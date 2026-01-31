import { Video, Github, Twitter, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
              <Video className="w-6 h-6" />
              AnyVid
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              您的全能视频处理助手。无需下载，在线处理。支持YouTube、B站、Twitter等主流平台。
              安全、快速、免费。
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-bold mb-4">产品</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#/extract" className="hover:text-primary transition-colors">视频提取</a></li>
              <li><a href="#/convert" className="hover:text-primary transition-colors">格式转换</a></li>
              <li><a href="#/edit" className="hover:text-primary transition-colors">在线剪辑</a></li>
              <li><a href="#/embed" className="hover:text-primary transition-colors">嵌入生成</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">支持</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">使用文档</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">常见问题</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">隐私政策</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">联系我们</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">关注我们</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 AnyVid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
