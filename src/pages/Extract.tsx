import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { extractVideoInfo, type VideoInfo } from "@/lib/video-extract";
import { Loader2, Download, Copy, Check, Plus, Trash2, ExternalLink, Video } from "lucide-react";
import { toast } from "sonner";

export default function Extract() {
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
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">视频链接提取</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          支持 YouTube, Bilibili, Twitter, TikTok 等主流平台。批量解析，一键下载。
        </p>
      </div>

      <Card className="mb-12 shadow-lg border-primary/10">
        <CardHeader className="bg-secondary/20 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            输入视频链接
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {urls.map((url, idx) => (
            <div key={idx} className="flex gap-2">
              <Input 
                placeholder="粘贴视频链接 (例如: https://www.youtube.com/watch?v=...)" 
                value={url}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                className="h-12 text-lg"
              />
              {urls.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => handleRemoveInput(idx)} className="h-12 w-12 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={handleAddInput} className="gap-2">
              <Plus className="w-4 h-4" /> 添加更多链接
            </Button>
            
            <Button size="lg" onClick={handleExtract} disabled={loading} className="px-8 h-12 text-base shadow-md shadow-blue-500/20">
              {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> 解析中...</> : "开始提取"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold mb-6">提取结果</h2>
          
          <div className="grid gap-6">
            {results.map((info, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail / Preview Area */}
                  <div className="w-full md:w-64 h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
                    {info.thumbnail ? (
                      <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <Video className="w-12 h-12 text-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={info.url} target="_blank" rel="noreferrer" className="text-white hover:text-blue-400"><ExternalLink className="w-8 h-8" /></a>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 mb-2">
                                {info.platform}
                            </span>
                            <h3 className="text-xl font-bold line-clamp-1 mb-1">{info.title || "未命名视频"}</h3>
                            <p className="text-sm text-muted-foreground font-mono truncate max-w-md">{info.id}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">可用下载链接 (模拟)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                                { label: "1080P MP4", size: "128MB" },
                                { label: "720P MP4", size: "64MB" },
                                { label: "Audio Only MP3", size: "12MB" }
                            ].map((opt, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/10 hover:bg-secondary/30 transition-colors">
                                    <div>
                                        <div className="font-bold text-sm">{opt.label}</div>
                                        <div className="text-xs text-muted-foreground">{opt.size}</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copyLink(`https://example.com/${info.id}/${opt.label}`)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" className="h-8 w-8" onClick={() => toast.info("演示模式：开始下载 " + opt.label)}>
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
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
