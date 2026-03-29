"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Github, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden relative p-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
        <Sparkles className="w-6 h-6 text-blue-500" />
        <span>Nexus AI</span>
      </Link>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl flex flex-col gap-6 relative z-10">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue to your workspace.</p>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-medium">
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>
              <a href="#" className="text-xs text-blue-400 hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          
          <Link href="/dashboard" className="w-full btn-3d btn-3d-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-6 inline-flex">
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don&apos;t have an account? <a href="#" className="text-blue-400 hover:underline font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
}
