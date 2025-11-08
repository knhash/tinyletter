# Tiny Letter

A minimalist, serverless letter-sharing service with beautiful envelope animations. Write tiny letters to friends with a physical envelope metaphor - flip, write inside, seal, and send.

## Features

- Interactive envelope with realistic flip animation
- Write on the envelope front, then flip to write inside
- Baronial-style envelope with triangular flaps that seal sequentially
- Everything encoded in the URL - completely serverless
- Light espresso color theme with monospace typography
- Fully responsive design
- Call back letters to edit before sharing
- Clean, separated codebase (HTML, CSS, JavaScript)

## Project Structure

```
tinyletter/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Application logic and animations
└── README.md       # Documentation
```

## How to Use

### Creating a Letter

1. Open `index.html` in your browser
2. Write on the envelope (max 100 characters)
3. Click **Flip** to turn the envelope over
4. Write your message inside (max 500 characters)
5. Click **Send** to seal and send the letter
6. Watch the envelope seal with animated flaps and slide away
7. Copy the generated URL and share it!

**Pro tip:** Use **Flip** to toggle between front and back while editing, and click **Call back** after sending to revise your letter.

### Reading a Letter

1. Open a letter URL (contains `?l=...`)
2. See the envelope with the front message
3. Click the envelope to flip and open the flaps sequentially
4. Read the message inside
5. Click again to close and flip back to the front

## How It Works

- Letter content is encoded using URL-safe base64 encoding
- Data is stored in the URL parameter `?l=`
- Create mode: Interactive envelope with flip, write, seal, and send flow
- View mode: Envelope opens with smooth 3D flip and sequential flap animations
- Slide-away animation reveals the shareable URL
- No backend server, database, or external dependencies needed

## Animation Details

- **Envelope flip:** 180° horizontal rotation with 3D perspective
- **Flap opening:** Four triangular flaps open sequentially (top, right, bottom, left)
- **Sealing:** Flaps close in sequence when sending
- **Send animation:** Envelope slides behind a wall, revealing the URL box underneath

## Local Development

Simply open `index.html` in any modern web browser. No build process or installation required!

## Tech Stack

- Pure HTML/CSS/JavaScript
- CSS 3D transforms and animations
- Modular file structure (separated HTML, CSS, JS)
- No frameworks or dependencies
- No backend required
- Works offline once loaded

## Design Philosophy

The design embraces minimalism with:
- Refined spacing and padding using rem units
- Subtle borders (1px instead of 2px) for cleaner look
- Optimized font sizes for better readability
- Enhanced responsive breakpoints for mobile devices
- Clean separation of concerns (structure, style, behavior)

## Color Palette

- Background: `#f5f1e8` (light espresso)
- Paper: `#fffcf7` (cream white)
- Envelope flaps: `#e8dcc8` (warm tan)
- Text: `#3d3026` (dark brown)
- Accents: `#9d8b73` (muted brown)

Enjoy sending tiny letters!
