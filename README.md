# PixiJS Fork - Distribution

This is a distribution build of PixiJS with triangle-wasm integration for improved triangulation.

## Installation

```bash
npm install git+https://github.com/007-DA-ZUERA/pixijsFork.git
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "pixi.js": "git+https://github.com/007-DA-ZUERA/pixijsFork.git"
  }
}
```

## Changes

- Replaced `earcut` with `triangle-wasm` for more robust polygon triangulation
- Improved hole handling in graphics

## Usage

This package is a drop-in replacement for the standard PixiJS package.

```javascript
import * as PIXI from 'pixi.js';
```

## Source

Based on PixiJS v8.14.0 with custom modifications.
Source repository: https://github.com/007-DA-ZUERA/pixijs
