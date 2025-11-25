# Icon Customizer

A web-based tool for creating custom 512x512 pixel icons for Windows start menus with rich customization options.

## Features

- **Background Customization**: Color, corner radius
- **Screenshot Processing**: Zoom, 3D rotation, perspective transformation
- **App Icon Watermark**: Upload app icon with position and size controls
- **Rich Text Overlay**: HTML formatting support (bold, italic, colors, sizes)
- **Gradient Overlay**: Customizable gradient with opacity and rotation
- **Real-time Preview**: Live preview with drag positioning
- **Export**: Download as 512x512 PNG

## GitHub Pages Deployment

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
   # Navigate to your project directory
   cd IconMaker
   
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit: Icon Customizer app"
   
   # Add your GitHub repository as remote
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

## Local Development

To run locally:
1. Clone the repository
2. Open `index.html` in a web browser
3. No server required - works as a static site

## Browser Compatibility

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## File Structure

```
icon-customizer/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # Main application logic
├── README.md          # This file
└── .nojekyll          # Prevents Jekyll processing
```

## Usage Examples

### Text Formatting
- `App <b>Name</b>` - Bold text
- `<i>Italic</i> Text` - Italic text
- `<span style="color:red">Red</span> Text` - Colored text
- `<span style="font-size:32px">Big</span> Text` - Different sizes

### App Icon Watermark
- Upload any image as app icon
- Choose from 5 positions
- Adjust size from 32px to 256px

### 3D Effects
- Rotate screenshot in X, Y, Z axes
- Perspective transformation
- Real-time preview

## License

MIT License - feel free to use and modify for your projects.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

If you encounter issues:
1. Check browser compatibility
2. Ensure JavaScript is enabled
3. Try refreshing the page
4. Open an issue on GitHub