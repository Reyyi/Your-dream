"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { ToplesBintang } from "@/components/ui/ToplesBintang";
import { LettersSection } from "@/components/ui/LettersSection";
import { useStarsJarStore } from "@/lib/starsJarStore";
import { soundscape } from "@/lib/soundscape";

type JournalEntry = {
  id: string;
  prompt: string;
  text: string;
  createdAt: string;
  mood?: string;
};

const STORAGE_KEY = "your-dream-journal-v1";
const moods = [
  { id: "tenang", label: "Tenang", symbol: "☾" },
  { id: "berharap", label: "Berharap", symbol: "✧" },
  { id: "lelah", label: "Lelah", symbol: "☁" },
  { id: "bersyukur", label: "Bersyukur", symbol: "✿" },
  { id: "campur", label: "Campur", symbol: "◌" },
];
const prompts = [
  "Mimpi kecil apa yang ingin kamu rawat, meski belum tahu kapan terwujud?",
  "Jika hatimu punya cuaca hari ini, seperti apa langitnya?",
  "Tempat seperti apa yang ingin kamu kunjungi dalam mimpi malam ini?",
  "Hal sederhana apa yang ingin kamu ingat dari hari ini?",
  "Jika bisa mengirim surat untuk dirimu di masa depan, apa yang ingin kamu titipkan?",
  "Warna apa yang paling dekat dengan perasaanmu sekarang, dan mengapa?",
  "Apa yang ingin kamu lepaskan agar punya ruang untuk sesuatu yang baru?",
  "Suara atau keheningan apa yang paling menenangkan jiwamu akhir-akhir ini?",
  "Bintang atau harapan rahasia apa yang masih kamu pandang diam-diam?",
  "Jika malam ini kamu bisa beristirahat tanpa cemas, apa yang ingin kamu katakan pada dirimu?",
];

function readEntries(): JournalEntry[] {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) {
    throw new Error("Format jurnal yang tersimpan tidak sesuai.");
  }

  return parsed.filter(
    (entry): entry is JournalEntry =>
      typeof entry === "object" &&
      entry !== null &&
      "id" in entry &&
      typeof entry.id === "string" &&
      "prompt" in entry &&
      typeof entry.prompt === "string" &&
      "text" in entry &&
      typeof entry.text === "string" &&
      "createdAt" in entry &&
      typeof entry.createdAt === "string" &&
      (!("mood" in entry) || typeof entry.mood === "string"),
  );
}

