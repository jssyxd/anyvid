import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { FFmpegService } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Upload, Play, Pause, Scissors, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Edit() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState([0, 100]); // Percentage 0-100
  const [isPlaying, setIsPlaying] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const url = URL.createObjectURL(f);
      setVideoUrl(url);
      setRange([0, 100]);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrim = async () => {
    if (!file || !videoRef.current) return;
    
    setProcessing(true);
    try {
      const ffmpeg = await FFmpegService.getInstance();
      const startTime = (range[0] / 100) * duration;
      const endTime = (range[1] / 100) * duration;
      const durationTime = endTime - startTime;
      
      const inputName = "input" + file.name.substring(file.name.lastIndexOf("."));
      const outputName = "trimmed.mp4";

      await ffmpeg.writeFile(inputName, await fetchFile(file) as any);
      
      // FFmpeg trim command: -ss start -t duration -i input -c copy output
      // Note: placing -ss before -i is faster (input seeking)
      await ffmpeg.exec([
        '-ss', startTime.toString(),
        '-i', inputName,
        '-t', durationTime.toString(),
        '-c', 'copy', // Stream copy for speed (might be inaccurate on keyframes, but good for demo)
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName) as any;
      const url = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `trimmed_${file.name}`;
      a.click();
      
      toast.success("剪辑完成并开始下载！");
    } catch (e) {
      console.error(e);
      toast.error("剪辑失败，请重试");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-heading">视频剪辑</h1>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => document.getElementById('edit-upload')?.click()}>
             <Upload className="w-4 h-4 mr-2" /> 打开视频
           </Button>
           <input id="edit-upload" type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
           
           <Button onClick={handleTrim} disabled={!file || processing} className="bg-blue-600 hover:bg-blue-700">
             {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Scissors className="w-4 h-4 mr-2" />}
             导出片段
           </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Main Preview Area */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden bg-black/5 dark:bg-black/40 border-0 shadow-inner">
          <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
            {videoUrl ? (
              <video 
                ref={videoRef}
                src={videoUrl}
                className="max-h-full max-w-full shadow-2xl"
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <Scissors className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>请先上传视频进行剪辑</p>
              </div>
            )}
          </div>
          
          {/* Timeline Controls */}
          {file && (
            <div className="p-6 bg-background border-t border-border z-10">
               <div className="flex justify-between text-sm font-mono mb-2 text-muted-foreground">
                 <span>{formatTime((range[0]/100) * duration)}</span>
                 <span>{formatTime((range[1]/100) * duration)}</span>
               </div>
               
               <Slider
                 defaultValue={[0, 100]}
                 value={range}
                 max={100}
                 step={0.1}
                 onValueChange={setRange}
                 className="mb-6 py-4"
               />
               
               <div className="flex justify-center gap-4">
                 <Button size="icon" variant="secondary" className="rounded-full w-12 h-12" onClick={togglePlay}>
                   {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
                 </Button>
               </div>
            </div>
          )}
        </Card>

        {/* Sidebar Tools (Placeholder for future features like Merge/Watermark) */}
        <Card className="hidden lg:block">
           <CardContent className="p-6">
              <h3 className="font-bold mb-4 text-muted-foreground uppercase text-xs tracking-wider">工具箱</h3>
              <div className="space-y-2">
                 <Button variant="secondary" className="w-full justify-start text-primary bg-primary/10">
                    <Scissors className="w-4 h-4 mr-2" /> 裁剪模式
                 </Button>
                 <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                    <Download className="w-4 h-4 mr-2" /> 合并视频 (即将推出)
                 </Button>
                 {/* Add more tool placeholders */}
              </div>
              
              <div className="mt-8">
                 <h3 className="font-bold mb-4 text-muted-foreground uppercase text-xs tracking-wider">片段信息</h3>
                 {file ? (
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">文件名</span>
                            <span className="font-medium truncate max-w-[120px]">{file.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">原始时长</span>
                            <span className="font-medium">{formatTime(duration)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">剪辑后时长</span>
                            <span className="font-bold text-primary">
                                {formatTime(((range[1]-range[0])/100) * duration)}
                            </span>
                        </div>
                    </div>
                 ) : (
                    <p className="text-sm text-muted-foreground">未选择文件</p>
                 )}
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
