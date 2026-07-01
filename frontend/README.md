# KOMEZAJU Organization Website

> Empower. Uplift. Move forward.

A modern, professional website for KOMEZAJU Organization — a Rwandan community organization promoting development through capacity building in Bugesera.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your site.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The static site will be in the `dist/` folder, ready to deploy.

## 📦 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS 4** - Utility-first styling
- **React Router** - Client-side routing
- **React Icons** - Professional iconography
- **Radix UI** - Accessible UI primitives

## 🎨 Design Features

- **Modern Professional Layout** - Clean, spacious design with excellent typography
- **Warm Color Palette** - Sunrise orange, sky blue, and golden accents
- **Smooth Animations** - Subtle transitions and micro-interactions
- **Fully Responsive** - Mobile-first, works on all devices
- **Accessible** - WCAG compliant, keyboard navigable
- **Multilingual** - English, Kinyarwanda, and French support

## 📁 Project Structure

```
src/
├── assets/          # Images and static files
├── components/      # Reusable UI components
│   └── ui/         # Radix UI primitives
├── lib/            # Utilities and helpers
│   └── i18n.tsx   # Internationalization
├── pages/          # Page components
│   ├── Home.tsx   # Main landing page
│   ├── Login.tsx  # Admin login
│   └── Dashboard.tsx # Admin dashboard
├── App.tsx         # Router configuration
├── main.tsx        # Application entry point
└── styles.css      # Global styles & design system
```

## 🌍 Deployment

### Netlify
1. Connect your Git repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel
1. Import your project to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

### Any Static Host
Simply upload the contents of the `dist/` folder after building.

## 🛠️ Customization

### Update Content
Edit translations in `src/lib/i18n.tsx` for all three languages.

### Change Colors
Modify CSS variables in `src/styles.css`:
```css
:root {
  --primary: oklch(0.74 0.165 55);    /* Sunrise orange */
  --secondary: oklch(0.72 0.12 240);   /* Sky blue */
  --accent: oklch(0.84 0.16 88);       /* Golden star */
}
```

### Add Images
Place images in `src/assets/` and import them in your components.

### Modify Programs
Update the `ACTIVITIES` array in the Home page component and add translations.

## 📄 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code
npm run format     # Format code with Prettier
```

## 📝 License

All rights reserved © KOMEZAJU Organization

## 📞 Contact

**KOMEZAJU Organization**
- Location: Nyabivumu Village, Nyamata, Bugesera, Eastern Province, Rwanda
- Email: info@komezaju.org
- Languages: Kinyarwanda, English, Français

---

Built with ❤️ for the communities of Bugesera
