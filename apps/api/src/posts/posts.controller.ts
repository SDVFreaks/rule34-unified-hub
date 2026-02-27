import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('posts')
export class PostsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getPosts() {
        try {
            const posts = await this.prisma.post.findMany({
                include: {
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    user: true
                }
            });
            return { status: 'success', data: posts };
        } catch (e) {
            return {
                status: 'db-offline',
                message: 'Returning dummy posts since database connection failed (migration needed/postgres not running).',
                data: [
                    { id: '1', title: 'Example Image Post', rating: 'safe', mediaUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81' },
                    { id: '2', title: 'Test Video Post', rating: 'questionable', mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f' }
                ]
            };
        }
    }
}
