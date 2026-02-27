import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('posts')
export class PostsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getPosts() {
        try {
            // Returning a dummy response or attempting connection
            const count = await this.prisma.post.count();
            return { status: 'success', message: `Found ${count} posts in DB.` };
        } catch (e) {
            return {
                status: 'db-offline',
                message: 'Returning dummy posts since database connection failed (migration needed/postgres not running).',
                data: [
                    { id: '1', title: 'Example Image Post', rating: 'safe', mediaUrl: 'https://example.com/image.jpg' },
                    { id: '2', title: 'Test Video Post', rating: 'questionable', mediaUrl: 'https://example.com/video.mp4' }
                ]
            };
        }
    }
}
