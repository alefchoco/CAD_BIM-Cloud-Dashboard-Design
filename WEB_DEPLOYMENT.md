# 🌐 Guía de Despliegue Web - CAD/BIM Platform

## 📋 Preparación de Archivos

Todos los archivos están **listos para despliegue web** con optimizaciones incluidas:

### ✅ Archivos Configurados:

1. **`/index.html`** - Optimizado con meta tags para SEO, PWA, y móviles
2. **`/src/styles/web-optimizations.css`** - CSS para rendimiento web
3. **`/manifest.json`** - Configuración PWA
4. **`/public/sw.js`** - Service Worker para funcionalidad offline

---

## 🚀 Métodos de Despliegue

### Método 1: Servidor Local (Desarrollo)

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará en: http://localhost:5173
```

### Método 2: Build de Producción

```bash
# Generar build optimizado
npm run build

# Los archivos estarán en /dist
# Sirve con cualquier servidor estático
npm run preview
```

### Método 3: Servidor HTTP Simple

**Opción A - Python:**
```bash
# Build primero
npm run build

# Servidor Python 3
cd dist
python -m http.server 8000

# Abrir: http://localhost:8000
```

**Opción B - Node.js (http-server):**
```bash
# Instalar servidor global
npm install -g http-server

# Build y servir
npm run build
cd dist
http-server -p 8000 -c-1

# Abrir: http://localhost:8000
```

**Opción C - Live Server (VSCode):**
1. Instala extensión "Live Server" en VSCode
2. Ejecuta `npm run build`
3. Click derecho en `dist/index.html`
4. Selecciona "Open with Live Server"

---

## ☁️ Despliegue en la Nube

### 🔷 Netlify (Recomendado - Gratuito)

**Opción A - Drag & Drop:**
1. Ejecuta `npm run build`
2. Ve a [netlify.com](https://netlify.com)
3. Arrastra carpeta `/dist` a Netlify Drop
4. ¡Listo! Obtienes URL pública

**Opción B - CLI:**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Sigue las instrucciones
```

**Configuración Netlify (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 🟦 Vercel (Recomendado - Gratuito)

**Opción A - CLI:**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Producción
vercel --prod
```

**Opción B - Git Integration:**
1. Sube código a GitHub
2. Conecta repositorio en [vercel.com](https://vercel.com)
3. Deploy automático en cada push

**Configuración Vercel (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### 🟩 GitHub Pages (Gratuito)

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar a package.json scripts:
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy

# URL: https://tu-usuario.github.io/tu-repo
```

**Configuración adicional:**
1. Ve a Settings → Pages en tu repo
2. Selecciona rama `gh-pages`
3. Guarda

---

### 🟧 Firebase Hosting (Google - Gratuito)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Configuración:
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No

# Build y deploy
npm run build
firebase deploy

# URL: https://tu-proyecto.web.app
```

---

### 🟪 Render (Gratuito)

1. Ve a [render.com](https://render.com)
2. Conecta repositorio Git
3. Configuración:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Click "Create Static Site"

---

## 🔧 Configuración Avanzada

### Optimización de Build

**`vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Elimina console.log en producción
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'motion': ['motion/react'],
          'lucide': ['lucide-react'],
        },
      },
    },
  },
  base: '/', // Cambia a '/tu-repo/' para GitHub Pages
});
```

---

## 📱 Optimizaciones Web Implementadas

### ✅ SEO
- Meta tags completos en `index.html`
- Open Graph tags para redes sociales
- Descripción y keywords
- Título optimizado

### ✅ PWA (Progressive Web App)
- Manifest.json configurado
- Service Worker para offline
- Instalable en móviles y desktop
- Icono de 512x512px

### ✅ Performance
- CSS optimizado para web (`web-optimizations.css`)
- Hardware acceleration para canvas
- Lazy loading de componentes
- Code splitting automático

### ✅ Accesibilidad
- Focus visible para teclado
- Prefers-reduced-motion
- High contrast mode
- Touch targets mínimo 44px

### ✅ Mobile-First
- Responsive design
- Prevent zoom en inputs
- Safe area para notch
- Touch-friendly controls

---

## 🔍 Testing Local

### Test en Diferentes Dispositivos:

**1. Chrome DevTools:**
- F12 → Toggle Device Toolbar (Ctrl+Shift+M)
- Prueba iPhone, iPad, Android

**2. Ngrok (Testing público):**
```bash
# Instalar ngrok
npm install -g ngrok

