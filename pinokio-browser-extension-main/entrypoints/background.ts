type ValidatePayload = {
  id: string;
  url: string;
  text: string;
  html: string;
};

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (msg: any) => {
    if (msg?.type !== 'VALIDATE_POSTS') return;

    for (const post of msg.posts as ValidatePayload[]) {
      try {
        await fetch('http://10.0.0.3/api/posts/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        });
      } catch (e) {
        console.warn('validate failed', post.id, e);
      }
    }
    return { ok: true, count: msg.posts?.length ?? 0 };
  });
});
