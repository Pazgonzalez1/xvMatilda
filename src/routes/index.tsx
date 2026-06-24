import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

// ============================================================
// EDITAR AQUÍ los datos de la invitación
// ============================================================
const INVITATION_CONFIG = {
  nombre: "Matilda",
  // Fecha y hora del evento (formato ISO con zona horaria)
  fechaISO: "2026-09-19T20:30:00-03:00",
  fechaTexto: { dia: "SÁBADO", numero: "19", mes: "SEPTIEMBRE", anio: "2026" },
  lugar: "Espacio Muñiz",
  horaTexto: "20:30 hs",
  fechaLarga: "19 de septiembre de 2026",
  // Link de Google Maps — EDITAR
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Espacio+Mu%C3%B1iz",
  // Link de WhatsApp — EDITAR (formato: https://wa.me/<código país + número>?text=<mensaje>)
  whatsappUrl:
    "https://wa.me/5491100000000?text=Hola%20Matilda%2C%20confirmo%20mi%20asistencia%20a%20tus%20XV",
  // Fecha límite para confirmar — EDITAR
  confirmarHasta: "fecha a definir",
  // Alias para regalo — EDITAR
  alias: "alias a definir",
  // Música de fondo — EDITAR: reemplazar por la URL de tu archivo .mp3
  // (también podés subir un mp3 a /public/music/ y usar "/music/cancion.mp3")
  musicaUrl: "",
  musicaTitulo: "Música de la invitación",
};
// ============================================================

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mis XV — Matilda · 19.09.2026" },
      {
        name: "description",
        content:
          "Invitación digital a los XV de Matilda. Sábado 19 de septiembre de 2026 — Espacio Muñiz.",
      },
      { property: "og:title", content: "Mis XV — Matilda" },
      {
        property: "og:description",
        content: "Acompañame en una noche inolvidable. 19.09.2026 — Espacio Muñiz.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Invitacion,
});

// ---------- Hooks / helpers ----------

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function useCountdown(targetISO: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(targetISO).getTime() - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { d, h, m, s };
}

// ---------- Decorative pieces ----------

function Sparkles({ count = 18 }: { count?: number }) {
  // Deterministic pseudo-random positions
  const dots = Array.from({ length: count }).map((_, i) => {
    const top = (i * 53) % 100;
    const left = (i * 37) % 100;
    const delay = (i % 7) * 0.4;
    const size = 2 + (i % 3);
    return { top, left, delay, size, key: i };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.key}
          className="sparkle absolute rounded-full bg-gold"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}

function WaveDivider() {
  return (
    <svg
      viewBox="0 0 400 40"
      className="my-6 h-6 w-full text-gold/40"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 20 Q 100 0 200 20 T 400 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="200" cy="20" r="1.6" fill="currentColor" />
    </svg>
  );
}

// ---------- Sections ----------

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section
      ref={ref}
      className={`reveal mx-auto w-full max-w-md px-6 py-12 ${className}`}
    >
      {children}
    </section>
  );
}

function Portada() {
  const { fechaTexto, nombre } = INVITATION_CONFIG;
  return (
    <section className="relative mx-auto w-full max-w-md px-6 pt-16 pb-10">
      <Sparkles count={24} />
      <div className="relative text-center">
        <p
          className="font-script text-4xl text-gold opacity-0"
          style={{ animation: "fade-up 1s ease-out 0.1s forwards" }}
        >
          Mis XV
        </p>
        <h1
          className="mt-3 font-script text-[5.5rem] leading-none text-foreground opacity-0 sm:text-[6.5rem]"
          style={{ animation: "fade-up 1.2s ease-out 0.5s forwards" }}
        >
          {nombre}
        </h1>
        <p
          className="mx-auto mt-6 max-w-xs font-serif text-base italic text-foreground/70 opacity-0"
          style={{ animation: "fade-up 1s ease-out 1s forwards" }}
        >
          Quiero compartir una noche única con las personas que más quiero.
        </p>

        <div
          className="mt-10 opacity-0"
          style={{ animation: "fade-up 1s ease-out 1.4s forwards" }}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 font-sans text-sm tracking-[0.3em] text-foreground/80">
            <span className="text-right">{fechaTexto.dia}</span>
            <span className="font-serif text-6xl font-light tracking-normal text-foreground">
              {fechaTexto.numero}
            </span>
            <span className="text-left">{fechaTexto.mes}</span>
          </div>
          <div className="mx-auto mt-2 h-px w-24 bg-gold/40" />
          <p className="mt-2 font-sans text-xs tracking-[0.4em] text-foreground/60">
            {fechaTexto.anio}
          </p>
        </div>
      </div>
    </section>
  );
}

