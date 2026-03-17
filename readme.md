# Pulse Ring

A hypnotic, minimalist arcade game where timing is everything.

![Game Screenshot](screenshot.png)

## Play Now

**Live Demo:** [https://brown-shade.github.io/pulse-ring](https://brown-shade.github.io/pulse-ring)

Or open `index.html` in any modern web browser.

---

## How to Play

1. **Tap** the screen (or click) when the spinning pointer enters the glowing target zone
2. **Hit** the zone → Score points, build combo, speed increases
3. **Miss** the zone → Game over
4. **Survive** as long as possible. Beat your high score.

**Pro Tip:** Every 5 perfect hits = combo multiplier. Stay in the zone.

---

## Features

- 🎮 **One-tap controls** — Instant play, zero learning curve
- ⚡ **Progressive difficulty** — Speed increases with your skill
- 🔥 **Combo system** — Multiply your score with perfect streaks
- ✨ **Particle effects** — Satisfying visual feedback on every hit
- 🎵 **Dynamic audio** — Synth sounds that react to your gameplay
- 📱 **Mobile-first** — Works on any device, any screen size
- 💾 **Local storage** — Saves your best score automatically
- 🌙 **Neon aesthetic** — Easy on the eyes, hard to put down

---

## Tech Stack

- **HTML5 Canvas** — Smooth 60fps rendering
- **Vanilla JavaScript** — No frameworks, no dependencies
- **CSS3** — Hardware-accelerated animations
- **Web Audio API** — Generated sound effects (no external files)

---

## File Structure


---

## Installation

### Local Play
1. Download or clone this repository
2. Open `index.html` in any browser
3. Start tapping

### Deploy Online (Free)
**Option A — GitHub Pages:**
1. Fork/upload to GitHub repository
2. Enable GitHub Pages in Settings
3. Play at `https://brown shade.github.io/repo-name`

**Option B — Netlify:**
1. Drag this folder to [netlify.com/drop](https://netlify.com/drop)
2. Get instant live link

---

## Customization

Want to make it yours? Edit these lines:

| Change | File | Line |
|--------|------|------|
| Game title | `index.html` | `<h1 class="title">PULSE RING</h1>` |
| Colors | `styles.css` | `:root { --neon-cyan: #00f3ff; ... }` |
| Difficulty | `game.js` | `state.speed = 2;` (higher = faster) |
| Target size | `game.js` | `targetSize: 60` (degrees, lower = harder) |

---

## Browser Support

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Note:** Audio requires user interaction first (click/tap) — this is a browser security feature, not a bug.

---

## Roadmap / Future Ideas

- [ ] Multiple color themes (Matrix, Sunset, Monochrome)
- [ ] Unlockable pointer shapes
- [ ] Daily challenge mode
- [ ] Global leaderboard
- [ ] Haptic feedback on iOS/Android
- [ ] Revive option (watch ad to continue)

---
## Credits

Created by [Brown Shade]

- Font: [Orbitron](https://fonts.google.com/specimen/Orbitron) by Matt McInerney
- Inspired by classic arcade timing games

---

## License

This project is open source and available under the [MIT License](LICENSE).

You are free to:
- Use commercially
- Modify and distribute
- Use privately

**Attribution appreciated but not required.**

---

## Feedback & Contact

Found a bug? Want to collaborate?

- Email: d.egein46@gmail.com
- Twitter: [@yourhandle](https://twitter.com/@nekraftnfts)

---

**Thanks for playing!** 🎯✨