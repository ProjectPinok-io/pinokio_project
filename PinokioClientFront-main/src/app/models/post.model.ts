export interface Post {
  id: number;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  image?: string;
}
