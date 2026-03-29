"use client";

import { useState } from "react";
import { Volume2, Play, Square, Download, Loader2, Settings2, FileText } from "lucide-react";
import { GoogleGenAI, Modality } from "@google/genai";
import { toast } from "sonner";

const VOICES = [
  { id: "Puck", name: "Puck (Male)" },
  { id: "Charon", name: "Charon (Male)" },
  { id: "Kore", name: "Kore (Female)" },
  { id: "Fenrir", name: "Fenrir (Male)" },
  { id: "Zephyr", name: "Zephyr (Female)" },
];

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Kore");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useState<HTMLAudioElement | null>(null);

  const generateSpeech = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setAudioUrl(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (base64Audio) {
        // Convert base64 to blob URL for playback and download
        const binary = atob(base64Audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        // Gemini TTS returns raw PCM, but we need to play it. 
        // Wait, the documentation says "decode and play audio with sample rate 24000".
        // Actually, the easiest way to play raw PCM in browser is using AudioContext, 
        // but if we want a simple <audio> element, we need a WAV header.
        // Let's create a WAV header for the PCM data.
        
        const sampleRate = 24000;
        const numChannels = 1;
        const bitsPerSample = 16;
        
        const wavBuffer = new ArrayBuffer(44 + bytes.length);
        const view = new DataView(wavBuffer);
        
        // RIFF chunk descriptor
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + bytes.length, true);
        writeString(view, 8, 'WAVE');
        
        // fmt sub-chunk
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
        view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // ByteRate
        view.setUint16(32, numChannels * (bitsPerSample / 8), true); // BlockAlign
        view.setUint16(34, bitsPerSample, true);
        
        // data sub-chunk
        writeString(view, 36, 'data');
        view.setUint32(40, bytes.length, true);
        
        // Write PCM data
        const pcmData = new Uint8Array(wavBuffer, 44);
        pcmData.set(bytes);
        
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        toast.success("Speech generated successfully!");
      } else {
        throw new Error("No audio data received");
      }
    } catch (error) {
      console.error("TTS error:", error);
      toast.error("Failed to generate speech.");
    } finally {
      setIsGenerating(false);
    }
  };

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  const togglePlay = () => {
    const audioEl = document.getElementById('tts-audio') as HTMLAudioElement;
    if (!audioEl) return;

    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else {
      audioEl.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Text to Speech</h1>
        <p className="text-muted-foreground">Convert your text into incredibly natural-sounding voices.</p>
      </header>

      <div className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col gap-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-medium">Voice Settings</h3>
              <p className="text-xs text-muted-foreground">Select a voice profile</p>
            </div>
          </div>
          
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full sm:w-auto bg-background border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" /> Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-lg leading-relaxed"
          />
          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">{text.length} characters</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={generateSpeech}
            disabled={!text.trim() || isGenerating}
            className="w-full sm:w-auto btn-3d btn-3d-primary bg-yellow-600 hover:bg-yellow-500 shadow-[0_4px_0_0_#a16207] dark:shadow-[0_4px_0_0_#854d0e] px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Generating Audio...
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" /> Generate Speech
              </>
            )}
          </button>

          {audioUrl && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <audio 
                id="tts-audio" 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                className="hidden" 
              />
              
              <button
                onClick={togglePlay}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                  isPlaying
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-5 h-5 fill-current" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" /> Play
                  </>
                )}
              </button>
              
              <a
                href={audioUrl}
                download={`speech-${selectedVoice}.wav`}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center"
                title="Download Audio"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


