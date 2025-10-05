import { HttpPostsService } from '@/services/http/http-posts-service';
import { PostsService } from '@/services/posts-service';
import { ValidateIdsMessage } from '@/types/validate-ids-message';

export const X_VALIDATOR_CONFIG: {
  matches: string[];
  batch: {
    size: number;
    flushIntervalMs: number;
    retryMs: number;
  };
} = {
  matches: ['*://x.com/*', '*://www.x.com/*', '*://twitter.com/*', '*://www.twitter.com/*'],
  batch: {
    size: 15,
    flushIntervalMs: 800,
    retryMs: 500,
  },
};

export default defineContentScript({
  matches: X_VALIDATOR_CONFIG.matches,
  runAt: 'document_idle',
  main() {
    console.log('[x-validator] initialized on', location.href);

    const seenPostIds = new Set<string>();
    const pendingIds: string[] = [];
    let flushTimer: number | null = null;

    // Schedule flush (sending batch) if no flush was scheduled
    function scheduleFlush(): void {
      if (flushTimer != null) return;
      flushTimer = window.setTimeout(flushPending, X_VALIDATOR_CONFIG.batch.flushIntervalMs);
    }

    // Send a batch of post IDs to the background service
    async function flushPending(): Promise<void> {
      flushTimer = null;

      // Only send a batch if there are items in the pendingIds array
      const batch = pendingIds.splice(0, X_VALIDATOR_CONFIG.batch.size);
      if (!batch.length) return; // No items to flush

      const msg: ValidateIdsMessage = { type: 'VALIDATE_POST_IDS', ids: batch };

      console.log('[x-validator] Flushing batch:', batch);

      try {
        const reply = await browser.runtime.sendMessage(msg);
        console.log('[x-validator] Background reply:', reply);
      } catch (err) {
        console.warn('[x-validator] Background not ready, retrying', err);
        // Retry the same batch if something went wrong
        pendingIds.unshift(...batch);
        flushTimer = window.setTimeout(flushPending, X_VALIDATOR_CONFIG.batch.retryMs);
      }

      // If there are still items to flush, schedule the next flush
      if (pendingIds.length && flushTimer == null) scheduleFlush();
    }

    // Function to enqueue article and get its ID, then fetch its status
    async function enqueueArticle(element: HTMLElement): Promise<void> {
      const postId = await PostsService.getIdFromArticle(element);
      if (!postId) return; // Skip if no post ID is found
      if (seenPostIds.has(postId)) return; // Skip if already seen

      seenPostIds.add(postId);
      pendingIds.push(postId);

      console.log(`[x-validator] Enqueued post ID: ${postId}`);

      scheduleFlush();

      // Fetch the status of the post asynchronously
      try {
        const { status, warnings } = await HttpPostsService.getPostStatus(postId);

        console.log(`API Response for post ${postId}:`, { status, warnings });

        console.log(`Post ${postId} status: ${status}`);
        if (warnings.length > 0) {
          console.log(`Warnings for post ${postId}: ${warnings.join(', ')}`);
        }
      } catch (e) {
        console.error(`Error fetching post status for ${postId}:`, e);
      }
    }

    // Function to scan the page for articles
    function scanPageForArticles(): void {
      const articles = PostsService.queryArticles(document);
      console.log('[x-validator] Scanning page for articles...');
      for (const el of articles) {
        enqueueArticle(el);
      }
      console.log('[x-validator] scan: articles=', articles.length, 'seenIds=', seenPostIds.size);
    }

    // Start scanning the page for articles
    scanPageForArticles();

    // Re-scan periodically to catch dynamic content (infinite scroll)
    setInterval(scanPageForArticles, 5000);

    // Optionally, if you want to add a manual refresh function in the future:
    // document.addEventListener('refresh', scanPageForArticles);
  },
});