function FraseEmotiva() {
  return (
    <Section>
      <div className="relative rounded-3xl border border-gold/30 bg-white/60 px-6 py-10 text-center shadow-[0_10px_40px_-20px_rgba(168,196,220,0.6)] backdrop-blur-sm">
        <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-gold/40 bg-white/60" />
        <p className="font-serif text-lg italic leading-relaxed text-foreground/80">
          “Tu presencia hará esta noche aún más especial, te espero para vivir
          juntos una noche inolvidable.”
        </p>
        <div className="mx-auto mt-5 h-px w-16 bg-gold/40" />
      </div>
    </Section>
  );
}

function CountCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-sky/30 bg-white/70 px-2 py-4 backdrop-blur-sm">
      <span className="font-serif text-3xl font-light tabular-nums text-foreground">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/60">
        {label}
      </span>
    </div>
  );
}

function Countdown() {
  const { d, h, m, s } = useCountdown(INVITATION_CONFIG.fechaISO);
  return (
    <Section>
      <p className="mb-6 text-center font-sans text-xs uppercase tracking-[0.4em] text-foreground/60">
        Faltan
      </p>
      <div className="grid grid-cols-4 gap-3">
        <CountCard label="Días" value={d} />
        <CountCard label="Horas" value={h} />
        <CountCard label="Min" value={m} />
        <CountCard label="Seg" value={s} />
      </div>
    </Section>
  );
}

function InfoEvento() {
  const { lugar, fechaLarga, horaTexto, mapsUrl } = INVITATION_CONFIG;
  return (
    <Section>
      <div className="rounded-3xl bg-gradient-to-b from-white/80 to-sky-soft/60 px-6 py-10 text-center">
        <svg
          className="float-soft mx-auto h-12 w-12 text-gold"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden
        >
          <path d="M12 52V28l20-14 20 14v24" />
          <path d="M24 52V36h16v16" />
          <path d="M8 52h48" />
          <circle cx="32" cy="22" r="1.5" fill="currentColor" />
        </svg>
        <p className="mt-4 font-sans text-xs uppercase tracking-[0.4em] text-foreground/60">
          Fiesta de XV
        </p>
        <h3 className="mt-3 font-serif text-3xl text-foreground">{lugar}</h3>
        <WaveDivider />
        <p className="font-sans text-sm text-foreground/70">{fechaLarga}</p>
        <p className="mt-1 font-sans text-sm text-foreground/70">{horaTexto}</p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-sky to-gold/80 px-10 py-3 font-sans text-sm tracking-wider text-white shadow-md transition hover:shadow-lg"
        >
          Cómo llegar
        </a>
      </div>
    </Section>
  );
}

