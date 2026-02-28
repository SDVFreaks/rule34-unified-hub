export const dummyPosts = [
    {
        id: 'dummy-1',
        title: 'Neon Night at the Hub (Dummy)',
        description: 'A futuristic cyberpunk sketch. [OFFLINE MODE]',
        mediaUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
        rating: 'safe',
        createdAt: new Date().toISOString(),
        userId: 'dummy-user',
        tags: [
            { tag: { name: 'art' } },
            { tag: { name: 'cyberpunk' } }
        ],
        user: {
            email: 'offline@r34.hub'
        }
    },
    {
        id: 'dummy-2',
        title: 'Traditional Ink Work (Dummy)',
        description: 'Hand-drawn ink art. [OFFLINE MODE]',
        mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
        rating: 'safe',
        createdAt: new Date().toISOString(),
        userId: 'dummy-user',
        tags: [
            { tag: { name: 'art' } },
            { tag: { name: 'sketch' } }
        ],
        user: {
            email: 'offline@r34.hub'
        }
    }
];
