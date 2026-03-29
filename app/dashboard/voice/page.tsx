"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Languages, ArrowRight, Loader2, Copy, Download } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "hi", name: "Hindi" },
];

export default function VoiceTranslationPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
        toast.error("Microphone access denied or error occurred.");
      };
    } else {
      toast.error("Speech recognition is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      if (transcript) {
        handleTranslate(transcript);
      }
    } else {
      setTranscript("");
      setTranslatedText("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleTranslate = async (textToTranslate: string) => {
    if (!textToTranslate.trim()) return;
    
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const langName = LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: `Translate the following text to ${langName}. Only return the translation, nothing else.\n\nText: ${textToTranslate}`,
      });

      if (response.text) {
        setTranslatedText(response.text.trim());
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  const playTranslation = () => {
    if (!translatedText) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang;
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Voice Translation</h1>
        <p className="text-muted-foreground">Speak naturally and translate instantly to 50+ languages.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-400" /> Original Speech
            </h2>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
              Auto-detect (English)
            </div>
          </div>

          <div className="flex-1 min-h-[200px] bg-white/5 rounded-xl p-4 border border-white/10 relative">
            {transcript ? (
              <p className="text-lg leading-relaxed">{transcript}</p>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Mic className="w-12 h-12 mb-4" />
                <p>Click the microphone to start speaking</p>
              </div>
            )}
            
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-xs text-red-400 font-medium animate-pulse">Recording...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={toggleRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 shadow-red-500/50" 
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/50"
              }`}
            >
              {isRecording ? <Square className="w-6 h-6 text-white fill-current" /> : <Mic className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Languages className="w-5 h-5 text-purple-400" /> Translation
            </h2>
            <select
              value={targetLang}
              onChange={(e) => {
                setTargetLang(e.target.value);
                if (transcript && !isRecording) handleTranslate(transcript);
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-background text-foreground">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-h-[200px] bg-white/5 rounded-xl p-4 border border-white/10 relative">
            {isTranslating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm font-medium">Translating...</p>
              </div>
            ) : translatedText ? (
              <p className="text-lg leading-relaxed text-purple-100">{translatedText}</p>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Languages className="w-12 h-12 mb-4" />
                <p>Translation will appear here</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(translatedText)}
                disabled={!translatedText}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 transition-colors"
                title="Copy Text"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                disabled={!translatedText}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 transition-colors"
                title="Download Audio"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={playTranslation}
              disabled={!translatedText}
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
                isPlaying
                  ? "bg-red-500/20 text-red-400 border border-red-500/50"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:shadow-none"
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-5 h-5 fill-current" /> Stop Playing
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" /> Play Translation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
