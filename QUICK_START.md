# ⚡ Quick Start - CAD/BIM Platform

**Inicio rápido en 3 pasos** para comenzar a usar la plataforma profesional de CAD/BIM.

---

## 🚀 1. Iniciar la Aplicación

### Opción A: Web (Desarrollo Local)
```bash
npm install && npm run dev
```
Abre: **http://localhost:5173**

### Opción B: Desktop (Instalador)
Doble click en el archivo instalador:
- **Windows:** `CAD-BIM-Platform-Setup.exe`
- **Mac:** `CAD-BIM-Platform.dmg`
- **Linux:** `CAD-BIM-Platform.AppImage`

---

## 🎨 2. Primeros Pasos

### Dashboard Principal

```
┌─────────────────────────────────────────────────┐
│  [Home]         🧭 North     📏 Units    [VR]  │
│                                                 │
│  🛠️              ┌───────────┐                 │
│  L               │           │                 │
│  O               │  CANVAS   │                 │
│  C               │    2D     │                 │
│  K               │           │                 │
│  S               └───────────┘                 │
│  I                                              │
│  D   [Mode: 2D] [Tool: LINE] [Layer: 0] [m]   │
│  E                                              │
│  B                          🎤 [Edit Mode] ⌨️  │
│  A                                              │
│  R   Status: X: 0.00m Y: 0.00m | Zoom: 100%   │
└─────────────────────────────────────────────────┘
```

### Controles Básicos

| Control | Acción |
|---------|--------|
| **Click izquierdo** | Colocar puntos / Seleccionar |
| **Click derecho + Drag** | Pan (mover vista) |
| **Scroll** | Zoom in/out |
| **Ctrl** | Abrir comandos |
| **Esc** | Cancelar operación |

---

## ✏️ 3. Dibujar Tu Primer Objeto

### Ejemplo: Habitación Simple

#### Paso 1: Configurar Unidades
```
1. Click en botón "📏 m" (esquina superior derecha)
2. Selecciona "Metros"
```

#### Paso 2: Crear Capa
```
1. Presiona Ctrl
2. Escribe: LA
3. Enter
4. Click "+ Add New Layer"
5. Nombre: "Walls"
6. Color: Rojo
7. Done
```

#### Paso 3: Dibujar Paredes
```
Método A - Visual:
1. Presiona L (o click en icono Line en sidebar)
2. Click en punto inicial (0, 0)
3. Click en punto final (5m a la derecha)
4. Repite para cerrar habitación

Método B - Con medidas exactas:
1. Presiona Ctrl
2. Escribe: L → Enter
3. Click punto inicial
4. Escribe: 5 → Enter (distancia en metros)
5. Escribe: 0 → Enter (ángulo horizontal)
6. Repite para otras 3 paredes
```

#### Paso 4: Agregar Cotas
```
1. Presiona Ctrl
2. Escribe: DIM → Enter
3. Click en esquina 1
4. Click en esquina 2
5. Aparece cota con medida "5.00 m"
```

#### Paso 5: Agregar Texto
```
1. Presiona T
2. Click en centro de habitación
3. Escribe: "BEDROOM"
4. Enter
```

#### Paso 6: Ver en 3D
```
1. Click en switch "3D" (barra superior)
2. Tu dibujo se extrude automáticamente
3. Click y arrastra para rotar vista 3D
```

---

## 🎯 Comandos Más Usados

### Dibujo
```bash
L       # Línea
C       # Círculo
REC     # Rectángulo
TR      # Trim (borrar línea al tocar)
T       # Texto
DIM     # Dimensión/Cota
```

### Edición
```bash
M       # Mover objeto
E       # Borrar
U       # Deshacer
```

### Vista
```bash
Z       # Zoom extents (ver todo)
P       # Pan (o Right-click + drag)
```

### Organización
```bash
LA      # Layer Manager (capas)
UN      # Units (unidades)
```

### 3D
```bash
EXT     # Extrude (convertir 2D → 3D)
```

---

## 💡 Tips Profesionales

### 1. Usa Snap Magnético
**Círculo verde** = Punto de enganche activo
- Espera a ver el círculo verde antes de clickear
- Se engancha automáticamente a:
  - Extremos de líneas
  - Puntos medios
  - Centros de círculos
  - Esquinas

