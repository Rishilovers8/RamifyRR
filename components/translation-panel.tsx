"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap } from "lucide-react";
import type { VideoData } from "@/types/video";

interface TranslationPanelProps {
  videoData: VideoData;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese (Mandarin)" },
  { code: "ko", name: "Korean" },
  { code: "hi", name: "Hindi" },
  { code: "ar", name: "Arabic" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
];

export function TranslationPanel({
  videoData,
  isProcessing,
  setIsProcessing,
}: TranslationPanelProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [voiceClone, setVoiceClone] = useState(true);
  const [subtitles, setSubtitles] = useState(true);
  const [lipSync, setLipSync] = useState(true);

  const handleLanguageToggle = (langCode: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(langCode)
        ? prev.filter((l) => l !== langCode)
        : [...prev, langCode]
    );
  };

  const handleStartTranslation = async () => {
    if (selectedLanguages.length === 0) {
      alert("Please select at least one language");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(
        `Translation started for: ${selectedLanguages.map((l) => LANGUAGES.find((lang) => lang.code === l)?.name).join(", ")}`
      );
    } catch (error) {
      alert("Error starting translation");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Translation Settings</CardTitle>
          <CardDescription>
            Configure your video translation preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Voice Cloning</p>
                <p className="text-sm text-muted-foreground">
                  Preserve original voice characteristics
                </p>
              </div>
              <Checkbox
                checked={voiceClone}
                onCheckedChange={setVoiceClone}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Subtitles</p>
                <p className="text-sm text-muted-foreground">
                  Generate subtitles in all languages
                </p>
              </div>
              <Checkbox checked={subtitles} onCheckedChange={setSubtitles} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lip Sync</p>
                <p className="text-sm text-muted-foreground">
                  Synchronize lips with translated audio
                </p>
              </div>
              <Checkbox checked={lipSync} onCheckedChange={setLipSync} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Target Languages</CardTitle>
          <CardDescription>
            Select which languages to translate the video into ({selectedLanguages.length} selected)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageToggle(language.code)}
                className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                  selectedLanguages.includes(language.code)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Selected Options:
            </p>
            <div className="flex flex-wrap gap-2">
              {voiceClone && <Badge>Voice Cloning</Badge>}
              {subtitles && <Badge>Auto Subtitles</Badge>}
              {lipSync && <Badge>Lip Sync</Badge>}
            </div>
          </div>

          <Button
            onClick={handleStartTranslation}
            disabled={isProcessing || selectedLanguages.length === 0}
            size="lg"
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Start Translation
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
