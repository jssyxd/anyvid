import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, RefreshCw, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import trendingData from "@/data/trending.json";
import VideoModal from "@/components/VideoModal";

// Use real data from JSON, fallback to mock if empty
const allVideos = trendingData.length > 0 ? trendingData : [];

export default function HotRecommendations() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<typeof allVideos[0] | null>(null);
  
  // Update to 6 items per page
  const pageSize = 6;
  
  // Loop through videos if we run out
  const currentVideos = Array.from({ length: pageSize }).map((_, i) => {
    const index = (page * pageSize + i) % allVideos.length;
    return allVideos[index];
  });

  const handleRefresh = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-16 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
          <h2 className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
            {t('hot.title')}
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          className="text-muted-foreground hover:text-primary gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t('hot.refresh')}
        </Button>
      </div>

      {/* Grid changed to support up to 6 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {currentVideos.map((video, idx) => (
          <div key={`${video.id}-${idx}`} className="group relative cursor-pointer" onClick={() => setSelectedVideo(video)}>
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-xl bg-card/40 border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)] h-full flex flex-col">
              
              {/* Thumbnail Area */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="transform scale-50 group-hover:scale-100 transition-transform duration-300">
                     <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/40">
                       <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                     </div>
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                  {video.source}
                </div>
              </div>

              {/* Info Area */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-xs line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-tight">
                  {video.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <VideoModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        video={selectedVideo} 
      />
    </div>
  );
}
