# 🏗️ CAD/BIM Cloud Platform

**Plataforma profesional de gestión de Arquitectura y CAD/BIM** con interfaz moderna, vista 2D/3D, controles VR, y herramientas avanzadas de diseño.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20|%20Mac%20|%20Linux-lightgrey.svg)

---

## 🚀 Inicio Rápido

### 🌐 Para Web (Local o Despliegue)

```bash
# Desarrollo local
npm install
npm run dev
# Abrir: http://localhost:5173

# Build para producción
npm run build
npm run preview
```

**📚 Guías completas:**
- [WEB_DEPLOYMENT.md](WEB_DEPLOYMENT.md) - **Guía completa de despliegue web** (Netlify, Vercel, GitHub Pages, etc.)
- [START_WEB_APP.md](START_WEB_APP.md) - Métodos de inicio local
- [start-simple.html](start-simple.html) - Launcher visual interactivo

### 💻 Para Desktop (Instalador Nativo)

```bash
# Generar instaladores (.exe, .dmg, .AppImage)
npm run electron:build
```

**📦 Ver:** [INSTALL.md](INSTALL.md) - Guía completa de instalación desktop

### 💬 Comandos CAD

**Presiona `Ctrl`** para abrir terminal de comandos AutoCAD

**📖 Ver:** [COMMANDS_GUIDE.md](COMMANDS_GUIDE.md) - **Guía completa de comandos CAD**

---

## ✨ Características Principales

### �� Interfaz Profesional
- Diseño minimalista estilo AutoCAD/Revit
- Sidebar con herramientas CAD completas (Line, Circle, Rectangle, Trim, Text, Dimension, Move)
- Efectos glassmorphism en barras flotantes
- Paleta de colores: `#F5F5F7` (fondo), slate/azul oscuro (acentos)
- Símbolo de norte colapsable para maximizar espacio de trabajo

### 📐 Canvas 2D/3D
- **Vista 2D**: 
  - Grid infinito de coordenadas XY
  - Planos arquitectónicos con zoom y pan ilimitado
  - **Snap magnético** a puntos, líneas y objetos
  - **Comando TRIM** para borrar líneas al tocarlas
- **Vista 3D**: 
  - Isométrica interactiva con rotación y zoom
  - **Extrusión 2D→3D** de objetos
  - Carga de archivos PDF/DWG para elevar en 3D
- **Switch suave** entre vistas con animaciones Motion
- **Coordenadas en tiempo real** del cursor
- **Plano infinito** con zoom scroll y pan con botón derecho

### 🛠️ Herramientas CAD Profesionales
- **Line Tool (L)**: Dibujo de líneas con vista previa, input de medida y ángulo
- **Circle Tool (C)**: Círculos con radio definido
- **Rectangle Tool (REC)**: Rectángulos con dimensiones precisas
- **Trim Tool (TR)**: Borrar líneas tocándolas
- **Text Tool (T)**: Agregar anotaciones de texto
- **Dimension Tool (DIM)**: Cotas de distancia con flechas y medidas
- **Move Tool (M)**: Mover y modificar objetos
- **Layers (LA)**: Sistema completo de capas con colores personalizables

### 💬 Sistema de Comandos AutoCAD
- **Presiona Ctrl**: Abre input de comandos
- **Comandos disponibles**:
  - `L` / `LINE` = Línea
  - `C` / `CIRCLE` = Círculo
  - `REC` / `R` / `RECTANGLE` = Rectángulo
  - `TR` / `TRIM` = Recortar
  - `T` / `TEXT` = Texto
  - `DIM` / `DIMENSION` = Cota
  - `M` / `MOVE` = Mover
  - `LA` / `LAYER` = Capas
  - `UN` / `UNITS` = Unidades
  - `EXT` / `EXTRUDE` = Extruir a 3D
- **Input de medidas**: Al crear línea, escribe distancia → Enter → ángulo → Enter
- **Historial de comandos**: Usa ↑↓ para navegar

### 🎨 Sistema de Capas
- **Crear capas ilimitadas**
- **Personalizar colores** con paleta o selector
- **Toggle visibilidad** por capa
- **Bloquear capas** para proteger objetos
- **Organizar objetos** por capa automáticamente
- **Selector de capa activa** en tiempo real

### 📏 Unidades de Medida
- **Milímetros (mm)**
- **Centímetros (cm)**
- **Metros (m)**
- **Pulgadas (in)**
- **Pies (ft)**
- Conversión automática en coordenadas y cotas
- Selector visual en esquina superior derecha

### 📂 Gestión de Archivos
- **Carga de archivos**: Drag & Drop o explorador
- **Formatos soportados**: `.DWG`, `.RVT`, `.PDF`, `.TIF`, `.JPG`, `.PNG`
- **Vista previa** de imágenes cargadas en canvas
- **Archivos recientes** en página de inicio
- **Descarga en múltiples formatos** (.DWG, .RVT, .PDF, .TIF)
- **Extrusión de archivos 2D** a modelos 3D

### 🥽 Interfaz VR
- **Toggle VR funcional** en barra superior
- **Controles de teletransporte**
- **Compass de navegación**
- **Gestos interactivos** mantenidos
- **Manipulación 3D** de objetos extruidos en VR

### 🎤 Controles Avanzados
- **Comando de voz**: Ctrl + Mic
- **Edit Mode / View Only**: Toggle de edición
- **Screenshot descargable**: Captura de pantalla con un click
- **Live Edit**: Colaboración en tiempo real
- **Snap magnético**: Círculo verde indica punto de enganche
- **Pan**: Click derecho + arrastrar
- **Zoom**: Scroll del mouse (ilimitado)

### 📱 Responsive
- Diseño adaptable a desktop, tablet y móvil
- Optimizado para pantallas grandes (CAD workstations)

