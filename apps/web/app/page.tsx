import Image from "next/image";

interface Tag {
  tag: {
    name: string;
  };
}

interface Post {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string | null;
  rating: string;
  tags: Tag[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { status: "error", data: [] };
  }
}

export default async function Home() {
  const result = await getPosts();
  const posts: Post[] = result.data || [];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500/30">
      {/* Hero Section */}
      <header className="relative py-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            R34 Unified Hub
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            A high-performance, unified platform for adult content discovery and management.
            Built with Next.js, NestJS, and Prisma.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Latest Discoveries</h2>
          {result.status === "db-offline" && (
            <span className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium animate-pulse">
              Offline Mode
            </span>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-gray-800 rounded-3xl bg-[#0d0d0f]">
            <p className="text-gray-500 text-lg">No posts found. Start by seeding the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group relative bg-[#121215] border border-gray-800 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(168,85,247,0.3)]"
              >
                {/* Image Placeholder */}
                <div
                  className="aspect-[4/3] bg-gray-900"
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  {post.mediaUrl ? (
                    <Image
                      src={post.mediaUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                      No Preview
                    </div>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 z-10">
                    {post.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{post.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                    {post.description || "No description provided."}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-gray-500 bg-gray-800/40 px-3 py-1 rounded-lg border border-gray-700/50"
                      >
                        #{t.tag?.name || "unknown"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )/* End of posts condition */}
      </main>


      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 px-6 text-center text-gray-600 text-sm">
        <p>&copy; 2026 R34 Unified Hub. Built with excellence.</p>
      </footer>
    </div>
  );
}
