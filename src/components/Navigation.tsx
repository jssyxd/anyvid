import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Video, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { t, i18n } = useTranslation();

  const navItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.convert'), path: "/convert" },
    { name: t('nav.edit'), path: "/edit" },
    { name: t('nav.embed'), path: "/embed" },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'es', label: 'Español' },
    { code: 'ru', label: 'Русский' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ar', label: 'العربية' },
    { code: 'he', label: 'עברית' },
    { code: 'it', label: 'Italiano' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <Video className="w-8 h-8 text-primary relative z-10" />
            </div>
            <span className="font-heading font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary animate-gradient-x">
              AnyVid
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "text-base font-medium transition-all hover:text-primary relative group py-2",
                  location === item.path ? "text-primary shadow-[0_1px_0_0_var(--color-primary)]" : "text-muted-foreground"
                )}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full opacity-50"></span>
              </a>
            </Link>
          ))}
        </div>

        {/* Global Right Side Actions */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/90 backdrop-blur border-white/10">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={cn("cursor-pointer", i18n.language === lang.code && "text-primary bg-primary/10")}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Toggle Button */}
          <div className="flex md:hidden">
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl p-4 flex flex-col gap-2 animate-in slide-in-from-top-5 shadow-2xl">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "block text-lg font-medium py-4 px-4 rounded-lg transition-all",
                  location === item.path ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-white/5 hover:text-primary"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