export function DreamJournalExperience() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [text, setText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [mood, setMood] = useState(moods[0].id);
  const [moodFilter, setMoodFilter] = useState("semua");
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  const { activeTab, setActiveTab, stars, foldStar } = useStarsJarStore();

  useEffect(() => {
    try {
      setEntries(readEntries());
      setReady(true);
    } catch {
      setMessage("Catatan tersimpan tidak dapat dibaca dari perangkat ini.");
      setReady(true);
    }
  }, []);

  const choosePrompt = () => {
    setPromptIndex((current) => {
      const offset = 1 + Math.floor(Math.random() * (prompts.length - 1));
      return (current + offset) % prompts.length;
    });
    setMessage("");
  };

  const saveEntry = () => {
    const trimmed = text.trim();
    if (!trimmed || !ready) return;

    const nextEntries = [
      {
        id: window.crypto.randomUUID(),
        prompt: prompts[promptIndex],
        text: trimmed,
        createdAt: new Date().toISOString(),
        mood,
      },
      ...entries,
    ];

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
      setEntries(nextEntries);
      setText("");
      setMessage("Catatanmu tersimpan di lembar jurnal perangkat ini.");
    } catch {
      setMessage("Catatan belum tersimpan. Periksa ruang penyimpanan browser.");
    }
  };

  const handleFoldStar = () => {
    const trimmed = text.trim();
    if (!trimmed || !ready) return;

    foldStar(trimmed, prompts[promptIndex], mood);
    soundscape.playStarFoldSound();
    setText("");
    setMessage("Mimpimu dilipat menjadi bintang dan masuk ke Toples Kaca! ⭐");
  };

  const removeEntry = (id: string) => {
    const nextEntries = entries.filter((entry) => entry.id !== id);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
      setEntries(nextEntries);
    } catch {
      setMessage("Catatan tidak dapat dihapus dari penyimpanan perangkat.");
    }
  };

  const exportAsText = () => {
    if (!entries.length) return;
    const content = entries
      .map((entry) => {
        const date = new Intl.DateTimeFormat("id-ID", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(new Date(entry.createdAt));
        const moodObj = moods.find((m) => m.id === entry.mood);
        const moodText = moodObj ? ` [Suasana: ${moodObj.symbol} ${moodObj.label}]` : "";
        return `=== ${date}${moodText} ===\nPertanyaan: ${entry.prompt}\n\n${entry.text}\n\n`;
      })
      .join("----------------------------------------\n\n");

    const header = `JURNAL MIMPI — YOUR DREAM\nDiekspor pada: ${new Date().toLocaleString("id-ID")}\nTotal Catatan: ${entries.length}\n========================================\n\n`;
    const blob = new Blob([header + content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jurnal-mimpi-yourdream-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Catatan jurnal berhasil diunduh sebagai file teks.");
  };

  const todayKey = new Date().toLocaleDateString("id-ID");
  const todayCount = entries.filter(
    (entry) => new Date(entry.createdAt).toLocaleDateString("id-ID") === todayKey,
  ).length;
  const visibleEntries = entries.filter((entry) => {
    const matchesMood = moodFilter === "semua" || entry.mood === moodFilter;
    const matchesSearch =
      !search.trim() ||
      `${entry.prompt} ${entry.text}`.toLowerCase().includes(search.trim().toLowerCase());
    return matchesMood && matchesSearch;
  });

  return (
    <main className="dream-page min-h-screen overflow-x-clip px-5 pb-24 pt-32 sm:px-10 lg:px-16">
      <div aria-hidden="true" className="dream-orb dream-orb-one" />
      <div aria-hidden="true" className="dream-orb dream-orb-two" />
      <SiteHeader active="journal" />
      <section className="relative z-10 mx-auto max-w-5xl">
        <p className="eyebrow">ruang untuk mendengarkan dirimu</p>
        <div className="mt-4 max-w-3xl">
          <h1 className="font-display text-5xl leading-none tracking-[-0.035em] text-[#f7f0e7] sm:text-7xl">
            Jurnal &amp;
            <span className="text-[#cbb9dd]"> Harapan.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            Tak perlu menulis dengan sempurna. Simpan pikiranmu, lipat menjadi
            bintang di toples kaca, atau buka surat renungan yang meneduhkan jiwa.
          </p>
        </div>

        {/* Etape 2: Multi-tab Navigation */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${
              activeTab === "compose"
                ? "border border-white/35 bg-white/20 text-white shadow-sm"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
            onClick={() => setActiveTab("compose")}
            type="button"
          >
            <span>✍️</span>
            <span>Catatan Refleksi</span>
            <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] text-white/75">
              {entries.length}
            </span>
          </button>

          <button
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${
              activeTab === "jar"
                ? "border border-amber-300/50 bg-amber-200/20 text-amber-100 shadow-[0_0_15px_rgba(255,220,140,0.25)]"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
            onClick={() => setActiveTab("jar")}
            type="button"
          >
            <span>🍯</span>
            <span>Toples Bintang</span>
            <span className="ml-1 rounded-full bg-amber-200/20 px-2 py-0.5 text-[0.6rem] text-amber-200">
              {stars.length}
            </span>
          </button>

          <button
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${
              activeTab === "letters"
                ? "border border-amber-300/50 bg-amber-200/20 text-amber-100 shadow-[0_0_15px_rgba(255,220,140,0.25)]"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
            onClick={() => setActiveTab("letters")}
            type="button"
          >
            <span>✉️</span>
            <span>Surat dari Rayvelione</span>
            <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] text-white/75">
              8 surat
            </span>
          </button>
        </div>

        {/* Tab 1: Compose & Journal History */}
        {activeTab === "compose" && (
          <div className="mt-8 animate-in fade-in duration-300">
            <div className="journal-compose">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">sebuah pertanyaan untukmu</p>
                  <p className="mt-3 max-w-2xl font-display text-2xl leading-snug text-[#f6ead8] sm:text-3xl">
                    {prompts[promptIndex]}
                  </p>
                </div>
                <button
                  className="dream-button dream-button-quiet"
                  onClick={choosePrompt}
                  type="button"
                >
                  Ganti pertanyaan <span aria-hidden="true">↻</span>
                </button>
              </div>
              <label className="mt-6 block">
                <span className="sr-only">Tulis catatan mimpimu</span>
                <textarea
                  className="journal-input"
                  maxLength={4000}
                  onChange={(event) => setText(event.currentTarget.value)}
                  placeholder="Mulai dari satu kalimat saja..."
                  rows={6}
                  value={text}
                />
              </label>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="mb-2 text-[0.62rem] uppercase tracking-[0.16em] text-white/45">
                    suasana hatimu
                  </p>
                  <div className="journal-mood">
                    {moods.map((option) => (
                      <button
                        key={option.id}
                        aria-pressed={mood === option.id}
                        className="journal-mood-button"
                        onClick={() => setMood(option.id)}
                        type="button"
                      >
                        <span aria-hidden="true">{option.symbol}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <p aria-live="polite">
                    {message || "Catatan & bintang tersimpan di browser perangkat ini."}
                  </p>
                  {message.includes("Toples Kaca") && (
                    <button
                      className="text-amber-200 underline underline-offset-4 hover:text-white"
                      onClick={() => setActiveTab("jar")}
                      type="button"
                    >
                      Buka Toples ➔
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    className="flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-200/15 px-4 py-2.5 text-xs font-medium text-amber-100 shadow-[0_0_15px_rgba(255,220,140,0.2)] transition hover:bg-amber-200/25 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!ready || !text.trim()}
                    onClick={handleFoldStar}
                    title="Lipat mimpi ini menjadi bintang kertas dan masukkan ke Toples Kaca"
                    type="button"
                  >
                    <span>Lipat Jadi Bintang</span>
                    <span>⭐</span>
                  </button>
                  <button
                    className="dream-home-primary"
                    disabled={!ready || !text.trim()}
                    onClick={saveEntry}
                    type="button"
                  >
                    <span>Simpan catatan</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Entries Section */}
            <section aria-labelledby="journal-entries-title" className="mt-12">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="eyebrow">lembar yang kamu simpan</p>
                  <h2
                    className="mt-2 font-display text-3xl text-white sm:text-4xl"
                    id="journal-entries-title"
                  >
                    Catatanmu
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="journal-stat">
                    <span className="block text-lg text-white">{entries.length}</span>
                    <span className="text-[0.6rem] text-white/45">semua catatan</span>
                  </div>
                  <div className="journal-stat">
                    <span className="block text-lg text-white">{todayCount}</span>
                    <span className="text-[0.6rem] text-white/45">ditulis hari ini</span>
                  </div>
                  {entries.length > 0 && (
                    <button
                      className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs text-white/70 transition hover:border-white/35 hover:bg-white/10 hover:text-white"
                      onClick={exportAsText}
                      title="Unduh seluruh catatan ke file teks"
                      type="button"
                    >
                      Unduh catatan (.txt) ↓
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="w-full sm:max-w-xs">
                  <span className="sr-only">Cari catatan jurnal</span>
                  <input
                    className="w-full rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 text-xs text-white outline-none placeholder:text-white/35 focus:border-white/35"
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Cari di catatanmu..."
                    type="search"
                    value={search}
                  />
                </label>
                <div aria-label="Filter suasana hati" className="journal-filter">
                  {[
                    { id: "semua", label: "Semua" },
                    ...moods.map(({ id, label }) => ({ id, label })),
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      aria-pressed={moodFilter === filter.id}
                      onClick={() => setMoodFilter(filter.id)}
                      type="button"
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              {visibleEntries.length ? (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {visibleEntries.map((entry) => (
                    <article className="journal-entry" key={entry.id}>
                      <div className="flex items-center justify-between gap-3">
                        <time
                          className="text-[0.65rem] uppercase tracking-[0.14em] text-white/40"
                          dateTime={entry.createdAt}
                        >
                          {new Intl.DateTimeFormat("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(entry.createdAt))}
                        </time>
                        <div className="flex items-center gap-3">
                          {entry.mood && (
                            <span className="text-[0.65rem] text-white/50">
                              {moods.find((item) => item.id === entry.mood)?.symbol}{" "}
                              {moods.find((item) => item.id === entry.mood)?.label}
                            </span>
                          )}
                          <button
                            aria-label="Hapus catatan"
                            className="text-xs text-white/40 transition hover:text-white"
                            onClick={() => removeEntry(entry.id)}
                            type="button"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                      <p className="mt-4 font-display text-lg leading-snug text-[#e4d5c1]">
                        {entry.prompt}
                      </p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/70">
                        {entry.text}
                      </p>
                    </article>
                  ))}
                </div>
              ) : entries.length ? (
                <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-sm text-white/50">
                  Tidak ada catatan yang cocok dengan pencarian ini.
                </p>
              ) : (
                <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-sm text-white/50">
                  {ready
                    ? "Belum ada catatan. Satu kalimat kecil bisa menjadi awal."
                    : "Membuka lembar jurnalmu..."}
                </p>
              )}
            </section>
          </div>
        )}

        {/* Tab 2: Toples Bintang */}
        {activeTab === "jar" && <ToplesBintang />}

        {/* Tab 3: Surat dari Rayvelione */}
        {activeTab === "letters" && <LettersSection />}
      </section>
    </main>
  );
}
