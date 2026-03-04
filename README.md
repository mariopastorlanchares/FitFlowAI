<p align="center">
  <img src="assets/images/icon.png" width="120" alt="FitFlow AI Logo" />
</p>

<h1 align="center">FitFlow AI</h1>

<p align="center">
  <strong>Asistente de entrenamiento inteligente impulsado por IA</strong><br/>
  Planifica, entrena y evoluciona — todo desde tu bolsillo.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK_52-000020?logo=expo&logoColor=white" alt="Expo SDK" />
  <img src="https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-Private-grey" alt="License" />
</p>

---

## 🎨 Identidad Visual

FitFlow AI sigue una estética **"Energetic & Motivational"**, diseñada para transmitir fuerza y dinamismo:

| Token              | Valor       | Uso                              |
| ------------------- | ----------- | -------------------------------- |
| **Background**      | `#0D0D0D`   | Fondo principal — negro puro     |
| **Accent**          | `#FF8C00`   | Botones, highlights, CTAs        |
| **Surface**         | `#1A1A1A`   | Tarjetas y contenedores          |
| **Text Primary**    | `#FFFFFF`   | Texto principal                  |
| **Text Secondary**  | `#A0A0A0`   | Texto de apoyo                   |

> Dark mode por defecto. Interfaz limpia con acentos naranja vibrante para guiar la atención del usuario.

---

## 🛠️ Stack Tecnológico

| Tecnología                  | Propósito                                    |
| --------------------------- | -------------------------------------------- |
| **React Native**            | Framework de desarrollo móvil multiplataforma |
| **Expo SDK 52**             | Toolchain, builds y servicios nativos         |
| **Expo Router**             | Navegación basada en sistema de archivos      |
| **NativeWind (Tailwind v4)**| Estilos utility-first para React Native       |
| **Firebase** *(próximamente)* | Auth, Firestore, Analytics y Cloud Functions |
| **TypeScript**              | Tipado estático y mejor DX                   |

---

## ✅ Prerrequisitos

Antes de empezar, asegúrate de tener instalado:

- **Node.js 24 LTS** — [descargar aquí](https://nodejs.org/)
- **Expo Go** — disponible en [App Store](https://apps.apple.com/app/expo-go/id982107779) y [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Git** — para clonar el repositorio

---

## 🚀 Instalación y Uso

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/FitFlowAI.git
cd FitFlowAI

# 2. Instala las dependencias
npm install

# 3. Arranca el servidor de desarrollo
npx expo start --clear
```

Escanea el **código QR** desde la terminal con la app **Expo Go** para ver la app en tu dispositivo.

> [!TIP]
> Usa la flag `--clear` al arrancar para limpiar la caché del bundler si experimentas errores tras cambios en la configuración.

---

## 📁 Estructura de Carpetas

```
FitFlowAI/
├── app/                      # 📱 Rutas — navegación basada en archivos (Expo Router)
│   ├── _layout.tsx           #    Layout raíz — decide entre Auth o Main
│   ├── (auth)/               #    🔒 Stack de Autenticación
│   │   ├── _layout.tsx       #       Layout del stack (sin header)
│   │   └── login.tsx         #       Pantalla de Login
│   └── (main)/               #    🏠 Stack Principal (usuario autenticado)
│       ├── _layout.tsx       #       Layout del stack (con header)
│       └── index.tsx         #       Pantalla de Inicio
│
├── components/               # 🧩 Componentes reutilizables
├── constants/                # 🎨 Tokens de diseño, colores y tipografía
├── hooks/                    # 🪝 Custom hooks (useColorScheme, etc.)
├── assets/                   # 🖼️ Imágenes, fuentes y recursos estáticos
├── app.json                  # ⚙️ Configuración de Expo
├── tailwind.config.js        # 🌬️ Configuración de NativeWind / Tailwind
└── tsconfig.json             # 📘 Configuración de TypeScript
```

> La carpeta `app/` utiliza **enrutamiento basado en archivos**: cada archivo `.tsx` dentro de ella se convierte automáticamente en una ruta. Los grupos entre paréntesis como `(auth)` y `(main)` permiten organizar rutas sin afectar la URL.

---

## 📐 Decisiones de Arquitectura

- **Navegación condicional**: el layout raíz evalúa el estado de autenticación y renderiza el Stack correspondiente (`(auth)` o `(main)`).
- **Separación clara**: la lógica de UI vive en `components/`, los tokens de diseño en `constants/`, y las rutas de la app en `app/`.
- **Expo Go first**: el proyecto está diseñado para funcionar en Expo Go sin necesidad de builds nativos personalizados.

---

<p align="center">
  <sub>Hecho con 💪 y ☕ — FitFlow AI © 2026</sub>
</p>
