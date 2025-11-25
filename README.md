# Icon Customizer

A web-based tool for creating custom 512x512 pixel icons with program screenshots, designed specifically for third-party Windows start menu customization.

## Features

### ✅ Currently Implemented (Phase 1)
- **File Upload**: Drag & drop or click to upload program screenshots
- **Background Customization**: 
  - Color picker with opacity control
  - Corner radius adjustment (0-50px)
- **Text Overlay**:
  - Custom text content
  - Position above/below screenshot
  - Font size and color customization
- **Real-time Preview**: Instant updates as you adjust settings
- **PNG Export**: High-quality 512x512 pixel PNG download

### 🚧 Planned Features
- Screenshot tint and opacity controls
- Gradient overlays and effects
- Background texture patterns
- Preset save/load system
- Advanced text effects (shadows, backgrounds)

## Quick Start

1. **Open the Tool**: Double-click `index.html` or run `start index.html` in the terminal
2. **Upload Screenshot**: 
   - Drag & drop a program screenshot onto the upload area, or
   - Click the upload area to browse for a file
3. **Customize Your Icon**:
   - Adjust background color and opacity
   - Set corner radius for rounded corners
   - Edit text content, position, size, and color
4. **Export**: Click "Export PNG (512x512)" to download your custom icon

## File Structure

```
IconMaker/
├── index.html          # Main application interface
├── styles.css          # Styling and responsive layout
├── app.js              # Core application logic
├── technical-spec.md   # Technical specifications
├── workflow-diagram.md # Process flow diagrams
├── implementation-roadmap.md # Development timeline
└── project-summary.md  # Project overview
```

## Technical Details

- **Technology**: Pure HTML5, CSS3, and JavaScript
- **Image Processing**: HTML Canvas API
- **No Dependencies**: Runs entirely in browser, no server required
- **Export Format**: 512x512 PNG with transparency support

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Usage Tips

- Use high-quality screenshots for best results
- Dark backgrounds with light text often work well
- Experiment with corner radius for different visual styles
- The preview updates in real-time as you adjust controls

## Next Development Phase

The current implementation covers the core MVP functionality. Future phases will add:
- Advanced effects and gradients
- Screenshot tinting and positioning
- Preset management system
- Performance optimizations

## License

This project is open source and available under the MIT License.