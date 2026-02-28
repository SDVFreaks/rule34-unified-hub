"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { PostCard, type Post } from "@/components/PostCard";
import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2, Database } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const breakpointColumnsObj = {
  default: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState<'loading' | 'success' | 'db-offline' | 'error'>('loading');
  const [searchParams, setSearchParams] = useState({
    search: "",
    tags: "",
    rating: ["safe", "questionable", "explicit"]
  });

  const fetchPosts = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    try {
      const ratingStr = searchParams.rating.join(",");
      const query = new URLSearchParams({
        page: pageNum.toString(),
        limit: "30",
        search: searchParams.search,
        tags: searchParams.tags,
        rating: ratingStr
      });

      const res = await fetch(`${API_URL}/posts?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const result = await res.json();
      const newPosts = result.data?.posts || [];
      const total = result.data?.total || 0;

      setStatus(result.status === 'db-offline' ? 'db-offline' : 'success');

      if (isInitial) {
        setPosts(newPosts);
        setHasMore(newPosts.length < total);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setHasMore(posts.length + newPosts.length < total);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setStatus('error');
    }
  }, [searchParams, posts.length]);

  useEffect(() => {
    setPage(1);
    fetchPosts(1, true);
  }, [searchParams]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handleSearch = (search: string, tags: string, rating: string[]) => {
    setSearchParams({ search, tags, rating });
  };

  const handleTagClick = (tagName: string) => {
    setSearchParams(prev => {
      const newTags = prev.tags.includes(tagName) ? prev.tags : `${prev.tags} ${tagName}`.trim();
      return { ...prev, tags: newTags };
    });
  };

  // Skeletons while initial loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white font-sans">
        <Header onSearch={handleSearch} />
        <main className="max-w-7xl mx-auto px-6 py-12 flex gap-8">
          <Sidebar />
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-900/50 rounded-xl border border-gray-800 animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500/30">
      <Header onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-6 py-12 flex gap-8 relative">
        <Sidebar onTagClick={handleTagClick} />

        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                {searchParams.tags || searchParams.search ? "Search Results" : "Recent Submissions"}
                {status === "db-offline" && (
                  <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse flex items-center gap-1">
                    <Database size={12} />
                    Offline Mode
                  </span>
                )}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Showing {posts.length} results
              </p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-40 border-2 border-dashed border-gray-900 rounded-[32px] bg-[#0d0d0f]/50 flex flex-col items-center justify-center">
              <AlertTriangle className="text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 text-lg font-medium">No results found for your search criteria.</p>
              <button
                onClick={() => setSearchParams({ search: "", tags: "", rating: ["safe", "questionable", "explicit"] })}
                className="mt-6 text-purple-400 hover:text-purple-300 underline underline-offset-4 text-sm font-bold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={handleLoadMore}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center py-12">
                  <Loader2 className="text-purple-500 animate-spin" size={32} />
                </div>
              }
              endMessage={
                <p className="text-center py-12 text-gray-700 text-sm font-bold uppercase tracking-[0.2em]">
                  End of the Hub
                </p>
              }
              scrollThreshold={0.9}
            >
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex gap-6 w-auto"
                columnClassName="bg-clip-padding"
              >
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </Masonry>
            </InfiniteScroll>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 px-6 text-center text-gray-700 text-xs font-bold uppercase tracking-[0.3em]">
        <p>&copy; 2026 R34 Unified Hub. Excellence in discovery.</p>
      </footer>
    </div>
  );
}
