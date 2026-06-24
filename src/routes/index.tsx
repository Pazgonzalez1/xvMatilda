import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  BlueFlowerAccent,
  FloralCorner,
  FloralDivider,
} from "@/components/invitation/Floral";

// ============================================================
// EDITAR AQUÍ los datos de la invitación
// ============================================================
const INVITATION_CONFIG = {
  nombre: "Matilda",
  // Fecha y hora del evento (ISO con zona horaria)
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
  // Música de fondo — EDITAR: pegar URL de un .mp3 (o subir a /public/music/cancion.mp3)
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
  // Avoid SSR hydration mismatch: render zeros until mounted on client.
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);
  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!mounted) return { d: 0, h: 0, m: 0, s: 0 };
  const diff = Math.max(0, new Date(targetISO).getTime() - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { d, h, m, s };
}

// ---------- Decorative pieces ----------

// Muy pocos destellos, opacidad baja
function GoldDots({ count = 6 }: { count?: number }) {
  const dots = Array.from({ length: count }).map((_, i) => {
    const top = (i * 47 + 11) % 90 + 5;
    const left = (i * 31 + 17) % 90 + 5;
    const delay = (i % 5) * 0.6;
    return { top, left, delay, key: i };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.key}
          className="sparkle absolute h-[3px] w-[3px] rounded-full bg-gold"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            opacity: 0.35,
          }}
        />
      ))}
    </div>
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
      className={`reveal mx-auto w-full max-w-md px-6 py-10 ${className}`}
    >
      {children}
    </section>
  );
}

function Portada() {
  const { fechaTexto, nombre } = INVITATION_CONFIG;
  return (
    <section className="relative mx-auto w-full max-w-md px-6 pt-14 pb-8">
      {/* Esquinas florales */}
      <FloralCorner
        className="float-soft pointer-events-none absolute -top-4 -left-6 h-32 w-32 opacity-90"
        style={{ transform: "rotate(-15deg)" }}
      />
      <FloralCorner
        className="sway-soft pointer-events-none absolute top-2 -right-6 h-28 w-28 opacity-80"
        style={{ transform: "rotate(95deg)" }}
      />

      <GoldDots count={5} />

      <div className="relative text-center">
        <p
          className="font-script text-4xl text-gold/90 opacity-0"
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

        {/* Fecha destacada */}
        <div
          className="mt-10 flex flex-col items-center opacity-0"
          style={{ animation: "fade-up 1s ease-out 1.4s forwards" }}
        >
          <span className="font-sans text-[11px] tracking-[0.5em] text-foreground/70">
            {fechaTexto.dia}
          </span>
          <div className="my-2 h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <span className="numero-fecha block">{fechaTexto.numero}</span>
          <div className="my-2 h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <span className="font-sans text-[11px] tracking-[0.5em] text-foreground/70">
            {fechaTexto.mes}
          </span>
          <span className="mt-1 font-sans text-[10px] tracking-[0.45em] text-foreground/50">
            {fechaTexto.anio}
          </span>
        </div>

        <FloralCorner
          className="float-soft mx-auto mt-10 h-20 w-20 opacity-70"
          style={{ transform: "rotate(180deg)" }}
        />
      </div>
    </section>
  );
}

function FraseEmotiva() {
  return (
    <Section>
      <div className="relative rounded-3xl border border-sky/30 bg-white/65 px-7 py-10 text-center backdrop-blur-sm frame-fine">
        <BlueFlowerAccent
          className="absolute -top-6 left-1/2 h-12 w-12 -translate-x-1/2"
          style={{ transform: "translateX(-50%) rotate(-10deg)" }}
        />
        <p className="mt-2 font-serif text-lg italic leading-relaxed text-foreground/80">
          “Tu presencia hará esta noche aún más especial, te espero para vivir
          juntos una noche inolvidable.”
        </p>
        <FloralDivider className="mt-5" />
      </div>
    </Section>
  );
}

function CountCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-sky/25 bg-white/75 px-2 py-4 shadow-[0_10px_30px_-25px_rgba(80,110,150,0.4)] backdrop-blur-sm">
      <span className="font-display text-3xl font-light italic tabular-nums text-foreground/85">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/55">
        {label}
      </span>
    </div>
  );
}

function Countdown() {
  const { d, h, m, s } = useCountdown(INVITATION_CONFIG.fechaISO);
  return (
    <Section>
      <p className="mb-5 text-center font-sans text-[11px] uppercase tracking-[0.5em] text-foreground/55">
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
      <div className="relative rounded-[2rem] border border-sky/30 bg-gradient-to-b from-white/90 to-sky-soft/60 px-7 py-12 text-center shadow-[0_25px_60px_-35px_rgba(80,110,150,0.45)] frame-fine">
        <BlueFlowerAccent
          className="float-soft absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2"
        />
        <FloralCorner
          className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 opacity-70"
          style={{ transform: "rotate(135deg)" }}
        />

        <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.5em] text-gold/80">
          Detalles de la Fiesta
        </p>

        <FloralDivider className="my-5" />

        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-foreground/55">
          Fecha
        </p>
        <p className="mt-1 font-serif text-lg text-foreground/85">{fechaLarga}</p>

        <div className="mx-auto my-5 h-px w-24 bg-gradient-to-r from-transparent via-sky/60 to-transparent" />

        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-foreground/55">
          Horario
        </p>
        <p className="mt-1 font-serif text-lg text-foreground/85">{horaTexto}</p>

        <div className="mx-auto my-5 h-px w-24 bg-gradient-to-r from-transparent via-sky/60 to-transparent" />

        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-foreground/55">
          Lugar
        </p>
        <p className="mt-1 font-serif text-xl text-foreground">{lugar}</p>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full border border-sky/40 bg-gradient-to-b from-white to-sky-soft px-10 py-3 font-sans text-xs tracking-[0.25em] text-foreground/80 shadow-[0_8px_20px_-12px_rgba(80,110,150,0.45)] transition hover:shadow-[0_12px_28px_-12px_rgba(80,110,150,0.55)]"
        >
          CÓMO LLEGAR
        </a>
      </div>
    </Section>
  );
}

