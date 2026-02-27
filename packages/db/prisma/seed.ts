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
    const tag1 = await prisma.tag.upsert({ where: { name: 'art' }, update: {}, create: { name: 'art' } });
    const tag2 = await prisma.tag.upsert({ where: { name: 'sketch' }, update: {}, create: { name: 'sketch' } });
    const tag3 = await prisma.tag.upsert({ where: { name: 'cyberpunk' }, update: {}, create: { name: 'cyberpunk' } });

    // Create some posts
    await prisma.post.create({
        data: {
            title: 'Neon Night at the Hub',
            description: 'A futuristic cyberpunk sketch.',
            mediaUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
            rating: 'safe',
            userId: user1.id,
            tags: {
                create: [
                    { tagId: tag1.id },
                    { tagId: tag3.id }
                ]
            }
        }
    });

    await prisma.post.create({
        data: {
            title: 'Traditional Ink Work',
            description: 'Hand-drawn ink art.',
            mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
            rating: 'safe',
            userId: user1.id,
            tags: {
                create: [
                    { tagId: tag1.id },
                    { tagId: tag2.id }
                ]
            }
        }
    });

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
