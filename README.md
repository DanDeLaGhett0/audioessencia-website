# audioessentia.com - Sound Design Collective Website

A dark, minimal, and sophisticated website for audioessentia.com sound design collective, featuring advanced audio integration, responsive design, and professional aesthetics.

## Features

### 🎵 Audio Integration
- **Custom HTML5 Audio Player** with persistent playback
- **Web Audio API** integration for advanced audio processing
- **Real-time Audio Visualization** with frequency and waveform displays
- **Waveform Animations** in hero section
- **Multiple Audio Format Support** (MP3, OGG, WAV)
- **Spatial Audio** considerations for installation work

### 🎨 Design & UX
- **Dark Theme** with Ableton-inspired UI
- **Responsive Design** (mobile-first approach)
- **Smooth Animations** and transitions
- **Professional Typography** using Inter font
- **Accessibility Compliant** with ARIA labels and keyboard navigation
- **SEO Optimized** with proper meta tags and structured data

### 📱 Technical Features
- **Vanilla JavaScript** (no external dependencies)
- **CSS Grid & Flexbox** for modern layouts
- **Intersection Observer** for performance optimization
- **Lazy Loading** for images and media
- **Progressive Enhancement** for older browsers
- **Cross-browser Compatibility**

### 🔧 Performance
- **< 3 second load time** target
- **Optimized Audio Loading** with preload strategies
- **Efficient Animations** using requestAnimationFrame
- **Memory Management** for audio contexts
- **Throttled Scroll Events** for smooth performance

## Pages

### Homepage (`index.html`)
- Hero section with audio visualization
- Featured projects showcase
- Collective manifesto
- Contributors highlight
- Persistent audio player

### Contributors (`contributors.html`)
- Detailed member profiles
- Filterable by expertise
- Audio samples for each contributor
- Interactive hover effects
- Statistics and achievements

### Contact (`contact.html`)
- Professional contact form
- Project type selection
- Budget and timeline options
- Direct contact information
- FAQ section

## Setup Instructions

### Prerequisites
- Modern web browser with audio support
- Web server (for local development)
- Audio files in supported formats

### Installation

1. **Clone or Download** the project files
2. **Set up a local web server** (required for audio loading):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Add Audio Files** to the `assets/audio/` directory
4. **Add Images** to the `assets/images/` directory
5. **Open** `http://localhost:8000` in your browser

### Required Assets

#### Audio Files
Place the following audio files in `assets/audio/`:
- `project-1.mp3` - Cinematic Soundscape
- `project-2.mp3` - Interactive Game Audio
- `project-3.mp3` - Sonic Installation
- `project-4.mp3` - Experimental Composition
- `sarah-preview.mp3` - Sarah Chen's featured work
- `sarah-sample-1.mp3` - Midnight Reverie
- `sarah-sample-2.mp3` - Urban Solitude
- `marcus-preview.mp3` - Marcus Rodriguez's featured work
- `marcus-sample-1.mp3` - Cyberpunk Ambience
- `marcus-sample-2.mp3` - Dynamic Combat
- `elena-preview.mp3` - Elena Vasquez's featured work
- `elena-sample-1.mp3` - Spatial Drift
- `elena-sample-2.mp3` - Binaural Dreams
- `david-preview.mp3` - David Park's featured work
- `david-sample-1.mp3` - Orchestral Mix
- `david-sample-2.mp3` - Electronic Precision
- `aisha-preview.mp3` - Aisha Okafor's featured work
- `aisha-sample-1.mp3` - Neural Networks
- `aisha-sample-2.mp3` - Algorithmic Bloom
- `james-preview.mp3` - James Liu's featured work
- `james-sample-1.mp3` - Forest Echoes
- `james-sample-2.mp3` - Urban Rhythms

#### Image Files
Place the following image files in `assets/images/`:
- `og-image.jpg` - Social media preview (1200x630px)
- `project-1.jpg` - Cinematic Soundscape project
- `project-2.jpg` - Interactive Game Audio project
- `project-3.jpg` - Sonic Installation project
- `project-4.jpg` - Experimental Composition project
- `contributor-1.jpg` - Sarah Chen photo
- `contributor-2.jpg` - Marcus Rodriguez photo
- `contributor-3.jpg` - Elena Vasquez photo
- `contributor-4.jpg` - David Park photo
- `contributor-5.jpg` - Aisha Okafor photo
- `contributor-6.jpg` - James Liu photo
- `default-artwork.jpg` - Default audio player artwork

## File Structure

```
audiessencia-website/
├── index.html              # Homepage
├── contributors.html       # Contributors page
├── contact.html           # Contact page
├── README.md              # This file
├── styles/
│   └── main.css           # Main stylesheet
├── js/
│   ├── main.js            # Main JavaScript functionality
│   └── audio-player.js    # Audio player with Web Audio API
└── assets/
    ├── audio/             # Audio files
    │   ├── project-*.mp3
    │   ├── *-preview.mp3
    │   └── *-sample-*.mp3
    └── images/            # Image files
        ├── og-image.jpg
        ├── project-*.jpg
        └── contributor-*.jpg
```

