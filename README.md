# The Society · Lecture Portal

Portal del curso: 27 módulos, 44 lecciones (YouTube + Loom), barra de progreso, marcar como visto,
lecciones guardadas, notas por lección, módulo TTP en dorado y página de instalación de los indicadores.

Es una web **estática** (HTML + CSS + JS, sin build). Se puede subir tal cual a Netlify, Vercel,
GitHub Pages, Cloudflare Pages o a cualquier hosting.

## Estructura

```
index.html                 página
css/styles.css             estilos (tema oscuro/claro)
js/data.js                 ⭐ CURRÍCULUM: módulos, lecciones y links → edita aquí
js/indicators.js           código de los indicadores (lo usan Copiar / Descargar)
js/thumbs.js               miniaturas de Loom
js/app.js                  lógica (progreso, guardados, notas, navegación)
indicators/*.pine          los 2 indicadores en Pine Script v6
```

## Editar lecciones

Abre `js/data.js`. Cada lección es:

```js
{ id: "orderblock", title: "Orderblock", url: "https://youtu.be/StQ6Jlbcejk" }
```

- `url` acepta `youtu.be/...`, `youtube.com/watch?v=...`, `youtube.com/playlist?list=...` y `loom.com/share/...`.
- **No cambies el `id`** de una lección existente: el progreso de los alumnos está guardado por `id`.
- Pon la URL de tu web principal en `mainSiteUrl` (arriba del archivo).

## Probar en local

YouTube bloquea los vídeos si abres el `index.html` con doble clic (`file://`), así que levanta un servidor:

```bash
python -m http.server 5173
```

y abre http://localhost:5173

## Publicar (lo más rápido)

Netlify Drop: arrastra la carpeta entera a https://app.netlify.com/drop

## Importante

- El progreso, los guardados y las notas se guardan **en el navegador de cada alumno** (localStorage).
  Si cambian de dispositivo o de navegador no se sincronizan. Para eso hace falta login + base de datos
  (por ejemplo Supabase o Firebase); la web está preparada para añadirlo después.
- El link de la playlist de Psicología del PDF (`list=PLT7Sa1IAajnE`) parece cortado: los IDs de playlist de
  YouTube suelen ser más largos. Si no carga, pega el link completo en `js/data.js`.
- El código de los indicadores se ha reconstruido desde el PDF (al exportar se partían las líneas).
  Pruébalos en el Pine Editor de TradingView antes de publicar.
