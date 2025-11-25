class IconCustomizer {
    constructor() {
        this.canvas = document.getElementById('previewCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentImage = null;
        this.config = {
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
                color: '#ffffff',
                size: 24,
                position: 'center'
            }
        };

        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.initializeEventListeners();
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

        // Background controls
        document.getElementById('bgColor').addEventListener('input', (e) => {
            this.config.background.color = e.target.value;
            this.renderPreview();
        });

        document.getElementById('cornerRadius').addEventListener('input', (e) => {
            this.config.background.cornerRadius = parseInt(e.target.value);
            document.getElementById('cornerRadiusValue').textContent = e.target.value + 'px';
            this.renderPreview();
        });

        // Screenshot controls
        document.getElementById('screenshotScale').addEventListener('input', (e) => {
            this.config.screenshot.scale = parseFloat(e.target.value);
            document.getElementById('screenshotScaleValue').textContent = e.target.value + 'x';
            this.renderPreview();
        });

        document.getElementById('rotationX').addEventListener('input', (e) => {
            this.config.screenshot.rotationX = parseInt(e.target.value);
            document.getElementById('rotationXValue').textContent = e.target.value + '°';
            this.renderPreview();
        });

        document.getElementById('rotationY').addEventListener('input', (e) => {
            this.config.screenshot.rotationY = parseInt(e.target.value);
            document.getElementById('rotationYValue').textContent = e.target.value + '°';
            this.renderPreview();
        });

        document.getElementById('rotationZ').addEventListener('input', (e) => {
            this.config.screenshot.rotationZ = parseInt(e.target.value);
            document.getElementById('rotationZValue').textContent = e.target.value + '°';
            this.renderPreview();
        });




        // Gradient controls
        document.getElementById('gradientEnabled').addEventListener('change', (e) => {
            this.config.gradient.enabled = e.target.checked;
            this.renderPreview();
        });

        document.getElementById('gradientStartColor').addEventListener('input', (e) => {
            this.config.gradient.startColor = e.target.value;
            this.renderPreview();
        });

        document.getElementById('gradientStartOpacity').addEventListener('input', (e) => {
            this.config.gradient.startOpacity = parseFloat(e.target.value);
            document.getElementById('gradientStartOpacityValue').textContent = Math.round(e.target.value * 100) + '%';
            this.renderPreview();
        });

        document.getElementById('gradientStartOffset').addEventListener('input', (e) => {
            this.config.gradient.startOffset = parseFloat(e.target.value);
            document.getElementById('gradientStartOffsetValue').textContent = Math.round(e.target.value * 100) + '%';
            this.renderPreview();
        });

        document.getElementById('gradientEndColor').addEventListener('input', (e) => {
            this.config.gradient.endColor = e.target.value;
            this.renderPreview();
        });

        document.getElementById('gradientEndOpacity').addEventListener('input', (e) => {
            this.config.gradient.endOpacity = parseFloat(e.target.value);
            document.getElementById('gradientEndOpacityValue').textContent = Math.round(e.target.value * 100) + '%';
            this.renderPreview();
        });

        document.getElementById('gradientEndOffset').addEventListener('input', (e) => {
            this.config.gradient.endOffset = parseFloat(e.target.value);
            document.getElementById('gradientEndOffsetValue').textContent = Math.round(e.target.value * 100) + '%';
            this.renderPreview();
        });

        document.getElementById('gradientRotation').addEventListener('input', (e) => {
            this.config.gradient.rotation = parseInt(e.target.value);
            document.getElementById('gradientRotationValue').textContent = e.target.value + '°';
            this.renderPreview();
        });

        // Text controls
        document.getElementById('textContent').addEventListener('input', (e) => {
            this.config.text.content = e.target.value;
            this.renderPreview();
        });

        document.getElementById('textPosition').addEventListener('change', (e) => {
            this.config.text.position = e.target.value;
            this.renderPreview();
        });

        document.getElementById('textColor').addEventListener('input', (e) => {
            this.config.text.color = e.target.value;
            this.renderPreview();
        });

        document.getElementById('textSize').addEventListener('input', (e) => {
            this.config.text.size = parseInt(e.target.value);
            document.getElementById('textSizeValue').textContent = e.target.value + 'px';
            this.renderPreview();
        });

        // Canvas drag events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportPNG();
        });
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

    renderPreview() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.drawBackground();

        // Draw screenshot if available
        if (this.currentImage) {
            this.drawScreenshot();
        }

        // Draw gradient overlay (between screenshot and text)
        this.drawGradientOverlay();

        // Draw text
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
        
        // Set text properties
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${size}px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        
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

        // Handle multi-line text
        const lines = content.split('\n');
        const lineHeight = size * 1.2; // Line height multiplier
        
        // Calculate starting Y position for multi-line text
        let startY = y;
        if (textBaseline === 'middle') {
            startY = y - ((lines.length - 1) * lineHeight) / 2;
        } else if (textBaseline === 'bottom') {
            startY = y - ((lines.length - 1) * lineHeight);
        }

        // Draw each line of text
        lines.forEach((line, index) => {
            if (line.trim()) {
                this.ctx.fillText(line, x, startY + (index * lineHeight));
            }
        });

        this.ctx.restore();
    }

    exportPNG() {
        if (!this.currentImage) {
            alert('Please upload a screenshot first.');
            return;
        }

        // Create download link
        const link = document.createElement('a');
        link.download = `custom-icon-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IconCustomizer();
});