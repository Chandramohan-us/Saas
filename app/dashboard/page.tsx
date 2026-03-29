import Link from "next/link";
import { MessageSquare, Mic, Image as ImageIcon, FileText, Sparkles, Volume2 } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, Creator</h1>
        <p className="text-muted-foreground text-lg">What would you like to build today?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          href="/dashboard/chat"
          icon={<MessageSquare className="w-8 h-8 text-blue-400" />}
          title="AI Chatbot"
          description="Have a conversation with our advanced AI assistant."
          color="blue"
        />
        <DashboardCard 
          href="/dashboard/voice"
          icon={<Mic className="w-8 h-8 text-purple-400" />}
          title="Voice Translation"
          description="Transcribe and translate speech in real-time."
          color="purple"
        />
        <DashboardCard 
          href="/dashboard/image-to-prompt"
          icon={<ImageIcon className="w-8 h-8 text-pink-400" />}
          title="Image to Prompt"
          description="Extract detailed prompts from any image."
          color="pink"
        />
        <DashboardCard 
          href="/dashboard/image-generation"
          icon={<Sparkles className="w-8 h-8 text-emerald-400" />}
          title="Image Generation"
          description="Create stunning visuals from text descriptions."
          color="emerald"
        />
        <DashboardCard 
          href="/dashboard/text-to-speech"
          icon={<Volume2 className="w-8 h-8 text-yellow-400" />}
          title="Text to Speech"
          description="Convert text into natural-sounding speech."
          color="yellow"
        />
        <DashboardCard 
          href="/dashboard/prompt-generator"
          icon={<FileText className="w-8 h-8 text-orange-400" />}
          title="Prompt Generator"
          description="Enhance your ideas with AI-powered prompt templates."
          color="orange"
        />
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
        <div className="glass-panel rounded-2xl p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Chat Session</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardCard({ href, icon, title, description, color }: { href: string, icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <Link href={href} className="group block">
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 h-full hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl group-hover:bg-${color}-500/20 transition-colors`} />
        
        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}