# Iniciar app
npm run dev

# En otra terminal
ngrok http 5173

# Comparte URL pública temporal
```

**3. LocalTunnel:**
```bash
# Instalar
npm install -g localtunnel

# Iniciar app
npm run dev

# Exponer
lt --port 5173

# URL pública temporal
```

---

## 📊 Analytics y Monitoreo

### Google Analytics

**`index.html`:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-focused)
```html
<script defer data-domain="tu-dominio.com" src="https://plausible.io/js/script.js"></script>
```

---

## 🛡️ Seguridad

### Headers de Seguridad (`_headers` para Netlify):
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Content Security Policy:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

---

## 🌍 Dominio Personalizado

### Netlify:
1. Domain Settings → Add custom domain
2. Configura DNS en tu registrador:
   ```
   Type: CNAME
   Name: www
   Value: tu-sitio.netlify.app
   ```
3. SSL automático incluido

### Vercel:
1. Project Settings → Domains
2. Agrega dominio
3. Configura DNS según instrucciones
4. SSL automático

### GitHub Pages:
1. Crea archivo `CNAME` en `/public`:
   ```
   tu-dominio.com
   ```
2. Configura DNS:
   ```
   Type: A
   Value: 185.199.108.153
   ```

---

## 📈 Checklist Pre-Deploy

- [ ] `npm run build` sin errores
- [ ] Probado en Chrome, Firefox, Safari
- [ ] Probado en móvil (iOS y Android)
- [ ] PWA instalable correctamente
- [ ] Service Worker funcionando
- [ ] Todas las rutas responden correctamente
- [ ] Canvas 2D/3D funciona
- [ ] Comandos AutoCAD funcionan (Ctrl)
- [ ] Capas, snap, zoom funcionan
- [ ] Archivos se pueden cargar
- [ ] Screenshot funciona
- [ ] Meta tags configurados
- [ ] Favicon y logo presentes
- [ ] Manifest.json correcto

---

## 🆘 Troubleshooting

### Error: "Cannot GET /"
**Solución:** Configura rewrite rules (ver sección de cada plataforma)

### Blank page en producción
**Solución:** Verifica `base` en `vite.config.ts`
```typescript
base: '/' // o '/tu-repo/' para GitHub Pages
```

### CSS no se aplica
**Solución:** Verifica que `/src/styles/index.css` importe todos los CSS:
```css
@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
@import './web-optimizations.css';
```

### Canvas no renderiza
**Solución:** Agrega a CSP (Content Security Policy):
```
script-src 'self' 'unsafe-inline' 'unsafe-eval';
```

### PWA no instala
**Solución:** Verifica:
- HTTPS (obligatorio, excepto localhost)
- manifest.json accesible
- Service Worker registrado
- Iconos de 192x192 y 512x512

---

## 🎯 URLs Útiles

- **Vite Docs:** https://vitejs.dev
- **Netlify:** https://netlify.com
- **Vercel:** https://vercel.com
- **Firebase:** https://firebase.google.com
- **GitHub Pages:** https://pages.github.com
- **PWA Checklist:** https://web.dev/pwa-checklist
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse

---

## 📞 Soporte

**Documentación:**
- [README.md](README.md) - Características principales
- [COMMANDS_GUIDE.md](COMMANDS_GUIDE.md) - Guía de comandos
- [INSTALL.md](INSTALL.md) - Instalación desktop
- [START_WEB_APP.md](START_WEB_APP.md) - Inicio local

**Testing:**
```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://tu-sitio.com --view

# Bundle analyzer
npm install --save-dev rollup-plugin-visualizer
```

---

## ✨ Características Web Optimizadas

- ✅ SEO completo
- ✅ PWA instalable
- ✅ Offline first
- ✅ Responsive design
- ✅ Touch optimized
- ✅ Hardware accelerated
- ✅ Lazy loading
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minificación automática

**¡Tu aplicación CAD/BIM está lista para el mundo! 🚀**
