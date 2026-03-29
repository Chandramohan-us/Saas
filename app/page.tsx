import Link from 'next/link';
import { ArrowRight, Sparkles, MessageSquare, Mic, Image as ImageIcon, FileText, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10" />

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between absolute top-0 z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">Nexus AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/dashboard" className="btn-3d btn-3d-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-20 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-8 text-sm font-medium text-blue-400">
          <Zap className="w-4 h-4" /> Introducing Nexus 2.0
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-6">
          The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 neon-text">AI Toolkit</span> for Creators
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Generate text, translate voice, create prompts from images, and generate stunning visuals all in one unified, powerful workspace.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/dashboard" className="btn-3d btn-3d-primary px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
            Start Creating Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="#features" className="px-8 py-4 rounded-xl text-lg font-semibold glass hover:bg-white/20 transition-colors w-full sm:w-auto justify-center flex">
            Explore Features
          </Link>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-24 z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need, in one place</h2>
          <p className="text-muted-foreground">Stop switching between 10 different AI apps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
            title="AI Chatbot"
            description="Advanced conversational AI with context memory and role-playing capabilities."
          />
          <FeatureCard 
            icon={<Mic className="w-6 h-6 text-purple-400" />}
            title="Voice Translation"
            description="Real-time speech-to-text and instant translation across 50+ languages."
          />
          <FeatureCard 
            icon={<ImageIcon className="w-6 h-6 text-pink-400" />}
            title="Image to Prompt"
            description="Reverse-engineer any image into a detailed, high-quality AI prompt."
          />
          <FeatureCard 
            icon={<ImageIcon className="w-6 h-6 text-emerald-400" />}
            title="Image Generation"
            description="Create stunning 1K, 2K, or 4K images from text descriptions using Gemini."
          />
          <FeatureCard 
            icon={<FileText className="w-6 h-6 text-orange-400" />}
            title="Prompt Generator"
            description="Enhance your ideas with our intelligent prompt engineering templates."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 cursor-default group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
