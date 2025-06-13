# Lordicon Internal Player

Minimalistic internal animation player based on `lottie-web`, SVG-only.

**This library is not intended for direct use by application developers.**  
It is a stripped-down internal animation engine optimized for specific use cases, such as the [Lordicon](https://lordicon.com/) library.

---

## What is this?

`@lordicon/internal` is a **specialized fork** of [Airbnb's lottie-web](https://github.com/airbnb/lottie-web), built with a narrow purpose:

- ✅ SVG renderer only (no canvas)
- 🗑️ Removed all text and font rendering logic
- ⚙️ Custom internal expression handling (without eval)
- 🧱 New build system
- 🧬 Designed for **internal integration** within higher-level UI frameworks

This is **not** a drop-in replacement for `lottie-web`.
