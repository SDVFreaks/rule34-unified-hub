"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Tag {
    tag: {
        name: string;
    };
}

export interface Post {
    id: string;
    title: string;
    description: string | null;
    mediaUrl: string | null;
    rating: string;
    tags: Tag[];
}

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative bg-[#121215] border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 mb-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-auto min-h-[200px] bg-gray-900 overflow-hidden">
                {post.mediaUrl ? (
                    <Image
                        src={post.mediaUrl}
                        alt={post.title}
                        width={400}
                        height={600}
                        className={cn(
                            "w-full h-auto object-cover transition-transform duration-500",
                            isHovered ? "scale-105" : "scale-100"
                        )}
                        loading="lazy"
                    />
                ) : (
                    <div className="h-48 flex items-center justify-center text-gray-700">
                        No Preview
                    </div>
                )}

                {/* Rating Badge */}
                <div className={cn(
                    "absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider z-10",
                    post.rating === 'explicit' ? "bg-red-500/80 text-white" :
                        post.rating === 'questionable' ? "bg-yellow-500/80 text-black" :
                            "bg-green-500/80 text-white"
                )}>
                    {post.rating}
                </div>

                {/* Hover Overlay */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-4",
                    isHovered ? "opacity-100" : "opacity-0"
                )}>
                    <h3 className="text-sm font-bold truncate mb-1">{post.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {post.tags?.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="text-[9px] text-gray-300 bg-black/40 px-1.5 py-0.5 rounded border border-gray-700 hover:bg-purple-500/40 cursor-default">
                                #{t.tag?.name}
                            </span>
                        ))}
                        {post.tags && post.tags.length > 3 && (
                            <span className="text-[9px] text-gray-400">+{post.tags.length - 3} more</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
