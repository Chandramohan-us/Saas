"use client";

import { useState, useRef } from "react";
import { Upload, ImageIcon, Sparkles, Copy, Loader2, RefreshCw, FileText } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { toast } from "sonner";
import Image from "next/image";

export default function ImageToPromptPage() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setPrompt(""); // Clear previous prompt
    };
    reader.readAsDataURL(file);
  };

  const generatePrompt = async () => {
    if (!image) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      // Extract base64 data and mime type
      const base64Data = image.split(",")[1];
      const mimeType = image.split(";")[0].split(":")[1];

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: "Analyze this image in extreme detail and generate a highly descriptive text prompt that could be used to recreate this image using an AI image generator like Midjourney or DALL-E. Include details about lighting, composition, style, mood, colors, and specific elements. Return ONLY the prompt text.",
            },
          ],
        },
      });

      if (response.text) {
        setPrompt(response.text.trim());
        toast.success("Prompt generated successfully!");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Image to Prompt</h1>
        <p className="text-muted-foreground">Reverse-engineer any image into a detailed AI prompt.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5 text-pink-400" /> Upload Image
          </h2>
          
          <div 
            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors relative overflow-hidden min-h-[300px] ${
              image ? "border-pink-500/50 bg-pink-500/5" : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
            }`}
            onClick={() => !image && fileInputRef.current?.click()}
          >
            {image ? (
              <>
                <Image src={image} alt="Uploaded" fill className="object-contain p-2" unoptimized />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setPrompt("");
                    }}
                    className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg font-medium backdrop-blur-sm transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-pink-400" />
                </div>
                <p className="text-lg font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <button
            onClick={generatePrompt}
            disabled={!image || isGenerating}
            className="w-full btn-3d btn-3d-primary bg-pink-600 hover:bg-pink-500 shadow-[0_4px_0_0_#9d174d] dark:shadow-[0_4px_0_0_#831843] py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Image...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate Prompt
              </>
            )}
          </button>
        </div>

        {/* Result Section */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> Generated Prompt
            </h2>
            {prompt && (
              <div className="flex gap-2">
                <button
                  onClick={generatePrompt}
                  disabled={isGenerating}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-white/5 rounded-xl p-6 border border-white/10 relative overflow-y-auto min-h-[300px]">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-pink-400">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 font-medium text-lg animate-pulse">Extracting details...</p>
              </div>
            ) : prompt ? (
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-blue-100 font-medium">{prompt}</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50 text-center px-4">
                <Sparkles className="w-12 h-12 mb-4" />
                <p className="text-lg">Upload an image and click generate</p>
                <p className="text-sm mt-2">Our AI will analyze the visual elements and create a detailed prompt.</p>
              </div>
            )}
          </div>

          {prompt && (
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Copy className="w-5 h-5" /> Copy Prompt to Clipboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