function Confirmacion() {
  const { whatsappUrl, confirmarHasta } = INVITATION_CONFIG;
  return (
    <Section>
      <div className="relative rounded-3xl border border-sky/30 bg-white/70 px-7 py-10 text-center backdrop-blur-sm frame-fine">
        <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-gold/80">
          Confirmá tu asistencia
        </p>
        <FloralDivider className="mt-4" />
        <p className="mt-4 font-serif text-base italic leading-relaxed text-foreground/75">
          Tu presencia es muy importante para mí. Por favor confirmá tu asistencia.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-sky/40 bg-gradient-to-b from-white to-sky-soft/80 px-8 py-3 font-sans text-xs tracking-[0.25em] text-foreground/85 shadow-[0_8px_20px_-12px_rgba(80,110,150,0.45)] transition hover:shadow-[0_12px_28px_-12px_rgba(80,110,150,0.55)]"
        >
          <svg className="h-4 w-4 text-foreground/70" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20 3.5A11 11 0 0 0 3.5 18L2 22l4.2-1.4A11 11 0 1 0 20 3.5Zm-8 18a9 9 0 0 1-4.6-1.3l-.3-.2-2.5.8.8-2.4-.2-.3A9 9 0 1 1 12 21.5Zm5-6.7c-.3-.2-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.8.1.2 2 3.1 4.9 4.3 2.9 1.2 2.9.8 3.4.7.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.2-.6-.3Z" />
          </svg>
          CONFIRMAR ASISTENCIA
        </a>
        <p className="mt-5 font-sans text-[11px] tracking-wide text-foreground/55">
          Confirmar asistencia hasta:{" "}
          <span className="font-medium text-foreground/75">{confirmarHasta}</span>
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
      <div className="relative rounded-3xl bg-sky-soft/60 px-7 py-10 text-center frame-fine">
        <BlueFlowerAccent className="float-soft absolute -top-6 -left-4 h-14 w-14 opacity-90" />
        <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-gold/80">
          Un detalle
        </p>
        <FloralDivider className="mt-4" />
        <p className="mt-4 font-serif text-base italic leading-relaxed text-foreground/80">
          Mi mejor regalo es tu presencia, pero si deseás hacerme un presente
          podés hacerlo en el siguiente alias:
        </p>
        <div className="mt-6 rounded-2xl border border-sky/35 bg-white/80 px-5 py-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-foreground/55">
            Alias
          </p>
          <p className="mt-1 font-serif text-xl tracking-wide text-foreground/85">
            {alias}
          </p>
        </div>
        <button
          onClick={copy}
          className="mt-4 rounded-full border border-foreground/15 bg-white/60 px-6 py-2 font-sans text-[11px] tracking-[0.25em] text-foreground/70 transition hover:bg-white"
        >
          {copied ? "¡COPIADO!" : "COPIAR ALIAS"}
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
    if (!a || !musicaUrl) return;
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
        title={musicaUrl ? musicaTitulo : "Agregá un mp3 en INVITATION_CONFIG.musicaUrl"}
        className="group flex items-center gap-2 rounded-full border border-sky/40 bg-white/85 px-3.5 py-2 shadow-[0_10px_25px_-12px_rgba(80,110,150,0.45)] backdrop-blur-md transition hover:bg-white"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-sky-soft to-sky text-foreground/80">
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
        <span className="font-sans text-[10px] tracking-[0.2em] text-foreground/65 group-hover:text-foreground/85">
          {musicaTitulo.toUpperCase()}
        </span>
      </button>
      {/* EDITAR: reemplazar src por la URL de tu mp3 (o dejar vacío) */}
      <audio ref={audioRef} src={musicaUrl} loop preload="none" />
    </div>
  );
}

function Cierre() {
  const { nombre } = INVITATION_CONFIG;
  return (
    <section className="relative mx-auto w-full max-w-md px-6 pb-24 pt-10 text-center">
      <GoldDots count={4} />
      <div className="relative">
        <FloralDivider className="mb-6" />
        <BlueFlowerAccent
          className="float-soft mx-auto h-20 w-20 opacity-90"
          style={{ transform: "rotate(-8deg)" }}
        />
        <p className="mt-4 font-serif text-lg italic text-foreground/80">
          Gracias por acompañarme en esta noche tan especial.
        </p>
        <p className="mt-5 font-script text-6xl text-gold/90">{nombre}</p>
        <FloralDivider className="mt-5" />
        <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.5em] text-foreground/40">
          19 · 09 · 2026
        </p>
      </div>
    </section>
  );
}

function Invitacion() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cream via-white to-sky-soft text-foreground">
      {/* Soft ambient blobs */}
      <div
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-sky/25 blur-3xl"
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
