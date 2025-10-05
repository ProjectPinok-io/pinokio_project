<?php

namespace App\Services;

use App\Models\Post;
use App\Models\Author;
use Illuminate\Support\Facades\DB; // Import DB facade
use Carbon\Carbon; // Import Carbon for date handling

class PostEvaluatorService
{
    // Define weights for different credibility factors
    private array $weights = [
        'author_is_verified' => 0.3,
        'profile_completeness' => 0.2,
        'content_keywords' => 0.3,
        'follower_following_ratio' => 0.1,
        'follower_following_ratio' => 0.1,
        'positive_user_evaluations' => 0.1, // Weight for aggregated user evaluations
        'comment_analysis' => 0.1, // New weight for comment analysis
        'post_length' => 0.05,
        'hyphen_usage' => 0.05,
        'keyword_topic_consistency' => 0.1,
        'share_comment_like_ratio' => 0.05,
        'topic_frequency' => 0.05,
    ];

    /**
     * Evaluates a single post and returns its credibility status.
     */
    public function evaluate(Post $post): string
    {
        $score = 0;

        // 1. Author Verification
        if ($post->author && $post->author->is_verified) {
            $score += $this->weights['author_is_verified'];
        }

        // 2. Profile Completeness (assuming 0-100 scale, normalize to 0-1)
        if ($post->author && $post->author->profile_completeness > 0) {
            $score += ($post->author->profile_completeness / 100) * $this->weights['profile_completeness'];
        }

        // 3. Content Keywords (simple example, can be expanded)
        $content = strtolower($post->content);
        $fakeNewsKeywords = ['fake news', 'hoax', 'unverified claim', 'conspiracy'];
        $hasFakeNewsKeyword = false;
        foreach ($fakeNewsKeywords as $keyword) {
            if (str_contains($content, $keyword)) {
                $hasFakeNewsKeyword = true;
                break;
            }
        }
        if (!$hasFakeNewsKeyword) {
            $score += $this->weights['content_keywords'];
        }

        // 4. Follower/Following Ratio (simple example: higher ratio = more credible)
        if ($post->author && $post->author->following_count > 0) {
            $ratio = $post->author->followers / $post->author->following_count;
            // Normalize ratio to a 0-1 scale for scoring (e.g., cap at 2.0 for max score contribution)
            $normalizedRatio = min($ratio / 2.0, 1.0);
            $score += $normalizedRatio * $this->weights['follower_following_ratio'];
        }

        // 5. Aggregated User Evaluations (incorporate positive evaluations)
        // This is a simplified approach; a more complex model would consider the trust score of evaluators.
        if ($post->positive_evaluations_count > $post->negative_evaluations_count) {
            $score += $this->weights['positive_user_evaluations'];
        }

        // 6. Comment Analysis
        if ($post->comments->count() > 0) {
            $totalLinguisticScore = 0;
            $totalLikes = 0;
            $totalReplies = 0;

            foreach ($post->comments as $comment) {
                $totalLinguisticScore += $comment->linguistic_score;
                $totalLikes += $comment->likes_count;
                $totalReplies += $comment->replies_count;
            }

            $averageLinguisticScore = $totalLinguisticScore / $post->comments->count();
            // Simple normalization for likes/replies (can be more sophisticated)
            $normalizedCommentEngagement = min(($totalLikes + $totalReplies) / 100.0, 1.0); // Assuming 100 total engagement is max

            $score += ($averageLinguisticScore * 0.5 + $normalizedCommentEngagement * 0.5) * $this->weights['comment_analysis'];
        }

        // 7. Post Analysis
        // 7.1 Post Length (e.g., longer posts might be more informative, up to a point)
        $postLength = strlen($post->content);
        $normalizedPostLength = min($postLength / 1000.0, 1.0); // Normalize length, cap at 1000 chars
        $score += $normalizedPostLength * $this->weights['post_length'];

        // 7.2 Hyphen Usage (simple check for excessive hyphens, could indicate poor writing)
        $hyphenCount = substr_count($post->content, '-');
        $normalizedHyphenUsage = 1.0 - min($hyphenCount / 5.0, 1.0); // More hyphens = lower score, cap at 5
        $score += $normalizedHyphenUsage * $this->weights['hyphen_usage'];

        // 7.3 Keyword/Topic Consistency (Placeholder - requires external data or more complex NLP)
        // For now, assume a basic check if keywords are present.
        // In a real scenario, this would involve searching for related articles and comparing topics.
        // $score += $this->weights['keyword_topic_consistency']; // Placeholder for now


        // 7.4 Share/Comment/Like Ratio (Engagement metrics)
        $totalEngagement = $post->likes + $post->comments + $post->reposts;
        if ($totalEngagement > 0) {
            $normalizedEngagement = min($totalEngagement / 500.0, 1.0); // Normalize engagement, cap at 500
            $score += $normalizedEngagement * $this->weights['share_comment_like_ratio'];
        }

        // 7.5 Topic Frequency (Placeholder - requires historical data or external analysis)
        // $score += $this->weights['topic_frequency']; // Placeholder for now

        // Map score to evaluation levels
        if ($score >= 0.7) {
            return 'Valid';
        } elseif ($score >= 0.4) {
            return 'Warning';
        } else {
            return 'Unknown';
        }
    }

    /**
     * Checks for review bombing activity.
     * If detected, it activates the review bombing mode.
     */
    public function checkForReviewBombing(): void
    {
        // Define the time window (e.g., last 48 hours)
        $timeWindow = Carbon::now()->subHours(48);

        // Get posts created within the time window
        $recentPosts = Post::where('created_at', '>=', $timeWindow)->get();

        if ($recentPosts->isEmpty()) {
            return; // No recent posts to analyze
        }

        $scores = [];
        foreach ($recentPosts as $post) {
            // Re-evaluate score for consistency, or use pre-calculated score if available and reliable
            // For simplicity, we re-evaluate here. In a production system, consider caching scores.
            $scores[] = $this->evaluate($post);
        }

        // Calculate statistics for the scores
        $scoreCounts = array_count_values($scores);

        // Define thresholds for review bombing detection
        // These thresholds need tuning based on expected data distribution.
        $outlierThreshold = 0.1; // e.g., 10% of posts are significantly outside the norm
        $minOutlierCount = 5;    // Minimum number of outlier posts to trigger

        // Simple check: if a large portion of posts are 'Unknown' or 'Warning' and significantly deviate
        // A more robust check would involve calculating mean and standard deviation of scores.
        // For now, let's use a simplified heuristic: if a high percentage of posts are 'Unknown' or 'Warning'
        // and there are at least a few of them, we might suspect review bombing.

        $totalRecentPosts = count($scores);
        $unknownCount = $scoreCounts['Unknown'] ?? 0;
        $warningCount = $scoreCounts['Warning'] ?? 0;

        // Heuristic: If more than 30% of recent posts are 'Unknown' or 'Warning', and at least 10 posts exist
        if ($totalRecentPosts >= 10 && (($unknownCount + $warningCount) / $totalRecentPosts) > 0.3) {
            // Potential review bombing detected. Activate the mode.
            DB::table('settings')->updateOrInsert(
                ['key' => 'is_review_bombing_active'],
                ['value' => json_encode(true), 'updated_at' => now()]
            );
            // Optionally, mark these recent posts for manual review
            foreach ($recentPosts as $post) {
                if ($post->status === 'Unknown' || $post->status === 'Warning') {
                    $post->needs_manual_review = true;
                    $post->save();
                }
            }
        }
    }
}
