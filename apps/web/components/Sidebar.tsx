"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagData {
    id: string;
    name: string;
    _count: {
        posts: number;
    };
}

interface SidebarProps {
    onTagClick?: (tagName: string) => void;
}

export function Sidebar({ onTagClick }: SidebarProps) {
    const [tags, setTags] = useState<TagData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTopTags() {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                const res = await fetch(`${API_URL}/posts/tags/top`);
                if (res.ok) {
                    const result = await res.json();
                    setTags(result.data || []);
                }
            } catch (error) {
                console.error("Error fetching tags:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTopTags();
    }, []);

    return (
        <aside className="w-64 flex-shrink-0 sticky top-20 h-fit space-y-8 pr-6 border-r border-gray-900 hidden lg:block">
            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Tag Cloud</h2>
                <div className="flex flex-wrap gap-2">
                    {loading ? (
                        Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="h-6 w-16 bg-gray-800 animate-pulse rounded" />
                        ))
                    ) : (
                        tags.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => onTagClick?.(tag.name)}
                                className="text-[11px] px-2 py-1 bg-gray-900 border border-gray-800 rounded-md hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors flex items-center gap-1.5"
                            >
                                <span className="text-gray-400">#</span>
                                <span>{tag.name}</span>
                                <span className="text-[9px] text-gray-600 bg-black/40 px-1 rounded ml-1">{tag._count.posts}</span>
                            </button>
                        ))
                    )}
                    {tags.length === 0 && !loading && (
                        <p className="text-xs text-gray-600">No tags found. Start by seeding the database.</p>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Links</h2>
                <ul className="space-y-2 text-xs text-gray-400">
                    <li className="hover:text-purple-400 cursor-pointer">Popular Artists</li>
                    <li className="hover:text-purple-400 cursor-pointer">Recent Comments</li>
                    <li className="hover:text-purple-400 cursor-pointer">Wiki Help</li>
                </ul>
            </div>
        </aside>
    );
}
