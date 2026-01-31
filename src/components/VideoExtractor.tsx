import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { extractVideoInfo, type VideoInfo } from "@/lib/video-extract";
import { Loader2, Download, Copy, ExternalLink, Video, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface VideoExtractorProps {
  className?: string;
}

export default function VideoExtractor({ className }: VideoExtractorProps) {
  const { t } = useTranslation();
  const [urls, setUrls] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VideoInfo[]>([]);

  const handleAddInput = () => {
    if (urls.length < 10) {
      setUrls([...urls, ""]);
    } else {
      toast.error("最多支持10个链接批量提取");
    }
  };

  const handleRemoveInput = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleInputChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleExtract = async () => {
    const validUrls = urls.filter(u => u.trim().length > 0);
    if (validUrls.length === 0) {
      toast.error("请输入至少一个视频链接");
      return;
    }

    setLoading(true);
    setResults([]);

    // Simulate network delay
    setTimeout(() => {
      const extracted = validUrls.map(url => extractVideoInfo(url));
      setResults(extracted);
      setLoading(false);
      toast.success(`成功解析 ${extracted.length} 个视频`);
    }, 1500);
  };

  const copyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("链接已复制");
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <Card className="shadow-2xl border-primary/20 bg-card/80 backdrop-blur-xl">
        <CardContent className="pt-8 space-y-4">
          {urls.map((url, idx) => (
            <div key={idx} className="flex gap-2 group">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <Input 
                  placeholder={t('extract.placeholder')} 
                  value={url}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  className="h-14 pl-10 text-lg bg-background/50 border-primary/20 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
              </div>
              {urls.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => handleRemoveInput(idx)} className="h-14 w-14 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <Button variant="ghost" onClick={handleAddInput} className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Plus className="w-4 h-4" /> {t('extract.more')}
            </Button>
            
            <Button 
              size="lg" 
              onClick={handleExtract} 
              disabled={loading} 
              className="w-full sm:w-auto px-8 h-12 text-base font-bold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
            >
              {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> 解析中...</> : "开始提取 / Download"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-bold font-heading">提取结果</h2>
          </div>
          
          <div className="grid gap-6">
            {results.map((info, idx) => (
              <Card key={idx} className="overflow-hidden border-primary/10 bg-card/60 hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail / Preview Area */}
                  <div className="w-full md:w-72 h-48 bg-black/20 flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
                    {info.thumbnail ? (
                      <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 w-full h-full flex items-center justify-center">
                        <Video className="w-12 h-12 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <a href={info.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/20 transition-colors">
                          <ExternalLink className="w-5 h-5" /> 访问原视频
                        </a>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_-3px_var(--color-primary)]">
                                {info.platform}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px] bg-secondary/50 px-2 py-0.5 rounded">{info.id}</span>
                        </div>
                        <h3 className="text-xl font-bold line-clamp-2 mb-2 leading-tight">{info.title || "未命名视频"}</h3>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                            { label: "1080P HD", size: "128MB", color: "text-green-500" },
                            { label: "720P SD", size: "64MB", color: "text-blue-500" },
                            { label: "Audio Only", size: "12MB", color: "text-orange-500" }
                        ].map((opt, i) => (
                            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer group/item">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", opt.label.includes("Audio") ? "bg-orange-500" : "bg-primary")}></div>
                                    <div className="text-sm font-medium">{opt.label}</div>
                                </div>
                                <div className="flex gap-1 opacity-60 group-hover/item:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyLink(`https://example.com/${info.id}/${opt.label}`)}>
                                        <Copy className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => toast.info("演示模式：开始下载 " + opt.label)}>
                                        <Download className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