---

## 🛠️ Crear Instalador (Desarrollo)

### Requisitos
```bash
Node.js 18+ y npm
```

### 1. Instalar dependencias
```bash
npm install
```

### 2. Compilar para tu sistema

#### Windows:
```bash
npm run electron:build:win
```
→ Genera: `release/CAD-BIM-Platform-Setup-1.0.0.exe`

#### Mac:
```bash
npm run electron:build:mac
```
→ Genera: `release/CAD-BIM-Platform-1.0.0.dmg`

#### Linux:
```bash
npm run electron:build:linux
```
→ Genera: `release/CAD-BIM-Platform-1.0.0.AppImage`

#### Todos los sistemas:
```bash
npm run electron:build:all
```

### 3. Encontrar instaladores
Los archivos generados estarán en la carpeta `release/`

---

## 💻 Desarrollo Local

### Ejecutar en modo desarrollo
```bash
npm install
npm run electron:dev
```

Esto abrirá:
- Servidor Vite en `http://localhost:5173`
- Aplicación Electron con DevTools

### Scripts disponibles
```bash
npm run dev              # Vite dev server
npm run build            # Compilar para producción
npm run electron         # Ejecutar Electron
npm run electron:dev     # Desarrollo con hot reload
npm run pack             # Empaquetar sin crear instalador
npm run dist             # Crear instalador
```

---

## 📦 Estructura del Proyecto

```
cad-bim-platform/
├── src/
│   ├── app/
│   │   ├── components/      # Componentes React
│   │   │   ├── Canvas2D.tsx
│   │   │   ├── Canvas3D.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── BottomControls.tsx
│   │   │   ├── VRInterface.tsx
│   │   │   └── NorthSymbol.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Página de inicio
│   │   │   └── Dashboard.tsx    # Dashboard principal
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── theme.css
│   │   └── fonts.css
│   └── main.tsx
├── public/
│   ├── logo.svg             # Logo de la app
│   ├── favicon.ico          # Favicon
│   ├── manifest.json        # PWA manifest
│   └── service-worker.js    # Service worker
├── build/                   # Assets del instalador
│   ├── icon.svg             # Icono principal
│   ├── icon.ico             # Icono Windows
│   ├── icon.icns            # Icono Mac
│   ├── installer.nsh        # Script NSIS
│   └── entitlements.mac.plist
├── electron.cjs             # Electron main process
├── electron-builder.json    # Configuración del instalador
├── package.json
├── INSTALL.md               # Guía de instalación
└── README.md
```

---

## 🎯 Uso de la Aplicación

### 1. Página de Inicio
- **Cargar archivos**: Click en "Upload Files" o arrastra archivos
- **Archivos recientes**: Acceso rápido a proyectos
- **Templates**: Plantillas para North Symbol, Revit, PDF, Terrain

### 2. Dashboard Principal
- **Canvas 2D/3D**: Vista principal de diseño
- **Sidebar izquierdo**: Herramientas de dibujo y edición
- **Barra superior flotante**:
  - Switch 2D/3D
  - Toggle VR
  - Botón de descarga (dropdown de formatos)
  - Live Edit
- **Barra inferior**:
  - Comando de voz (Ctrl + Mic)
  - Edit Mode / View Only
  - Coordenadas del cursor

### 3. Herramientas

#### Line Tool (L)
- Click para punto inicial
- Move para vista previa
- Click para punto final

#### Modify Tool (M)
- Selecciona objetos
- Arrastra para mover
- Resize handles para escalar

#### Layers (Ctrl+L)
- Crear nuevas capas
- Toggle visibilidad
- Organizar elementos

### 4. Exportar
- Click en botón de descarga
- Selecciona formato (.DWG, .RVT, .PDF, .TIF)
- El archivo se descarga automáticamente

---

## 🔧 Tecnologías Utilizadas

- **Frontend**: React 18.3 + TypeScript
- **Styling**: Tailwind CSS v4 + Motion (Framer Motion)
- **Routing**: React Router v7
- **Build**: Vite 6.3
- **Desktop**: Electron 40
- **Packaging**: electron-builder 26
- **UI Components**: Radix UI, Lucide Icons

---

## 📋 Requisitos del Sistema

### Mínimos
- **OS**: Windows 10+, macOS 10.13+, Linux (64-bit)
- **RAM**: 4 GB
- **Espacio**: 500 MB
- **GPU**: OpenGL 2.0

### Recomendados
- **OS**: Windows 11, macOS 14+, Ubuntu 22.04+
- **RAM**: 8 GB+
- **Espacio**: 1 GB
- **GPU**: Tarjeta dedicada con OpenGL 3.0+

---

## 🐛 Reportar Problemas

Encontraste un bug? [Abre un issue](../../issues/new)

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Desarrollo

Desarrollado con ❤️ para profesionales de Arquitectura e Ingeniería.

**Version**: 1.0.0  
**Last Updated**: March 2026

---

## 🌟 Características Futuras

- [ ] Colaboración multi-usuario en tiempo real
- [ ] Integración con Autodesk Cloud
- [ ] Importación de modelos 3D (.OBJ, .FBX, .GLTF)
- [ ] Renderizado fotorrealista
- [ ] Análisis de iluminación natural
- [ ] Cálculos estructurales básicos
- [ ] Exportación a Unity/Unreal Engine
- [ ] Mobile app (iOS/Android)

---

## 📞 Soporte

- **Documentación**: [Ver INSTALL.md](INSTALL.md)
- **Issues**: [GitHub Issues](../../issues)
- **Email**: support@cadbim-platform.com (ejemplo)

---

**¡Gracias por usar CAD/BIM Cloud Platform!** 🚀