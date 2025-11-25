# 🎨 Icon Customizer

A powerful web-based tool for creating custom 512x512 pixel icons for Windows start menus with rich customization options and dynamic Google Fonts loading.

![Static Badge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Static Badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Static Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Static Badge](https://img.shields.io/badge/Canvas-2D-4CAF50?style=for-the-badge)

## ✨ Features

### 🎯 Core Functionality
- **🖼️ Background Customization** - Color picker and corner radius controls
- **📸 Screenshot Processing** - Upload from file or URL with zoom, 3D rotation, and perspective transformation
- **🔖 App Icon Watermark** - Upload app icons from file or URL with position and size controls
- **📝 Rich Text Overlay** - HTML formatting support (bold, italic, colors, sizes) with dynamic Google Fonts
- **🌈 Gradient Overlay** - Customizable gradient with opacity and rotation controls

### 🚀 Advanced Features
- **👀 Real-time Preview** - Live preview with drag positioning
- **💾 Export** - Download as high-quality PNG (custom sizes supported)
- **💾 State Persistence** - Automatic save/restore of all settings
- **🌐 URL Loading** - Load images directly from URLs with CORS support
- **🎨 Dynamic Font Loading** - Load any Google Font on-demand with loading indicators

## 🎮 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/icon-customizer.git

# Open in browser (no server required)
open index.html
```

### Live Demo
Visit the live demo: `https://YOUR_USERNAME.github.io/icon-customizer/`

## 🛠️ Usage Guide

### Text Formatting Examples
```html
App <b>Name</b>                    <!-- Bold text -->
<i>Italic</i> Text                 <!-- Italic text -->
<span style="color:red">Red</span> <!-- Colored text -->
<span style="font-size:32px">Big</span> <!-- Different sizes -->
```

### Google Fonts Integration
- Type any Google Font name in the font field
- Loading indicator shows while font downloads
- Font automatically applies to text on icon
- Works with any Google Font (Roboto, Open Sans, Lato, etc.)

### App Icon Watermark
- Upload any image as app icon from file or URL
- Choose from 5 positions (corners + center)
- Adjust size from 32px to 256px
- Color repainting option available

### 3D Effects
- Rotate screenshot in X, Y, Z axes (-45° to +45°)
- Perspective transformation
- Real-time preview with smooth rendering

## 📁 Project Structure

```
icon-customizer/
├── 📄 index.html          # Main HTML file
├── 🎨 styles.css          # CSS styles and animations
├── ⚡ app.js              # Main application logic
├── 📖 README.md           # Documentation
└── 🔧 .nojekyll           # Prevents Jekyll processing
```

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome/Chromium | 80+ | ✅ Fully Supported |
| Firefox | 75+ | ✅ Fully Supported |
| Safari | 13+ | ✅ Fully Supported |
| Edge | 80+ | ✅ Fully Supported |

## 🚀 GitHub Pages Deployment

### Prerequisites
- GitHub account
- Git installed on your computer

### Step-by-Step Deployment

1. **Create GitHub Repository**
   ```bash
   # Create a new repository on GitHub named "icon-customizer"
   # Make sure it's public (required for free GitHub Pages)
   ```

2. **Initialize Git and Push Code**
   ```bash
   cd IconMaker
   git init
   git add .
   git commit -m "Initial commit: Icon Customizer app"
   git remote add origin https://github.com/YOUR_USERNAME/icon-customizer.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** tab
   - Scroll down to **Pages** section
   - Under **Source**, select **Deploy from a branch**
   - Select **main** branch and **/(root)** folder
   - Click **Save**

4. **Access Your Live Site**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/icon-customizer/`
   - It may take a few minutes for the first deployment

### Custom Domain (Optional)
If you want to use a custom domain:
1. Buy a domain from a domain registrar
2. In GitHub Pages settings, add your custom domain
3. Configure DNS records with your domain provider

## 🎯 Technical Highlights

### Dynamic Font Loading
- Uses FontFace Observer for reliable font loading detection
- Loading indicators with smooth animations
- Automatic fallback to system fonts
- Supports all Google Fonts API weights and styles

### Canvas Rendering
- High-performance 2D canvas rendering
- Real-time preview updates
- Export at custom resolutions
- Anti-aliased text rendering

### State Management
- Automatic localStorage persistence
- Restores all settings on page reload
- Maintains image uploads and configurations

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. 🧪 Check browser compatibility
2. 🔄 Ensure JavaScript is enabled
3. 🗑️ Try clearing browser cache
4. 📱 Refresh the page
5. 🐛 Open an issue on GitHub with details

---

**Made with ❤️ for the Windows customization community**