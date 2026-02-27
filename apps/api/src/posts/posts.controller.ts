import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Post } from '@repo/db';

@Controller('posts')
export class PostsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getPosts(): Promise<ApiResponse<Post[]>> {
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
  }
}
