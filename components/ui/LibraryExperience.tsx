"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { libraryEntries } from "@/lib/library";
import type { LibraryCategory, LibraryEntry } from "@/lib/library";

type Filter = "Semua" | LibraryCategory | "Tersimpan";
type LibraryPreferences = {
  bookmarks: string[];
  progress: Record<string, number>;
};

const STORAGE_KEY = "your-dream-library-v1";
const emptyPreferences: LibraryPreferences = { bookmarks: [], progress: {} };

function readPreferences(): LibraryPreferences {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyPreferences;
  const value: unknown = JSON.parse(raw);
  if (typeof value !== "object" || value === null) {
    throw new Error("Format rak buku tersimpan tidak sesuai.");
  }

  const candidate = value as {
    bookmarks?: unknown;
    progress?: unknown;
  };
  const bookmarks = Array.isArray(candidate.bookmarks)
    ? candidate.bookmarks.filter((id): id is string => typeof id === "string")
    : [];
  const progress =
    typeof candidate.progress === "object" && candidate.progress !== null
      ? Object.fromEntries(
          Object.entries(candidate.progress).filter(
            (item): item is [string, number] =>
              typeof item[0] === "string" &&
              typeof item[1] === "number" &&
              Number.isFinite(item[1]),
          ),
        )
      : {};
  return { bookmarks, progress };
}

