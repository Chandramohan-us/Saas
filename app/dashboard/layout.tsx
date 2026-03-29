"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, 
  Mic, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  LogOut,
  Sparkles,
  Menu,
  X,
  Volume2
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "AI Chatbot", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Voice Translation", href: "/dashboard/voice", icon: Mic },
  { name: "Image to Prompt", href: "/dashboard/image-to-prompt", icon: ImageIcon },
  { name: "Image Generation", href: "/dashboard/image-generation", icon: Sparkles },
  { name: "Text to Speech", href: "/dashboard/text-to-speech", icon: Volume2 },
  { name: "Prompt Generator", href: "/dashboard/prompt-generator", icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 glass-panel border-r border-white/10 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-400 neon-text">
            <Sparkles className="w-6 h-6" />
            Nexus AI
          </Link>
          <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-blue-600/20 text-blue-400 neon-border" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-400" : ""}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credits</span>
            <span className="text-xs font-bold text-blue-400">45/100</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mx-4 mb-4">
            <div className="h-full bg-blue-500 w-[45%]" />
          </div>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all text-sm font-medium">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
            <LogOut className="w-5 h-5" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-10">
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="btn-3d btn-3d-primary px-4 py-1.5 rounded-lg text-sm font-medium">
              Upgrade
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-background" />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-0 relative">
          {/* Background Glows for Dashboard */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
