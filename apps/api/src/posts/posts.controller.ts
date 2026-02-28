import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Post, Tag } from '@repo/db';
import { dummyPosts } from '../common/constants/dummy-data';

@Controller('posts')
export class PostsController {
  constructor(private prisma: PrismaService) { }

  @Get()
  async getPosts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '30',
    @Query('tags') tags?: string,
    @Query('rating') rating?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponse<any>> {
    try {
      if (this.prisma.isOffline) {
        return {
          status: 'db-offline',
          data: {
            posts: dummyPosts,
            total: dummyPosts.length,
          },
          message: 'Database is offline. Showing dummy data.',
        };
      }

      const p = parseInt(page, 10) || 1;
      const l = parseInt(limit, 10) || 30;
      const skip = (p - 1) * l;

      const where: any = {};

      if (tags) {
        const tagList = tags.split(' ').filter(t => t.length > 0);
        const includeTags = tagList.filter(t => !t.startsWith('-'));
        const excludeTags = tagList.filter(t => t.startsWith('-')).map(t => t.substring(1));

        if (includeTags.length > 0 || excludeTags.length > 0) {
          where.tags = {
            some: includeTags.length > 0 ? {
              tag: {
                name: { in: includeTags }
              }
            } : undefined,
            none: excludeTags.length > 0 ? {
              tag: {
                name: { in: excludeTags }
              }
            } : undefined,
          };
        }
      }

      if (rating) {
        const ratings = rating.split(',').filter(r => r.length > 0);
        if (ratings.length > 0) {
          where.rating = { in: ratings };
        }
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where,
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
            user: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: l,
        }),
        this.prisma.post.count({ where }),
      ]);

      return {
        status: 'success',
        data: {
          posts,
          total,
          page: p,
          limit: l,
        },
      };
    } catch (error) {
      console.error('Error in getPosts:', error);
      return {
        status: 'db-offline',
        data: {
          posts: dummyPosts,
          total: dummyPosts.length,
        },
        message: 'Database is unreachable. Showing dummy data.',
      };
    }
  }

  @Get('tags/top')
  async getTopTags(): Promise<ApiResponse<any>> {
    try {
      if (this.prisma.isOffline) {
        return {
          status: 'success',
          data: [
            { id: '1', name: 'art', _count: { posts: 10 } },
            { id: '2', name: 'cyberpunk', _count: { posts: 5 } },
          ],
        };
      }

      const tags = await this.prisma.tag.findMany({
        take: 15,
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        }
      });

      return {
        status: 'success',
        data: tags,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Could not fetch top tags'
      };
    }
  }
}
