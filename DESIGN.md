# Design System

## Overview

Globiu utiliza una composición luminosa enmarcada por globos y flores, con una barra de navegación negra que conserva el fondo original del logotipo. La dirección visual combina fotografía de producto de estudio con una interpretación web limpia y editorial.

## Visual Theme

- Estrategia de color: paleta completa con blanco como superficie principal y negro como ancla estructural.
- Escena: escaparate de celebración sobre fondo blanco, con elementos suspendidos y arreglos florales en los bordes.
- Motivo distintivo: el globo negro integrado entre las letras altas de GLOBIU.
- Profundidad: brillos suaves, transparencias, sombras difusas y superposición controlada.

## Color Palette

- `--color-bg`: `oklch(1 0 0)`
- `--color-ink`: `oklch(0.18 0.012 225)`
- `--color-nav`: `oklch(0.06 0 0)`
- `--color-primary`: `oklch(0.73 0.14 220)`
- `--color-primary-dark`: `oklch(0.55 0.11 218)`
- `--color-lilac`: `oklch(0.78 0.09 305)`
- `--color-blush`: `oklch(0.82 0.09 20)`
- `--color-mint`: `oklch(0.87 0.07 150)`
- `--color-gold`: `oklch(0.78 0.11 75)`
- `--color-surface`: `oklch(0.97 0.008 220)`
- `--color-muted`: `oklch(0.48 0.025 225)`

## Typography

- Logotipo y títulos de exhibición: familia condensada de alto contraste basada en `Impact`, `Haettenschweiler` y `Arial Narrow Bold`.
- Interfaz y texto: `Trebuchet MS`, `Segoe UI`, sans-serif.
- Los títulos utilizan escalas fluidas con `clamp()` y el texto de lectura permanece en `1rem` o más.

## Layout

- Contenedor principal máximo de 1200 px.
- Espaciado basado en 4 px con ritmos de 8, 12, 16, 24, 32, 48, 64 y 96 px.
- La portada ocupa la mayor parte del primer viewport y mantiene el logotipo en el centro óptico.
- En móvil, la navegación se convierte en panel desplegable y los elementos decorativos se reposicionan, no solo se reducen.

## Components

- Barra negra fija con logotipo a la izquierda y navegación en secuencia natural.
- Logotipo HTML con globo integrado y subtítulo `BALLOONS & MORE`.
- Botones con borde celeste, estados de foco visibles y respuesta táctil.
- Galería asimétrica con escenas ilustradas de producto.
- Testimonios en una franja de alto contraste.
- Formulario de contacto con validación y confirmación local simulada.

## Motion

- Una entrada orquestada para la portada, globos con movimiento ambiental lento y aparición progresiva de contenidos al entrar al viewport.
- Los grupos de servicios y galería utilizan un escalonado breve; las columnas editoriales entran desde direcciones complementarias.
- Todas las animaciones se desactivan o simplifican con `prefers-reduced-motion`.
