import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FFmpegService } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Loader2, Upload, FileVideo, CheckCircle, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Convert() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("medium");
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const ffmpeg = await FFmpegService.getInstance();
        ffmpeg.on('log', ({ message }) => {
          setLogs(prev => [...prev.slice(-4), message]);
        });
        ffmpeg.on('progress', ({ progress }) => {
          setProgress(Math.round(progress * 100));
        });
        setFfmpegLoaded(true);
      } catch (e) {
        console.error("Failed to load FFmpeg", e);
        toast.error("无法加载转换核心组件，请检查浏览器兼容性");
      }
    };
    load();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOutputUrl(null);
      setProgress(0);
      setLogs([]);
    }
  };

  const handleConvert = async () => {
    if (!file || !ffmpegLoaded) return;
    setConverting(true);
    setProgress(0);
    setOutputUrl(null);

    try {
      const ffmpeg = await FFmpegService.getInstance();
      const inputName = "input" + file.name.substring(file.name.lastIndexOf("."));
      const outputName = `output.${format}`;
      
      await ffmpeg.writeFile(inputName, await fetchFile(file) as any);
      
      const args = ["-i", inputName];
      
      // Quality presets
      if (quality === "high") args.push("-preset", "slow", "-crf", "18");
      else if (quality === "medium") args.push("-preset", "medium", "-crf", "23");
      else args.push("-preset", "ultrafast", "-crf", "28");

      args.push(outputName);
      
      await ffmpeg.exec(args);
      
      const data = await ffmpeg.readFile(outputName) as any;
      const url = URL.createObjectURL(new Blob([data], { type: `video/${format}` }));
      setOutputUrl(url);
      toast.success("转换成功！");
    } catch (error) {
      console.error(error);
      toast.error("转换失败，请重试");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-heading font-bold mb-4">视频格式转换</h1>
        <p className="text-muted-foreground">本地转换，保护隐私。支持 MP4, WebM, AVI 等主流格式。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>上传文件</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center h-64 bg-secondary/5 hover:bg-secondary/20 transition-colors relative">
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="video/*"
                    />
                    {file ? (
                        <>
                            <FileVideo className="w-12 h-12 text-primary mb-4" />
                            <p className="font-bold text-lg truncate max-w-xs">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <Button variant="ghost" size="sm" className="mt-4 z-10 relative" onClick={(e) => {
                                e.preventDefault();
                                setFile(null);
                            }}>更换文件</Button>
                        </>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="font-medium text-lg mb-2">点击或拖拽上传视频</p>
                            <p className="text-xs text-muted-foreground">支持 MP4, MOV, AVI, MKV 等 (最大 2GB)</p>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>转换设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
                <div className="space-y-2">
                    <label className="text-sm font-medium">目标格式</label>
                    <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger>
                            <SelectValue placeholder="选择格式" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mp4">MP4 (推荐)</SelectItem>
                            <SelectItem value="webm">WebM</SelectItem>
                            <SelectItem value="avi">AVI</SelectItem>
                            <SelectItem value="mov">MOV</SelectItem>
                            <SelectItem value="mkv">MKV</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">转换质量</label>
                    <Select value={quality} onValueChange={setQuality}>
                        <SelectTrigger>
                            <SelectValue placeholder="选择质量" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="high">高质量 (慢)</SelectItem>
                            <SelectItem value="medium">中等 (推荐)</SelectItem>
                            <SelectItem value="low">低质量 (快)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {!ffmpegLoaded && (
                    <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-md text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        正在加载转换核心组件...
                    </div>
                )}

                <div className="pt-4 mt-auto">
                    <Button 
                        className="w-full h-12 text-lg shadow-lg shadow-primary/20" 
                        onClick={handleConvert} 
                        disabled={!file || !ffmpegLoaded || converting}
                    >
                        {converting ? <><Loader2 className="mr-2 animate-spin" /> 转换中 ({progress}%)</> : "开始转换"}
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Progress & Logs Area */}
      {(converting || outputUrl) && (
        <Card className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <CardContent className="pt-6">
                {converting && (
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span>处理进度</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="bg-black/90 text-green-400 font-mono text-xs p-4 rounded-md h-32 overflow-y-auto" ref={logContainerRef}>
                            {logs.map((log, i) => <div key={i}>{log}</div>)}
                        </div>
                    </div>
                )}
                
                {outputUrl && (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">转换完成!</h3>
                        <p className="text-muted-foreground mb-6">您的视频已准备好下载</p>
                        <div className="flex justify-center gap-4">
                            <a href={outputUrl} download={`anyvid_converted.${format}`}>
                                <Button size="lg" className="px-8 gap-2">
                                    <Download className="w-5 h-5" /> 下载文件
                                </Button>
                            </a>
                            <Button variant="outline" onClick={() => {
                                setOutputUrl(null);
                                setFile(null);
                            }}>转换下一个</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
