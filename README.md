# 🦈 Pitch Predictor

An intense, data-rich simulator that provides instant, brutally honest evaluations of your startup pitch. Designed with a sleek Bloomberg terminal aesthetic and zero external dependencies.

## ✨ Features
- **Offline Procedural Evaluation Engine**: The app evaluates your pitch instantly without using any external APIs. It analyzes keyword density (e.g., checking for red-flag buzzwords like "synergy" or "web3"), word count, and stage/industry expectations to mathematically generate a funding probability.
- **Shark Tank Simulation**: Based on your calculated probability, the engine randomly selects from a local database of fictional investor personas ("The Ruthless Calculator", "The Tech Evangelist") and generates their opinions, strengths, and fatal flaws.
- **High-Fidelity Animations**: Features a circular SVG probability gauge, a dramatic CSS rubber stamp animation for the verdict, and a swimming CSS shark loading screen.
- **Dynamic Web Audio**: Experience the tension of the boardroom with a ticking metronome while you type, an escalating tension sweep while the sharks evaluate, and a final fanfare or "sad trombone" based on your verdict.
- **Local History**: Your past pitches and verdicts are saved locally on your device for easy reference.

## 🚀 Getting Started
Open `index.html` in your browser, or serve locally:
```bash
python -m http.server 8080
```
*Note: This app is 100% free and runs entirely locally. No API keys are required.*

## 🛠️ Tech Stack
- **HTML5 & CSS3**: SVG gauge rendering, CSS Grid dashboard layout, and complex keyframe animations.
- **Vanilla JavaScript**: Procedural evaluation algorithm, DOM manipulation, and `localStorage` caching.
- **Web Audio API**: Procedural sound synthesis (oscillators, sawtooth sweeps, square waves).

---
*Built as part of the VishwaNova Weboreel Hackathon.*
