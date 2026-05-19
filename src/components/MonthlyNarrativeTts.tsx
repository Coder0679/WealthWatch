import { useEffect, useMemo, useState } from 'react';
import { Play, Square, Volume2, Loader2 } from 'lucide-react';

export default function MonthlyNarrativeTts(props: {
  summaryText: string;
  fetchTts: () => Promise<{ audioBase64: string; audioMime: string; summary?: string }>;
}) {
  const { summaryText, fetchTts } = props;
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTts, setHasTts] = useState(false);
  const audio = useMemo(() => new Audio(), []);

  useEffect(() => {
    // Reset when summary changes
    setAudioUrl(null);
    setHasTts(false);
    audio.pause();
  }, [summaryText, audio]);

  const play = async () => {
    if (!summaryText) return;
    try {
      setIsLoading(true);
      if (!hasTts) {
        const { audioBase64, audioMime } = await fetchTts();
        const url = `data:${audioMime || 'audio/wav'};base64,${audioBase64}`;
        setAudioUrl(url);
        setHasTts(true);
        audio.src = url;
      } else if (audioUrl) {
        audio.src = audioUrl;
      }

      audio.play();
    } finally {
      setIsLoading(false);
    }
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div className="flex items-center gap-3 mt-4">
      <button
        type="button"
        onClick={play}
        disabled={!summaryText || isLoading}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-300 border border-indigo-500/20 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
        {hasTts ? 'Play again' : 'Play narration'}
      </button>

      <button
        type="button"
        onClick={stop}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1F2937] text-[#94A3B8] border border-[#1F2937] rounded-xl font-bold hover:bg-[#2D3748] hover:text-white transition-all disabled:opacity-50"
      >
        <Square size={16} />
        Stop
      </button>
    </div>
  );
}