### 2. Input de Medidas Exactas
En lugar de clickear:
```
1. Click punto inicial
2. Escribe distancia: 5
3. Enter
4. Escribe ángulo: 90
5. Enter
```

### 3. Organiza con Capas
Crea capas separadas para:
- **Structure**: Paredes, columnas
- **Dimensions**: Cotas y medidas
- **Text**: Anotaciones
- **Furniture**: Mobiliario

### 4. Atajos de Teclado
Aprende los shortcuts de una letra:
- `L` = Line
- `C` = Circle
- `R` = Rectangle
- `T` = Text
- `M` = Move

### 5. Historial de Comandos
Presiona `↑` y `↓` en terminal de comandos para navegar por comandos anteriores

---

## 📋 Workflow Recomendado

### Proyecto Típico

```
1. Configurar Unidades
   └─ Ctrl → UN → Selecciona unidad

2. Crear Estructura de Capas
   └─ LA → Crear: Walls, Doors, Windows, Furniture, Dimensions, Text

3. Dibujar Planta Base
   └─ Selecciona capa "Walls"
   └─ L → Dibujar perímetro con medidas exactas

4. Agregar Elementos
   └─ Cambia a capa "Doors" → Dibujar puertas
   └─ Cambia a capa "Windows" → Dibujar ventanas

5. Dimensionar
   └─ Capa "Dimensions"
   └─ DIM → Agregar cotas a paredes principales

6. Anotar
   └─ Capa "Text"
   └─ T → Agregar nombres de habitaciones

7. Revisar en 3D
   └─ Switch 3D → Verificar diseño
   └─ Ctrl → EXT → Extruir elementos específicos

8. Exportar
   └─ Click botón Download
   └─ Seleccionar formato (.DWG, .PDF, etc.)
```

---

## 🎨 Ejemplo Completo: Casa Simple

```bash
# 1. Unidades
Ctrl → UN → m

# 2. Capas
LA → Crear "Walls" (Rojo), "Rooms" (Azul), "Dims" (Verde)

# 3. Dibujar habitación 5x4m
L → Click (0,0) → 5 → 0     # Pared derecha
L → Click final → 4 → 90    # Pared arriba
L → Click final → 5 → 180   # Pared izquierda
L → Click final → 4 → 270   # Cerrar

# 4. Agregar puerta
Cambia a capa "Rooms"
REC → Click (2, 0) → Click (3, 0.2)  # Puerta 1m

# 5. Dimensionar
Cambia a capa "Dims"
DIM → Click esquina 1 → Click esquina 2

# 6. Texto
T → Click centro → "LIVING ROOM"

# 7. Ver 3D
Switch → 3D

# 8. Exportar
Download → PDF
```

---

## 🚨 Solución Rápida de Problemas

### No veo el snap (círculo verde)
✅ **Acércate** con zoom (scroll) cerca de los objetos

### La línea no se dibuja
✅ Verifica que la herramienta **Line esté activa** (L o click en sidebar)

### No puedo mover la vista
✅ Usa **Right-click + drag** para pan

### El comando no funciona
✅ Presiona **Esc** para cancelar operación actual
✅ Verifica que presionaste **Enter** después del comando

### Las medidas no coinciden
✅ Verifica las **unidades** (botón 📏)
✅ Usa **input de medidas** en lugar de click visual

---

## 📚 Siguientes Pasos

Una vez dominado lo básico:

1. **Comandos Avanzados**: Lee [COMMANDS_GUIDE.md](COMMANDS_GUIDE.md)
2. **Despliegue Web**: Consulta [WEB_DEPLOYMENT.md](WEB_DEPLOYMENT.md)
3. **Instalación Desktop**: Ver [INSTALL.md](INSTALL.md)
4. **Documentación Completa**: Revisa [README.md](README.md)

---

## ⌨️ Cheat Sheet

```
DIBUJO           EDICIÓN          VISTA
L   - Line       M  - Move        Z   - Zoom All
C   - Circle     E  - Erase       P   - Pan
REC - Rectangle  TR - Trim        
T   - Text       U  - Undo        ORGANIZACIÓN
DIM - Dimension                   LA  - Layers
                                  UN  - Units
                                  
ESPECIAL
Ctrl           - Comandos
Esc            - Cancelar
Right+Drag     - Pan
Scroll         - Zoom
```

---

**¡Listo para crear! 🚀**

¿Tienes dudas? Consulta la documentación completa o abre un Issue en GitHub.