export function LibraryExperience() {
  const [filter, setFilter] = useState<Filter>("Semua");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LibraryEntry | null>(null);
  const [page, setPage] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [warmPage, setWarmPage] = useState(true);
  const [preferences, setPreferences] =
    useState<LibraryPreferences>(emptyPreferences);
  const [storageReady, setStorageReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const filters: Filter[] = ["Semua", "Fantasi", "Pengetahuan", "Tersimpan"];

  useEffect(() => {
    try {
      setPreferences(readPreferences());
    } catch {
      setStorageMessage("Rak tersimpan belum dapat dibaca dari browser ini.");
    } finally {
      setStorageReady(true);
    }
  }, []);

  const persistPreferences = useCallback((next: LibraryPreferences) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setPreferences(next);
      setStorageMessage("");
      return true;
    } catch {
      setStorageMessage("Perubahan rak belum tersimpan. Periksa ruang browser.");
      return false;
    }
  }, []);

  const toggleBookmark = (entry: LibraryEntry) => {
    const bookmarks = preferences.bookmarks.includes(entry.id)
      ? preferences.bookmarks.filter((id) => id !== entry.id)
      : [...preferences.bookmarks, entry.id];
    persistPreferences({ ...preferences, bookmarks });
  };

  const openBook = (entry: LibraryEntry) => {
    setSelected(entry);
    setPage(Math.min(preferences.progress[entry.id] ?? 0, entry.content.length - 1));
  };

  const changePage = useCallback((nextPage: number) => {
    if (!selected) return;
    const bounded = Math.max(0, Math.min(nextPage, selected.content.length - 1));
    setPage(bounded);
    persistPreferences({
      ...preferences,
      progress: { ...preferences.progress, [selected.id]: bounded },
    });
  }, [persistPreferences, preferences, selected]);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowLeft") changePage(page - 1);
      if (event.key === "ArrowRight") changePage(page + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changePage, page, selected]);

  const entries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return libraryEntries.filter((entry) => {
      const matchesCategory =
        filter === "Semua" ||
        (filter === "Tersimpan"
          ? preferences.bookmarks.includes(entry.id)
          : entry.category === filter);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${entry.title} ${entry.description} ${entry.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [filter, preferences.bookmarks, query]);

  return (
    <main className="dream-page min-h-screen overflow-x-clip px-5 pb-20 pt-32 sm:px-10 lg:px-16">
      <div aria-hidden="true" className="dream-orb dream-orb-one" />
      <div aria-hidden="true" className="dream-orb dream-orb-two" />
      <section className="relative z-10 mx-auto max-w-6xl">
        <p className="eyebrow">rak cerita fantasi dan pengetahuan</p>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)] leading-none tracking-[-0.035em] text-[#f7f0e7]">
              Perpustakaan
              <span className="text-[#cbb9dd]"> kecil.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Pilih sampul yang memanggilmu. Kisah fantasi dan pengetahuan nyata
              menunggu untuk dibuka, satu halaman setiap kali.
            </p>
          </div>
          <label className="w-full md:max-w-xs">
            <span className="sr-only">Cari buku</span>
            <input
              className="w-full rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/40"
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Cari judul atau topik..."
              type="search"
              value={query}
            />
          </label>
        </div>

        {preferences.bookmarks.length > 0 && (
          <button
            className="continue-reading mt-7 w-full text-left sm:w-auto"
            onClick={() => {
              const lastRead = libraryEntries.find(
                (entry) => (preferences.progress[entry.id] ?? 0) > 0,
              );
              if (lastRead) openBook(lastRead);
              else {
                const saved = libraryEntries.find((entry) =>
                  preferences.bookmarks.includes(entry.id),
                );
                if (saved) openBook(saved);
              }
            }}
            type="button"
          >
            <span aria-hidden="true" className="continue-mark">↗</span>
            <span>
              <span className="block text-[0.58rem] uppercase tracking-[0.2em] text-white/45">
                lanjutkan perjalanan
              </span>
              <span className="mt-1 block text-sm text-white/85">
                {libraryEntries.find(
                  (entry) => (preferences.progress[entry.id] ?? 0) > 0,
                )?.title ??
                  libraryEntries.find((entry) =>
                    preferences.bookmarks.includes(entry.id),
                  )?.title ??
                  "Buka buku tersimpan"}
              </span>
            </span>
          </button>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-2" aria-label="Kategori buku">
          {filters.map((item) => (
            <button
              key={item}
              aria-pressed={filter === item}
              className={`rounded-full border px-3 py-2 text-xs transition sm:px-4 ${
                filter === item
                  ? "border-white/40 bg-white/15 text-white"
                  : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"
              }`}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item === "Tersimpan" ? "♡ Tersimpan" : item}
            </button>
          ))}
          <span className="ml-auto text-xs text-white/40">{entries.length} buku</span>
        </div>
        {storageMessage && (
          <p aria-live="polite" className="mt-3 text-xs text-amber-100/70">
            {storageMessage}
          </p>
        )}

        {entries.length > 0 ? (
          <div className="bookcase mt-7 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            {entries.map((entry, index) => {
              const isBookmarked = preferences.bookmarks.includes(entry.id);
              const progress = preferences.progress[entry.id];
              return (
                <article className="book-card group" key={entry.id}>
                  <div className="book-cover-wrap">
                    <button
                      aria-label={`Baca ${entry.title}`}
                      className={`book-cover bg-gradient-to-br ${entry.accent}`}
                      onClick={() => openBook(entry)}
                      style={{ animationDelay: `${index * 70}ms` }}
                      type="button"
                    >
                      <span className="book-cover-inner" aria-hidden="true">
                        <span className="book-symbol">{entry.cover}</span>
                        <span className="book-cover-title">{entry.title}</span>
                        <span className="book-cover-category">
                          {entry.category === "Fantasi"
                            ? "Kisah fantasi"
                            : "Buku pengetahuan"}
                        </span>
                      </span>
                      <span className="book-cover-edition" aria-hidden="true">
                        YOUR DREAM · VOL. {String(index + 1).padStart(2, "0")}
                      </span>
                    </button>
                    <button
                      aria-label={
                        isBookmarked
                          ? `Hapus ${entry.title} dari tersimpan`
                          : `Simpan ${entry.title}`
                      }
                      aria-pressed={isBookmarked}
                      className={`bookmark-button ${isBookmarked ? "is-bookmarked" : ""}`}
                      onClick={() => toggleBookmark(entry)}
                      type="button"
                    >
                      {isBookmarked ? "♥" : "♡"}
                    </button>
                  </div>
                  {typeof progress === "number" && (
                    <div className="book-progress" aria-label={`Progres halaman ${progress + 1}`}>
                      <span style={{ width: `${((progress + 1) / entry.content.length) * 100}%` }} />
                    </div>
                  )}
                  <div className="book-info mt-4 flex items-center justify-between gap-2">
                    <span className="text-[0.58rem] uppercase tracking-[0.16em] text-[#d4c1e1] sm:text-[0.62rem] sm:tracking-[0.2em]">
                      {entry.category}
                    </span>
                    <span className="text-[0.62rem] text-white/40 sm:text-[0.65rem]">
                      {entry.readTime}
                    </span>
                  </div>
                  <button
                    className="mt-2 text-left font-display text-xl leading-tight text-white group-hover:text-[#f0dcb7] sm:text-2xl"
                    onClick={() => openBook(entry)}
                    type="button"
                  >
                    {entry.title}
                  </button>
                  <p className="mt-2 text-xs leading-5 text-white/55 sm:text-sm sm:leading-6">
                    {entry.description}
                  </p>
                  <button
                    className="mt-3 inline-flex min-h-9 items-center gap-2 text-xs text-white/75 hover:text-white"
                    onClick={() => openBook(entry)}
                    type="button"
                  >
                    Baca buku <span aria-hidden="true">↗</span>
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-white/55">
            {filter === "Tersimpan"
              ? storageReady
                ? "Belum ada buku tersimpan. Tandai buku dengan ikon hati untuk menemukannya lagi."
                : "Membuka rak bukumu..."
              : "Belum ada bacaan yang cocok. Coba kata kunci lain."}
          </p>
        )}
      </section>

      {selected && (
        <div
          className="reader-backdrop"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <article
            aria-labelledby="reader-title"
            aria-modal="true"
            className={`reader-panel ${warmPage ? "reader-warm" : ""}`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="reader-toolbar">
              <span className="eyebrow">{selected.category} · {selected.readTime}</span>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Perkecil teks"
                  className="reader-tool"
                  onClick={() => setFontScale((value) => Math.max(0.85, value - 0.1))}
                  type="button"
                >
                  A−
                </button>
                <button
                  aria-label="Perbesar teks"
                  className="reader-tool"
                  onClick={() => setFontScale((value) => Math.min(1.3, value + 0.1))}
                  type="button"
                >
                  A+
                </button>
                <button
                  aria-label={warmPage ? "Gunakan halaman malam" : "Gunakan halaman hangat"}
                  className="reader-tool hidden sm:inline-flex"
                  onClick={() => setWarmPage((value) => !value)}
                  type="button"
                >
                  {warmPage ? "☼" : "☾"}
                </button>
                <button
                  aria-label="Tutup bacaan"
                  className="reader-tool"
                  onClick={() => setSelected(null)}
                  type="button"
                >
                  Tutup
                </button>
              </div>
            </div>
            <div className="reader-progress" aria-label={`Halaman ${page + 1} dari ${selected.content.length}`}>
              <span style={{ width: `${((page + 1) / selected.content.length) * 100}%` }} />
            </div>
            <div className="reader-book">
              <div className="reader-page-art" aria-hidden="true">
                <span className="reader-art-symbol">{selected.cover}</span>
                <span className="reader-art-label">YOUR DREAM LIBRARY</span>
              </div>
              <div className="reader-page-copy">
                <p className="reader-page-number">HALAMAN {String(page + 1).padStart(2, "0")}</p>
                <h2 className="reader-title" id="reader-title">{selected.title}</h2>
                <p className="reader-description">{selected.description}</p>
                <p className="reader-paragraph" style={{ fontSize: `${1.02 * fontScale}rem` }}>
                  {selected.content[page]}
                </p>
                <p className="reader-page-count">
                  {page + 1} / {selected.content.length}
                </p>
              </div>
            </div>
            <div className="reader-footer">
              <button
                className="reader-tool"
                disabled={page === 0}
                onClick={() => changePage(page - 1)}
                type="button"
              >
                ← Sebelumnya
              </button>
              <button
                aria-pressed={preferences.bookmarks.includes(selected.id)}
                className="reader-tool"
                onClick={() => toggleBookmark(selected)}
                type="button"
              >
                {preferences.bookmarks.includes(selected.id) ? "♥ Tersimpan" : "♡ Simpan"}
              </button>
              {page < selected.content.length - 1 ? (
                <button
                  className="reader-next"
                  onClick={() => changePage(page + 1)}
                  type="button"
                >
                  Halaman berikutnya <span aria-hidden="true">→</span>
                </button>
              ) : (
                <button
                  className="reader-next"
                  onClick={() => setSelected(null)}
                  type="button"
                >
                  Selesai membaca <span aria-hidden="true">✓</span>
                </button>
              )}
            </div>
            <p className="reader-hint">Gunakan tombol panah kiri/kanan untuk membalik halaman.</p>
          </article>
        </div>
      )}
    </main>
  );
}
