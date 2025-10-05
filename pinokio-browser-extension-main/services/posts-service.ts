export class PostsService {
  static config: {
    selectors: {
      article: string;
      id: string;
    };
    regex: {
      statusId: RegExp;
    };
    textMaxLength: number;
  } = {
    selectors: {
      article: "article[data-testid='tweet']",
      id: "a[href*='/status/']",
    },
    regex: {
      statusId: /(?:\/status\/|\/posts\/)(\d+)/,
    },
    textMaxLength: 10_000,
  };

  static queryArticles = (root: ParentNode = document): HTMLElement[] => {
    return Array.from(root.querySelectorAll<HTMLElement>(this.config.selectors.article));
  };

  static sha256Hex = async (input: string): Promise<string> => {
    const bytes = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  static extractStatusIdFromHref = (href: string): string | null => {
    if (!href) return null;
    const match = href.match(this.config.regex.statusId);
    return match?.[1] ?? null;
  };

  static getIdFromArticle = async (element: HTMLElement): Promise<string> => {
    const statusLink = element.querySelector<HTMLAnchorElement>("a[href*='/status/']");
    const match = statusLink?.href.match(/status\/(\d+)/);
    if (match) return match[1];

    const text = (element.innerText?.trim() || element.textContent?.trim() || '').slice(0, this.config.textMaxLength);
    const basis = text || element.outerHTML;

    return `sha:${await PostsService.sha256Hex(basis)}`;
  };
}
