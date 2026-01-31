import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractVideoInfo } from "@/lib/video-extract";
import { Copy, Code, Check } from "lucide-react";
import { toast } from "sonner";

export default function Embed() {
  const [url, setUrl] = useState("");
  const [autoplay, setAutoplay] = useState(false);
  const [mute, setMute] = useState(false);
  const [loop, setLoop] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [platform, setPlatform] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!url) return;
    const info = extractVideoInfo(url);
    if (info.id) {
        setVideoId(info.id);
        setPlatform(info.platform);
    }
  }, [url]);

  useEffect(() => {
    generateCode();
  }, [videoId, platform, autoplay, mute, loop]);

  const generateCode = () => {
    if (!videoId) {
        setCode("<!-- 请输入有效的视频链接 -->");
        return;
    }

    let src = "";
    if (platform === "youtube") {
        src = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${mute ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${videoId}`;
    } else if (platform === "bilibili") {
        src = `//player.bilibili.com/player.html?bvid=${videoId}&autoplay=${autoplay ? 1 : 0}&muted=${mute ? 1 : 0}`;
    } else {
        setCode("<!-- 目前仅支持 YouTube 和 Bilibili 的高级嵌入配置 -->");
        return;
    }

    const embedCode = `<iframe 
  src="${src}" 
  width="100%" 
  height="100%" 
  style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
  allow="autoplay; encrypted-media; fullscreen; picture-in-picture" 
  allowfullscreen
></iframe>`;

    // Wrap in responsive container
    const finalCode = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;">
  ${embedCode}
</div>`;

    setCode(finalCode);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("代码已复制到剪贴板");
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-heading font-bold mb-4">平台嵌入代码生成器</h1>
        <p className="text-muted-foreground">生成完美的自适应嵌入代码，支持 YouTube, Bilibili 等。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>视频来源</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input 
                        placeholder="粘贴 YouTube 或 Bilibili 链接..." 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="mb-4"
                    />
                    {videoId && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                            <Check className="w-4 h-4" /> 已识别: {platform} ({videoId})
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>播放设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="font-medium">自动播放</label>
                        <Switch checked={autoplay} onCheckedChange={setAutoplay} />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="font-medium">静音</label>
                        <Switch checked={mute} onCheckedChange={setMute} />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="font-medium">循环播放</label>
                        <Switch checked={loop} onCheckedChange={setLoop} />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        生成代码
                        <Button size="sm" variant="outline" onClick={copyCode}>
                            <Copy className="w-4 h-4 mr-2" /> 复制
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                    <Tabs defaultValue="preview" className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="preview">实时预览</TabsTrigger>
                            <TabsTrigger value="code">HTML 代码</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="preview" className="flex-1 min-h-[300px] border border-border rounded-lg bg-black/5 p-4 flex items-center justify-center">
                            {videoId ? (
                                <div className="w-full" dangerouslySetInnerHTML={{ __html: code }} />
                            ) : (
                                <div className="text-muted-foreground text-center">
                                    <Code className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    预览将显示在这里
                                </div>
                            )}
                        </TabsContent>
                        
                        <TabsContent value="code" className="flex-1 relative">
                            <textarea 
                                className="w-full h-full min-h-[300px] p-4 font-mono text-sm bg-slate-900 text-slate-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                readOnly
                                value={code}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
