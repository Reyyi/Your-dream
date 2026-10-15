"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  SceneryMode,
  PolaroidPhoto,
  RetroItemKnowledge,
  VINYL_ALBUMS,
  TV_CHANNELS,
  POLAROID_PHOTOS,
  PHONE_RECORDS,
  RETRO_ITEMS_KNOWLEDGE,
} from "@/lib/retroRoomData";
import { retroRoomAudio } from "@/lib/retroRoomAudio";

// Zero-dependency SVG Icons for maximum performance
function DiscIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" x2="12.01" y1="12" y2="12" />
    </svg>
  );
}

function TvIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="15" x="2" y="7" rx="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeMuteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
    </svg>
  );
}

function CloudRainIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}

export function RetroRoomExperience() {
  // State: Suasana Pemandangan & Pengaturan Audio
  const [scenery, setScenery] = useState<SceneryMode>("rainy-window");
  const [isMuted, setIsMuted] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<RetroItemKnowledge | null>(null);

  // State: Item 1 - Pemutar Piringan Hitam Vinil
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0);
  const [isNeedleDown, setIsNeedleDown] = useState(false);
  const [turntableRotation, setTurntableRotation] = useState(0);

  // State: Item 2 - Televisi Tabung CRT
  const [tvPowered, setTvPowered] = useState(true);
  const [channelIndex, setChannelIndex] = useState(0);

  // State: Item 3 - Kamera Polaroid Instan & Kamera Asli
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [developedPhotos, setDevelopedPhotos] = useState<PolaroidPhoto[]>(POLAROID_PHOTOS);
  const [lastEjectedPhoto, setLastEjectedPhoto] = useState<PolaroidPhoto | null>(null);
  const [developingProgress, setDevelopingProgress] = useState(100);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // State: Item 4 - Lampu Lava & Jam Flip
  const [lavaColor, setLavaColor] = useState<"amber" | "emerald" | "magenta">("amber");
  const [currentTime, setCurrentTime] = useState<{ hours: string; minutes: string; seconds: string }>({
    hours: "21",
    minutes: "45",
    seconds: "00",
  });

  // State: Item 5 - Telepon Putar Rotary
  const [dialedDigit, setDialedDigit] = useState<number | null>(null);
  const [rotaryAngle, setRotaryAngle] = useState(0);
  const [isReceiverLifted, setIsReceiverLifted] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState<string | null>(null);

  // Canvas Refs untuk Animasi Efek
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const tvCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sync mute state
  useEffect(() => {
    retroRoomAudio.setMuted(isMuted);
  }, [isMuted]);

  // Jam Flip Waktu Nyata
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime({ hours, minutes, seconds });
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animasi Pemandangan Jendela Hujan Canvas
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    const dropCount = 65;

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 12 + Math.random() * 20,
        speed: 3 + Math.random() * 4,
        opacity: 0.15 + Math.random() * 0.35,
      });
    }

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (scenery === "rainy-window") {
        ctx.strokeStyle = "rgba(186, 215, 255, 0.4)";
        ctx.lineWidth = 1.2;
        drops.forEach((d) => {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 1, d.y + d.length);
          ctx.stroke();

          d.y += d.speed;
          d.x -= 0.5;
          if (d.y > canvas.height) {
            d.y = -d.length;
            d.x = Math.random() * canvas.width;
          }
        });
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [scenery]);

  // Animasi Layar Televisi Tabung CRT
  useEffect(() => {
    if (!tvPowered) return;
    const canvas = tvCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    const channel = TV_CHANNELS[channelIndex];

    const render = () => {
      animId = requestAnimationFrame(render);
      phase += 0.05;

      if (channel.type === "pixel-rain") {
        // Siluet kota malam dengan rintik pixel
        ctx.fillStyle = "#0c1220";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gedung kota
        ctx.fillStyle = "#162035";
        ctx.fillRect(20, 50, 45, 90);
        ctx.fillRect(80, 30, 60, 110);
        ctx.fillRect(155, 60, 50, 80);
        ctx.fillRect(220, 20, 70, 120);

        // Kerlip jendela gedung
        ctx.fillStyle = Math.sin(phase * 2) > 0 ? "#ffd56b" : "#4a5568";
        ctx.fillRect(32, 65, 8, 8);
        ctx.fillRect(95, 45, 8, 8);
        ctx.fillRect(108, 75, 8, 8);
        ctx.fillRect(240, 40, 8, 8);
        ctx.fillRect(255, 70, 8, 8);

        // Hujan neon biru
        ctx.strokeStyle = "rgba(100, 200, 255, 0.6)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 20; i++) {
          const rx = (i * 16 + phase * 40) % canvas.width;
          const ry = (i * 24 + phase * 60) % canvas.height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 2, ry + 10);
          ctx.stroke();
        }
      } else if (channel.type === "color-bars") {
        // SMPTE Color Bars
        const barColors = ["#ffffff", "#e5e500", "#00e5e5", "#00e500", "#e500e5", "#e50000", "#0000e5"];
        const barWidth = canvas.width / barColors.length;
        barColors.forEach((color, idx) => {
          ctx.fillStyle = color;
          ctx.fillRect(idx * barWidth, 0, barWidth, canvas.height * 0.75);
        });
        // Bottom reference blocks
        ctx.fillStyle = "#002147";
        ctx.fillRect(0, canvas.height * 0.75, canvas.width * 0.25, canvas.height * 0.25);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(canvas.width * 0.25, canvas.height * 0.75, canvas.width * 0.25, canvas.height * 0.25);
        ctx.fillStyle = "#32006a";
        ctx.fillRect(canvas.width * 0.5, canvas.height * 0.75, canvas.width * 0.25, canvas.height * 0.25);
        ctx.fillStyle = "#131313";
        ctx.fillRect(canvas.width * 0.75, canvas.height * 0.75, canvas.width * 0.25, canvas.height * 0.25);
      } else if (channel.type === "vector-synth") {
        // Neon Synth Horizon
        ctx.fillStyle = "#1a0b2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Retro Sun
        const sunY = canvas.height * 0.45;
        const grad = ctx.createLinearGradient(0, 0, 0, sunY);
        grad.addColorStop(0, "#ff4b72");
        grad.addColorStop(1, "#fdbb2d");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, sunY, 35, 0, Math.PI, true);
        ctx.fill();

        // Sun lines
        ctx.fillStyle = "#1a0b2e";
        ctx.fillRect(canvas.width / 2 - 40, sunY - 14, 80, 3);
        ctx.fillRect(canvas.width / 2 - 40, sunY - 6, 80, 2);

        // Ground grid
        ctx.strokeStyle = "#ff007f";
        ctx.lineWidth = 1;
        const groundY = canvas.height * 0.45;
        for (let y = groundY; y < canvas.height; y += 10) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        for (let x = -40; x < canvas.width + 40; x += 30) {
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, groundY);
          ctx.lineTo(x + Math.sin(phase) * 5, canvas.height);
          ctx.stroke();
        }
      } else {
        // Static Snow Noise
        const imgData = ctx.createImageData(canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [tvPowered, channelIndex]);

  // Mekanisme Pemutar Piringan Hitam & Alunan Nada Hangat Realistis
  useEffect(() => {
    if (!isNeedleDown) {
      retroRoomAudio.stopVinylSound();
      return;
    }

    retroRoomAudio.startVinylSound();
    const album = VINYL_ALBUMS[selectedAlbumIndex];
    let chordIdx = 0;
    let active = true;

    const interval = setInterval(() => {
      if (!active) return;
      const chord = album.chords[chordIdx % album.chords.length];
      const bass = album.bassNotes ? album.bassNotes[chordIdx % album.bassNotes.length] : undefined;
      const melody = album.melodyNotes ? album.melodyNotes[chordIdx % album.melodyNotes.length] : undefined;
      retroRoomAudio.playWarmLofiChord(chord, bass, melody);
      chordIdx++;
    }, 2800);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isNeedleDown, selectedAlbumIndex]);

  // Rotasi Piringan Hitam Nyata
  useEffect(() => {
    if (!isNeedleDown) return;
    let animId: number;
    const rotate = () => {
      setTurntableRotation((prev) => (prev + 1.2) % 360);
      animId = requestAnimationFrame(rotate);
    };
    animId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animId);
  }, [isNeedleDown]);

  // Aktifkan atau Nonaktifkan Kamera Nyata Perangkat
  const toggleRealCamera = async () => {
    if (isCameraActive) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
      setIsCameraActive(false);
      return;
    }

    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });
      cameraStreamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => undefined);
      }
    } catch {
      setCameraError("Izin kamera belum diberikan. Mode pemandangan retro tetap aktif.");
      setIsCameraActive(false);
    }
  };

  // Balik Kamera Depan / Belakang untuk Ponsel
  const switchCameraFacing = async () => {
    const nextFacing = cameraFacing === "user" ? "environment" : "user";
    setCameraFacing(nextFacing);
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: nextFacing,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => undefined);
      }
    } catch {
      // Fallback
    }
  };

  // Bersihkan track kamera saat komponen ditutup
  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
    };
  }, []);

  // Tombol Jepret Kamera Polaroid Instan (Bidikan Nyata atau Retro Pemandangan)
  const handleSnapPolaroid = async () => {
    if (isTakingPhoto) return;
    await retroRoomAudio.unlockAudio();
    setIsTakingPhoto(true);
    setDevelopingProgress(0);
    retroRoomAudio.playPolaroidCapture();

    let capturedUrl: string | undefined = undefined;

    // Ambil bingkai nyata dari kamera pengguna jika aktif
    if (isCameraActive && videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = photoCanvasRef.current || document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const video = videoRef.current;
        const minDim = Math.min(video.videoWidth, video.videoHeight);
        const startX = (video.videoWidth - minDim) / 2;
        const startY = (video.videoHeight - minDim) / 2;

        ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 400, 400);

        // Efek warna hangat analog 1984
        ctx.fillStyle = "rgba(255, 220, 160, 0.14)";
        ctx.fillRect(0, 0, 400, 400);

        // Efek vinyet tepi lensa
        const grad = ctx.createRadialGradient(200, 200, 120, 200, 200, 280);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, "rgba(25, 15, 10, 0.45)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 400);

        capturedUrl = canvas.toDataURL("image/jpeg", 0.92);
      }
    }

    const photoTemplates = [
      {
        title: "Pojok Meja Kamar Nostalgia",
        caption: "Cahaya temaram lampu meja menyinari koleksi kaset vinil.",
        filterClass: "sepia-[0.35] contrast-[1.05] brightness-[1.02]",
      },
      {
        title: "Rintik Hujan di Balik Kaca Jendela",
        caption: "Butiran air merambat perlahan membiaskan cahaya neon kota.",
        filterClass: "hue-rotate-[15deg] contrast-[1.1] brightness-[0.98]",
      },
      {
        title: "Piringan Hitam Berputar Damai",
        caption: "Kilauan alur spiral vinil di bawah pendar lampu meja antik.",
        filterClass: "sepia-[0.25] saturate-[1.2]",
      },
      {
        title: "Lampu Lava Berpijar Tenang",
        caption: "Gumpalan lilin hangat melayang perlahan memancarkan ketenangan batin.",
        filterClass: "sepia-[0.4] brightness-[1.08]",
      },
    ];

    const pick = photoTemplates[Math.floor(Math.random() * photoTemplates.length)];
    const newPhoto: PolaroidPhoto = {
      id: `photo-${Date.now()}`,
      title: capturedUrl ? "Potret Kamera Nyata 1984" : pick.title,
      caption: capturedUrl ? "Foto asli diri berbalut warna kimiawi polaroid analog" : pick.caption,
      filterClass: capturedUrl ? "" : pick.filterClass,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      imageUrl: capturedUrl,
    };

    setLastEjectedPhoto(newPhoto);

    // Animasi kemunculan kimia foto perlahan selama 4 detik
    let progress = 0;
    const devInterval = setInterval(() => {
      progress += 5;
      setDevelopingProgress(progress);
      if (progress >= 100) {
        clearInterval(devInterval);
        setIsTakingPhoto(false);
        setDevelopedPhotos((prev) => [newPhoto, ...prev.slice(0, 5)]);
      }
    }, 180);
  };

  // Putaran Piringan Telepon Rotary Dial
  const handleDialNumber = (digit: number) => {
    setDialedDigit(digit);
    setRotaryAngle(digit * 28 + 40);
    retroRoomAudio.playRotaryDialRatchet();

    setTimeout(() => {
      setRotaryAngle(0);
      retroRoomAudio.playPhoneChime();
      const record = PHONE_RECORDS.find((r) => r.digit === digit);
      if (record) {
        setPhoneMessage(record.message);
        setIsReceiverLifted(true);
      }
    }, 450);
  };

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-1000 select-none overflow-x-hidden pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-12 ${
        scenery === "rainy-window"
          ? "bg-[#0b101d] text-slate-100"
          : "bg-[#1f1217] text-amber-50"
      }`}
    >
      {/* Background Atmosphere & Window Canvas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Soft Ambient Room Lighting Gradient */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            scenery === "rainy-window"
              ? "bg-[radial-gradient(circle_at_top,_rgba(24,35,62,0.85)_0%,_rgba(11,16,29,1)_85%)]"
              : "bg-[radial-gradient(circle_at_top,_rgba(88,38,42,0.85)_0%,_rgba(31,18,23,1)_85%)]"
          }`}
        />

        {/* Raindrop Trails Canvas for Rainy Window Mode */}
        <canvas
          ref={rainCanvasRef}
          width={1200}
          height={800}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            scenery === "rainy-window" ? "opacity-75" : "opacity-0"
          }`}
        />

        {/* Golden Sunset Glow Blinds for Sunset Mode */}
        <div
          className={`absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(245,158,11,0.08)_50%,transparent_100%)] bg-[length:100%_48px] transition-opacity duration-1000 ${
            scenery === "golden-sunset" ? "opacity-90" : "opacity-0"
          }`}
        />
      </div>

      <div className="relative mx-auto max-w-6xl z-10">
        {/* Top Control Bar: Suasana Pemandangan & Kontrol Ruangan */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-white/15 bg-black/45 p-4 sm:p-5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-950/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <DiscIcon className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-sm sm:text-base font-semibold tracking-wide text-[#fff4e0]">
                RUANG NOSTALGIA
              </span>
              <span className="text-[0.68rem] text-white/60">
                Koleksi barang-barang klasik dan sudut santai bernuansa masa lalu
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Scenery Selector */}
            <div className="flex items-center rounded-xl border border-white/15 bg-black/50 p-1">
              <button
                onClick={() => setScenery("rainy-window")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  scenery === "rainy-window"
                    ? "bg-sky-500/25 text-sky-200 border border-sky-400/30"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <CloudRainIcon className="h-3.5 w-3.5" />
                <span>Hujan Malam</span>
              </button>
              <button
                onClick={() => setScenery("golden-sunset")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  scenery === "golden-sunset"
                    ? "bg-amber-500/25 text-amber-200 border border-amber-400/30"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <SunIcon className="h-3.5 w-3.5" />
                <span>Senja Emas</span>
              </button>
            </div>

            {/* Audio Mute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-white/80 hover:text-white transition"
              title={isMuted ? "Aktifkan Suara" : "Bisukan"}
              aria-label="Pengaturan suara"
            >
              {isMuted ? (
                <VolumeMuteIcon className="h-4 w-4 text-white/40" />
              ) : (
                <VolumeIcon className="h-4 w-4 text-amber-300" />
              )}
            </button>
          </div>
        </div>

        {/* Main Interactive Retro Studio Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7">
          {/* ================= COLUMN KIRI: ITEM 1 & ITEM 2 (VINYL & CRT TV) ================= */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
            {/* ITEM 1: PEMUTAR PIRINGAN HITAM VINIL */}
            <div className="relative rounded-2xl border border-white/15 bg-black/45 p-4.5 sm:p-5 lg:p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/40 text-amber-300">
                    <DiscIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#fff3db]">
                      Pemutar Piringan Hitam Vinil 1978
                    </h3>
                    <p className="text-[0.65rem] text-white/60">
                      Alur mikro spiral dan jarum pemutar fisik
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedKnowledge(
                      RETRO_ITEMS_KNOWLEDGE.find((k) => k.id === "turntable") || null
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-950/30 px-2.5 py-1 text-[0.68rem] font-medium text-amber-200 hover:border-amber-400/60 transition"
                >
                  <BookIcon className="h-3 w-3" />
                  <span>Pelajari Sains</span>
                </button>
              </div>

              {/* Turntable Chassis & Spinning Disc */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-around gap-6">
                {/* Vinyl Disc with Tonearm */}
                <div className="relative flex h-52 w-52 shrink-0 items-center justify-center rounded-full border-4 border-[#2d251e] bg-gradient-to-tr from-[#141416] via-[#212124] to-[#111113] shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                  {/* Rotating Vinyl Texture */}
                  <div
                    className="relative flex h-48 w-48 items-center justify-center rounded-full border-2 border-white/5 bg-[#121214]"
                    style={{
                      transform: `rotate(${turntableRotation}deg)`,
                    }}
                  >
                    {/* Concentric Grooves */}
                    <div className="absolute inset-2 rounded-full border border-white/[0.04]" />
                    <div className="absolute inset-5 rounded-full border border-white/[0.06]" />
                    <div className="absolute inset-8 rounded-full border border-white/[0.04]" />
                    <div className="absolute inset-11 rounded-full border border-white/[0.06]" />

                    {/* Center Label Badge */}
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${VINYL_ALBUMS[selectedAlbumIndex].coverColor} border-2 border-amber-400/40 text-center shadow`}
                    >
                      <span className="font-mono text-[0.55rem] font-bold text-amber-200 leading-tight px-1">
                        33⅓ RPM
                      </span>
                    </div>
                  </div>

                  {/* Physical Tonearm Lever */}
                  <div
                    className={`absolute -top-1 -right-2 h-28 w-2 origin-top rounded-full bg-gradient-to-b from-slate-300 to-slate-500 shadow-lg transition-transform duration-700 ease-out ${
                      isNeedleDown ? "rotate-[28deg]" : "rotate-[-12deg]"
                    }`}
                  >
                    {/* Tonearm head & cartridge */}
                    <div className="absolute -bottom-2 -left-1.5 h-4 w-5 rounded bg-amber-600 shadow border border-amber-300" />
                  </div>
                </div>

                {/* Turntable Controls & Album Selector */}
                <div className="flex flex-col gap-3.5 w-full sm:max-w-xs text-xs">
                  <div>
                    <span className="text-[0.62rem] uppercase tracking-wider text-white/50 font-semibold">
                      ALBUM SAAT INI:
                    </span>
                    <h4 className="font-display text-sm font-semibold text-amber-200 mt-0.5">
                      {VINYL_ALBUMS[selectedAlbumIndex].title}
                    </h4>
                    <p className="text-[0.68rem] text-white/60 leading-relaxed mt-1">
                      {VINYL_ALBUMS[selectedAlbumIndex].description}
                    </p>
                  </div>

                  {/* Needle Toggle Button */}
                  <button
                    onClick={async () => {
                      await retroRoomAudio.unlockAudio();
                      retroRoomAudio.playNeedleDrop();
                      setIsNeedleDown(!isNeedleDown);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-semibold text-xs tracking-wide transition-all shadow ${
                      isNeedleDown
                        ? "border-emerald-400/50 bg-emerald-950/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "border-amber-400/40 bg-amber-950/40 text-amber-200 hover:border-amber-400/70"
                    }`}
                  >
                    <span>{isNeedleDown ? "ANGKAT JARUM (JEDA MUSIK)" : "LETAKKAN JARUM (PUTAR MUSIK)"}</span>
                  </button>

                  {/* Equalizer Wave Indicator when playing */}
                  {isNeedleDown && (
                    <div className="flex items-center gap-2 rounded-lg bg-black/40 px-2.5 py-1.5 border border-emerald-500/30">
                      <span className="flex gap-1 items-end h-3">
                        <span className="w-1 bg-emerald-400 animate-pulse h-2 rounded" />
                        <span className="w-1 bg-emerald-400 animate-pulse h-3 rounded delay-75" />
                        <span className="w-1 bg-emerald-400 animate-pulse h-1.5 rounded delay-150" />
                        <span className="w-1 bg-emerald-400 animate-pulse h-2.5 rounded delay-100" />
                      </span>
                      <span className="text-[0.62rem] text-emerald-300 font-mono">
                        Musik Vinil Analog Sedang Mengalun
                      </span>
                    </div>
                  )}

                  {/* Album Switcher Pills */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
                    <span className="text-[0.6rem] text-white/50">PILIH KEPINGAN ALBUM:</span>
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {VINYL_ALBUMS.map((alb, idx) => (
                        <button
                          key={alb.id}
                          onClick={async () => {
                            await retroRoomAudio.unlockAudio();
                            retroRoomAudio.playNeedleDrop();
                            setSelectedAlbumIndex(idx);
                          }}
                          className={`rounded-lg px-2.5 py-1 text-[0.65rem] whitespace-nowrap border transition ${
                            selectedAlbumIndex === idx
                              ? "border-amber-400 bg-amber-500/25 text-amber-200 font-semibold"
                              : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                          }`}
                        >
                          {alb.year} • {alb.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ITEM 2: TELEVISI TABUNG CEMBUNG ANTIK (CRT TV) */}
            <div className="relative rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-950/40 text-sky-300">
                    <TvIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#fff3db]">
                      Televisi Tabung Cembung Kayu 1982
                    </h3>
                    <p className="text-[0.65rem] text-white/60">
                      Pancaran elektron katoda dan kenop putar saluran
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedKnowledge(
                      RETRO_ITEMS_KNOWLEDGE.find((k) => k.id === "crt-tv") || null
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-sky-400/30 bg-sky-950/30 px-2.5 py-1 text-[0.68rem] font-medium text-sky-200 hover:border-sky-400/60 transition"
                >
                  <BookIcon className="h-3 w-3" />
                  <span>Pelajari Sains</span>
                </button>
              </div>

              {/* Wooden TV Cabinet with Curved Screen & Rotary Dial */}
              <div className="mt-5 flex flex-col md:flex-row items-center gap-5 rounded-2xl border-4 border-[#3e2b20] bg-gradient-to-b from-[#2a1b13] to-[#1a110c] p-4 shadow-2xl">
                {/* Curved CRT Screen */}
                <div className="relative w-full max-w-sm rounded-[24px] border-4 border-[#121212] bg-black p-2.5 shadow-inner overflow-hidden">
                  {/* Subtle Scanlines & Curvature Reflection */}
                  <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.1),_transparent_75%)]" />

                  <canvas
                    ref={tvCanvasRef}
                    width={320}
                    height={200}
                    className={`w-full h-44 rounded-[16px] object-cover transition-opacity duration-300 ${
                      tvPowered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>

                {/* TV Controls & Rotary Channel Switcher */}
                <div className="flex flex-col justify-between gap-3 w-full md:w-48 text-xs">
                  <div>
                    <span className="text-[0.62rem] text-amber-200/70 uppercase tracking-widest font-mono">
                      SALURAN {TV_CHANNELS[channelIndex].channelNumber}
                    </span>
                    <h4 className="font-semibold text-white mt-0.5 line-clamp-1">
                      {TV_CHANNELS[channelIndex].name}
                    </h4>
                    <p className="text-[0.65rem] text-white/60 leading-relaxed mt-1">
                      {TV_CHANNELS[channelIndex].caption}
                    </p>
                  </div>

                  {/* Rotary Channel Knob */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        retroRoomAudio.playTvKnobClick();
                        setChannelIndex((prev) => (prev + 1) % TV_CHANNELS.length);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-950/40 py-2 font-semibold text-xs text-amber-200 hover:border-amber-400 transition"
                    >
                      <span>PUTAR SALURAN</span>
                    </button>

                    <button
                      onClick={() => {
                        retroRoomAudio.playTvKnobClick();
                        setTvPowered(!tvPowered);
                      }}
                      className={`h-9 w-9 flex items-center justify-center rounded-lg border text-xs font-bold transition ${
                        tvPowered
                          ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                          : "border-rose-500/50 bg-rose-950/40 text-rose-300"
                      }`}
                      title={tvPowered ? "Matikan TV" : "Nyalakan TV"}
                    >
                      {tvPowered ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= COLUMN KANAN: ITEM 3, 4, 5 (POLAROID, LAVA LAMP, ROTARY PHONE) ================= */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
            {/* ITEM 3: KAMERA POLAROID INSTAN */}
            <div className="relative rounded-2xl border border-white/15 bg-black/45 p-4.5 sm:p-5 lg:p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-950/40 text-rose-300">
                    <CameraIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#fff3db]">
                      Kamera Polaroid Instan
                    </h3>
                    <p className="text-[0.65rem] text-white/60">
                      Kimiawi kamar gelap dalam satu jepretan
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedKnowledge(
                      RETRO_ITEMS_KNOWLEDGE.find((k) => k.id === "polaroid") || null
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-950/30 px-2.5 py-1 text-[0.68rem] font-medium text-rose-200 hover:border-rose-400/60 transition"
                >
                  <BookIcon className="h-3 w-3" />
                  <span>Pelajari Sains</span>
                </button>
              </div>

              {/* Polaroid Camera Shutter & Ejected Film Slot */}
              <div className="mt-4 flex flex-col items-center">
                {/* Hidden Canvas for Frame Processing */}
                <canvas ref={photoCanvasRef} className="hidden" />

                {/* Camera Body Chassis */}
                <div className="relative flex w-full max-w-xs items-center justify-between rounded-xl border-2 border-slate-700 bg-gradient-to-b from-[#2a2d34] to-[#1a1b20] p-3 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    {/* Live Camera Viewfinder Lens */}
                    <div className="relative h-14 w-14 shrink-0 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
                      {isCameraActive ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`h-full w-full object-cover ${
                            cameraFacing === "user" ? "scale-x-[-1]" : ""
                          }`}
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-sky-950 border border-sky-400" />
                      )}
                    </div>

                    {/* Retro Rainbow Stripe */}
                    <div className="flex h-6 flex-col justify-center gap-0.5">
                      <div className="h-1 w-10 bg-rose-500 rounded" />
                      <div className="h-1 w-10 bg-amber-500 rounded" />
                      <div className="h-1 w-10 bg-emerald-500 rounded" />
                    </div>
                  </div>

                  {/* Red Shutter Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSnapPolaroid}
                      disabled={isTakingPhoto}
                      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-rose-400 bg-rose-600 text-white font-bold shadow-md hover:bg-rose-500 active:scale-95 transition disabled:opacity-50"
                      title="Jepret Foto Polaroid"
                    >
                      📸
                    </button>
                  </div>
                </div>

                {/* Camera Mode Toggles */}
                <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={toggleRealCamera}
                    className={`rounded-lg border px-2.5 py-1 text-[0.68rem] font-semibold transition ${
                      isCameraActive
                        ? "border-emerald-400/60 bg-emerald-950/40 text-emerald-300"
                        : "border-rose-400/40 bg-rose-950/30 text-rose-200 hover:border-rose-400/70"
                    }`}
                  >
                    {isCameraActive ? "Matikan Kamera Asli" : "Aktifkan Kamera Asli 📷"}
                  </button>

                  {isCameraActive && (
                    <button
                      onClick={switchCameraFacing}
                      className="rounded-lg border border-white/20 bg-white/5 px-2.5 py-1 text-[0.68rem] font-semibold text-white/80 hover:text-white transition"
                      title="Balik kamera depan / belakang"
                    >
                      🔄 Balik Kamera
                    </button>
                  )}
                </div>

                {cameraError && (
                  <p className="mt-1.5 text-center text-[0.62rem] text-amber-300/90 leading-tight">
                    {cameraError}
                  </p>
                )}

                {/* Ejected Developing Polaroid Photo Card */}
                {lastEjectedPhoto && (
                  <div className="mt-3 w-52 rounded-xl bg-[#fbf9f4] p-3 pb-4 text-slate-900 shadow-2xl transition-all duration-500 animate-fadeIn border border-amber-200/40">
                    <div
                      className="h-36 w-full rounded-lg bg-slate-900 overflow-hidden transition-all duration-700"
                      style={{
                        filter: `contrast(${developingProgress}%) brightness(${
                          0.5 + (developingProgress / 100) * 0.5
                        })`,
                      }}
                    >
                      {lastEjectedPhoto.imageUrl ? (
                        <img
                          src={lastEjectedPhoto.imageUrl}
                          alt={lastEjectedPhoto.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className={`h-full w-full bg-gradient-to-tr from-amber-900 to-indigo-950 flex flex-col justify-end p-2 text-white ${lastEjectedPhoto.filterClass}`}
                        >
                          <span className="text-[0.62rem] font-bold line-clamp-1">
                            {lastEjectedPhoto.title}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2.5 flex items-start justify-between gap-1 text-[0.62rem] text-slate-600 leading-tight">
                      <div>
                        <p className="line-clamp-1 italic font-medium">&quot;{lastEjectedPhoto.caption}&quot;</p>
                        <span className="text-[0.55rem] text-slate-400 mt-0.5 block">
                          {lastEjectedPhoto.timestamp}
                        </span>
                      </div>

                      {lastEjectedPhoto.imageUrl && (
                        <a
                          href={lastEjectedPhoto.imageUrl}
                          download={`polaroid-${Date.now()}.jpg`}
                          className="shrink-0 rounded bg-slate-900 px-2 py-1 text-[0.6rem] font-bold text-white hover:bg-slate-800 transition"
                          title="Simpan foto ke perangkat"
                        >
                          Simpan 💾
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Koleksi Cetakan Foto */}
                {developedPhotos.length > 0 && (
                  <div className="mt-3 w-full text-center">
                    <p className="text-[0.62rem] font-medium text-white/50 mb-1.5">
                      Koleksi Cetakan Foto ({developedPhotos.length})
                    </p>
                    <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
                      {developedPhotos.slice(0, 4).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setLastEjectedPhoto(p);
                            setDevelopingProgress(100);
                          }}
                          className="group relative h-12 w-10 shrink-0 overflow-hidden rounded border border-white/20 bg-slate-900 transition hover:scale-105"
                          title={p.title}
                        >
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className={`h-full w-full ${p.filterClass} opacity-80`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ITEM 4: LAMPU LAVA & JAM FLIP ANALOG */}
            <div className="relative rounded-2xl border border-white/15 bg-black/45 p-4.5 sm:p-5 lg:p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/40 text-amber-300">
                    <FlameIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#fff3db]">
                      Lampu Lava & Jam Flip
                    </h3>
                    <p className="text-[0.65rem] text-white/60">
                      Termodinamika cairan dan mekanika kartu waktu
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedKnowledge(
                      RETRO_ITEMS_KNOWLEDGE.find((k) => k.id === "lava-lamp") || null
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-950/30 px-2.5 py-1 text-[0.68rem] font-medium text-amber-200 hover:border-amber-400/60 transition"
                >
                  <BookIcon className="h-3 w-3" />
                  <span>Pelajari Sains</span>
                </button>
              </div>

              <div className="mt-4 flex items-center justify-around gap-4">
                {/* Visual Lava Lamp Bottle */}
                <div className="relative flex flex-col items-center">
                  <div className="relative h-32 w-14 rounded-full border-2 border-white/20 bg-gradient-to-b from-white/10 to-black/80 overflow-hidden shadow-inner flex flex-col items-center justify-center">
                    {/* Animated morphing floating wax blobs */}
                    <div
                      className={`h-7 w-7 rounded-full blur-[2px] transition-all duration-1000 animate-pulse ${
                        lavaColor === "amber"
                          ? "bg-amber-400 shadow-[0_0_15px_#f59e0b]"
                          : lavaColor === "emerald"
                          ? "bg-emerald-400 shadow-[0_0_15px_#10b981]"
                          : "bg-fuchsia-400 shadow-[0_0_15px_#e879f9]"
                      }`}
                    />
                    <div
                      className={`mt-2 h-9 w-9 rounded-full blur-[3px] transition-all duration-1000 ${
                        lavaColor === "amber"
                          ? "bg-amber-500"
                          : lavaColor === "emerald"
                          ? "bg-emerald-500"
                          : "bg-fuchsia-500"
                      }`}
                    />
                  </div>
                  {/* Color Selector Pills */}
                  <div className="mt-2 flex gap-1">
                    <button
                      onClick={() => setLavaColor("amber")}
                      className="h-3.5 w-3.5 rounded-full bg-amber-400 border border-white/30"
                      title="Lilin Amber"
                    />
                    <button
                      onClick={() => setLavaColor("emerald")}
                      className="h-3.5 w-3.5 rounded-full bg-emerald-400 border border-white/30"
                      title="Lilin Emerald"
                    />
                    <button
                      onClick={() => setLavaColor("magenta")}
                      className="h-3.5 w-3.5 rounded-full bg-fuchsia-400 border border-white/30"
                      title="Lilin Magenta"
                    />
                  </div>
                </div>

                {/* Flip Clock Cards Display */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-1.5">
                    {/* Hours Card */}
                    <div className="flex h-16 w-14 items-center justify-center rounded-lg border-2 border-white/20 bg-slate-900 font-mono text-2xl font-bold text-white shadow-lg">
                      {currentTime.hours}
                    </div>
                    <span className="font-mono text-xl text-amber-400 font-bold animate-pulse">:</span>
                    {/* Minutes Card */}
                    <div className="flex h-16 w-14 items-center justify-center rounded-lg border-2 border-white/20 bg-slate-900 font-mono text-2xl font-bold text-white shadow-lg">
                      {currentTime.minutes}
                    </div>
                  </div>
                  <span className="text-[0.62rem] text-white/50 font-mono tracking-widest">
                    DETIK: {currentTime.seconds}
                  </span>
                </div>
              </div>
            </div>

            {/* ITEM 5: TELEPON PUTAR ROTARY DIAL */}
            <div className="relative rounded-2xl border border-white/15 bg-black/45 p-4.5 sm:p-5 lg:p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-300">
                    <PhoneIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#fff3db]">
                      Telepon Putar Rotary Dial
                    </h3>
                    <p className="text-[0.65rem] text-white/60">
                      Sistem pulsa elektromekanik putaran pegas
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedKnowledge(
                      RETRO_ITEMS_KNOWLEDGE.find((k) => k.id === "rotary-phone") || null
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-950/30 px-2.5 py-1 text-[0.68rem] font-medium text-emerald-200 hover:border-emerald-400/60 transition"
                >
                  <BookIcon className="h-3 w-3" />
                  <span>Pelajari Sains</span>
                </button>
              </div>

              {/* Rotary Dial Disc & Digits */}
              <div className="mt-4 flex flex-col items-center">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-slate-700 bg-gradient-to-b from-slate-800 to-slate-950 shadow-2xl">
                  {/* Rotating Wheel with Dial Holes */}
                  <div
                    className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/20 transition-transform duration-300"
                    style={{ transform: `rotate(${rotaryAngle}deg)` }}
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleDialNumber(num)}
                        className={`absolute flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-black/80 font-mono text-xs font-bold text-white shadow hover:bg-amber-500 hover:text-black transition ${
                          num === 1
                            ? "top-1 right-3"
                            : num === 2
                            ? "right-1 top-10"
                            : num === 3
                            ? "bottom-3 right-3"
                            : "bottom-1 left-10"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Center Metal Cap */}
                  <div className="absolute h-9 w-9 rounded-full border-2 border-slate-400 bg-slate-300 shadow flex items-center justify-center">
                    <span className="text-[0.55rem] font-bold text-slate-800">1975</span>
                  </div>
                </div>

                {/* Dialed Pulse Indicator */}
                {dialedDigit !== null && (
                  <span className="mt-2 text-[0.62rem] text-emerald-400/90 font-mono tracking-wider">
                    Sinyal Pulsa: Angka {dialedDigit}
                  </span>
                )}

                {/* Receiver Transcript / Voice Message */}
                {isReceiverLifted && phoneMessage && (
                  <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-200 leading-relaxed font-sans sm:font-mono animate-fadeIn">
                    <span className="font-bold text-emerald-300 block mb-1">
                      SUARA DI BALIK GAGANG TELEPON:
                    </span>
                    <p>&quot;{phoneMessage}&quot;</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= MODAL PENJELASAN SAINS BARANG RETRO ================= */}
        {selectedKnowledge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-lg rounded-2xl border-2 border-amber-400/40 bg-slate-950 p-6 shadow-2xl text-slate-100 font-sans">
              <button
                onClick={() => setSelectedKnowledge(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 hover:text-white transition"
              >
                <XIcon className="h-4 w-4" />
              </button>

              <span className="text-[0.62rem] uppercase font-bold tracking-widest text-amber-300">
                ARSIP PENGETAHUAN & SAINS • {selectedKnowledge.year}
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-1">
                {selectedKnowledge.name}
              </h3>
              <p className="text-xs text-amber-200/80 font-medium mt-0.5">
                {selectedKnowledge.headline}
              </p>

              <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                <span className="text-[0.65rem] font-bold text-white/50 tracking-wider uppercase">
                  FAKTA REKAYASA & SEJARAH:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedKnowledge.facts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-amber-100 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-1">
                  PRINSIP FISIKA DAN KIMIAWI:
                </span>
                <p>{selectedKnowledge.scientificPrinciple}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition"
          >
            <span>← Kembali ke Beranda</span>
          </Link>
          <span>Ruang Nostalgia, Your Dream</span>
        </div>
      </div>
    </div>
  );
}
