"use client";

import { useState } from "react";
import { Search, Shield, AlertCircle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    onSearch?: (searchQuery: string, tagsQuery: string, ratingQuery: string[]) => void;
}

export function Header({ onSearch }: HeaderProps) {
    const [searchValue, setSearchValue] = useState("");
    const [selectedRatings, setSelectedRatings] = useState<string[]>(["safe", "questionable", "explicit"]);

    const toggleRating = (rating: string) => {
        const newRatings = selectedRatings.includes(rating)
            ? selectedRatings.filter(r => r !== rating)
            : [...selectedRatings, rating];
        setSelectedRatings(newRatings);
        onSearch?.("", searchValue, newRatings);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.("", searchValue, selectedRatings);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-gray-900 px-6 py-4 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent flex-shrink-0 flex items-center gap-2 cursor-pointer">
                    <Shield className="text-purple-500 fill-purple-500/20" size={24} />
                    R34 Hub
                </h1>

                <form onSubmit={handleSearch} className="relative flex-grow group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <input
                        type="text"
                        className="w-full bg-[#121215] border border-gray-800 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500 ring-0 focus:ring-4 focus:ring-purple-500/10 placeholder-gray-600 transition-all"
                        placeholder="Search tags (e.g. 'neon cyberpunk -safe')"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </form>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex bg-[#121215] border border-gray-800 p-0.5 rounded-lg overflow-hidden h-fit">
                        {[
                            { id: "safe", label: "S", color: "text-green-500" },
                            { id: "questionable", label: "Q", color: "text-yellow-500" },
                            { id: "explicit", label: "E", color: "text-red-500" },
                        ].map((rating) => (
                            <button
                                key={rating.id}
                                type="button"
                                onClick={() => toggleRating(rating.id)}
                                className={cn(
                                    "px-3 py-1 text-xs font-bold transition-all flex items-center gap-1.5",
                                    selectedRatings.includes(rating.id)
                                        ? "bg-gray-800 text-white rounded-[6px]"
                                        : "text-gray-600 hover:text-gray-400"
                                )}
                                title={`Filter by ${rating.id}`}
                            >
                                <span className={rating.color}>{rating.label}</span>
                            </button>
                        ))}
                    </div>
                    <button className="p-2 text-gray-500 hover:text-white transition-colors bg-[#121215] border border-gray-800 rounded-lg">
                        <Filter size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
