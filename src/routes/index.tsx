/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

// Imágenes florales — importadas desde src/imagenes
import floresPortadaArribaIzquierda from "../imagenes/floresPortadaArribaIzquierda.png";
import floresportadaAlaDerecha from "../imagenes/floresportadaAlaDerecha.png";
import petalosAbajoizquierdaPortada from "../imagenes/petalosAbajoizquierdaPortada.webp";
import abajoDerechaDetallesFIestas from "../imagenes/abajoDerechaDetallesFIestas.png";
import floresAbajoIzquierdaDetalleFiesta from "../imagenes/floresAbajoIzquierdaDetalleFiesta.png";
import florcitaChiquitaDivision from "../imagenes/florcitaChiquitaDivision.png";
import divisionbarFlorDetallesFiesta from "../imagenes/divisionbarFlorDetallesFiesta.png";
import detallesFiestaArribaFlor from "../imagenes/detallesFiestaArribaFlor.png";
import audioInvitacion from "../imagenes/audio.mp3";
// ============================================================
// EDITAR AQUÍ los datos de la invitación
// ============================================================
const INVITATION_CONFIG = {
  nombre: "Matilda",
  fechaISO: "2026-09-19T20:30:00-03:00",
  fechaTexto: { dia: "SÁBADO", numero: "19", mes: "SEPTIEMBRE", anio: "2026" },
  lugar: "Espacio Muñiz",
  horaTexto: "20:30 hs",
  fechaLarga: "19 de septiembre de 2026",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Espacio+Mu%C3%B1iz",
  whatsappUrl:
    "https://wa.me/5493584356577?text=Hola%20Matilda%2C%20confirmo%20mi%20asistencia%20a%20tus%20XV",
  confirmarHasta: "fecha a definir",
  alias: "alias a definir",
  musicaUrl: audioInvitacion,
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
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Great+Vibes&display=swap",
      },
    ],
  }),
  component: Invitacion,
});

