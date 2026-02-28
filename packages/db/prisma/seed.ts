import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // Create some users
    const user1 = await prisma.user.upsert({
        where: { email: 'admin@r34.hub' },
        update: {},
        create: {
            email: 'admin@r34.hub',
        },
    });

    // Create some tags
    const tagNames = [
        'art', 'sketch', 'cyberpunk', 'illustration',
        'character', 'digital', 'original', 'monochrome',
        'portrait', 'background', 'nature', 'urban'
    ];

    const tags = await Promise.all(
        tagNames.map(name =>
            prisma.tag.upsert({
                where: { name },
                update: {},
                create: { name }
            })
        )
    );

    const findTag = (name: string) => tags.find(t => t.name === name)!.id;

    // Create more posts
    const postData = [
        {
            title: 'Cyber City 77',
            description: 'Vibrant neon streets.',
            mediaUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
            rating: 'safe',
            tags: ['cyberpunk', 'digital', 'urban']
        },
        {
            title: 'Inked Spirit',
            description: 'Detailed ink portrait.',
            mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
            rating: 'safe',
            tags: ['art', 'sketch', 'monochrome']
        },
        {
            title: 'Forest Guardian',
            description: 'An ancient spirit in the woods.',
            mediaUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969',
            rating: 'questionable',
            tags: ['nature', 'character', 'illustration']
        },
        {
            title: 'Sunset Peaks',
            description: 'High altitude landscape.',
            mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
            rating: 'safe',
            tags: ['nature', 'background', 'original']
        },
        {
            title: 'Midnight Arcade',
            description: 'Forgotten retro gaming hub.',
            mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
            rating: 'explicit',
            tags: ['cyberpunk', 'urban', 'background']
        },
        {
            title: 'Golden Hour Muse',
            description: 'Stunning portrait in light.',
            mediaUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c',
            rating: 'safe',
            tags: ['portrait', 'original', 'illustration']
        },
        {
            title: 'Abstract Flow',
            description: 'Flowing colors and shapes.',
            mediaUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
            rating: 'questionable',
            tags: ['art', 'digital', 'original']
        },
        {
            title: 'Neon Samurai',
            description: 'Honor in the dark streets.',
            mediaUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
            rating: 'explicit',
            tags: ['cyberpunk', 'character', 'digital']
        }
    ];

    for (const post of postData) {
        await prisma.post.create({
            data: {
                title: post.title,
                description: post.description,
                mediaUrl: post.mediaUrl,
                rating: post.rating as any,
                userId: user1.id,
                tags: {
                    create: post.tags.map(tagName => ({ tagId: findTag(tagName) }))
                }
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
