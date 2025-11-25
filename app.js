class IconCustomizer {
    constructor() {
        this.canvas = document.getElementById('previewCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentImage = null;
        this.config = {
            iconSize: {
                width: 512,
                height: 512
            },
            background: {
                color: '#ffffff',
                cornerRadius: 20
            },
            screenshot: {
                scale: 1.0,
                offsetX: 0,
                offsetY: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0
            },
            appIcon: {
                image: null,
                position: 'top-left',
                size: 64,
                repaintEnabled: false,
                repaintColor: '#ffffff'
            },
            gradient: {
                enabled: false,
                startColor: '#000000',
                endColor: '#ffffff',
                startOpacity: 1.0,
                endOpacity: 0.0,
                startOffset: 0.0,
                endOffset: 1.0,
                rotation: 0
            },
            text: {
                content: 'App Name',
                font: 'Segoe UI',
                color: '#ffffff',
                size: 24,
                position: 'center'
            }
        };

        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.initializeEventListeners();
        this.initializeResizable();
        this.loadState();
        this.renderPreview();
    }

    initializeEventListeners() {
        // File upload handling
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const clearFileBtn = document.getElementById('clearFile');

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        clearFileBtn.addEventListener('click', () => {
            this.clearImage();
        });

        // URL loading for screenshots
        document.getElementById('loadScreenshotUrl').addEventListener('click', () => {
            this.loadScreenshotFromUrl();
        });

        document.getElementById('screenshotUrl').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadScreenshotFromUrl();
            }
        });

        // Background controls
        document.getElementById('bgColor').addEventListener('input', (e) => {
            this.config.background.color = e.target.value;
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('cornerRadius').addEventListener('input', (e) => {
            this.config.background.cornerRadius = parseInt(e.target.value);
            document.getElementById('cornerRadiusValue').textContent = e.target.value + 'px';
            this.renderPreview();
            this.saveState();
        });

        // Screenshot controls
        document.getElementById('screenshotScale').addEventListener('input', (e) => {
            this.config.screenshot.scale = parseFloat(e.target.value);
            document.getElementById('screenshotScaleValue').textContent = e.target.value + 'x';
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('rotationX').addEventListener('input', (e) => {
            this.config.screenshot.rotationX = parseInt(e.target.value);
            document.getElementById('rotationXValue').textContent = e.target.value + '°';
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('rotationY').addEventListener('input', (e) => {
            this.config.screenshot.rotationY = parseInt(e.target.value);
            document.getElementById('rotationYValue').textContent = e.target.value + '°';
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('rotationZ').addEventListener('input', (e) => {
            this.config.screenshot.rotationZ = parseInt(e.target.value);
            document.getElementById('rotationZValue').textContent = e.target.value + '°';
            this.renderPreview();
            this.saveState();
        });




        // App Icon controls
        const iconUploadArea = document.getElementById('iconUploadArea');
        const iconInput = document.getElementById('iconInput');
        const clearIconBtn = document.getElementById('clearIcon');

        iconUploadArea.addEventListener('click', () => iconInput.click());
        iconUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            iconUploadArea.classList.add('dragover');
        });
        iconUploadArea.addEventListener('dragleave', () => {
            iconUploadArea.classList.remove('dragover');
        });
        iconUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            iconUploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleIconUpload(files[0]);
            }
        });

        iconInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleIconUpload(e.target.files[0]);
            }
        });

        clearIconBtn.addEventListener('click', () => {
            this.clearIcon();
        });

        // URL loading for app icons
        document.getElementById('loadIconUrl').addEventListener('click', () => {
            this.loadIconFromUrl();
        });

        document.getElementById('iconUrl').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadIconFromUrl();
            }
        });

        document.getElementById('iconPosition').addEventListener('change', (e) => {
            this.config.appIcon.position = e.target.value;
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('iconSize').addEventListener('input', (e) => {
            this.config.appIcon.size = parseInt(e.target.value);
            document.getElementById('iconSizeValue').textContent = e.target.value + 'px';
            this.renderPreview();
            this.saveState();
        });

        // Icon repaint controls
        document.getElementById('iconRepaintEnabled').addEventListener('change', (e) => {
            this.config.appIcon.repaintEnabled = e.target.checked;
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('iconRepaintColor').addEventListener('input', (e) => {
            this.config.appIcon.repaintColor = e.target.value;
            this.renderPreview();
            this.saveState();
        });

        // Gradient controls
        document.getElementById('gradientEnabled').addEventListener('change', (e) => {
            this.config.gradient.enabled = e.target.checked;
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('gradientStartColor').addEventListener('input', (e) => {
            this.config.gradient.startColor = e.target.value;
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('gradientStartOpacity').addEventListener('input', (e) => {
            this.config.gradient.startOpacity = parseFloat(e.target.value);
            document.getElementById('gradientStartOpacityValue').textContent = Math.round(e.target.value * 100) + '%';
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('gradientStartOffset').addEventListener('input', (e) => {
            this.config.gradient.startOffset = parseFloat(e.target.value);
            document.getElementById('gradientStartOffsetValue').textContent = Math.round(e.target.value * 100) + '%';
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('gradientEndColor').addEventListener('input', (e) => {
            this.config.gradient.endColor = e.target.value;
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('gradientEndOpacity').addEventListener('input', (e) => {
            this.config.gradient.endOpacity = parseFloat(e.target.value);
            document.getElementById('gradientEndOpacityValue').textContent = Math.round(e.target.value * 100) + '%';
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('gradientEndOffset').addEventListener('input', (e) => {
            this.config.gradient.endOffset = parseFloat(e.target.value);
            document.getElementById('gradientEndOffsetValue').textContent = Math.round(e.target.value * 100) + '%';
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('gradientRotation').addEventListener('input', (e) => {
            this.config.gradient.rotation = parseInt(e.target.value);
            document.getElementById('gradientRotationValue').textContent = e.target.value + '°';
            this.renderPreview();
            this.saveState();
        });

        // Text controls
        document.getElementById('textContent').addEventListener('input', (e) => {
            this.config.text.content = e.target.value;
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('textPosition').addEventListener('change', (e) => {
            this.config.text.position = e.target.value;
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('textColor').addEventListener('input', (e) => {
            this.config.text.color = e.target.value;
            this.renderPreview();
            this.saveState();
        });

        document.getElementById('textSize').addEventListener('input', (e) => {
            this.config.text.size = parseInt(e.target.value);
            document.getElementById('textSizeValue').textContent = e.target.value + 'px';
            this.renderPreview();
            this.saveState();
        });

        // Font input handling with debounce
        document.getElementById('textFont').addEventListener('input', this.debounce((e) => {
            const fontName = e.target.value.trim();
            this.config.text.font = fontName;
            this.loadGoogleFont(fontName);
            this.saveState();
        }, 500));

        // Canvas drag events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Icon size controls
        document.getElementById('iconWidth').addEventListener('input', (e) => {
            this.config.iconSize.width = parseInt(e.target.value);
            this.updateExportInfo();
            this.updatePreviewSize();
            this.saveState();
        });

        document.getElementById('iconHeight').addEventListener('input', (e) => {
            this.config.iconSize.height = parseInt(e.target.value);
            this.updateExportInfo();
            this.updatePreviewSize();
            this.saveState();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportPNG();
        });

        // Initialize export info
        this.updateExportInfo();
    }

    handleMouseDown(e) {
        if (!this.currentImage) return;
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.canvas.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.currentImage) return;
        
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        this.config.screenshot.offsetX += deltaX;
        this.config.screenshot.offsetY += deltaY;
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        this.renderPreview();
    }

    handleMouseUp() {
        this.isDragging = false;
        this.canvas.style.cursor = this.currentImage ? 'grab' : 'default';
    }

    handleTouchStart(e) {
        if (!this.currentImage) return;
        e.preventDefault();
        this.isDragging = true;
        const touch = e.touches[0];
        this.lastMouseX = touch.clientX;
        this.lastMouseY = touch.clientY;
    }

    handleTouchMove(e) {
        if (!this.isDragging || !this.currentImage) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.lastMouseX;
        const deltaY = touch.clientY - this.lastMouseY;
        
        this.config.screenshot.offsetX += deltaX;
        this.config.screenshot.offsetY += deltaY;
        
        this.lastMouseX = touch.clientX;
        this.lastMouseY = touch.clientY;
        
        this.renderPreview();
    }

    handleTouchEnd() {
        this.isDragging = false;
    }

    handleFileUpload(file) {
        if (!file.type.match('image.*')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.updateFileInfo(file.name);
                this.enableExport();
                this.renderPreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    updateFileInfo(fileName) {
        document.getElementById('fileName').textContent = fileName;
        document.getElementById('fileInfo').style.display = 'block';
        document.querySelector('.preview-help').textContent = 'Drag controls to customize your icon';
    }

    handleIconUpload(file) {
        if (!file.type.match('image.*')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.config.appIcon.image = img;
                this.updateIconInfo(file.name);
                this.renderPreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    updateIconInfo(fileName) {
        document.getElementById('iconName').textContent = fileName;
        document.getElementById('iconInfo').style.display = 'block';
    }

    clearIcon() {
        this.config.appIcon.image = null;
        document.getElementById('iconInfo').style.display = 'none';
        document.getElementById('iconInput').value = '';
        this.renderPreview();
    }

    clearImage() {
        this.currentImage = null;
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('fileInput').value = '';
        document.querySelector('.preview-help').textContent = 'Upload a screenshot to begin customizing';
        this.disableExport();
        this.renderPreview();
    }

    enableExport() {
        document.getElementById('exportBtn').disabled = false;
    }

    disableExport() {
        document.getElementById('exportBtn').disabled = true;
    }

    updateExportInfo() {
        const { width, height } = this.config.iconSize;
        document.getElementById('exportSizeInfo').textContent = `Output: ${width}x${height} pixels`;
    }

    updatePreviewSize() {
        const { width, height } = this.config.iconSize;
        
        // Update preview info display
        document.querySelector('.preview-info p:first-child').textContent = `Size: ${width} × ${height} pixels`;
        
        // Resize the preview canvas to match the custom size
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Re-render the preview with new size
        this.renderPreview();
    }

    saveState() {
        // Save configuration to localStorage
        localStorage.setItem('iconCustomizerState', JSON.stringify(this.config));
    }

    loadState() {
        try {
            const savedState = localStorage.getItem('iconCustomizerState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                
                // Merge saved state with current config (preserve images)
                this.config = {
                    ...this.config,
                    ...parsedState,
                    // Don't restore image data
                    appIcon: {
                        ...this.config.appIcon,
                        ...parsedState.appIcon,
                        image: null // Don't restore uploaded images
                    }
                };
                
                // Update UI controls with saved values
                this.updateUIControls();
            }
        } catch (error) {
            console.warn('Failed to load saved state:', error);
            // Continue with default config if loading fails
        }
    }

    updateUIControls() {
        // Background controls
        document.getElementById('bgColor').value = this.config.background.color;
        document.getElementById('cornerRadius').value = this.config.background.cornerRadius;
        document.getElementById('cornerRadiusValue').textContent = this.config.background.cornerRadius + 'px';

        // Screenshot controls
        document.getElementById('screenshotScale').value = this.config.screenshot.scale;
        document.getElementById('screenshotScaleValue').textContent = this.config.screenshot.scale + 'x';
        document.getElementById('rotationX').value = this.config.screenshot.rotationX;
        document.getElementById('rotationXValue').textContent = this.config.screenshot.rotationX + '°';
        document.getElementById('rotationY').value = this.config.screenshot.rotationY;
        document.getElementById('rotationYValue').textContent = this.config.screenshot.rotationY + '°';
        document.getElementById('rotationZ').value = this.config.screenshot.rotationZ;
        document.getElementById('rotationZValue').textContent = this.config.screenshot.rotationZ + '°';

        // App Icon controls
        document.getElementById('iconPosition').value = this.config.appIcon.position;
        document.getElementById('iconSize').value = this.config.appIcon.size;
        document.getElementById('iconSizeValue').textContent = this.config.appIcon.size + 'px';
        document.getElementById('iconRepaintEnabled').checked = this.config.appIcon.repaintEnabled;
        document.getElementById('iconRepaintColor').value = this.config.appIcon.repaintColor;

        // Gradient controls
        document.getElementById('gradientEnabled').checked = this.config.gradient.enabled;
        document.getElementById('gradientStartColor').value = this.config.gradient.startColor;
        document.getElementById('gradientStartOpacity').value = this.config.gradient.startOpacity;
        document.getElementById('gradientStartOpacityValue').textContent = Math.round(this.config.gradient.startOpacity * 100) + '%';
        document.getElementById('gradientStartOffset').value = this.config.gradient.startOffset;
        document.getElementById('gradientStartOffsetValue').textContent = Math.round(this.config.gradient.startOffset * 100) + '%';
        document.getElementById('gradientEndColor').value = this.config.gradient.endColor;
        document.getElementById('gradientEndOpacity').value = this.config.gradient.endOpacity;
        document.getElementById('gradientEndOpacityValue').textContent = Math.round(this.config.gradient.endOpacity * 100) + '%';
        document.getElementById('gradientEndOffset').value = this.config.gradient.endOffset;
        document.getElementById('gradientEndOffsetValue').textContent = Math.round(this.config.gradient.endOffset * 100) + '%';
        document.getElementById('gradientRotation').value = this.config.gradient.rotation;
        document.getElementById('gradientRotationValue').textContent = this.config.gradient.rotation + '°';

        // Text controls
        document.getElementById('textContent').value = this.config.text.content;
        document.getElementById('textFont').value = this.config.text.font;
        document.getElementById('textPosition').value = this.config.text.position;
        document.getElementById('textColor').value = this.config.text.color;
        document.getElementById('textSize').value = this.config.text.size;
        document.getElementById('textSizeValue').textContent = this.config.text.size + 'px';

        // Icon size controls
        document.getElementById('iconWidth').value = this.config.iconSize.width;
        document.getElementById('iconHeight').value = this.config.iconSize.height;
        this.updateExportInfo();
    }

    renderPreview() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.drawBackground();

        // Draw screenshot if available
        if (this.currentImage) {
            this.drawScreenshot();
        }

        // Draw gradient overlay (before watermark and text)
        this.drawGradientOverlay();

        // Draw app icon watermark if available (over gradient)
        if (this.config.appIcon.image) {
            this.drawAppIcon();
        }

        // Draw text (over everything)
        this.drawText();
    }

    drawBackground() {
        const { color, cornerRadius } = this.config.background;
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.save();
        
        // Create rounded rectangle path
        if (cornerRadius > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(cornerRadius, 0);
            this.ctx.lineTo(width - cornerRadius, 0);
            this.ctx.quadraticCurveTo(width, 0, width, cornerRadius);
            this.ctx.lineTo(width, height - cornerRadius);
            this.ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
            this.ctx.lineTo(cornerRadius, height);
            this.ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
            this.ctx.lineTo(0, cornerRadius);
            this.ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
            this.ctx.closePath();
            this.ctx.clip();
        }

        // Fill with background color (always full opacity)
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, width, height);
        
        this.ctx.restore();
    }

    drawScreenshot() {
        if (!this.currentImage) return;

        const { scale, offsetX, offsetY, rotationX, rotationY, rotationZ } = this.config.screenshot;
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.save();

        // Apply rounded corners clip
        const cornerRadius = this.config.background.cornerRadius;
        if (cornerRadius > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(cornerRadius, 0);
            this.ctx.lineTo(width - cornerRadius, 0);
            this.ctx.quadraticCurveTo(width, 0, width, cornerRadius);
            this.ctx.lineTo(width, height - cornerRadius);
            this.ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
            this.ctx.lineTo(cornerRadius, height);
            this.ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
            this.ctx.lineTo(0, cornerRadius);
            this.ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
            this.ctx.closePath();
            this.ctx.clip();
        }

        // Calculate scaled dimensions
        const scaledWidth = this.currentImage.width * scale;
        const scaledHeight = this.currentImage.height * scale;

        // Calculate center position with offset
        const centerX = width / 2 + offsetX;
        const centerY = height / 2 + offsetY;

        // Apply 3D transformations if any rotation is set
        if (rotationX !== 0 || rotationY !== 0 || rotationZ !== 0) {
            // Move to center for rotation
            this.ctx.translate(centerX, centerY);
            
            // Apply 3D rotation using matrix transformation
            this.apply3DRotation(rotationX, rotationY, rotationZ);
            
            // Draw image centered at transformed origin
            this.ctx.drawImage(
                this.currentImage,
                -scaledWidth / 2,
                -scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );
        } else {
            // No rotation, draw normally with offset
            const x = centerX - scaledWidth / 2;
            const y = centerY - scaledHeight / 2;
            this.ctx.drawImage(this.currentImage, x, y, scaledWidth, scaledHeight);
        }

        this.ctx.restore();
    }

    drawAppIcon() {
        if (!this.config.appIcon.image) return;

        const { image, position, size, repaintEnabled, repaintColor } = this.config.appIcon;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 20;

        this.ctx.save();

        // Calculate position based on selection
        let x, y;

        switch (position) {
            case 'top-left':
                x = padding;
                y = padding;
                break;
            case 'top-right':
                x = width - size - padding;
                y = padding;
                break;
            case 'bottom-left':
                x = padding;
                y = height - size - padding;
                break;
            case 'bottom-right':
                x = width - size - padding;
                y = height - size - padding;
                break;
            case 'center':
                x = (width - size) / 2;
                y = (height - size) / 2;
                break;
            default:
                x = padding;
                y = padding;
        }

        if (repaintEnabled) {
            // Draw repainted icon with color replacement
            this.drawRepaintedIcon(image, x, y, size, repaintColor);
        } else {
            // Draw the original app icon
            this.ctx.drawImage(image, x, y, size, size);
        }

        this.ctx.restore();
    }

    drawRepaintedIcon(image, x, y, size, repaintColor) {
        // Create a temporary canvas for image processing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = image.width;
        tempCanvas.height = image.height;
        
        // Draw the original image to get pixel data
        tempCtx.drawImage(image, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        
        // Parse the repaint color
        const repaintR = parseInt(repaintColor.substring(1, 3), 16);
        const repaintG = parseInt(repaintColor.substring(3, 5), 16);
        const repaintB = parseInt(repaintColor.substring(5, 7), 16);
        
        // Replace all colors while preserving alpha
        for (let i = 0; i < data.length; i += 4) {
            // Keep original alpha, replace RGB with repaint color
            data[i] = repaintR;     // R
            data[i + 1] = repaintG; // G
            data[i + 2] = repaintB; // B
            // Alpha channel (data[i + 3]) remains unchanged
        }
        
        // Put the modified image data back
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw the repainted icon to the main canvas
        this.ctx.drawImage(tempCanvas, x, y, size, size);
    }

    apply3DRotation(rotationX, rotationY, rotationZ) {
        // Convert degrees to radians
        const rx = rotationX * Math.PI / 180;
        const ry = rotationY * Math.PI / 180;
        const rz = rotationZ * Math.PI / 180;

        // Calculate rotation matrices
        // X-axis rotation matrix
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        
        // Y-axis rotation matrix
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);
        
        // Z-axis rotation matrix
        const cosZ = Math.cos(rz);
        const sinZ = Math.sin(rz);

        // Combined rotation matrix (Z * Y * X order)
        const m11 = cosZ * cosY;
        const m12 = cosZ * sinY * sinX - sinZ * cosX;
        const m21 = sinZ * cosY;
        const m22 = sinZ * sinY * sinX + cosZ * cosX;
        const m31 = -sinY;
        const m32 = cosY * sinX;

        // Apply the transformation matrix
        // Note: Canvas 2D only supports 2D transformations, so we simulate 3D
        // by applying a 2D transformation that approximates the 3D rotation
        this.ctx.transform(m11, m21, m12, m22, 0, 0);
    }

    drawGradientOverlay() {
        const { enabled, startColor, endColor, startOpacity, endOpacity, startOffset, endOffset, rotation } = this.config.gradient;
        if (!enabled || (startOpacity <= 0 && endOpacity <= 0)) return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.save();
        
        // Apply rounded corners clip to match the background
        const cornerRadius = this.config.background.cornerRadius;
        if (cornerRadius > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(cornerRadius, 0);
            this.ctx.lineTo(width - cornerRadius, 0);
            this.ctx.quadraticCurveTo(width, 0, width, cornerRadius);
            this.ctx.lineTo(width, height - cornerRadius);
            this.ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
            this.ctx.lineTo(cornerRadius, height);
            this.ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
            this.ctx.lineTo(0, cornerRadius);
            this.ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
            this.ctx.closePath();
            this.ctx.clip();
        }

        // Calculate gradient direction based on rotation
        const angle = rotation * Math.PI / 180;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate gradient line length to cover the entire canvas at any angle
        const diagonal = Math.sqrt(width * width + height * height);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        const startX = centerX - cos * diagonal / 2;
        const startY = centerY - sin * diagonal / 2;
        const endX = centerX + cos * diagonal / 2;
        const endY = centerY + sin * diagonal / 2;

        // Create gradient with individual opacities and offsets
        const gradient = this.ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(startOffset, this.hexToRgba(startColor, startOpacity));
        gradient.addColorStop(endOffset, this.hexToRgba(endColor, endOpacity));

        // Draw gradient overlay
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        this.ctx.restore();
    }

    hexToRgba(hex, opacity) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    drawText() {
        const { content, color, size, position } = this.config.text;
        const width = this.canvas.width;
        const height = this.canvas.height;

        if (!content.trim()) return;

        this.ctx.save();
        
        // Set base text properties
        this.ctx.fillStyle = color;
        
        // Use custom font if specified, otherwise fallback to system fonts
        const fontFamily = this.config.text.font && this.config.text.font !== 'Segoe UI'
            ? `'${this.config.text.font}', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
            : `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        
        this.ctx.font = `bold ${size}px ${fontFamily}`;
        
        // Set text alignment and position based on selection
        let x, y, textAlign, textBaseline;
        const padding = 30;

        switch (position) {
            case 'center':
                x = width / 2;
                y = height / 2;
                textAlign = 'center';
                textBaseline = 'middle';
                break;
            case 'top-center':
                x = width / 2;
                y = padding;
                textAlign = 'center';
                textBaseline = 'top';
                break;
            case 'bottom-center':
                x = width / 2;
                y = height - padding;
                textAlign = 'center';
                textBaseline = 'bottom';
                break;
            case 'top-left':
                x = padding;
                y = padding;
                textAlign = 'left';
                textBaseline = 'top';
                break;
            case 'top-right':
                x = width - padding;
                y = padding;
                textAlign = 'right';
                textBaseline = 'top';
                break;
            case 'bottom-left':
                x = padding;
                y = height - padding;
                textAlign = 'left';
                textBaseline = 'bottom';
                break;
            case 'bottom-right':
                x = width - padding;
                y = height - padding;
                textAlign = 'right';
                textBaseline = 'bottom';
                break;
            default:
                x = width / 2;
                y = height / 2;
                textAlign = 'center';
                textBaseline = 'middle';
        }

        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;

        // Add text shadow for better readability
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;

        // Parse and render rich text with HTML tags
        this.drawRichText(content, x, y, textAlign, textBaseline, size, color);

        this.ctx.restore();
    }

    drawRichText(htmlContent, x, y, textAlign, textBaseline, baseSize, baseColor) {
        // Parse HTML content and extract text segments with styles
        const segments = this.parseHTML(htmlContent, baseSize, baseColor);
        
        // Calculate total width for centering
        let totalWidth = 0;
        segments.forEach(segment => {
            this.ctx.font = segment.font;
            totalWidth += this.ctx.measureText(segment.text).width;
        });

        // Calculate starting position based on alignment
        let currentX = x;
        if (textAlign === 'center') {
            currentX = x - totalWidth / 2;
        } else if (textAlign === 'right') {
            currentX = x - totalWidth;
        }

        // Draw each text segment
        segments.forEach(segment => {
            this.ctx.font = segment.font;
            this.ctx.fillStyle = segment.color;
            
            this.ctx.fillText(segment.text, currentX, y);
            
            // Move to next position
            currentX += this.ctx.measureText(segment.text).width;
        });
    }

    parseHTML(htmlContent, baseSize, baseColor) {
        const segments = [];
        let currentText = '';
        let currentStyles = {
            bold: false,
            italic: false,
            color: baseColor,
            fontSize: baseSize
        };

        // Simple HTML parser for basic tags
        const tagRegex = /(<(\/?)(b|i|span)(?:\s+[^>]*)?>)|([^<]+)/g;
        let match;

        while ((match = tagRegex.exec(htmlContent)) !== null) {
            if (match[4]) {
                // Text content
                currentText += match[4];
            } else if (match[1]) {
                // HTML tag
                const isClosing = match[2] === '/';
                const tagName = match[3];

                // If we have accumulated text, add it as a segment
                if (currentText) {
                    segments.push({
                        text: currentText,
                        font: this.buildFontString(currentStyles),
                        color: currentStyles.color
                    });
                    currentText = '';
                }

                // Handle opening tags
                if (!isClosing) {
                    if (tagName === 'b') {
                        currentStyles.bold = true;
                    } else if (tagName === 'i') {
                        currentStyles.italic = true;
                    } else if (tagName === 'span') {
                        // Parse span attributes
                        const styleMatch = match[1].match(/style="([^"]*)"/);
                        if (styleMatch) {
                            const style = styleMatch[1];
                            
                            // Parse color
                            const colorMatch = style.match(/color:\s*([^;]+)/);
                            if (colorMatch) {
                                currentStyles.color = colorMatch[1].trim();
                            }
                            
                            // Parse font size
                            const sizeMatch = style.match(/font-size:\s*(\d+)px/);
                            if (sizeMatch) {
                                currentStyles.fontSize = parseInt(sizeMatch[1]);
                            }
                        }
                    }
                } else {
                    // Handle closing tags
                    if (tagName === 'b') {
                        currentStyles.bold = false;
                    } else if (tagName === 'i') {
                        currentStyles.italic = false;
                    } else if (tagName === 'span') {
                        // Reset span styles to base
                        currentStyles.color = baseColor;
                        currentStyles.fontSize = baseSize;
                    }
                }
            }
        }

        // Add any remaining text
        if (currentText) {
            segments.push({
                text: currentText,
                font: this.buildFontString(currentStyles),
                color: currentStyles.color
            });
        }

        return segments;
    }

    buildFontString(styles) {
        let font = '';
        
        if (styles.bold) font += 'bold ';
        if (styles.italic) font += 'italic ';
        
        font += `${styles.fontSize}px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        
        return font;
    }

    exportPNG() {
        if (!this.currentImage) {
            alert('Please upload a screenshot first.');
            return;
        }

        // Create a temporary canvas with the custom export size
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        const { width, height } = this.config.iconSize;
        
        exportCanvas.width = width;
        exportCanvas.height = height;

        // Render the icon at the custom size
        this.renderToCanvas(exportCtx, width, height);

        // Create download link
        const link = document.createElement('a');
        link.download = `custom-icon-${width}x${height}-${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    renderToCanvas(ctx, width, height) {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background
        this.drawBackgroundToCanvas(ctx, width, height);

        // Draw screenshot if available
        if (this.currentImage) {
            this.drawScreenshotToCanvas(ctx, width, height);
        }

        // Draw gradient overlay (before watermark and text)
        this.drawGradientOverlayToCanvas(ctx, width, height);

        // Draw app icon watermark if available (over gradient)
        if (this.config.appIcon.image) {
            this.drawAppIconToCanvas(ctx, width, height);
        }

        // Draw text (over everything)
        this.drawTextToCanvas(ctx, width, height);
    }

    drawBackgroundToCanvas(ctx, width, height) {
        const { color, cornerRadius } = this.config.background;

        ctx.save();
        
        // Create rounded rectangle path
        if (cornerRadius > 0) {
            const scaledRadius = Math.min(cornerRadius * (width / 512), cornerRadius * (height / 512));
            ctx.beginPath();
            ctx.moveTo(scaledRadius, 0);
            ctx.lineTo(width - scaledRadius, 0);
            ctx.quadraticCurveTo(width, 0, width, scaledRadius);
            ctx.lineTo(width, height - scaledRadius);
            ctx.quadraticCurveTo(width, height, width - scaledRadius, height);
            ctx.lineTo(scaledRadius, height);
            ctx.quadraticCurveTo(0, height, 0, height - scaledRadius);
            ctx.lineTo(0, scaledRadius);
            ctx.quadraticCurveTo(0, 0, scaledRadius, 0);
            ctx.closePath();
            ctx.clip();
        }

        // Fill with background color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        
        ctx.restore();
    }

    drawScreenshotToCanvas(ctx, width, height) {
        if (!this.currentImage) return;

        const { scale, offsetX, offsetY, rotationX, rotationY, rotationZ } = this.config.screenshot;
        const scaleFactor = Math.min(width / 512, height / 512);

        ctx.save();

        // Apply rounded corners clip
        const cornerRadius = this.config.background.cornerRadius;
        if (cornerRadius > 0) {
            const scaledRadius = Math.min(cornerRadius * (width / 512), cornerRadius * (height / 512));
            ctx.beginPath();
            ctx.moveTo(scaledRadius, 0);
            ctx.lineTo(width - scaledRadius, 0);
            ctx.quadraticCurveTo(width, 0, width, scaledRadius);
            ctx.lineTo(width, height - scaledRadius);
            ctx.quadraticCurveTo(width, height, width - scaledRadius, height);
            ctx.lineTo(scaledRadius, height);
            ctx.quadraticCurveTo(0, height, 0, height - scaledRadius);
            ctx.lineTo(0, scaledRadius);
            ctx.quadraticCurveTo(0, 0, scaledRadius, 0);
            ctx.closePath();
            ctx.clip();
        }

        // Calculate scaled dimensions
        const scaledWidth = this.currentImage.width * scale * scaleFactor;
        const scaledHeight = this.currentImage.height * scale * scaleFactor;

        // Calculate center position with offset (scaled)
        const centerX = width / 2 + offsetX * scaleFactor;
        const centerY = height / 2 + offsetY * scaleFactor;

        // Apply 3D transformations if any rotation is set
        if (rotationX !== 0 || rotationY !== 0 || rotationZ !== 0) {
            // Move to center for rotation
            ctx.translate(centerX, centerY);
            
            // Apply 3D rotation using matrix transformation
            this.apply3DRotationToCanvas(ctx, rotationX, rotationY, rotationZ);
            
            // Draw image centered at transformed origin
            ctx.drawImage(
                this.currentImage,
                -scaledWidth / 2,
                -scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );
        } else {
            // No rotation, draw normally with offset
            const x = centerX - scaledWidth / 2;
            const y = centerY - scaledHeight / 2;
            ctx.drawImage(this.currentImage, x, y, scaledWidth, scaledHeight);
        }

        ctx.restore();
    }

    drawAppIconToCanvas(ctx, width, height) {
        if (!this.config.appIcon.image) return;

        const { image, position, size, repaintEnabled, repaintColor } = this.config.appIcon;
        const scaleFactor = Math.min(width / 512, height / 512);
        const scaledSize = size * scaleFactor;
        const padding = 20 * scaleFactor;

        ctx.save();

        // Calculate position based on selection
        let x, y;

        switch (position) {
            case 'top-left':
                x = padding;
                y = padding;
                break;
            case 'top-right':
                x = width - scaledSize - padding;
                y = padding;
                break;
            case 'bottom-left':
                x = padding;
                y = height - scaledSize - padding;
                break;
            case 'bottom-right':
                x = width - scaledSize - padding;
                y = height - scaledSize - padding;
                break;
            case 'center':
                x = (width - scaledSize) / 2;
                y = (height - scaledSize) / 2;
                break;
            default:
                x = padding;
                y = padding;
        }

        if (repaintEnabled) {
            // Draw repainted icon with color replacement
            this.drawRepaintedIconToCanvas(ctx, image, x, y, scaledSize, repaintColor);
        } else {
            // Draw the original app icon
            ctx.drawImage(image, x, y, scaledSize, scaledSize);
        }

        ctx.restore();
    }

    drawRepaintedIconToCanvas(ctx, image, x, y, size, repaintColor) {
        // Create a temporary canvas for image processing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = image.width;
        tempCanvas.height = image.height;
        
        // Draw the original image to get pixel data
        tempCtx.drawImage(image, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        
        // Parse the repaint color
        const repaintR = parseInt(repaintColor.substring(1, 3), 16);
        const repaintG = parseInt(repaintColor.substring(3, 5), 16);
        const repaintB = parseInt(repaintColor.substring(5, 7), 16);
        
        // Replace all colors while preserving alpha
        for (let i = 0; i < data.length; i += 4) {
            // Keep original alpha, replace RGB with repaint color
            data[i] = repaintR;     // R
            data[i + 1] = repaintG; // G
            data[i + 2] = repaintB; // B
            // Alpha channel (data[i + 3]) remains unchanged
        }
        
        // Put the modified image data back
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw the repainted icon to the target canvas
        ctx.drawImage(tempCanvas, x, y, size, size);
    }

    drawGradientOverlayToCanvas(ctx, width, height) {
        const { enabled, startColor, endColor, startOpacity, endOpacity, startOffset, endOffset, rotation } = this.config.gradient;
        if (!enabled || (startOpacity <= 0 && endOpacity <= 0)) return;

        ctx.save();
        
        // Apply rounded corners clip to match the background
        const cornerRadius = this.config.background.cornerRadius;
        if (cornerRadius > 0) {
            const scaledRadius = Math.min(cornerRadius * (width / 512), cornerRadius * (height / 512));
            ctx.beginPath();
            ctx.moveTo(scaledRadius, 0);
            ctx.lineTo(width - scaledRadius, 0);
            ctx.quadraticCurveTo(width, 0, width, scaledRadius);
            ctx.lineTo(width, height - scaledRadius);
            ctx.quadraticCurveTo(width, height, width - scaledRadius, height);
            ctx.lineTo(scaledRadius, height);
            ctx.quadraticCurveTo(0, height, 0, height - scaledRadius);
            ctx.lineTo(0, scaledRadius);
            ctx.quadraticCurveTo(0, 0, scaledRadius, 0);
            ctx.closePath();
            ctx.clip();
        }

        // Calculate gradient direction based on rotation
        const angle = rotation * Math.PI / 180;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate gradient line length to cover the entire canvas at any angle
        const diagonal = Math.sqrt(width * width + height * height);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        const startX = centerX - cos * diagonal / 2;
        const startY = centerY - sin * diagonal / 2;
        const endX = centerX + cos * diagonal / 2;
        const endY = centerY + sin * diagonal / 2;

        // Create gradient with individual opacities and offsets
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(startOffset, this.hexToRgba(startColor, startOpacity));
        gradient.addColorStop(endOffset, this.hexToRgba(endColor, endOpacity));

        // Draw gradient overlay
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.restore();
    }

    drawTextToCanvas(ctx, width, height) {
        const { content, color, size, position } = this.config.text;
        const scaleFactor = Math.min(width / 512, height / 512);
        const scaledSize = size * scaleFactor;

        if (!content.trim()) return;

        ctx.save();
        
        // Set base text properties
        ctx.fillStyle = color;
        
        // Use custom font if specified, otherwise fallback to system fonts
        const fontFamily = this.config.text.font && this.config.text.font !== 'Segoe UI'
            ? `'${this.config.text.font}', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
            : `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        
        ctx.font = `bold ${scaledSize}px ${fontFamily}`;
        
        // Set text alignment and position based on selection
        let x, y, textAlign, textBaseline;
        const padding = 30 * scaleFactor;

        switch (position) {
            case 'center':
                x = width / 2;
                y = height / 2;
                textAlign = 'center';
                textBaseline = 'middle';
                break;
            case 'top-center':
                x = width / 2;
                y = padding;
                textAlign = 'center';
                textBaseline = 'top';
                break;
            case 'bottom-center':
                x = width / 2;
                y = height - padding;
                textAlign = 'center';
                textBaseline = 'bottom';
                break;
            case 'top-left':
                x = padding;
                y = padding;
                textAlign = 'left';
                textBaseline = 'top';
                break;
            case 'top-right':
                x = width - padding;
                y = padding;
                textAlign = 'right';
                textBaseline = 'top';
                break;
            case 'bottom-left':
                x = padding;
                y = height - padding;
                textAlign = 'left';
                textBaseline = 'bottom';
                break;
            case 'bottom-right':
                x = width - padding;
                y = height - padding;
                textAlign = 'right';
                textBaseline = 'bottom';
                break;
            default:
                x = width / 2;
                y = height / 2;
                textAlign = 'center';
                textBaseline = 'middle';
        }

        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;

        // Add text shadow for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 8 * scaleFactor;
        ctx.shadowOffsetX = 2 * scaleFactor;
        ctx.shadowOffsetY = 2 * scaleFactor;

        // Parse and render rich text with HTML tags
        this.drawRichTextToCanvas(ctx, content, x, y, textAlign, textBaseline, scaledSize, color);

        ctx.restore();
    }

    drawRichTextToCanvas(ctx, htmlContent, x, y, textAlign, textBaseline, baseSize, baseColor) {
        // Parse HTML content and extract text segments with styles
        const segments = this.parseHTML(htmlContent, baseSize, baseColor);
        
        // Calculate total width for centering
        let totalWidth = 0;
        segments.forEach(segment => {
            ctx.font = segment.font;
            totalWidth += ctx.measureText(segment.text).width;
        });

        // Calculate starting position based on alignment
        let currentX = x;
        if (textAlign === 'center') {
            currentX = x - totalWidth / 2;
        } else if (textAlign === 'right') {
            currentX = x - totalWidth;
        }

        // Draw each text segment
        segments.forEach(segment => {
            ctx.font = segment.font;
            ctx.fillStyle = segment.color;
            
            ctx.fillText(segment.text, currentX, y);
            
            // Move to next position
            currentX += ctx.measureText(segment.text).width;
        });
    }

    apply3DRotationToCanvas(ctx, rotationX, rotationY, rotationZ) {
        // Convert degrees to radians
        const rx = rotationX * Math.PI / 180;
        const ry = rotationY * Math.PI / 180;
        const rz = rotationZ * Math.PI / 180;

        // Calculate rotation matrices
        // X-axis rotation matrix
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        
        // Y-axis rotation matrix
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);
        
        // Z-axis rotation matrix
        const cosZ = Math.cos(rz);
        const sinZ = Math.sin(rz);

        // Combined rotation matrix (Z * Y * X order)
        const m11 = cosZ * cosY;
        const m12 = cosZ * sinY * sinX - sinZ * cosX;
        const m21 = sinZ * cosY;
        const m22 = sinZ * sinY * sinX + cosZ * cosX;
        const m31 = -sinY;
        const m32 = cosY * sinX;

        // Apply the transformation matrix
        ctx.transform(m11, m21, m12, m22, 0, 0);
    }

    loadScreenshotFromUrl() {
        const urlInput = document.getElementById('screenshotUrl');
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Please enter a valid URL');
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            alert('Please enter a valid URL format (e.g., https://example.com/image.png)');
            return;
        }

        this.loadImageFromUrl(url, (img) => {
            this.currentImage = img;
            this.updateFileInfo('URL: ' + this.truncateUrl(url));
            this.enableExport();
            this.renderPreview();
            urlInput.value = ''; // Clear the input after successful load
        }, (error) => {
            alert('Failed to load image from URL. Please check the URL and try again.');
            console.error('URL loading error:', error);
        });
    }

    loadIconFromUrl() {
        const urlInput = document.getElementById('iconUrl');
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Please enter a valid URL');
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            alert('Please enter a valid URL format (e.g., https://example.com/icon.png)');
            return;
        }

        this.loadImageFromUrl(url, (img) => {
            this.config.appIcon.image = img;
            this.updateIconInfo('URL: ' + this.truncateUrl(url));
            this.renderPreview();
            urlInput.value = ''; // Clear the input after successful load
        }, (error) => {
            alert('Failed to load icon from URL. Please check the URL and try again.');
            console.error('URL loading error:', error);
        });
    }

    loadImageFromUrl(url, onSuccess, onError) {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS for external images
        
        img.onload = () => {
            onSuccess(img);
        };
        
        img.onerror = (error) => {
            onError(error);
        };
        
        img.src = url;
    }

    truncateUrl(url, maxLength = 30) {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength - 3) + '...';
    }

    loadGoogleFont(fontName) {
        console.log('Loading font:', fontName);
        
        if (!fontName || fontName === 'Segoe UI') {
            // Use default system font
            console.log('Using default system font');
            this.renderPreview();
            return;
        }

        // Clean font name for Google Fonts API
        const cleanFontName = fontName.replace(/['"]/g, '').trim();
        console.log('Cleaned font name:', cleanFontName);
        
        // Show loading indicator
        const fontLoading = document.getElementById('fontLoading');
        fontLoading.style.display = 'flex';

        // Remove previous font link if exists
        const existingLink = document.querySelector('link[data-font-loaded]');
        if (existingLink) {
            existingLink.remove();
        }

        // Create new font link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFontName)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap`;
        link.setAttribute('data-font-loaded', 'true');
        document.head.appendChild(link);

        // Wait for font to load using FontFaceObserver
        const font = new FontFaceObserver(cleanFontName);
        font.load(null, 15000).then(() => {
            console.log(`FontFaceObserver: Font ${cleanFontName} loaded successfully`);
            
            // Double check with document.fonts API
            return document.fonts.ready.then(() => {
                console.log('Document fonts ready, checking font availability...');
                
                // Verify the font is actually available
                if (document.fonts.check(`16px "${cleanFontName}"`)) {
                    console.log(`Font ${cleanFontName} is confirmed available`);
                    // Hide loading indicator
                    fontLoading.style.display = 'none';
                    this.renderPreview();
                } else {
                    console.warn(`Font ${cleanFontName} not available after loading`);
                    // Hide loading indicator
                    fontLoading.style.display = 'none';
                    this.renderPreview();
                }
            });
        }).catch((error) => {
            console.warn(`Font ${cleanFontName} failed to load:`, error);
            // Hide loading indicator
            fontLoading.style.display = 'none';
            // Fallback to system font but still try to render
            this.renderPreview();
        });
    }

    buildFontString(styles) {
        let font = '';
        
        // Handle font weight and style
        if (styles.bold) {
            font += 'bold ';
        } else {
            font += 'normal ';
        }
        
        if (styles.italic) {
            font += 'italic ';
        }
        
        // Use custom font if specified, otherwise fallback to system fonts
        const fontFamily = this.config.text.font && this.config.text.font !== 'Segoe UI'
            ? `'${this.config.text.font}', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
            : `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        
        font += `${styles.fontSize}px ${fontFamily}`;
        
        console.log('Built font string:', font);
        return font;
    }

    initializeResizable() {
        const controlsPanel = document.querySelector('.controls-panel');
        const mainContent = document.querySelector('.main-content');
        let isResizing = false;
        let startX, startWidth;

        const handleMouseDown = (e) => {
            // Only start resizing if clicking near the right edge
            const rect = controlsPanel.getBoundingClientRect();
            if (e.clientX > rect.right - 10) {
                isResizing = true;
                startX = e.clientX;
                startWidth = parseInt(document.defaultView.getComputedStyle(controlsPanel).width, 10);
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                controlsPanel.style.userSelect = 'none';
                controlsPanel.style.cursor = 'col-resize';
                e.preventDefault();
            }
        };

        const handleMouseMove = (e) => {
            if (!isResizing) return;
            
            const width = startWidth + (e.clientX - startX);
            const minWidth = 300;
            const maxWidth = 800;
            
            if (width >= minWidth && width <= maxWidth) {
                controlsPanel.style.width = width + 'px';
                mainContent.style.gridTemplateColumns = width + 'px 1fr';
            }
        };

        const handleMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            controlsPanel.style.userSelect = '';
            controlsPanel.style.cursor = '';
        };

        controlsPanel.addEventListener('mousedown', handleMouseDown);
        
        // Prevent text selection while resizing
        controlsPanel.addEventListener('selectstart', (e) => {
            if (isResizing) {
                e.preventDefault();
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IconCustomizer();
});