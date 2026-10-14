"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/ui/SiteHeader";
// Zero-dependency SVG Icons for maximum performance and compatibility
function Monitor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

function Radio({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    </svg>
  );
}

function KeyRound({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
}

function Volume2({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  );
}

function Power({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
    </svg>
  );
}

function RotateCcw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function Play({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function Square({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}

function FastForward({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="13 19 22 12 13 5 13 19" />
      <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
  );
}

function Rewind({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="11 19 2 12 11 5 11 19" />
      <polygon points="22 19 13 12 22 5 22 19" />
    </svg>
  );
}

function FolderOpen({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function Search({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}

function Award({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function Sliders({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="1" x2="7" y1="14" y2="14" />
      <line x1="9" x2="15" y1="8" y2="8" />
      <line x1="17" x2="23" y1="16" y2="16" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
import {
  RETRO_ARTICLES,
  CIPHER_PUZZLES,
  RADIO_STATIONS,
  CASSETTE_TRACKS,
  encodeCaesar,
  RetroArticle,
  RadioStation,
} from "@/lib/retroData";
import { retroAudio } from "@/lib/retroAudio";

type CrtTheme = "amber" | "green" | "paper";
type ActiveTab = "terminal" | "radio" | "cipher";
type TerminalSubMode = "docs" | "cli";

export function RetroWorldExperience() {
  // State: System
  const [powerOn, setPowerOn] = useState(true);
  const [theme, setTheme] = useState<CrtTheme>("amber");
  const [scanlines, setScanlines] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("terminal");

  // State: Knowledge Vault & Progress
  const [learnedArticleIds, setLearnedArticleIds] = useState<string[]>([]);
  const [unlockedCipherIds, setUnlockedCipherIds] = useState<string[]>([]);

  // State: Terminal Module
  const [terminalSubMode, setTerminalSubMode] = useState<TerminalSubMode>("docs");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<RetroArticle | null>(null);

  // State: CLI Sub-Mode
  const [cliHistory, setCliHistory] = useState<string[]>([
    "RETRO-OS KERNEL v2.4 (C) 1984 KNOWLEDGE ARCHIVE",
    "MEMORI BEBAS: 640 KB OK.",
    "Ketik 'help' untuk panduan daftar perintah terminal.",
  ]);
  const [cliInput, setCliInput] = useState("");
  const cliBottomRef = useRef<HTMLDivElement>(null);

  // State: Radio Tuner Module
  const [frequency, setFrequency] = useState(7.83); // MHz
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [morseDecodedText, setMorseDecodedText] = useState("");
  const oscilloscopeCanvasRef = useRef<HTMLCanvasElement>(null);

  // State: Cassette Tape Module
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tapePlaying, setTapePlaying] = useState(false);
  const [tapeCounter, setTapeCounter] = useState(1);
  const tapeSpeedMultiplier = 1;
  const [tapeSpoolAngle, setTapeSpoolAngle] = useState(0);

  // State: Cipher Decoder Module
  const [currentCipherIndex, setCurrentCipherIndex] = useState(0);
  const [rotorShift, setRotorShift] = useState(0);
  const [cipherSolved, setCipherSolved] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customShift, setCustomShift] = useState(3);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const storedArticles = localStorage.getItem("retro_learned_articles");
      if (storedArticles) setLearnedArticleIds(JSON.parse(storedArticles));

      const storedCiphers = localStorage.getItem("retro_unlocked_ciphers");
      if (storedCiphers) setUnlockedCipherIds(JSON.parse(storedCiphers));
    } catch {
      // Ignore local storage error
    }
  }, []);

  // Sync mute state
  useEffect(() => {
    retroAudio.setMuted(isMuted);
  }, [isMuted]);

  // Handle CRT power toggle
  const togglePower = () => {
    const nextState = !powerOn;
    retroAudio.playCrtPower(nextState);
    setPowerOn(nextState);
    if (!nextState) {
      // Pause active sounds
      setIsRadioPlaying(false);
      setTapePlaying(false);
      retroAudio.stopRadioNoise();
      retroAudio.stopTapeHum();
    }
  };

  // Color Palette mapping based on theme
  const colors = useMemo(() => {
    if (theme === "amber") {
      return {
        text: "text-amber-400",
        textMuted: "text-amber-400/60",
        border: "border-amber-500/30",
        borderActive: "border-amber-400",
        bg: "bg-amber-950/20",
        bgHover: "hover:bg-amber-500/10",
        bgActive: "bg-amber-500/20",
        glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        accentHex: "#f59e0b",
      };
    }
    if (theme === "green") {
      return {
        text: "text-emerald-400",
        textMuted: "text-emerald-400/60",
        border: "border-emerald-500/30",
        borderActive: "border-emerald-400",
        bg: "bg-emerald-950/20",
        bgHover: "hover:bg-emerald-500/10",
        bgActive: "bg-emerald-500/20",
        glow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        accentHex: "#10b981",
      };
    }
    return {
      text: "text-slate-100",
      textMuted: "text-slate-300/60",
      border: "border-slate-400/30",
      borderActive: "border-slate-200",
      bg: "bg-slate-900/30",
      bgHover: "hover:bg-slate-300/10",
      bgActive: "bg-slate-300/20",
      glow: "shadow-[0_0_20px_rgba(226,232,240,0.2)]",
      badge: "bg-slate-200/20 text-slate-100 border-slate-300/40",
      accentHex: "#e2e8f0",
    };
  }, [theme]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add("Semua");
    RETRO_ARTICLES.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return RETRO_ARTICLES.filter((article) => {
      const matchCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;
      const matchSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Mark article as learned
  const handleMarkAsLearned = (id: string) => {
    if (learnedArticleIds.includes(id)) return;
    const nextList = [...learnedArticleIds, id];
    setLearnedArticleIds(nextList);
    try {
      localStorage.setItem("retro_learned_articles", JSON.stringify(nextList));
    } catch {
      // Ignore
    }
    retroAudio.playSuccessChime();
  };

  // CLI Command processor
  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim().toLowerCase();
    if (!cmd) return;

    retroAudio.playKeyClick(Math.floor(Math.random() * 5));

    const newHistory = [...cliHistory, `> ${cliInput}`];

    if (cmd === "help") {
      newHistory.push(
        "DAFTAR PERINTAH RETRO-OS:",
        "  help         : Menampilkan daftar perintah",
        "  dir / ls     : Menampilkan daftar arsip pengetahuan",
        "  read <id>    : Membaca arsip berdasarkan ID dokumen",
        "  cls / clear  : Membersihkan layar terminal",
        "  theme <mode> : Ganti tema tampilan (amber, green, paper)",
        "  scanlines    : Menyalakan atau mematikan efek garis kaca",
        "  stats        : Memeriksa capaian belajar dan sandi terpecahkan",
        "  radio        : Beralih ke modul penala radio gelombang pendek",
        "  cipher       : Beralih ke modul dekoder sandi kriptografi",
        "  date         : Menampilkan tanggal dan jam sistem waktu nyata"
      );
    } else if (cmd === "dir" || cmd === "ls") {
      newHistory.push("DIREKTORI ARSIP PENGETAHUAN [C:\\RETRO\\DOCS\\*.*]:");
      RETRO_ARTICLES.forEach((art) => {
        newHistory.push(
          `  [${art.id.padEnd(20)}] ${art.title.slice(0, 38).padEnd(40)} ${art.era}`
        );
      });
      newHistory.push("Ketik 'read <id>' untuk membaca isi dokumen.");
    } else if (cmd.startsWith("read ")) {
      const targetId = cmd.replace("read ", "").trim();
      const found = RETRO_ARTICLES.find(
        (a) => a.id.toLowerCase() === targetId.toLowerCase()
      );
      if (found) {
        setSelectedArticle(found);
        setTerminalSubMode("docs");
        retroAudio.playSwitchSnap();
        newHistory.push(`Membuka dokumen: ${found.title}...`);
      } else {
        newHistory.push(
          `Error: Dokumen '${targetId}' tidak ditemukan. Ketik 'dir' untuk melihat ID yang valid.`
        );
      }
    } else if (cmd === "cls" || cmd === "clear") {
      setCliHistory([]);
      setCliInput("");
      return;
    } else if (cmd.startsWith("theme ")) {
      const targetTheme = cmd.replace("theme ", "").trim() as CrtTheme;
      if (["amber", "green", "paper"].includes(targetTheme)) {
        setTheme(targetTheme);
        newHistory.push(`Tema tampilan diubah ke: ${targetTheme.toUpperCase()}`);
      } else {
        newHistory.push("Gunakan: theme amber, theme green, atau theme paper");
      }
    } else if (cmd === "scanlines") {
      setScanlines((prev) => !prev);
      newHistory.push("Efek garis pindaian kaca CRT berhasil dialihkan.");
    } else if (cmd === "stats") {
      newHistory.push(
        `STATISTIK PENGETAHUAN PENGUNJUNG:`,
        `  Arsip Dipelajari : ${learnedArticleIds.length} dari ${RETRO_ARTICLES.length} dokumen`,
        `  Sandi Terpecahkan: ${unlockedCipherIds.length} dari ${CIPHER_PUZZLES.length} teka-teki`
      );
    } else if (cmd === "radio") {
      setActiveTab("radio");
      newHistory.push("Beralih ke stasiun radio gelombang pendek.");
    } else if (cmd === "cipher") {
      setActiveTab("cipher");
      newHistory.push("Beralih ke stasiun dekoder sandi logika.");
    } else if (cmd === "date") {
      newHistory.push(`WAKTU SISTEM: ${new Date().toLocaleString("id-ID")}`);
    } else {
      newHistory.push(
        `Perintah '${cmd}' tidak dikenali. Ketik 'help' untuk bantuan.`
      );
    }

    setCliHistory(newHistory);
    setCliInput("");

    setTimeout(() => {
      cliBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // Radio Station Tuning calculation
  const currentStationMatch = useMemo<{
    station: RadioStation | null;
    clarity: number;
  }>(() => {
    let closestStation: RadioStation | null = null;
    let minDiff = Infinity;

    RADIO_STATIONS.forEach((station) => {
      const diff = Math.abs(station.frequency - frequency);
      if (diff < minDiff) {
        minDiff = diff;
        closestStation = station;
      }
    });

    // Tolerance range 0.18 MHz for clear reception
    if (minDiff <= 0.18 && closestStation) {
      const clarity = Math.max(0, 1 - minDiff / 0.18);
      return { station: closestStation, clarity };
    }
    return { station: null, clarity: 0 };
  }, [frequency]);

  // Sync radio audio when frequency or active tab changes
  useEffect(() => {
    if (!powerOn || activeTab !== "radio" || !isRadioPlaying) {
      retroAudio.stopRadioNoise();
      return;
    }

    retroAudio.startRadioNoise();
    retroAudio.updateRadioTuning(
      frequency * 1000,
      currentStationMatch.clarity
    );
  }, [powerOn, activeTab, isRadioPlaying, frequency, currentStationMatch]);

  // Oscilloscope canvas animation
  useEffect(() => {
    if (!powerOn || activeTab !== "radio") return;
    const canvas = oscilloscopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      phase += 0.08;

      ctx.fillStyle = "rgba(10, 15, 12, 0.35)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const stepX = canvas.width / 10;
      const stepY = canvas.height / 6;
      for (let x = 0; x < canvas.width; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Signal wave
      ctx.beginPath();
      ctx.strokeStyle = colors.accentHex;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = colors.accentHex;

      const midY = canvas.height / 2;
      const clarity = currentStationMatch.clarity;

      for (let x = 0; x < canvas.width; x++) {
        const normX = x / canvas.width;
        // Clean sine wave if tuned, noisy jitter if untuned
        const sineSignal =
          Math.sin(normX * 18 + phase) *
          Math.cos(normX * 6 - phase * 0.5) *
          (midY * 0.65 * clarity);
        const noiseJitter = (Math.random() - 0.5) * (midY * 0.7 * (1 - clarity));
        const y = midY + sineSignal + noiseJitter;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [powerOn, activeTab, colors, currentStationMatch]);

  // Morse code transmission ticker
  useEffect(() => {
    if (!powerOn || activeTab !== "radio" || !isRadioPlaying) {
      setMorseDecodedText("");
      return;
    }

    const st = currentStationMatch.station;
    if (!st) {
      setMorseDecodedText("");
      return;
    }

    const message = st.morseMessage;
    let charIdx = 0;
    let cancelled = false;

    const interval = setInterval(() => {
      if (cancelled) return;
      charIdx = (charIdx + 1) % (message.length + 8);
      if (charIdx <= message.length) {
        setMorseDecodedText(message.slice(0, charIdx));
        if (charIdx > 0 && message[charIdx - 1] !== " ") {
          retroAudio.playMorseBeep(60, 680);
        }
      } else {
        setMorseDecodedText("");
      }
    }, 280);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [powerOn, activeTab, isRadioPlaying, currentStationMatch]);

  // Cassette Tape Mechanics & Lo-Fi Playback Loop
  useEffect(() => {
    if (!powerOn || !tapePlaying) {
      retroAudio.stopTapeHum();
      return;
    }

    retroAudio.startTapeHum();
    const track = CASSETTE_TRACKS[currentTrackIndex];
    let noteIdx = 0;
    let active = true;

    const interval = setInterval(() => {
      if (!active) return;
      const note = track.notes[noteIdx % track.notes.length];
      retroAudio.playLofiSynthNote(note, 1.4);
      noteIdx++;
      setTapeCounter((c) => (c >= 999 ? 1 : c + 1));
    }, Math.floor(track.tempoMs / tapeSpeedMultiplier));

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [powerOn, tapePlaying, currentTrackIndex, tapeSpeedMultiplier]);

  // Rotate tape reels visually
  useEffect(() => {
    if (!tapePlaying) return;
    let animId: number;
    const rotate = () => {
      setTapeSpoolAngle((prev) => (prev + 3 * tapeSpeedMultiplier) % 360);
      animId = requestAnimationFrame(rotate);
    };
    animId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animId);
  }, [tapePlaying, tapeSpeedMultiplier]);

  // Cipher Puzzle Setup & Solver
  const activeCipher = CIPHER_PUZZLES[currentCipherIndex];
  const encryptedText = useMemo(() => {
    return encodeCaesar(activeCipher.plaintext, activeCipher.shift);
  }, [activeCipher]);

  // Decoded view with current rotor shift
  const currentDecodedView = useMemo(() => {
    // Decoding is shifting backwards (26 - shift)
    const effectiveShift = (26 - rotorShift) % 26;
    return encodeCaesar(encryptedText, effectiveShift);
  }, [encryptedText, rotorShift]);

  // Check if puzzle is solved
  useEffect(() => {
    const isCorrect = rotorShift === activeCipher.shift;
    setCipherSolved(isCorrect);
    if (isCorrect && !unlockedCipherIds.includes(activeCipher.id)) {
      const nextUnlocked = [...unlockedCipherIds, activeCipher.id];
      setUnlockedCipherIds(nextUnlocked);
      try {
        localStorage.setItem(
          "retro_unlocked_ciphers",
          JSON.stringify(nextUnlocked)
        );
      } catch {
        // Ignore
      }
      retroAudio.playSuccessChime();
    }
  }, [rotorShift, activeCipher, unlockedCipherIds]);

  // Custom text encoded view
  const customEncodedResult = useMemo(() => {
    if (!customText) return "";
    return encodeCaesar(customText.toUpperCase(), customShift);
  }, [customText, customShift]);

  return (
    <div className="relative min-h-screen w-full bg-[#0d1117] text-slate-200 font-mono select-none overflow-x-hidden pt-24 pb-16 px-3 sm:px-6 lg:px-12">
      {/* Global Navigation Header */}
      <SiteHeader active="retro" />

      {/* Background Subtle Ambient Scan Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Top Control Deck: Chassis Bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-900/80 p-3 sm:p-4 backdrop-blur-md shadow-2xl">
          {/* Machine Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePower}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                powerOn
                  ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "border-rose-500/50 bg-rose-950/40 text-rose-400"
              }`}
              title={powerOn ? "Matikan Daya CRT" : "Nyalakan Daya CRT"}
              aria-label="Tombol daya CRT"
            >
              <Power className="h-5 w-5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  DUNIA RETRO
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[0.62rem] text-slate-300">
                  MODEL 1984
                </span>
              </div>
              <span className="text-[0.72rem] text-slate-500">
                Laboratorium Pengetahuan Analog dan Sandi Logika
              </span>
            </div>
          </div>

          {/* Quick Hardware Toggles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Theme Selector */}
            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 p-1">
              <button
                onClick={() => {
                  retroAudio.playSwitchSnap();
                  setTheme("amber");
                }}
                className={`rounded px-2 py-1 text-[0.68rem] font-bold transition ${
                  theme === "amber"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                AMBER
              </button>
              <button
                onClick={() => {
                  retroAudio.playSwitchSnap();
                  setTheme("green");
                }}
                className={`rounded px-2 py-1 text-[0.68rem] font-bold transition ${
                  theme === "green"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                GREEN
              </button>
              <button
                onClick={() => {
                  retroAudio.playSwitchSnap();
                  setTheme("paper");
                }}
                className={`rounded px-2 py-1 text-[0.68rem] font-bold transition ${
                  theme === "paper"
                    ? "bg-slate-300/20 text-slate-200 border border-slate-300/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                PAPER
              </button>
            </div>

            {/* Scanlines Toggle */}
            <button
              onClick={() => {
                retroAudio.playSwitchSnap();
                setScanlines(!scanlines);
              }}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                scanlines
                  ? "border-cyan-500/40 bg-cyan-950/30 text-cyan-300"
                  : "border-slate-700 bg-slate-950 text-slate-400"
              }`}
              title="Efek Garis Layar CRT"
            >
              SCANLINES {scanlines ? "ON" : "OFF"}
            </button>

            {/* Audio Mute Toggle */}
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (!nextMute) retroAudio.playSwitchSnap();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-slate-300 hover:text-white transition"
              title={isMuted ? "Aktifkan Suara Analog" : "Bisukan Suara"}
              aria-label="Pengaturan suara"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-slate-500" />
              ) : (
                <Volume2 className="h-4 w-4 text-emerald-400" />
              )}
            </button>

            {/* Achievement Badge Counter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/20 px-2.5 py-1 text-xs text-amber-300">
              <Award className="h-3.5 w-3.5" />
              <span>
                {learnedArticleIds.length + unlockedCipherIds.length}/
                {RETRO_ARTICLES.length + CIPHER_PUZZLES.length}
              </span>
            </div>
          </div>
        </div>

        {/* Main Workstation Navigation (Heavy Mechanical Push Buttons) */}
        <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
          <button
            onClick={() => {
              retroAudio.playSwitchSnap();
              setActiveTab("terminal");
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 rounded-xl border p-3 sm:p-4 font-bold text-xs sm:text-sm tracking-wide transition-all ${
              activeTab === "terminal"
                ? `${colors.borderActive} ${colors.bgActive} ${colors.text} ${colors.glow} translate-y-0.5`
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>TERMINAL CRT</span>
          </button>

          <button
            onClick={() => {
              retroAudio.playSwitchSnap();
              setActiveTab("radio");
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 rounded-xl border p-3 sm:p-4 font-bold text-xs sm:text-sm tracking-wide transition-all ${
              activeTab === "radio"
                ? `${colors.borderActive} ${colors.bgActive} ${colors.text} ${colors.glow} translate-y-0.5`
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Radio className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>RADIO & KASET</span>
          </button>

          <button
            onClick={() => {
              retroAudio.playSwitchSnap();
              setActiveTab("cipher");
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 rounded-xl border p-3 sm:p-4 font-bold text-xs sm:text-sm tracking-wide transition-all ${
              activeTab === "cipher"
                ? `${colors.borderActive} ${colors.bgActive} ${colors.text} ${colors.glow} translate-y-0.5`
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <KeyRound className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>DEKODER SANDI</span>
          </button>
        </div>

        {/* Master CRT Enclosure Frame */}
        <div className="relative rounded-2xl border-4 border-[#232a35] bg-[#0c1017] p-2.5 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Glass Reflection Vignette */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04),_transparent_70%)]" />

          {/* CRT Screen Bezel */}
          <div
            className={`relative min-h-[560px] overflow-hidden rounded-xl border-2 border-slate-950 bg-black p-4 sm:p-6 transition-all duration-300 ${
              powerOn ? "opacity-100" : "opacity-0 scale-y-[0.002] scale-x-50"
            }`}
          >
            {/* Scanlines Overlay */}
            {scanlines && (
              <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px]" />
            )}

            {/* Phosphor Glow Tint Overlay */}
            <div
              className={`pointer-events-none absolute inset-0 z-10 opacity-15 mix-blend-screen transition-colors duration-500 ${
                theme === "amber"
                  ? "bg-amber-600"
                  : theme === "green"
                  ? "bg-emerald-600"
                  : "bg-slate-400"
              }`}
            />

            {/* ----------------- TAB 1: TERMINAL CRT (ENSIKLOPEDIA) ----------------- */}
            {activeTab === "terminal" && (
              <div className="relative z-10 flex flex-col gap-5">
                {/* Terminal Sub-mode bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        retroAudio.playSwitchSnap();
                        setTerminalSubMode("docs");
                      }}
                      className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-bold transition ${
                        terminalSubMode === "docs"
                          ? `${colors.bgActive} ${colors.text} border ${colors.border}`
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                      <span>ARSIP DOKUMEN</span>
                    </button>
                    <button
                      onClick={() => {
                        retroAudio.playSwitchSnap();
                        setTerminalSubMode("cli");
                      }}
                      className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-bold transition ${
                        terminalSubMode === "cli"
                          ? `${colors.bgActive} ${colors.text} border ${colors.border}`
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <TerminalIcon className="h-3.5 w-3.5" />
                      <span>BARIS PERINTAH (CLI)</span>
                    </button>
                  </div>

                  <span className={`text-[0.7rem] ${colors.textMuted}`}>
                    Koleksi: {RETRO_ARTICLES.length} Dokumen Sains Klasik
                  </span>
                </div>

                {/* Sub-mode A: Document Explorer */}
                {terminalSubMode === "docs" && (
                  <div>
                    {selectedArticle ? (
                      /* Detail Document Reader */
                      <div className="flex flex-col gap-4 animate-fadeIn">
                        <button
                          onClick={() => {
                            retroAudio.playSwitchSnap();
                            setSelectedArticle(null);
                          }}
                          className={`self-start flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs ${colors.text} hover:border-slate-500`}
                        >
                          <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                          <span>KEMBALI KE DIREKTORI</span>
                        </button>

                        <div
                          className={`rounded-xl border ${colors.border} bg-slate-950/70 p-4 sm:p-6 shadow-inner`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                            <div>
                              <span
                                className={`text-[0.65rem] uppercase tracking-wider font-bold ${colors.textMuted}`}
                              >
                                {selectedArticle.category}
                              </span>
                              <h2
                                className={`text-lg sm:text-xl font-bold tracking-tight ${colors.text}`}
                              >
                                {selectedArticle.title}
                              </h2>
                              <span className="text-xs text-slate-400">
                                {selectedArticle.era}
                              </span>
                            </div>

                            <button
                              onClick={() => handleMarkAsLearned(selectedArticle.id)}
                              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                                learnedArticleIds.includes(selectedArticle.id)
                                  ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                                  : `${colors.border} ${colors.bgHover} ${colors.text}`
                              }`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>
                                {learnedArticleIds.includes(selectedArticle.id)
                                  ? "SUDAH DIPELAJARI"
                                  : "TANDAI TELAH DIPELAJARI"}
                              </span>
                            </button>
                          </div>

                          {/* Quote box in retro ASCII frame */}
                          <div
                            className={`my-4 rounded border-l-4 ${colors.borderActive} bg-slate-900/80 p-3 text-xs italic ${colors.textMuted}`}
                          >
                            &quot;{selectedArticle.quote}&quot;
                          </div>

                          {/* Article Body */}
                          <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-slate-300 font-sans sm:font-mono">
                            {selectedArticle.content.map((paragraph, idx) => (
                              <p key={idx}>{paragraph}</p>
                            ))}
                          </div>

                          {/* Tags */}
                          <div className="mt-6 flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                            {selectedArticle.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`rounded px-2 py-0.5 text-[0.65rem] ${colors.badge} border`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Directory Grid */
                      <div className="flex flex-col gap-4">
                        {/* Filters & Search */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                          {/* Search Input */}
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => {
                                retroAudio.playKeyClick(
                                  Math.floor(Math.random() * 5)
                                );
                                setSearchQuery(e.target.value);
                              }}
                              placeholder="Cari arsip sains, akustik, biner..."
                              className={`w-full rounded-lg border border-slate-800 bg-slate-950/90 pl-9 pr-3 py-1.5 text-xs ${colors.text} focus:border-slate-500 focus:outline-none`}
                            />
                          </div>

                          {/* Category Filter */}
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => {
                                  retroAudio.playSwitchSnap();
                                  setSelectedCategory(cat);
                                }}
                                className={`rounded px-2.5 py-1 text-[0.68rem] whitespace-nowrap transition ${
                                  selectedCategory === cat
                                    ? `${colors.bgActive} ${colors.text} font-bold border ${colors.border}`
                                    : "text-slate-400 hover:text-slate-200"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Article Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredArticles.map((article) => {
                            const isLearned = learnedArticleIds.includes(
                              article.id
                            );
                            return (
                              <div
                                key={article.id}
                                onClick={() => {
                                  retroAudio.playSwitchSnap();
                                  setSelectedArticle(article);
                                }}
                                className={`cursor-pointer rounded-xl border p-4 transition-all hover:translate-y-[-2px] ${
                                  isLearned
                                    ? "border-emerald-500/30 bg-emerald-950/10"
                                    : "border-slate-800/90 bg-slate-950/60"
                                } ${colors.bgHover}`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span
                                    className={`text-[0.62rem] uppercase font-bold tracking-wider ${colors.textMuted}`}
                                  >
                                    {article.category}
                                  </span>
                                  {isLearned && (
                                    <span className="flex items-center gap-1 text-[0.62rem] text-emerald-400">
                                      <CheckCircle2 className="h-3 w-3" />
                                      SELESAI
                                    </span>
                                  )}
                                </div>

                                <h3
                                  className={`mt-1 font-bold text-sm tracking-tight ${colors.text}`}
                                >
                                  {article.title}
                                </h3>

                                <p className="mt-1.5 line-clamp-2 text-xs text-slate-400 leading-relaxed font-sans sm:font-mono">
                                  {article.summary}
                                </p>

                                <div className="mt-3 flex items-center justify-between text-[0.65rem] text-slate-500">
                                  <span>{article.era}</span>
                                  <span>{article.readTime}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-mode B: Command Line Interface */}
                {terminalSubMode === "cli" && (
                  <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-xs shadow-inner">
                    <div className="h-80 overflow-y-auto space-y-1 pr-2 no-scrollbar">
                      {cliHistory.map((line, idx) => (
                        <div
                          key={idx}
                          className={`${
                            line.startsWith(">")
                              ? colors.text
                              : line.startsWith("Error:")
                              ? "text-rose-400"
                              : "text-slate-300"
                          } leading-relaxed whitespace-pre-wrap`}
                        >
                          {line}
                        </div>
                      ))}
                      <div ref={cliBottomRef} />
                    </div>

                    <form
                      onSubmit={handleCliSubmit}
                      className="flex items-center gap-2 border-t border-slate-800 pt-2"
                    >
                      <span className={`font-bold ${colors.text}`}>&gt;</span>
                      <input
                        type="text"
                        value={cliInput}
                        onChange={(e) => setCliInput(e.target.value)}
                        placeholder="Ketik perintah (contoh: help, dir, stats)..."
                        className={`w-full bg-transparent text-xs ${colors.text} focus:outline-none`}
                        autoFocus
                      />
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ----------------- TAB 2: RADIO & KASET PITA ----------------- */}
            {activeTab === "radio" && (
              <div className="relative z-10 flex flex-col gap-6">
                {/* Top Section: Analog Shortwave Tuner */}
                <div
                  className={`rounded-xl border ${colors.border} bg-slate-950/80 p-4 sm:p-6 shadow-inner`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Radio className={`h-5 w-5 ${colors.text}`} />
                      <span className={`font-bold text-sm ${colors.text}`}>
                        PENALA FREKUENSI SHORTWAVE AM / SW
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        retroAudio.playSwitchSnap();
                        setIsRadioPlaying(!isRadioPlaying);
                      }}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                        isRadioPlaying
                          ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                          : "border-slate-700 bg-slate-900 text-slate-400"
                      }`}
                    >
                      <Power className="h-3.5 w-3.5" />
                      <span>{isRadioPlaying ? "RADIO NYALA" : "RADIO MATI"}</span>
                    </button>
                  </div>

                  {/* Backlit Tuner Scale & Needle */}
                  <div className="relative mt-5 rounded-lg border border-amber-900/50 bg-[#140f07] p-4 shadow-inner">
                    <div className="flex items-center justify-between text-[0.65rem] text-amber-500/70 font-mono tracking-widest pb-1">
                      <span>6.00 MHz</span>
                      <span>10.00 MHz</span>
                      <span>14.00 MHz</span>
                      <span>18.00 MHz</span>
                      <span>22.00 MHz</span>
                    </div>

                    {/* Scale Markings */}
                    <div className="relative h-6 w-full flex items-center justify-between px-1">
                      {Array.from({ length: 41 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-[1px] ${
                            i % 5 === 0
                              ? "h-4 bg-amber-400/80"
                              : "h-2 bg-amber-500/30"
                          }`}
                        />
                      ))}

                      {/* Moving Red Needle */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] transition-all duration-75"
                        style={{
                          left: `${((frequency - 6.0) / (22.0 - 6.0)) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Frequency Slider Drag Control */}
                    <input
                      type="range"
                      min={6.0}
                      max={22.0}
                      step={0.01}
                      value={frequency}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setFrequency(val);
                        if (!isRadioPlaying) setIsRadioPlaying(true);
                      }}
                      className="mt-4 w-full accent-amber-400 cursor-pointer"
                    />

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-bold">
                        DIAL: {frequency.toFixed(2)} MHz
                      </span>
                      <span
                        className={`font-bold ${
                          currentStationMatch.clarity > 0.7
                            ? "text-emerald-400"
                            : "text-slate-500"
                        }`}
                      >
                        SINYAL: {Math.round(currentStationMatch.clarity * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Tuner Station Info & Oscilloscope */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Live Oscilloscope Display */}
                    <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-black/90 p-3">
                      <span className="text-[0.65rem] text-slate-400 font-bold">
                        OSILOSKOP GELOMBANG ANALOG
                      </span>
                      <canvas
                        ref={oscilloscopeCanvasRef}
                        width={320}
                        height={120}
                        className="w-full h-28 rounded bg-[#090d0b]"
                      />
                    </div>

                    {/* Decoded Telemetry & Station Info */}
                    <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/90 p-3 text-xs">
                      {currentStationMatch.station ? (
                        <div className="space-y-1.5 animate-fadeIn">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[0.62rem] font-bold text-emerald-300 border border-emerald-500/30">
                              {currentStationMatch.station.band}
                            </span>
                            <span className={`font-bold ${colors.text}`}>
                              {currentStationMatch.station.name}
                            </span>
                          </div>
                          <p className="text-slate-300 leading-relaxed text-[0.72rem] font-sans sm:font-mono">
                            {currentStationMatch.station.description}
                          </p>

                          {morseDecodedText && (
                            <div className="mt-2 rounded bg-black/80 p-2 font-mono text-[0.68rem] text-amber-300 border border-amber-900/40">
                              <span className="text-slate-500 mr-2">RX:</span>
                              {morseDecodedText}
                              <span className="animate-pulse">_</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-6">
                          <Sliders className="h-6 w-6 mb-2 opacity-40 animate-pulse" />
                          <span>Derau statik atmosferik.</span>
                          <span className="text-[0.68rem] text-slate-600 mt-1">
                            Coba putar kenop ke 7.83, 10.00, 14.22, atau 18.10 MHz
                          </span>
                        </div>
                      )}

                      {/* Station Presets Quick Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
                        {RADIO_STATIONS.map((st) => (
                          <button
                            key={st.id}
                            onClick={() => {
                              retroAudio.playSwitchSnap();
                              setFrequency(st.frequency);
                              setIsRadioPlaying(true);
                            }}
                            className={`rounded px-2 py-0.5 text-[0.65rem] border transition ${
                              Math.abs(frequency - st.frequency) < 0.1
                                ? `${colors.bgActive} ${colors.text} ${colors.border}`
                                : "border-slate-800 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {st.frequency.toFixed(2)} MHz
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Mechanical Cassette Deck */}
                <div
                  className={`rounded-xl border ${colors.border} bg-slate-950/80 p-4 sm:p-6 shadow-inner`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold text-slate-400">
                        DEK KASET PITA STEREO ANALOG
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[0.62rem] text-slate-300">
                        FERRITE HEAD
                      </span>
                    </div>

                    {/* Tape Counter */}
                    <div className="flex items-center gap-1.5 rounded bg-black px-2.5 py-1 text-xs font-mono font-bold text-amber-400 border border-slate-800">
                      <span className="text-slate-600">COUNTER:</span>
                      <span>{String(tapeCounter).padStart(3, "0")}</span>
                    </div>
                  </div>

                  {/* Cassette Housing View */}
                  <div className="mt-4 flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-md rounded-2xl border-2 border-slate-700 bg-gradient-to-b from-[#1e232d] to-[#12161f] p-4 shadow-2xl">
                      {/* Mixtape Label */}
                      <div className="mb-3 rounded-lg border border-slate-600/50 bg-[#e8e0cc] p-2 text-slate-900 text-center font-bold text-xs tracking-wider shadow">
                        {CASSETTE_TRACKS[currentTrackIndex].title}
                      </div>

                      {/* Transparent Window with Rotating Spools */}
                      <div className="relative mx-auto flex h-24 w-64 items-center justify-between rounded-xl border-2 border-slate-600 bg-black/80 px-6">
                        {/* Supply Reel (Left Spool) */}
                        <div
                          className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-400 bg-slate-800 shadow"
                          style={{
                            transform: `rotate(${tapeSpoolAngle}deg)`,
                          }}
                        >
                          <div className="h-4 w-4 rounded-full bg-slate-300" />
                          <div className="absolute h-1.5 w-10 bg-slate-400 rounded" />
                          <div className="absolute h-10 w-1.5 bg-slate-400 rounded" />
                        </div>

                        {/* Center Ribbon Guide */}
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="h-1.5 w-16 rounded bg-amber-900/80" />
                          <span className="text-[0.55rem] text-slate-500 font-mono">
                            NORMAL BIAS
                          </span>
                        </div>

                        {/* Take-up Reel (Right Spool) */}
                        <div
                          className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-400 bg-slate-800 shadow"
                          style={{
                            transform: `rotate(${tapeSpoolAngle}deg)`,
                          }}
                        >
                          <div className="h-4 w-4 rounded-full bg-slate-300" />
                          <div className="absolute h-1.5 w-10 bg-slate-400 rounded" />
                          <div className="absolute h-10 w-1.5 bg-slate-400 rounded" />
                        </div>
                      </div>
                    </div>

                    {/* Mechanical Transport Controls */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          retroAudio.playTapeButton();
                          setCurrentTrackIndex(
                            (prev) =>
                              (prev - 1 + CASSETTE_TRACKS.length) %
                              CASSETTE_TRACKS.length
                          );
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 transition active:translate-y-0.5"
                        title="Trek Sebelumnya"
                      >
                        <Rewind className="h-4 w-4" />
                        <span>REW</span>
                      </button>

                      <button
                        onClick={() => {
                          retroAudio.playTapeButton();
                          setTapePlaying(!tapePlaying);
                        }}
                        className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-bold transition active:translate-y-0.5 ${
                          tapePlaying
                            ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : "border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                        }`}
                      >
                        {tapePlaying ? (
                          <>
                            <Square className="h-4 w-4" />
                            <span>STOP</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            <span>PLAY</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          retroAudio.playTapeButton();
                          setCurrentTrackIndex(
                            (prev) => (prev + 1) % CASSETTE_TRACKS.length
                          );
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 transition active:translate-y-0.5"
                        title="Trek Berikutnya"
                      >
                        <FastForward className="h-4 w-4" />
                        <span>FF</span>
                      </button>

                      <button
                        onClick={() => {
                          retroAudio.playTapeButton();
                          setTapeCounter(0);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 transition active:translate-y-0.5"
                        title="Reset Counter"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>RESET</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB 3: DEKODER SANDI (CIPHER MACHINE) ----------------- */}
            {activeTab === "cipher" && (
              <div className="relative z-10 flex flex-col gap-6">
                {/* Cipher Workspace Card */}
                <div
                  className={`rounded-xl border ${colors.border} bg-slate-950/80 p-4 sm:p-6 shadow-inner`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <span
                        className={`text-[0.62rem] uppercase font-bold tracking-wider ${colors.textMuted}`}
                      >
                        MISI DEKODER SANDI LOGIKA
                      </span>
                      <h2
                        className={`text-base sm:text-lg font-bold tracking-tight ${colors.text}`}
                      >
                        {activeCipher.title}
                      </h2>
                      <span className="text-xs text-slate-500">
                        {activeCipher.era}
                      </span>
                    </div>

                    {/* Mission Selector Buttons */}
                    <div className="flex items-center gap-1">
                      {CIPHER_PUZZLES.map((puzzle, idx) => {
                        const isSolved = unlockedCipherIds.includes(puzzle.id);
                        return (
                          <button
                            key={puzzle.id}
                            onClick={() => {
                              retroAudio.playSwitchSnap();
                              setCurrentCipherIndex(idx);
                              setRotorShift(0);
                            }}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition ${
                              currentCipherIndex === idx
                                ? `${colors.borderActive} ${colors.bgActive} ${colors.text}`
                                : isSolved
                                ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                                : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                            }`}
                            title={puzzle.title}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clue Prompt */}
                  <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300 leading-relaxed font-sans sm:font-mono">
                    <span className="font-bold text-amber-400 mr-1.5">
                      PETUNJUK SEJARAH:
                    </span>
                    {activeCipher.clue}
                  </div>

                  {/* Rotary Dial / Shift Controller */}
                  <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-800 bg-black/60 p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-bold">
                        POSISI ROTOR GESER:
                      </span>
                      <span
                        className={`text-xl font-bold font-mono px-3 py-1 rounded bg-slate-900 border ${colors.border} ${colors.text}`}
                      >
                        +{rotorShift}
                      </span>
                    </div>

                    {/* Slider for Rotor Shift 0 - 25 */}
                    <input
                      type="range"
                      min={0}
                      max={25}
                      step={1}
                      value={rotorShift}
                      onChange={(e) => {
                        retroAudio.playCipherTick();
                        setRotorShift(parseInt(e.target.value, 10));
                      }}
                      className="w-full max-w-md accent-amber-400 cursor-pointer"
                    />

                    {/* Alphabet Alignment Visualizer */}
                    <div className="w-full max-w-lg overflow-x-auto no-scrollbar py-2 text-center">
                      <div className="text-[0.62rem] text-slate-500 font-mono tracking-widest">
                        ALFABET ASLI (A-Z)
                      </div>
                      <div className="text-xs text-slate-300 font-mono tracking-wider font-bold">
                        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").join(" ")}
                      </div>
                      <div className={`text-xs ${colors.text} font-mono tracking-wider font-bold mt-1`}>
                        {encodeCaesar("ABCDEFGHIJKLMNOPQRSTUVWXYZ", rotorShift)
                          .split("")
                          .join(" ")}
                      </div>
                      <div className={`text-[0.62rem] ${colors.textMuted} font-mono tracking-widest mt-0.5`}>
                        ALFABET ROTOR (+{rotorShift})
                      </div>
                    </div>
                  </div>

                  {/* Decrypted Screen Output */}
                  <div className="mt-5 rounded-xl border border-slate-800 bg-black/90 p-4">
                    <span className="text-[0.65rem] text-slate-500 font-bold uppercase tracking-wider">
                      TEKS SANDI TERKUNCI (CIPHERTEXT):
                    </span>
                    <p className="mt-1 font-mono text-xs text-slate-400 tracking-wider">
                      {encryptedText}
                    </p>

                    <div className="mt-4 border-t border-slate-800 pt-3">
                      <span
                        className={`text-[0.65rem] font-bold uppercase tracking-wider ${
                          cipherSolved ? "text-emerald-400" : colors.textMuted
                        }`}
                      >
                        HASIL DEKODER ROTOR REAL-TIME:
                      </span>
                      <p
                        className={`mt-1 font-mono text-xs sm:text-sm tracking-wide font-bold leading-relaxed ${
                          cipherSolved ? "text-emerald-300 animate-pulse" : colors.text
                        }`}
                      >
                        {currentDecodedView}
                      </p>
                    </div>

                    {/* Unlocked Knowledge Reveal Card */}
                    {cipherSolved && (
                      <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-3 text-xs text-emerald-200 animate-fadeIn">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                          <Sparkles className="h-4 w-4" />
                          <span>SANDI BERHASIL DIPECAHKAN:</span>
                        </div>
                        <p className="leading-relaxed font-sans sm:font-mono">
                          {activeCipher.unlockedKnowledge}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Custom Encoder Tool Sandbox */}
                  <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
                    <span className="text-xs font-bold text-slate-400">
                      LABORATORIUM MANDIRI: UJI COBA ENKRIPSI CAESAR
                    </span>
                    <div className="mt-3 flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => {
                          retroAudio.playKeyClick(Math.floor(Math.random() * 5));
                          setCustomText(e.target.value);
                        }}
                        placeholder="Ketik kata atau kalimat rahasia di sini..."
                        className={`flex-1 rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs ${colors.text} focus:outline-none`}
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Shift:</span>
                        <input
                          type="number"
                          min={1}
                          max={25}
                          value={customShift}
                          onChange={(e) => {
                            retroAudio.playCipherTick();
                            setCustomShift(parseInt(e.target.value, 10) || 1);
                          }}
                          className="w-16 rounded border border-slate-800 bg-slate-950 p-1.5 text-xs text-center font-bold text-amber-400"
                        />
                      </div>
                    </div>

                    {customEncodedResult && (
                      <div className="mt-3 rounded bg-black/60 p-2.5 font-mono text-xs text-slate-300 border border-slate-800">
                        <span className="text-slate-500 mr-2">HASIL SANDI:</span>
                        <span className="font-bold text-amber-300">
                          {customEncodedResult}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation & Brand Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Kembali ke Halaman Beranda (Dunia Mimpi)</span>
          </Link>

          <span>
            Laboratorium Pengetahuan Retro, Your Dream
          </span>
        </div>
      </div>
    </div>
  );
}
