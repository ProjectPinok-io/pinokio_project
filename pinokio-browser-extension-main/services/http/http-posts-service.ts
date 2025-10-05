import { PostStatus } from '@/enums/post-status';
import { GetPostsStatusResponse } from '@/types/responses/posts/get-posts-status';
import axios, { AxiosInstance } from 'axios';

export class HttpPostsService {
  static readonly baseUrl = 'http://10.10.0.3:8000/api/posts';

  static readonly axiosInstance: AxiosInstance = axios.create({
    baseURL: HttpPostsService.baseUrl,
  });

  static async getPostStatus(postId: string): Promise<GetPostsStatusResponse> {
    try {
      const response = await this.axiosInstance.get(`/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`There was an error fetching post status for ${postId}:`, error);
      return { status: PostStatus.UNKNOWN, warnings: [] };
    }
  }
}
