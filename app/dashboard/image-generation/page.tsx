"use client";

import { useState, useEffect } from "react";
import { Sparkles, Image as ImageIcon, Download, Loader2, Key } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { toast } from "sonner";
import Image from "next/image";

// Add type declarations for window.aistudio
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } catch (error) {
          console.error("Error checking API key:", error);
          setHasApiKey(false);
        }
      } else {
        // If not in AI Studio environment, assume true and use env var
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success to mitigate race condition
        setHasApiKey(true);
      } catch (error) {
        console.error("Error opening select key dialog:", error);
      }
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImageUrl(null);
    
    try {
      // Create a new instance right before making an API call
      // The platform injects the selected key into NEXT_PUBLIC_GEMINI_API_KEY or handles it internally
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: {
          parts: [
            { text: prompt },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: imageSize,
          },
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64EncodeString}`;
          setGeneratedImageUrl(imageUrl);
          foundImage = true;
          toast.success("Image generated successfully!");
          break;
        }
      }

      if (!foundImage) {
        throw new Error("No image data found in response");
      }

    } catch (error: any) {
      console.error("Image generation error:", error);
      
      if (error?.message?.includes("Requested entity was not found")) {
        toast.error("API Key error. Please select your API key again.");
        setHasApiKey(false);
      } else {
        toast.error("Failed to generate image. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasApiKey === false) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
          <Key className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">API Key Required</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          To generate high-quality images using Gemini 3.1 Flash Image Preview, you need to select a paid Google Cloud API key.
        </p>
        <button
          onClick={handleSelectKey}
          className="btn-3d btn-3d-primary bg-emerald-600 hover:bg-emerald-500 shadow-[0_4px_0_0_#047857] dark:shadow-[0_4px_0_0_#065f46] px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-lg mt-4"
        >
          Select API Key
        </button>
        <p className="text-sm text-muted-foreground mt-4">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-400 transition-colors">
            Learn more about billing
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Image Generation</h1>
        <p className="text-muted-foreground">Create stunning 1K, 2K, or 4K visuals from text descriptions using Gemini 3.1 Flash.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Section */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col gap-6 h-fit">
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic neon city at night, cyberpunk style, flying cars, highly detailed, 8k resolution..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none text-base leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" /> Image Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["1K", "2K", "4K"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setImageSize(size)}
                  className={`py-3 rounded-xl border font-medium transition-all ${
                    imageSize === size
                      ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Higher resolutions may take longer to generate.
            </p>
          </div>

          <button
            onClick={generateImage}
            disabled={!prompt.trim() || isGenerating}
            className="w-full btn-3d btn-3d-primary bg-emerald-600 hover:bg-emerald-500 shadow-[0_4px_0_0_#047857] dark:shadow-[0_4px_0_0_#065f46] py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate Image
              </>
            )}
          </button>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl flex flex-col gap-6 min-h-[500px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-400" /> Result
            </h2>
            {generatedImageUrl && (
              <a
                href={generatedImageUrl}
                download={`generated-image-${imageSize}.png`}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2 text-sm font-medium"
                title="Download Image"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            )}
          </div>

          <div className="flex-1 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-400 bg-background/50 backdrop-blur-sm z-10">
                <div className="w-16 h-16 relative mb-6">
                  <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="font-medium text-lg animate-pulse">Painting your imagination...</p>
                <p className="text-sm text-emerald-500/70 mt-2">This usually takes 10-20 seconds</p>
              </div>
            ) : generatedImageUrl ? (
              <div className="relative w-full h-full min-h-[400px]">
                <Image 
                  src={generatedImageUrl} 
                  alt={prompt} 
                  fill 
                  className="object-contain p-2" 
                  unoptimized 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50 text-center px-4 py-12">
                <ImageIcon className="w-16 h-16 mb-4" />
                <p className="text-lg">Your generated image will appear here</p>
                <p className="text-sm mt-2">Enter a prompt and select a size to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
