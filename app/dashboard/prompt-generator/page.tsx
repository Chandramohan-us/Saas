"use client";

import { useState } from "react";
import { FileText, Sparkles, Copy, Loader2, ChevronRight, PenTool, Code, Megaphone } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { toast } from "sonner";

const TEMPLATES = [
  {
    id: "marketing",
    title: "Marketing Copy",
    icon: <Megaphone className="w-5 h-5 text-orange-400" />,
    description: "Generate high-converting ad copy or social media posts.",
    placeholder: "e.g., A new eco-friendly water bottle targeting fitness enthusiasts.",
  },
  {
    id: "coding",
    title: "Code Assistant",
    icon: <Code className="w-5 h-5 text-blue-400" />,
    description: "Create prompts for debugging, refactoring, or writing new code.",
    placeholder: "e.g., A React component for a drag-and-drop file uploader.",
  },
  {
    id: "content",
    title: "Content Creation",
    icon: <PenTool className="w-5 h-5 text-purple-400" />,
    description: "Draft blog posts, articles, or creative stories.",
    placeholder: "e.g., A 1000-word blog post about the future of AI in healthcare.",
  },
];

export default function PromptGeneratorPage() {
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);
  const [input, setInput] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePrompt = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const systemPrompt = `You are an expert prompt engineer. Your task is to take a user's basic idea for a ${activeTemplate.title} task and turn it into a highly detailed, optimized, and effective prompt that they can use with an AI model (like ChatGPT or Gemini) to get the best possible result. 
      
      The enhanced prompt should include:
      - A clear role or persona for the AI
      - Specific instructions and constraints
      - Desired tone and format
      - Examples or context if helpful
      
      Return ONLY the enhanced prompt text, ready to be copy-pasted.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          { role: "user", parts: [{ text: `System: ${systemPrompt}\n\nUser Idea: ${input}` }] }
        ],
      });

      if (response.text) {
        setEnhancedPrompt(response.text.trim());
        toast.success("Prompt enhanced successfully!");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to enhance prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!enhancedPrompt) return;
    navigator.clipboard.writeText(enhancedPrompt);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Prompt Generator</h1>
        <p className="text-muted-foreground">Turn simple ideas into master-level AI prompts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Templates */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Select Template</h2>
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                setActiveTemplate(template);
                setInput("");
                setEnhancedPrompt("");
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                activeTemplate.id === template.id
                  ? "bg-white/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="mt-1 bg-background p-2 rounded-lg border border-white/5">
                {template.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{template.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{template.description}</p>
              </div>
              <ChevronRight className={`w-5 h-5 mt-2 transition-transform ${activeTemplate.id === template.id ? "text-orange-400 translate-x-1" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> Your Idea
            </h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeTemplate.placeholder}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none text-lg"
            />
            <button
              onClick={generatePrompt}
              disabled={!input.trim() || isGenerating}
              className="w-full sm:w-auto self-end btn-3d btn-3d-primary bg-orange-600 hover:bg-orange-500 shadow-[0_4px_0_0_#c2410c] dark:shadow-[0_4px_0_0_#9a3412] px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Enhance Prompt
                </>
              )}
            </button>
          </div>

          {/* Result */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 flex-1 min-h-[300px] relative">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" /> Enhanced Prompt
              </h2>
              {enhancedPrompt && (
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex-1 bg-white/5 rounded-xl p-6 border border-white/10 relative overflow-y-auto">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-orange-400">
                  <div className="w-12 h-12 relative mb-4">
                    <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="font-medium animate-pulse">Applying prompt engineering techniques...</p>
                </div>
              ) : enhancedPrompt ? (
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-orange-50 font-medium whitespace-pre-wrap">{enhancedPrompt}</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50 text-center px-4">
                  <FileText className="w-12 h-12 mb-4" />
                  <p className="text-lg">Describe your idea and click enhance</p>
                  <p className="text-sm mt-2">We&apos;ll turn it into a professional, highly-effective prompt.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
