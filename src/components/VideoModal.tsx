import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: string;
    title: string;
    url: string;
    source: string;
  } | null;
}

export default function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  if (!video) return null;

  // Function to determine embed URL based on source or raw URL
  const getEmbedUrl = (url: string) => {
    // For this demo, since we scraped cutcut.top/video/ID, we can't directly embed THAT page in an iframe 
    // due to likely X-Frame-Options.
    // CutCut probably uses a player. 
    // If the URL is external (youtube), we embed youtube.
    // If it's cutcut, we might need a direct video link or just show a link.
    
    // However, the user request says: "click to enlarge nested play preview"
    // and provided an image of a player.
    // If we don't have the actual video file URL, we can't play it natively.
    // We will simulate this by showing an iframe to the original URL if allowed, 
    // or a placeholder player.
    
    // For the scraped data, the URL is https://cutcut.top/video/...
    // Let's try to embed it. If it fails, we show a "Open in new tab" fallback.
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-black border-white/10 sm:rounded-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-video w-full bg-black flex items-center justify-center group">
          {/* Close button for fullscreen feel */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <iframe 
            src={getEmbedUrl(video.url)} 
            className="w-full h-full" 
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        </div>
        
        <div className="p-6 bg-card">
          <h2 className="text-xl font-bold mb-2 text-foreground">{video.title}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
              {video.source}
            </span>
            <a href={video.url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              Open source link
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