## Key Components

### Audio Player (`js/audio-player.js`)
- **Custom Controls**: Play/pause, seek, volume, next/previous
- **Visualizations**: Real-time frequency and waveform displays
- **Web Audio API**: Advanced audio processing capabilities
- **Media Session API**: Integration with OS media controls
- **Keyboard Shortcuts**: Space (play/pause), arrows (seek/volume), ESC (close)

### Main Application (`js/main.js`)
- **Navigation**: Mobile-responsive menu with accessibility
- **Filters**: Dynamic filtering for contributors page
- **Forms**: Contact form with validation and submission
- **Animations**: Scroll-triggered animations and parallax effects
- **Accessibility**: Focus management and keyboard navigation

### Styling (`styles/main.css`)
- **CSS Custom Properties**: Comprehensive design system
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Theme**: Professional audio industry aesthetic
- **Animations**: Smooth transitions and hover effects
- **Typography**: Inter font with proper sizing scale

## Customization

### Colors
Modify the CSS custom properties in `styles/main.css`:
```css
:root {
    --color-primary: #00D4FF;        /* Main brand color */
    --color-accent: #FF6B6B;         /* Secondary accent */
    --color-bg-primary: #0A0A0A;     /* Main background */
    --color-text-primary: #FFFFFF;   /* Main text */
    /* ... */
}
```

### Audio Settings
Adjust audio parameters in `js/audio-player.js`:
```javascript
// Analyser settings
this.analyser.fftSize = 256;              // Frequency resolution
this.analyser.smoothingTimeConstant = 0.8; // Smoothing

// Default volume
this.volume = 0.7;                        // 70% volume
```

### Content
Update project information in the HTML files:
- Project titles and descriptions
- Contributor information and specialties
- Contact details and studio information

## Browser Support

### Modern Browsers (Full Features)
- Chrome 66+
- Firefox 60+
- Safari 12+
- Edge 79+

### Legacy Support
- Graceful degradation for older browsers
- Fallback audio controls
- Progressive enhancement approach

## Performance Optimization

### Audio Loading
- **Lazy Loading**: Audio files load only when needed
- **Preload Strategy**: Metadata preloaded for quick access
- **Format Optimization**: Multiple formats for browser compatibility
- **Compression**: Optimized file sizes for web delivery

### Image Optimization
- **Lazy Loading**: Images load when entering viewport
- **Responsive Images**: Different sizes for different devices
- **WebP Support**: Modern format with fallbacks
- **Compression**: Optimized for web while maintaining quality

### JavaScript Performance
- **Throttled Events**: Scroll and resize events optimized
- **RequestAnimationFrame**: Smooth animations
- **Memory Management**: Proper cleanup of audio contexts
- **Code Splitting**: Modular architecture for better caching

## Accessibility Features

### ARIA Labels
- Proper labeling for screen readers
- Role attributes for interactive elements
- Live regions for dynamic content

### Keyboard Navigation
- Full keyboard accessibility
- Focus management and trapping
- Skip links for main content

### Visual Accessibility
- High contrast mode support
- Reduced motion preferences
- Focus indicators for all interactive elements

## SEO Optimization

### Meta Tags
- Comprehensive Open Graph and Twitter Card meta tags
- Proper title and description optimization
- Structured data for rich snippets

### Performance
- Fast loading times (< 3 seconds)
- Optimized images and assets
- Efficient CSS and JavaScript

### Content Structure
- Semantic HTML5 elements
- Proper heading hierarchy
- Descriptive alt text for images

## Development

### Local Development
1. Make changes to HTML, CSS, or JavaScript files
2. Refresh browser to see changes
3. Use browser developer tools for debugging
4. Test across different devices and browsers

### Production Deployment
1. **Optimize Assets**: Compress images and audio files
2. **Minify Code**: Compress CSS and JavaScript
3. **Configure Server**: Set up proper MIME types and caching
4. **SSL Certificate**: Ensure HTTPS for audio loading
5. **CDN**: Consider using a CDN for better performance

## Future Enhancements

### Planned Features
- **Playlist Management**: Full playlist functionality
- **User Accounts**: Favorites and personal playlists
- **Comments System**: Community engagement features
- **Analytics Dashboard**: Track listening patterns
- **Mobile App**: Progressive Web App capabilities

### Technical Improvements
- **Service Worker**: Offline functionality
- **WebAssembly**: Advanced audio processing
- **WebRTC**: Real-time collaboration features
- **AI Integration**: Smart music recommendations

## Contributing

### Code Style
- Use semantic HTML5 elements
- Follow CSS naming conventions (BEM methodology)
- Use ES6+ JavaScript features
- Comment complex functionality

### Testing
- Test across multiple browsers
- Verify accessibility with screen readers
- Performance testing with various network conditions
- Mobile device testing

## License

This project is proprietary to audioessentia.com. All rights reserved.

## Contact

For technical support or questions about the website:
- Email: tech@audioessentia.com
- Website: https://audioessentia.com

---

**Built with ❤️ for the audioessentia.com collective** 