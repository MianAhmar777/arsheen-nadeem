import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import photoAsset from "@/assets/arsheen-photo.jpg.asset.json";
import songAsset from "@/assets/arsheen-birthday-song.mp3.asset.json";
import tuneAsset from "@/assets/arsheen-islamic-tune.mp3.asset.json";

const TRACKS = [
  {
    key: "birthday",
    label: "Birthday Song",
    subtitle: "A cheerful song made just for Arsheen",
    src: songAsset.url,
  },
  {
    key: "tune",
    label: "Islamic Tune",
    subtitle: "A peaceful instrumental melody for duas",
    src: tuneAsset.url,
  },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Arsheen Nadeem! 🎂" },
      {
        name: "description",
        content:
          "A birthday page full of love, duas and music for Arsheen Nadeem — with love from her Bhai.",
      },
      { property: "og:title", content: "Happy Birthday, Arsheen Nadeem! 🎂" },
      {
        property: "og:description",
        content: "A page full of love, duas and a birthday song for Arsheen Nadeem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Quicksand:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

/* Deterministic pseudo-random so SSR and client render identical confetti */
function seeded(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const CONFETTI_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-gold)",
  "var(--color-blush)",
  "var(--color-teal-soft)",
];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: `${seeded(i + 1) * 100}%`,
        color: CONFETTI_COLORS[Math.floor(seeded(i + 21) * CONFETTI_COLORS.length)],
        width: 6 + seeded(i + 41) * 6,
        height: 10 + seeded(i + 61) * 8,
        dur: `${7 + seeded(i + 81) * 6}s`,
        delay: `${seeded(i + 101) * 10}s`,
        drift: `${(seeded(i + 121) - 0.5) * 12}vw`,
        round: seeded(i + 141) > 0.6,
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              left: p.left,
              width: p.width,
              height: p.height,
              backgroundColor: p.color,
              borderRadius: p.round ? "50%" : "2px",
              "--dur": p.dur,
              "--delay": p.delay,
              "--drift": p.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

const BALLOONS = ["🎈", "🎀", "✨", "🎈", "💖", "🎈", "✨", "🎁"];

function Balloons() {
  const items = useMemo(
    () =>
      BALLOONS.map((emoji, i) => ({
        emoji,
        left: `${4 + seeded(i + 201) * 90}%`,
        top: `${8 + seeded(i + 221) * 70}%`,
        size: 26 + seeded(i + 241) * 26,
        dur: `${6 + seeded(i + 261) * 5}s`,
        delay: `${seeded(i + 281) * 4}s`,
        tilt: `${(seeded(i + 301) - 0.5) * 10}deg`,
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((b, i) => (
        <span
          key={i}
          className="balloon"
          style={
            {
              left: b.left,
              top: b.top,
              fontSize: b.size,
              "--dur": b.dur,
              "--delay": b.delay,
              "--tilt": b.tilt,
            } as React.CSSProperties
          }
        >
          {b.emoji}
        </span>
      ))}
    </div>
  );
}

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackKey, setTrackKey] = useState<(typeof TRACKS)[number]["key"]>("birthday");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = TRACKS.find((t) => t.key === trackKey)!;

  const selectTrack = (key: (typeof TRACKS)[number]["key"]) => {
    if (key === trackKey) return;
    const audio = audioRef.current;
    if (audio) audio.pause();
    setTrackKey(key);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch {
        /* autoplay restrictions — user gesture was given, safe to ignore */
      }
    }
  };

  const format = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="relative mx-auto w-full max-w-md rounded-4xl border border-border bg-card p-6 shadow-[0_18px_50px_-18px_var(--color-primary)]">
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-full bg-secondary p-1">
        {TRACKS.map((t) => (
          <button
            key={t.key}
            onClick={() => selectTrack(t.key)}
            aria-pressed={trackKey === t.key}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
              trackKey === t.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          aria-label={playing ? `Pause ${track.label}` : `Play ${track.label}`}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ animation: playing ? "soft-pulse 1.6s ease-in-out infinite" : undefined }}
        >
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-semibold text-foreground">
            {track.label}
          </p>
          <p className="text-sm text-muted-foreground">
            {playing ? "Now playing… press pause anytime" : track.subtitle}
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
          {format(progress)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={progress}
          onChange={(e) => {
            const audio = audioRef.current;
            if (audio) audio.currentTime = Number(e.target.value);
          }}
          aria-label="Seek through the music"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
        />
        <span className="w-10 text-xs tabular-nums text-muted-foreground">
          {duration ? format(duration) : "--:--"}
        </span>
      </div>
      <audio
        ref={audioRef}
        key={track.key}
        src={track.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}

const DUAS = [
  {
    title: "Dua for Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidnī ʿilmā",
    meaning:
      "“My Lord, increase me in knowledge.” — that her studies and her heart both fill with light.",
  },
  {
    title: "Dua for Ease & Success",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    transliteration: "Rabbi-shraḥ lī ṣadrī wa-yassir lī amrī",
    meaning:
      "“My Lord, expand for me my chest and ease for me my task.” — may every exam and every worry become easy for her.",
  },
  {
    title: "Dua for Guidance & Purity",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَىٰ وَالتُّقَىٰ وَالْعَفَافَ وَالْغِنَىٰ",
    transliteration:
      "Allāhumma innī as'aluka-l-hudā wa-t-tuqā wa-l-ʿafāfa wa-l-ghinā",
    meaning:
      "“O Allah, I ask You for guidance, piety, modesty and contentment.” — a dua as decent and graceful as she is.",
  },
  {
    title: "Dua for Protection",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
    transliteration: "Bismillāhi-l-ladhī lā yaḍurru maʿa ismihi shayʾ",
    meaning:
      "“In the name of Allah, with whose name nothing can cause harm.” — may she be protected every morning and evening.",
  },
  {
    title: "Dua for the Best of Both Worlds",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration:
      "Rabbanā ātinā fi-d-dunyā ḥasanah wa-fi-l-ākhirati ḥasanah wa-qinā ʿadhāb-an-nār",
    meaning:
      "“Our Lord, give us good in this world and good in the Hereafter.” — may every birthday of hers be blessed, here and forever.",
  },
  {
    title: "Dua for Joy in the Family",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ",
    transliteration: "Rabbanā hab lanā min azwājinā wa-dhurriyyātinā qurrata aʿyun",
    meaning:
      "“Our Lord, grant us joy in our families.” — she is already the coolness of our eyes; may it never fade.",
  },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background font-body text-foreground">
      <Confetti />

      {/* ---------- Hero ---------- */}
      <header className="relative overflow-hidden px-4 pb-20 pt-16 text-center sm:pt-20">
        <Balloons />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            5th October · A Very Special Day
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-7xl">
            <span className="title-shimmer">Happy Birthday</span>
            <br />
            <span className="text-primary">Arsheen Nadeem</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            To the sweetest little sister — cute, decent and full of kindness.
            Today the whole world celebrates you. 🎂
          </p>

          <div className="relative mx-auto mt-12 w-fit">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-gold-soft via-blush to-teal-soft blur-sm"
            />
            <figure className="relative -rotate-1 rounded-[2rem] border border-border bg-card p-3 shadow-[0_24px_60px_-20px_var(--color-primary)]">
              <img
                src={photoAsset.url}
                alt="Arsheen Nadeem smiling on a sunny day in her teal embroidered dress"
                className="h-auto w-[min(78vw,360px)] rounded-3xl object-cover"
              />
              <figcaption className="pb-1 pt-3 font-display text-lg italic text-muted-foreground">
                Our little star ✨
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      {/* ---------- Message from Bhai ---------- */}
      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-4xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
          <span className="text-3xl" aria-hidden>
            💌
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
            A Message From Your Bhai
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground sm:text-lg">
            Dear Arsheen,
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground sm:text-lg">
            You are the most precious gift Allah has given me. Watching you grow
            into such a cute, decent and caring young girl fills my heart with
            pride every single day. You care for everyone around you with so
            much love — today, let that love come back to you, doubled.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground sm:text-lg">
            Study well in your pre-9th year, keep that beautiful smile, and
            never forget: whatever happens, your Bhai is always by your side.
          </p>
          <p className="mt-8 font-display text-2xl italic text-accent">
            Happy Birthday, little one. ❤️
          </p>
        </div>
      </section>

      {/* ---------- Music ---------- */}
      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
            🎵 Her Birthday Song
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            A cheerful song made just for Arsheen — press play and let the
            celebration begin.
          </p>
          <div className="mt-8">
            <MusicPlayer />
          </div>
        </div>
      </section>

      {/* ---------- Duas ---------- */}
      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
            🤲 Duas for Arsheen
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Prayers said for her today, and every day after.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {DUAS.map((dua) => (
              <article
                key={dua.title}
                className="rounded-4xl border border-border bg-card p-7 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
                  {dua.title}
                </h3>
                <p
                  dir="rtl"
                  lang="ar"
                  className="mt-5 text-2xl leading-[2] text-primary sm:text-[1.7rem]"
                >
                  {dua.arabic}
                </p>
                <p className="mt-4 text-sm font-semibold italic text-foreground">
                  {dua.transliteration}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {dua.meaning}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing ---------- */}
      <footer className="relative overflow-hidden px-4 pb-24 pt-16 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-4xl" aria-hidden>
            🎂
          </p>
          <p className="mt-4 font-display text-2xl font-semibold text-primary sm:text-3xl">
            May every wish you make come true, Arsheen.
          </p>
          <p className="mt-3 text-muted-foreground">
            With all my love and countless duas —
            <br />
            <span className="font-semibold text-foreground">Your Bhai</span> ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