function Confirmacion() {
  const { whatsappUrl, confirmarHasta } = INVITATION_CONFIG;
  return (
    <Section>
      <div className="rounded-3xl border border-sky/30 bg-white/70 px-6 py-10 text-center backdrop-blur-sm">
        <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold">
          RSVP
        </p>
        <p className="mt-4 font-serif text-lg italic text-foreground/80">
          Tu presencia es muy importante para mí. Por favor confirmá tu
          asistencia.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground/90 px-8 py-3 font-sans text-sm tracking-wide text-white shadow-md transition hover:bg-foreground"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20 3.5A11 11 0 0 0 3.5 18L2 22l4.2-1.4A11 11 0 1 0 20 3.5Zm-8 18a9 9 0 0 1-4.6-1.3l-.3-.2-2.5.8.8-2.4-.2-.3A9 9 0 1 1 12 21.5Zm5-6.7c-.3-.2-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.8.1.2 2 3.1 4.9 4.3 2.9 1.2 2.9.8 3.4.7.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.2-.6-.3Z" />
          </svg>
          Confirmar por WhatsApp
        </a>
        <p className="mt-6 font-sans text-xs tracking-wide text-foreground/60">
          Confirmar asistencia hasta:{" "}
          <span className="font-medium text-foreground/80">{confirmarHasta}</span>
        </p>
      </div>
    </Section>
  );
}

function Regalo() {
  const { alias } = INVITATION_CONFIG;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(alias);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };
  return (
    <Section>
      <div className="rounded-3xl bg-sky-soft/60 px-6 py-10 text-center">
        <svg
          className="mx-auto h-10 w-10 text-gold"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden
        >
          <path d="M20 12v9H4v-9" />
          <path d="M2 7h20v5H2z" />
          <path d="M12 22V7" />
          <path d="M12 7s-3-5-6-3 3 3 3 3" />
          <path d="M12 7s3-5 6-3-3 3-3 3" />
        </svg>
        <p className="mt-5 font-serif text-base italic leading-relaxed text-foreground/80">
          Mi mejor regalo es tu presencia, pero si deseás hacerme un presente
          podés hacerlo en el siguiente alias:
        </p>
        <div className="mt-6 rounded-2xl border border-gold/40 bg-white/80 px-5 py-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-foreground/60">
            Alias
          </p>
          <p className="mt-1 font-serif text-xl tracking-wide text-foreground">
            {alias}
          </p>
        </div>
        <button
          onClick={copy}
          className="mt-4 rounded-full border border-foreground/20 px-6 py-2 font-sans text-xs tracking-wider text-foreground/80 transition hover:bg-white/60"
        >
          {copied ? "¡Copiado!" : "Copiar alias"}
        </button>
      </div>
    </Section>
  );
}

function MusicPlayer() {
  const { musicaUrl, musicaTitulo } = INVITATION_CONFIG;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        className="group flex items-center gap-2 rounded-full border border-gold/40 bg-white/80 px-4 py-2 shadow-md backdrop-blur-md transition hover:bg-white"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-sky to-gold/70 text-white">
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
        <span className="font-sans text-[11px] tracking-wide text-foreground/70 group-hover:text-foreground">
          {musicaTitulo}
        </span>
      </button>
      {/* EDITAR: reemplazar src por la URL de tu mp3 (o dejar vacío para ocultar reproducción) */}
      <audio ref={audioRef} src={musicaUrl} loop preload="none" />
    </div>
  );
}

function Cierre() {
  const { nombre } = INVITATION_CONFIG;
  return (
    <section className="relative mx-auto w-full max-w-md px-6 pb-20 pt-12 text-center">
      <Sparkles count={14} />
      <div className="relative">
        <WaveDivider />
        <p className="mt-4 font-serif text-lg italic text-foreground/80">
          Gracias por acompañarme en esta noche tan especial.
        </p>
        <p className="mt-6 font-script text-6xl text-gold">{nombre}</p>
        <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />
        <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.4em] text-foreground/40">
          19 · 09 · 2026
        </p>
      </div>
    </section>
  );
}

function Invitacion() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cream via-white to-sky-soft text-foreground">
      {/* Decorative soft blobs */}
      <div
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-sky/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-soft/80 blur-3xl"
        aria-hidden
      />

      <Portada />
      <WaveDivider />
      <FraseEmotiva />
      <Countdown />
      <InfoEvento />
      <Confirmacion />
      <Regalo />
      <Cierre />
      <MusicPlayer />
    </main>
  );
}
