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
                    { id: '1', title: 'Neon Night at the Hub', rating: 'safe', mediaUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81', description: 'A futuristic cyberpunk sketch.', tags: [{ tag: { name: 'cyberpunk' } }, { tag: { name: 'art' } }] },
                    { id: '2', title: 'Traditional Ink Work', rating: 'safe', mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f', description: 'Hand-drawn ink art.', tags: [{ tag: { name: 'ink' } }, { tag: { name: 'sketch' } }] },
                    { id: '3', title: 'Digital Landscape', rating: 'safe', mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', description: 'Breathtaking digital scenery.', tags: [{ tag: { name: 'landscape' } }, { tag: { name: 'digital' } }] }
                ]
            };
        }
    }
}
