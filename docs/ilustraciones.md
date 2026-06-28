# Ilustraciones SVG

Carpeta: `src/assets/illustrations/`

Todas las ilustraciones son archivos SVG estáticos, dibujados con paths SVG sin librerías externas. Se importan como URLs de imagen mediante Vite y se usan con `<img>` o `Box component="img"`.

---

## Cómo importar

```jsx
import cuteEarth from '../../assets/illustrations/cute-earth.svg'
import atomImg   from '../../assets/illustrations/atom.svg'

// Uso como imagen
<img src={cuteEarth} width={180} alt="" aria-hidden="true" />

// Uso con MUI Box (permite sx responsive)
<Box
  component="img"
  src={cuteEarth}
  alt=""
  aria-hidden="true"
  sx={{ width: { xs: 120, sm: 160, md: 200 } }}
/>
```

> **Accesibilidad:** todas las ilustraciones son puramente decorativas. Siempre usar `alt=""` y `aria-hidden="true"` para que los lectores de pantalla las ignoren.

---

## Catálogo de ilustraciones

### `cute-earth.svg`

**Descripción:** Planeta Tierra estilo kawaii con cara sonriente.

**viewBox:** `0 0 200 200`

**Paleta:**
- Océano: `#5BB8F5`
- Continentes: `#72C85A`
- Contorno/cara: `#1E3A5F`

**Técnica:** `clipPath` para recortar los continentes al círculo. Cara dibujada sobre los continentes.

**Usos actuales:** `JoinPage` (mascota flotante desktop + mobile)

---

### `atom.svg`

**Descripción:** Átomo colorido con 3 anillos orbitales y electrones.

**viewBox:** `0 0 200 200`

**Paleta:**
- Anillo 1: `#4CAF50` (verde)
- Anillo 2: `#E91E63` (rosa)
- Anillo 3: `#2196F3` (azul)
- Núcleo: `#F44336` (rojo)
- Electrones: `#FFC107` (amarillo)

**Usos actuales:** disponible para usar en cualquier página

---

### `dna-helix.svg`

**Descripción:** Hélice de ADN doble con puentes de colores.

**viewBox:** `0 0 120 220`

**Paleta:**
- Hebra 1: `#2196F3`
- Hebra 2: `#E91E63`
- Puentes: verde, naranja, violeta, amarillo, rojo, cyan

**Técnica:** Dos curvas cúbicas Bézier simétricas (`C`) + líneas transversales como puentes de bases nitrogenadas.

**Usos actuales:** disponible

---

### `flask-erlenmeyer.svg`

**Descripción:** Frasco Erlenmeyer (cónico) con líquido amarillo-verde.

**viewBox:** `0 0 110 140`

**Paleta:**
- Líquido: `#C6EF3A`
- Contorno: `#5D4037`
- Fondo: `#FFFDE7`

**Técnica:** `clipPath` para recortar el líquido a la forma del frasco.

**Usos actuales:** disponible

---

### `beaker.svg`

**Descripción:** Vaso de precipitados con pico vertedor y líquido rosa.

**viewBox:** `0 0 110 140`

**Paleta:**
- Líquido: `#E91E63`
- Contorno: `#880E4F`
- Fondo: `#FCE4EC`

**Extras:** líneas de graduación en el lateral.

**Usos actuales:** disponible

---

### `flask-round.svg`

**Descripción:** Balón de destilación (fondo redondo) con líquido verde.

**viewBox:** `0 0 110 145`

**Paleta:**
- Líquido: `#4CAF50`
- Contorno: `#1B5E20`
- Fondo: `#E8F5E9`

**Usos actuales:** disponible

---

## Ilustración pendiente

### `cute-turtle.svg`

**Descripción:** Tortuga marina kawaii, vista desde arriba.

**Estado:** archivo generado pero diseño en revisión. La tortuga tiene caparazón con patrón de escamas (líneas stroke clipeadas al óvalo), 4 aletas en forma de paleta, cabeza con ojo y sonrisa.

**Pendiente:** validar diseño final con la usuaria.

---

## Notas de extensión

Para agregar nuevas ilustraciones:
1. Crear el archivo `.svg` en `src/assets/illustrations/`
2. Usar `viewBox` cuadrado o proporcional
3. Probar que el SVG se recorta bien cuando se usa `border-radius: 50%` (si aplica)
4. Documentar aquí la paleta y el viewBox
