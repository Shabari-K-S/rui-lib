# Nexus UI

**Nexus UI** is a next-generation React component library built with **magnetic physics**, **glassmorphism 2.0**, and deep interactivity. It's designed to make your applications feel alive.

Built with **React 19**, **Tailwind CSS v4**, and **Framer Motion**.

## ✨ Features

- **🧲 Magnetic Physics**: Interactions that feel naturally fluid using spring-based animations.
- **💎 Glassmorphism 2.0**: Next-level blur effects, frosted glass materials, and beautiful gradients.
- **🚀 Teleport Search**: Command palette (Cmd+K) navigation built-in.
- **📱 Responsive**: Works seamlessly across desktop and mobile.
- **🌗 Dark Mode**: First-class support for light and dark themes.

## 📦 Components

Nexus UI comes with a suite of premium components:

- **Interactive Dock**: macOS-style dock with magnification effects.
- **Glass Card**: Beautiful, frosted glass containers with tilt effects.
- **Smart Breadcrumb**: Adaptive navigation paths with dropdown support.
- **Teleport Search**: Global search and command palette.
- **Navbar**: Responsive navigation with glass effects.
- **Code Block**: Syntax-highlighted code viewer with copy functionality.

## 🛠️ Usage Example

Here's how to use the `GlassCard` component:

```tsx
import { GlassCard } from './components/GlassCard';

function App() {
  return (
    <GlassCard className="p-8">
      <h1>Hello Nexus</h1>
      <p>This is a glassmorphic card.</p>
    </GlassCard>
  );
}
```

## 🎨 Customizable

Built on top of **Tailwind CSS**, every component accepts a `className` prop for easy overrides using standard utility classes.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
