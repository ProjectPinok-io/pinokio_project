import { PostStatus } from '@/enums/post-status';

export type GetPostsStatusResponse = {
  status: PostStatus;
  warnings: string[];
};
