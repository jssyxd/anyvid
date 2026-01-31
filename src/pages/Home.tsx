import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Scissors, Share2, Shield, Wallet, PlayCircle, Youtube, Twitter, Facebook, Instagram, Linkedin, Twitch, ExternalLink, Zap } from "lucide-react";
import { motion } from "framer-motion";
import VideoExtractor from "@/components/VideoExtractor";
import HotRecommendations from "@/components/HotRecommendations";
import { useTranslation } from "react-i18next";
import "@/i18n"; // Import i18n config

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { t } = useTranslation();

  const platforms = [
    { name: "YouTube", icon: Youtube, url: "https://www.youtube.com", color: "text-red-500" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com", color: "text-blue-400" },
    { name: "Facebook", icon: Facebook, url: "https://facebook.com", color: "text-blue-600" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com", color: "text-pink-500" },
    { name: "Twitch", icon: Twitch, url: "https://twitch.tv", color: "text-purple-500" },
    { name: "Bilibili", icon: PlayCircle, url: "https://www.bilibili.com", color: "text-blue-400" },
    { name: "TikTok", icon: PlayCircle, url: "https://www.tiktok.com", color: "text-black dark:text-white" },
    { name: "Vimeo", icon: ExternalLink, url: "https://vimeo.com", color: "text-blue-500" },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Cyberpunk Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-purple-600/20 blur-[100px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo/Title Area */}
            <div className="mb-10">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight mb-4 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                    AnyVid
                </span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 font-light mb-2">{t('hero.title')}</p>
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                   {t('hero.subtitle')}
                </p>
            </div>
            
            {/* Integrated Extractor */}
            <div className="mb-12">
              <VideoExtractor />
            </div>

            {/* Hot Recommendations */}
            <HotRecommendations />

          </motion.div>
        </div>
      </section>

      {/* Features Section (Compact / 1/3 Size) */}
      <section id="features" className="py-16 relative bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              {t('features.title')}
            </h2>
            <p className="text-muted-foreground text-sm">{t('features.subtitle')}</p>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {[
              { icon: RefreshCw, title: "feat.convert.title", desc: "feat.convert.desc" },
              { icon: Scissors, title: "feat.edit.title", desc: "feat.edit.desc" },
              { icon: Share2, title: "feat.embed.title", desc: "feat.embed.desc" },
              { icon: Wallet, title: "feat.free.title", desc: "feat.free.desc" },
              { icon: Shield, title: "feat.privacy.title", desc: "feat.privacy.desc" },
              { icon: Zap, title: "feat.speed.title", desc: "feat.speed.desc" },
            ].map((feat, idx) => (
              <motion.div key={idx} variants={item}>
                <Card className="h-full border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(var(--primary),0.15)] group p-0">
                  <CardHeader className="p-4 pb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-sm">
                      <feat.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-sm font-bold text-white group-hover:text-primary transition-colors">{t(feat.title)}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="text-xs leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-3">
                        {t(feat.desc)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-12 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-heading font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
            {t('platforms.title')}
          </h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
             {platforms.map((p, i) => (
               <a 
                 key={i} 
                 href={p.url} 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_0_10px_rgba(var(--primary),0.2)] transition-all duration-300 group"
               >
                 <p.icon className={`w-4 h-4 ${p.color} filter grayscale group-hover:grayscale-0 transition-all duration-300`} />
                 <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                   {p.name}
                 </span>
               </a>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
