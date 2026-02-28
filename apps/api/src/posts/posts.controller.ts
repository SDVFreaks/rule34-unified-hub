import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Post } from '@repo/db';
import { dummyPosts } from '../common/constants/dummy-data';

@Controller('posts')
export class PostsController {
  constructor(private prisma: PrismaService) { }

  @Get()
  async getPosts(): Promise<ApiResponse<Post[]>> {
    try {
      if (this.prisma.isOffline) {
        return {
          status: 'db-offline',
          data: dummyPosts as any,
          message: 'Database is offline. Showing dummy data.',
        };
      }

      const posts = await this.prisma.post.findMany({
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          user: true,
        },
      });

      return {
        status: 'success',
        data: posts,
      };
    } catch (error) {
      console.error('Error in getPosts:', error);
      return {
        status: 'db-offline',
        data: dummyPosts as any,
        message: 'Database is unreachable. Showing dummy data.',
      };
    }
  }
}