// ---------- Hooks / helpers ----------
const ConfirmationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [hasFamily, setHasFamily] = useState(false);
  const [companionCount, setCompanionCount] = useState(1);
  const [companions, setCompanions] = useState([{ nombre: "", apellido: "" }]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSubmitted(false);
        setHasFamily(false);
        setCompanionCount(1);
        setCompanions([{ nombre: "", apellido: "" }]);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    setCompanionCount(count);
    
    setCompanions(prev => {
      const newArr = [...prev];
      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) {
          newArr.push({ nombre: "", apellido: "" });
        }
      } else {
        newArr.splice(count);
      }
      return newArr;
    });
  };

  const handleCompanionChange = (index: number, field: "nombre" | "apellido", value: string) => {
    const newCompanions = [...companions];
    newCompanions[index][field] = value;
    setCompanions(newCompanions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const actionUrl = form.action;

    // 1. RECOLECTAR DATOS USANDO LOS MISMOS 'ENTRY' QUE TIENES EN TUS INPUTS
    const mainNombre = form.querySelector<HTMLInputElement>('input[name="entry.1234365743"]')?.value || "";
    const mainApellido = form.querySelector<HTMLInputElement>('input[name="entry.389381319"]')?.value || "";
    const mainEmail = form.querySelector<HTMLInputElement>('input[name="entry.811209631"]')?.value || "";
    const mainTelefono = form.querySelector<HTMLInputElement>('input[name="entry.1460209317"]')?.value || "";

    try {
      const formDataTitular = new FormData();
      // 2. ENVIAR LOS DATOS USANDO LOS MISMOS 'ENTRY'
      formDataTitular.append("entry.1234365743", mainNombre);
      formDataTitular.append("entry.389381319", mainApellido);
      formDataTitular.append("entry.811209631", mainEmail);
      formDataTitular.append("entry.1460209317", mainTelefono);

      await fetch(actionUrl, { method: 'POST', body: formDataTitular, mode: 'no-cors' });
      
      if (hasFamily) {
        for (const companion of companions) {
          if (companion.nombre.trim() !== "" || companion.apellido.trim() !== "") {
            const formDataCompanion = new FormData();
            // 3. ACTUALIZAR TAMBIÉN LOS ENTRY DE LOS ACOMPAÑANTES
            formDataCompanion.append("entry.1234365743", companion.nombre);
            formDataCompanion.append("entry.389381319", companion.apellido);
            formDataCompanion.append("entry.811209631", `Acompañante de ${mainNombre} ${mainApellido}`);
            formDataCompanion.append("entry.1460209317", mainTelefono); 
            
            await fetch(actionUrl, { method: 'POST', body: formDataCompanion, mode: 'no-cors' });
          }
        }
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        onClose();
      }, 3500);

    } catch (error) {
      console.error("Error al enviar el formulario", error);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative border-2 border-[#9bd3e6]/50 shadow-[0_0_30px_rgba(155,211,230,0.3)] max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-black/40 hover:text-[#7fa9c2] transition-colors text-3xl">✕</button>
        
        {isSubmitted ? (
          <div className="text-center py-6 transition-opacity duration-500">
            <div className="w-16 h-16 bg-[#9bd3e6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#7fa9c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-4xl font-serif text-[#7fa9c2] mb-2">¡Gracias!</h3>
            <p className="text-xl text-[#354656]/70 font-sans">Gracias por confirmar tu asistencia.</p>
          </div>
        ) : (
          <>
            <h3 className="text-4xl font-serif text-[#7fa9c2] mb-2 text-center">Asistiré</h3>
            <p className="text-xs text-center text-[#354656]/60 mb-6 uppercase tracking-[0.2em] font-sans">Por favor completa tus datos</p>
            
            <form 
              action="https://docs.google.com/forms/d/e/1FAIpQLSfbiauThHezmxqGXY8vuzB7F_x4BknNtkgd6-ifbbGBGCvI6A/formResponse"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input name="entry.1234365743" type="text" placeholder="Tu Nombre" required className="w-full p-4 text-sm font-sans bg-[#f8fbfe] border border-[#9bd3e6]/30 rounded-xl focus:outline-none focus:border-[#7fa9c2] text-[#354656]" />
              <input name="entry.389381319" type="text" placeholder="Tu Apellido" required className="w-full p-4 text-sm font-sans bg-[#f8fbfe] border border-[#9bd3e6]/30 rounded-xl focus:outline-none focus:border-[#7fa9c2] text-[#354656]" />
              <input name="entry.811209631" type="email" placeholder="Tu Email" required className="w-full p-4 text-sm font-sans bg-[#f8fbfe] border border-[#9bd3e6]/30 rounded-xl focus:outline-none focus:border-[#7fa9c2] text-[#354656]" />
              <input name="entry.1460209317" type="tel" placeholder="Tu Teléfono" required className="w-full p-4 text-sm font-sans bg-[#f8fbfe] border border-[#9bd3e6]/30 rounded-xl focus:outline-none focus:border-[#7fa9c2] text-[#354656]" />

              <div className="flex items-center gap-4 py-2 border-t border-[#9bd3e6]/20 mt-6 pt-6">
                <input 
                  type="checkbox" 
                  id="hasFamily"
                  checked={hasFamily}
                  onChange={(e) => setHasFamily(e.target.checked)}
                  className="w-6 h-6 accent-[#7fa9c2] rounded cursor-pointer shrink-0"
                />
                <label htmlFor="hasFamily" className="text-[#354656] font-sans text-sm cursor-pointer select-none">
                  Asistiré con grupo familiar
                </label>
              </div>

              {hasFamily && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 p-5 bg-[#9bd3e6]/10 border border-[#9bd3e6]/30 rounded-xl mt-4">
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#7fa9c2] uppercase tracking-[0.2em] font-sans">¿Cuántos son?</span>
                    <select 
                      value={companionCount} 
                      onChange={handleCountChange}
                      className="p-2 px-4 text-sm font-bold bg-white border border-[#9bd3e6]/50 rounded-xl focus:outline-none focus:border-[#7fa9c2] text-[#354656] shadow-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-[#9bd3e6]/20">
                    {companions.map((companion, index) => (
                      <div key={index} className="flex gap-3">
                        <input 
                          type="text"
                          placeholder={`Nombre ${index + 1}`}
                          required={hasFamily}
                          value={companion.nombre}
                          onChange={(e) => handleCompanionChange(index, "nombre", e.target.value)}
                          className="w-1/2 p-3 text-sm font-sans bg-white border border-[#9bd3e6]/40 rounded-xl focus:outline-none focus:border-[#7fa9c2] focus:ring-1 focus:ring-[#9bd3e6] text-[#354656] placeholder:text-[#354656]/40 shadow-sm"
                        />
                        <input 
                          type="text"
                          placeholder={`Apellido ${index + 1}`}
                          required={hasFamily}
                          value={companion.apellido}
                          onChange={(e) => handleCompanionChange(index, "apellido", e.target.value)}
                          className="w-1/2 p-3 text-sm font-sans bg-white border border-[#9bd3e6]/40 rounded-xl focus:outline-none focus:border-[#7fa9c2] focus:ring-1 focus:ring-[#9bd3e6] text-[#354656] placeholder:text-[#354656]/40 shadow-sm"
                        />
                      </div>
                    ))}
                  </div>

                </div>
              )}
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 mt-6 text-xs rounded-full font-sans font-semibold uppercase tracking-[0.2em] transition-all shadow-md text-white ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#9bd3e6] hover:bg-[#82c5dd] active:scale-95 hover:shadow-lg"
                }`}
              >
                {isSubmitting ? "Enviando..." : "Confirmar"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
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

// ============================================================
// Assets florales
// ============================================================
const FLORES = {
  portadaArribaIzquierda: floresPortadaArribaIzquierda,
  portadaArribaDerecha: floresportadaAlaDerecha,
  portadaPetalos: petalosAbajoizquierdaPortada,
  ramoGrande: abajoDerechaDetallesFIestas,
  detallesAbajoIzquierda: floresAbajoIzquierdaDetalleFiesta,
  florcitaDivisionPortada: florcitaChiquitaDivision,
  ramitoDetallesArriba: divisionbarFlorDetallesFiesta,
detallesFiestaArribaFlor: detallesFiestaArribaFlor,
};

function FloralImage({
  src,
  alt = "",
  className = "",
  flip = false,
  rotate = 0,
}: {
  src: string;
  alt?: string;
  className?: string;
  flip?: boolean;
  rotate?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`pointer-events-none select-none object-contain ${className}`}
      style={{
        transform: `${flip ? "scaleX(-1) " : ""}${rotate ? `rotate(${rotate}deg)` : ""}`,
      }}
      draggable={false}
      aria-hidden={alt === ""}
    />
  );
}

function FloralDivider({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`mx-auto flex w-full items-center justify-center ${compact ? "my-4" : "my-7"} gap-3`}
    >
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#354656]/20" />
      <FloralImage
        src={FLORES.florcitaDivisionPortada}
        className={compact ? "h-6 w-6" : "h-7 w-7"}
      />
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#354656]/20" />
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


function MusicPlayer() {
  const { musicaUrl, musicaTitulo } = INVITATION_CONFIG;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setHasInteracted(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsFloating(window.scrollY > 180);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const pauseAudio = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.pause();
      setIsPlaying(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAudio();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", pauseAudio);
    window.addEventListener("beforeunload", pauseAudio);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", pauseAudio);
      window.removeEventListener("beforeunload", pauseAudio);
      pauseAudio();
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
        setHasInteracted(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={
        isFloating && hasInteracted
          ? "fixed right-4 top-4 z-50 transition-all duration-500"
          : "absolute bottom-12 left-1/2 z-50 -translate-x-1/2 transition-all duration-500"
      }
    >
      <audio ref={audioRef} src={musicaUrl} preload="auto" loop />

      <button
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        title={musicaTitulo}
        onClick={toggleMusic}
        className={`music-button grid place-items-center rounded-full bg-[#9bd3e6] text-white shadow-[0_8px_22px_-10px_rgba(130,164,235,0.7)] transition hover:scale-105 hover:bg-[#82c5dd] ${
          isFloating && hasInteracted ? "h-10 w-10" : "h-12 w-12"
        } ${isPlaying ? "music-button--playing" : ""}`}
        type="button"
      >
        {isPlaying ? (
          <span className="music-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className={`${isFloating && hasInteracted ? "h-4 w-4" : "h-5 w-5"} ml-0.5 fill-white`}
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function Portada() {
  const { fechaTexto, nombre } = INVITATION_CONFIG;

  return (
    <section className="relative mx-auto w-full max-w-md min-h-[100svh] overflow-hidden px-4 sm:px-6">
      {/* Arriba izquierda */}
      <FloralImage
        src={FLORES.portadaArribaIzquierda}
        className="absolute top-0 left-0 w-[13rem] sm:w-60 -translate-x-8 sm:-translate-x-5 -translate-y-2 sm:translate-y-0 opacity-95"
      />

      {/* Arriba derecha */}
      <FloralImage
        src={FLORES.portadaArribaDerecha}
        className="absolute top-0 right-0 w-[12rem] sm:w-72 translate-x-20 sm:translate-x-28 -translate-y-2 sm:-translate-y-1 opacity-95"
        rotate={180}
      />

      {/* Pétalos abajo izquierda */}
      <FloralImage
        src={FLORES.portadaPetalos}
        className="absolute bottom-24 sm:bottom-16 left-0 w-40 sm:w-64 -translate-x-8 sm:-translate-x-5 opacity-90"
      />

      {/* Abajo derecha */}
      <FloralImage
        src={FLORES.portadaArribaDerecha}
        className="absolute bottom-0 right-0 w-44 sm:w-64 translate-x-14 sm:translate-x-16 translate-y-6 sm:translate-y-8 opacity-95"
      />

      <div className="relative min-h-[100svh]">
        <div className="absolute left-1/2 top-1/2 flex w-full max-w-[285px] sm:max-w-[320px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
          <div
            className="h-px w-12 sm:w-16 bg-[#c5a659]/30 opacity-0"
            style={{ animation: "fade-up 1s ease-out 0.05s forwards" }}
          />

          <p
            className="mt-1 font-serif text-[3.7rem] sm:text-[5rem] leading-none tracking-[0.05em] text-[#c5a659] opacity-0"
            style={{ animation: "fade-up 1s ease-out 0.1s forwards" }}
          >
            XV
          </p>

          <h1
            className="mt-2 sm:mt-3 w-full text-center font-script text-[4.8rem] sm:text-[6.5rem] leading-[0.9] text-[#354656] opacity-0"
            style={{ animation: "fade-up 1.2s ease-out 0.45s forwards" }}
          >
            {nombre}
          </h1>

          <div
            className="mt-5 sm:mt-6 w-full opacity-0"
            style={{ animation: "fade-up 1s ease-out 0.9s forwards" }}
          >
            <div className="mx-auto flex w-full max-w-[235px] sm:max-w-[290px] items-center justify-center gap-3 sm:gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#354656]/20" />
              <FloralImage
                src={FLORES.florcitaDivisionPortada}
                className="h-7 w-7 sm:h-9 sm:w-9"
              />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#354656]/20" />
            </div>
          </div>

          <div
            className="mt-5 sm:mt-6 w-full opacity-0"
            style={{ animation: "fade-up 1s ease-out 1.2s forwards" }}
          >
            <div className="fecha-portada-row mx-auto grid w-full max-w-[280px] sm:max-w-[315px] grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_82px_minmax(0,1fr)] items-center">
              <span className="justify-self-end pr-3 sm:pr-5 font-sans text-[9px] sm:text-[11px] tracking-[0.25em] text-[#354656]/70">
                {fechaTexto.dia}
              </span>

              <span className="numero-19 justify-self-center self-center">
                {fechaTexto.numero}
              </span>

              <span className="justify-self-start pl-3 sm:pl-5 font-sans text-[9px] sm:text-[11px] tracking-[0.25em] text-[#354656]/70">
                {fechaTexto.mes}
              </span>
            </div>

            <p className="mt-2 sm:mt-4 font-sans text-[10px] sm:text-[11px] tracking-[0.35em] text-[#354656]/60">
              {fechaTexto.anio}
            </p>

            <div className="mx-auto mt-3 sm:mt-4 h-px w-12 sm:w-14 bg-[#c5a659]/40" />
          </div>
        </div>

        <MusicPlayer />
      </div>
    </section>
  );
}

function FraseEmotiva() {
  return (
    <Section>
      <div className="relative rounded-[28px] border border-[#82a4eb]/30 bg-white/55 px-6 py-9 text-center shadow-[0_14px_45px_-22px_rgba(130,164,235,0.3)] backdrop-blur-sm before:absolute before:inset-[5px] before:rounded-[22px] before:border before:border-[#c5a659]/25 before:content-['']">
        <p className="font-serif text-lg italic leading-relaxed text-[#354656]/90">
          "Tu presencia hará esta noche aún más especial, te espero para vivir
          juntos una noche inolvidable."
        </p>
      </div>
    </Section>
  );
}

function CountCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-[#82a4eb]/30 bg-white/65 px-2 py-4 shadow-[0_6px_20px_-12px_rgba(130,164,235,0.3)] backdrop-blur-sm">
      <span className="font-serif text-3xl font-light tabular-nums text-[#354656]">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-[#354656]/60">
        {label}
      </span>
    </div>
  );
}

function Countdown() {
  const { d, h, m, s } = useCountdown(INVITATION_CONFIG.fechaISO);

  return (
    <Section>
      <p className="mb-6 text-center font-sans text-xs uppercase tracking-[0.4em] text-[#354656]/60">
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
    <Section className="px-3 py-12">
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-[#eef8fc] px-4 pb-16 pt-12 text-center shadow-[0_18px_55px_-32px_rgba(130,164,235,0.45)]">
        {/* Flores inferiores más chicas */}
<FloralImage
  src={FLORES.ramoGrande}
  className="pointer-events-none absolute -left-1 bottom-1 z-20 w-24 sm:w-28 opacity-95"
/>

<FloralImage
  src={FLORES.portadaArribaIzquierda}
  className="pointer-events-none absolute -right-8 bottom-0 z-20 w-32 sm:w-36 opacity-95"
/>
<div className="relative mx-auto mt-10 max-w-[335px] overflow-visible">
  {/* Arreglo floral superior: más chico, más horizontal y por arriba de la tarjeta */}
  <FloralImage
    src={FLORES.detallesFiestaArribaFlor}
    rotate={0}
    className="pointer-events-none absolute left-1/2 top-0 z-30 w-[240px] sm:w-[265px] -translate-x-1/2 -translate-y-[55%] opacity-95"
  />

  <div className="relative z-10 border border-[#e9eef1] bg-white/75 px-6 pb-24 pt-16 shadow-[0_10px_35px_-28px_rgba(53,70,86,0.35)] backdrop-blur-sm">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-[#7fa9c2]">
              Detalles de la Fiesta
            </p>

            {/* FLOR DEL MEDIO CORREGIDA */}
            <div className="mx-auto mt-4 flex w-full max-w-[230px] items-center justify-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#9bd3e6]/45" />
              <FloralImage
                src={FLORES.ramitoDetallesArriba}
                className="w-14 sm:w-16"
              />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#9bd3e6]/45" />
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <span className="block font-sans text-[10px] uppercase tracking-[0.35em] text-[#354656]/40">
                  Fecha
                </span>
                <span className="mt-2 block font-serif text-lg leading-none text-[#354656]">
                  {fechaLarga}
                </span>
              </div>

              <div className="mx-auto h-px w-10 bg-[#c5a659]/45" />

              <div>
                <span className="block font-sans text-[10px] uppercase tracking-[0.35em] text-[#354656]/40">
                  Horario
                </span>
                <span className="mt-2 block font-serif text-lg leading-none text-[#354656]">
                  {horaTexto}
                </span>
              </div>

              <div className="mx-auto h-px w-10 bg-[#c5a659]/45" />

              <div>
                <span className="block font-sans text-[10px] uppercase tracking-[0.35em] text-[#354656]/40">
                  Lugar
                </span>
                <span className="mt-2 block font-serif text-lg leading-none text-[#354656]">
                  {lugar}
                </span>
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-block rounded-full bg-[#9bd3e6] px-10 py-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_24px_-14px_rgba(53,70,86,0.45)] transition hover:bg-[#82c5dd] hover:shadow-md"
            >
              Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Confirmacion({ onOpenModal }: { onOpenModal: () => void }) {
  const { confirmarHasta } = INVITATION_CONFIG;

  return (
    <Section>
      <div className="relative overflow-hidden rounded-[28px] border border-[#d7edf5] bg-gradient-to-b from-white via-white to-[#eef8fc] px-6 py-10 text-center shadow-[0_16px_45px_-28px_rgba(130,164,235,0.45)]">
        <span className="pointer-events-none absolute inset-[6px] rounded-[22px] border border-[#c5a659]/20" />

        <div className="relative">
          <FloralImage
            src={FLORES.florcitaDivisionPortada}
            className="mx-auto mb-4 h-8 w-8 opacity-90"
          />

          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-[#7fa9c2]">
            Haz click para confirmar
          </p>

          {/* Botón modificado para abrir el Modal en lugar de WhatsApp */}
          <button
            onClick={onOpenModal}
            className="mt-7 inline-flex items-center justify-center rounded-full bg-[#9bd3e6] px-10 py-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_24px_-14px_rgba(53,70,86,0.45)] transition hover:bg-[#82c5dd] hover:shadow-md cursor-pointer"
          >
            Confirmar asistencia
          </button>

          <div className="mx-auto mt-7 h-px w-12 bg-[#c5a659]/45" />

          <p className="mt-5 font-sans text-[10px] uppercase tracking-[0.28em] text-[#354656]/45">
            Confirmar hasta 
          </p>

          <p className="mt-2 font-serif text-lg text-[#354656]">
            5 de Septiembre
          </p>
        </div>
      </div>
    </Section>
  );
}
function Cierre() {
  const { nombre } = INVITATION_CONFIG;

  return (
    <section className="relative mx-auto w-full max-w-md overflow-hidden px-6 pb-20 pt-10 text-center">
      <FloralImage
        src={FLORES.detallesAbajoIzquierda}
        className="pointer-events-none absolute -left-4 bottom-0 h-28 w-28 opacity-80"
      />
      <FloralImage
        src={FLORES.portadaArribaDerecha}
        className="pointer-events-none absolute -right-4 -top-2 h-24 w-24 opacity-70"
      />

      <div className="relative">
        <FloralDivider />
        <p className="mt-2 font-serif text-lg italic text-[#354656]/90">
          Gracias por acompañarme en esta noche tan especial.
        </p>
        <p className="mt-6 font-script text-6xl text-[#354656]">{nombre}</p>
        <div className="mx-auto mt-6 h-px w-16 bg-[#82a4eb]/40" />
        <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.4em] text-[#354656]/40">
          19 · 09 · 2026
        </p>
      </div>
    </section>
  );
}

function Invitacion() {
  // 1. ESTO FALTABA: Declarar el estado que controla si el modal está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fafcfd] via-white to-[#f0f4fa] text-[#354656]">
      <style>{`
        .font-script {
          font-family: "Great Vibes", "Times New Roman", cursive;
        }

        .font-serif {
          font-family: "Cormorant Garamond", "Playfair Display", serif;
        }
        /* AJUSTE DEL NÚMERO 19 */
        .fecha-portada-row {
          min-height: 62px;
        }

        .numero-19 {
          display: block;
          font-family: "Playfair Display", serif;
          font-style: normal;
          font-weight: 400;
          font-size: 3.6rem;
          line-height: 0.82;
          color: #354656;
          transform: translateY(-1px);
        }

        @media (min-width: 640px) {
          .fecha-portada-row {
            min-height: 78px;
          }

          .numero-19 {
            font-size: 4.6rem;
          }
        }

        .sparkle {
          animation: twinkle 3.6s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.9s ease-out, transform 0.9s ease-out;
        }

        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        .float-soft {
          animation: float-soft 5s ease-in-out infinite;
        }

        @keyframes float-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }


        .music-button {
          position: relative;
          overflow: visible;
        }

        .music-button::before {
          content: "";
          position: absolute;
          inset: -7px;
          border-radius: 9999px;
          border: 1px solid rgba(155, 211, 230, 0.55);
          opacity: 0;
          transform: scale(0.85);
          pointer-events: none;
        }

        .music-button--playing {
          animation: music-float 2.2s ease-in-out infinite;
        }

        .music-button--playing::before {
          animation: music-pulse 1.5s ease-out infinite;
        }

        .music-bars {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          height: 20px;
          width: 22px;
        }

        .music-bars span {
          display: block;
          width: 3px;
          height: 8px;
          border-radius: 9999px;
          background: currentColor;
          transform-origin: center bottom;
          animation: music-bars 0.8s ease-in-out infinite;
        }

        .music-bars span:nth-child(2) {
          animation-delay: 0.12s;
        }

        .music-bars span:nth-child(3) {
          animation-delay: 0.24s;
        }

        @keyframes music-pulse {
          0% { opacity: 0.65; transform: scale(0.85); }
          100% { opacity: 0; transform: scale(1.45); }
        }

        @keyframes music-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes music-bars {
          0%, 100% { height: 7px; }
          50% { height: 18px; }
        }
      `}</style>

      {/* 2. ESTO FALTABA: Agregar el componente del Modal para que exista en la página */}
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#82a4eb]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-[#c5a659]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#82a4eb]/10 blur-3xl"
        aria-hidden
      />

      <Portada />
      <FloralDivider />
      <FraseEmotiva />
      <Countdown />
      <InfoEvento />
      
      {/* Pasamos la función para abrir el modal */}
      <Confirmacion onOpenModal={() => setIsModalOpen(true)} />
      
      <Cierre />
    </main>
  );
}