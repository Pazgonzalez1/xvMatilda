
# Invitación digital de XV — Matilda

Página única (one-page) tipo tarjeta vertical optimizada para celular, lista para compartir por link y fácil de editar. Sin padres, sin padrinos, sin galería.

## Paleta y estética

- Blanco cálido `#FBFAF7`, celeste pastel `#DCE9F2`, azul muy suave `#A8C4DC`, beige claro `#F1EBDD`, dorado sutil `#C9A96B`.
- Fondo: degradado suave blanco → celeste pastel, con detalles decorativos sutiles (puntos luminosos, líneas finas, ondas SVG, pequeños destellos animados). Sin flores recargadas ni mariposas grandes.
- Tipografías (cargadas vía `<link>` en `__root.tsx`):
  - Caligráfica para "Mis XV" y "Matilda": **Cormorant Garamond Italic** + **Pinyon Script** para el nombre.
  - Texto: **Inter** (legible y moderna).
- Mucho aire visual, separaciones generosas, bordes redondeados (radius xl), micro-sombras suaves.

## Estructura (single-page, scroll vertical)

1. **Portada**
   - "Mis XV" (script dorado sutil) + "Matilda" en grande caligráfico.
   - Frase: "Quiero compartir una noche única con las personas que más quiero."
   - Fecha destacada: SÁBADO · **19** · SEPTIEMBRE · 2026 (el 19 en grande, fino).
   - Animación de aparición al cargar (fade + slide suave).

2. **Frase emotiva**
   - "Tu presencia hará esta noche aún más especial, te espero para vivir juntos una noche inolvidable."
   - Tarjeta translúcida blanco/celeste, borde dorado fino.

3. **Cuenta regresiva** hasta `2026-09-19T20:30:00-03:00`
   - 4 tarjetas pequeñas: Días / Horas / Minutos / Segundos. Actualización por segundo con `useEffect`.

4. **Información del evento**
   - Ícono minimalista (SVG inline) de salón.
   - "Fiesta de XV" · "Espacio Muñiz" · "19 de septiembre de 2026" · "20:30 hs".
   - Botón "Cómo llegar" → link editable a Google Maps.

5. **Confirmación de asistencia**
   - Texto + botón "Confirmar asistencia por WhatsApp" (link editable `wa.me/...?text=...`).
   - "Confirmar asistencia hasta: fecha a definir" (editable).

6. **Regalo**
   - "Mi mejor regalo es tu presencia, pero si deseás hacerme un presente podés hacerlo en el siguiente alias:"
   - "alias a definir" en tarjeta con botón "Copiar alias".

7. **Música**
   - Reproductor pequeño con play/pausa, texto "Música de la invitación".
   - `<audio>` con `src` editable (mp3) — comentario explicando cómo cambiarlo o reemplazar por embed de YouTube.

8. **Cierre**
   - "Gracias por acompañarme en esta noche tan especial." + "Matilda" en caligráfica.
   - Pequeños destellos animados (CSS keyframes).

## Editabilidad

Todos los datos editables se centralizan en un objeto `INVITATION_CONFIG` al inicio del archivo de la ruta, con comentarios:

```ts
// EDITAR AQUÍ los datos de la invitación
const INVITATION_CONFIG = {
  nombre: "Matilda",
  fecha: "2026-09-19T20:30:00-03:00",
  fechaTexto: { dia: "SÁBADO", numero: "19", mes: "SEPTIEMBRE", anio: "2026" },
  lugar: "Espacio Muñiz",
  horaTexto: "20:30 hs",
  mapsUrl: "https://maps.google.com/?q=Espacio+Muniz", // EDITAR
  whatsappUrl: "https://wa.me/5491100000000?text=Confirmo%20asistencia%20XV%20Matilda", // EDITAR
  confirmarHasta: "fecha a definir", // EDITAR
  alias: "alias a definir", // EDITAR
  musicaUrl: "/music/cancion.mp3", // EDITAR: reemplazar por tu mp3
};
```

## Detalles técnicos

- TanStack Start: toda la invitación en `src/routes/index.tsx` (homepage). Componentes auxiliares (Countdown, MusicPlayer, SectionFade) en `src/components/invitation/`.
- Animaciones: CSS puro + IntersectionObserver para fade-on-scroll (sin libs pesadas).
- Tokens de color añadidos a `src/styles.css` bajo `@theme inline` (`--color-cream`, `--color-sky-soft`, `--color-sky`, `--color-sand`, `--color-gold`) + variables `:root`.
- SEO en `head()` del route: title "Mis XV — Matilda · 19.09.2026", description, og:title/description/type=website, og:url y canonical relativos.
- Mobile-first: max-width ~ 28rem centrado, padding generoso, botones grandes (≥44px), grid responsive seguro (`min-w-0`, `shrink-0`).
- Sin backend. Sin Cloud. Sin dependencias nuevas.

## Archivos a crear/editar

- `src/styles.css` — añadir tokens de color y fuentes.
- `src/routes/__root.tsx` — añadir `<link>` a Google Fonts (Cormorant + Pinyon Script + Inter).
- `src/routes/index.tsx` — reemplazar placeholder por la invitación completa con `INVITATION_CONFIG`.
- `src/components/invitation/Countdown.tsx`
- `src/components/invitation/MusicPlayer.tsx`
- `src/components/invitation/FadeIn.tsx` (wrapper de aparición on-scroll)
- `src/components/invitation/Decor.tsx` (ondas SVG, puntos luminosos)

Resultado: una sola página vertical, ligera, elegante, lista para compartir por link y editar cambiando un objeto de configuración.
