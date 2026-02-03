/**
 * First-time voice greeting for NEXI chatbot.
 * Must be called from a user gesture (e.g. click) so speech synthesis is allowed.
 */

// Spelled so TTS says "NEX" as one word and "I" as "eye" (not letter-by-letter N-E-X-I)
const GREETING_TEXT =
  "Hi, I'm NEX eye — a real-time AI bot here to entertain and help you.";
const VOICE_SETTINGS = {
  rate: 0.92, // slightly slower, but a touch more lively
  pitch: 1.15, // a bit higher for a sweeter tone
  volume: 0.8,
  lang: "en-US",
} as const;

let cachedPreferredVoice: SpeechSynthesisVoice | null = null;
let hasRegisteredVoicesChangedListener = false;
let greetingTriggeredThisSession = false;

function computePreferredVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const isEnglish = (v: SpeechSynthesisVoice) => v.lang?.toLowerCase().startsWith("en");
  const femaleNameHint =
    /(female|woman|girl|samantha|victoria|karen|tessa|serena|jenny|natasha|zira|aria|ava|emma|olivia|sara|seraphina|nova)/i;

  const englishVoices = voices.filter(isEnglish);

  return (
    // 1) Explicitly female-sounding voice names (best-effort)
    englishVoices.find((v) => femaleNameHint.test(v.name)) ??
    // 2) Exact locale match
    englishVoices.find((v) => v.lang === VOICE_SETTINGS.lang) ??
    // 3) Any English voice
    englishVoices[0] ??
    // 4) Anything available
    voices[0] ??
    null
  );
}

function getPreferredVoice(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices();
    if (!cachedPreferredVoice && voices.length > 0) {
      cachedPreferredVoice = computePreferredVoice(voices);
    }

    // Chrome sometimes loads voices async; cache once they arrive.
    if (!hasRegisteredVoicesChangedListener) {
      hasRegisteredVoicesChangedListener = true;
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        try {
          const updated = window.speechSynthesis.getVoices();
          cachedPreferredVoice = computePreferredVoice(updated);
        } catch {
          // ignore
        }
      });
    }

    return cachedPreferredVoice;
  } catch {
    return null;
  }
}

export function playNexiVoiceGreetingIfFirstTime(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  // Prevent double-queueing within the same page load (e.g. open → close → open).
  // After a full reload, greetingTriggeredThisSession is reset, so greeting plays again.
  if (greetingTriggeredThisSession) return;
  greetingTriggeredThisSession = true;

  const utterance = new SpeechSynthesisUtterance(GREETING_TEXT);
  utterance.rate = VOICE_SETTINGS.rate;
  utterance.pitch = VOICE_SETTINGS.pitch;
  utterance.volume = VOICE_SETTINGS.volume;
  utterance.lang = VOICE_SETTINGS.lang;

  const preferredVoice = getPreferredVoice();
  if (preferredVoice) utterance.voice = preferredVoice;

  utterance.onstart = () => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[NEXI] voice greeting started", {
        chosenVoice: utterance.voice ? { name: utterance.voice.name, lang: utterance.voice.lang } : null,
        availableVoices: (() => {
          try {
            return window.speechSynthesis.getVoices().map((v) => ({ name: v.name, lang: v.lang }));
          } catch {
            return null;
          }
        })(),
      });
    }
  };

  utterance.onend = () => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[NEXI] voice greeting ended");
    }
  };

  utterance.onerror = (event) => {
    console.error("Speech synthesis error:", event);
  };

  try {
    // Cancel any pending/playing speech so we never queue a duplicate greeting.
    window.speechSynthesis.cancel();
    // Call speak() immediately so it runs in the same user gesture.
    window.speechSynthesis.resume?.();
    window.speechSynthesis.speak(utterance);
  } catch {
    // ignore
  }
}
