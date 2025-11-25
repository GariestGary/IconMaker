# Icon Customization Tool - Technical Specification

## Overview
A web-based tool for creating custom 512x512 pixel icons with program screenshots, background effects, text overlays, and various customization options for third-party Windows start menus.

## Core Requirements
- **Input**: Program screenshots (manual upload)
- **Output**: 512x512 PNG images
- **Technology**: JavaScript/TypeScript with HTML Canvas
- **Interface**: Simple web page with real-time preview

## Architecture Components

### 1. User Interface Layer
```
┌─────────────────────────────────────────────────┐
│                 Icon Customizer                  │
├─────────────────┬─────────────────┬─────────────┤
│  Controls Panel │  Preview Panel  │  Export     │
│                 │                 │             │
│ • File Upload   │ • Live Preview  │ • Download  │
│ • Background    │ • 512x512       │ • Save      │
│ • Text          │ • Real-time     │   Presets   │
│ • Effects       │   Updates       │             │
│ • Gradients     │                 │             │
└─────────────────┴─────────────────┴─────────────┘
```

### 2. Image Processing Pipeline
```
Input Screenshot → Resize/Crop → Background Layer → Effects → Text Layer → Export
```

### 3. Core Features

#### Background Customization
- Solid color with opacity
- Tint overlay on screenshot
- Background texture patterns
- Corner radius (0-50px)

#### Text Customization
- Position (above/below screenshot)
- Font family, size, weight
- Text color and shadow effects
- Background for text (optional)

#### Effects & Gradients
- Gradient overlays (linear/radial)
- Blur effects
- Shadow effects
- Border customization

## Technical Implementation

### File Structure
```
icon-maker/
├── index.html          # Main interface
├── styles.css          # Styling and layout
├── app.js              # Main application logic
├── image-processor.js  # Canvas image processing
├── export-utils.js     # PNG export functionality
└── presets.js          # Save/load presets
```

### Key Classes & Functions

#### ImageProcessor Class
- `loadImage(file)` - Handle file upload
- `applyBackground(config)` - Apply background layers
- `applyText(config)` - Add text overlay
- `applyEffects(config)` - Apply visual effects
- `renderPreview()` - Update canvas preview
- `exportPNG()` - Generate 512x512 PNG

#### Configuration Object
```javascript
const iconConfig = {
  background: {
    color: '#000000',
    opacity: 0.3,
    cornerRadius: 20,
    texture: 'none' // 'grid', 'dots', 'lines'
  },
  screenshot: {
    tint: '#ffffff',
    opacity: 1.0,
    position: 'center'
  },
  text: {
    content: 'App Name',
    position: 'below', // 'above', 'below'
    font: 'Arial',
    size: 24,
    color: '#ffffff',
    shadow: true
  },
  effects: {
    gradient: {
      type: 'linear', // 'radial'
      colors: ['#ff0000', '#0000ff'],
      opacity: 0.2
    },
    blur: 0,
    shadow: {
      enabled: true,
      blur: 10,
      color: '#000000'
    }
  }
};
```

## Implementation Phases

### Phase 1: Foundation
- Basic HTML structure with file upload
- Canvas setup and image loading
- Simple background and text rendering

### Phase 2: Customization
- Background controls (color, opacity, corner radius)
- Text controls (content, font, position)
- Real-time preview updates

### Phase 3: Advanced Features
- Gradient overlays and effects
- Texture patterns
- Export functionality
- Preset system

### Phase 4: Polish
- Performance optimization
- UI/UX improvements
- Documentation and testing

## Browser Compatibility
- Modern browsers with Canvas support
- File API for uploads
- No server-side processing required