# Assets Directory

This directory contains all the media assets for the AudiEssencia website.

## Required Files

### Audio Files (`/audio/`)

#### Project Samples
- `project-1.mp3` - Cinematic Soundscape demo
- `project-2.mp3` - Interactive Game Audio demo  
- `project-3.mp3` - Sonic Installation demo
- `project-4.mp3` - Experimental Composition demo

#### Contributor Previews
- `sarah-preview.mp3` - Sarah Chen's featured work
- `marcus-preview.mp3` - Marcus Rodriguez's featured work
- `elena-preview.mp3` - Elena Vasquez's featured work
- `david-preview.mp3` - David Park's featured work
- `aisha-preview.mp3` - Aisha Okafor's featured work
- `james-preview.mp3` - James Liu's featured work

#### Individual Samples
- `sarah-sample-1.mp3` - Midnight Reverie
- `sarah-sample-2.mp3` - Urban Solitude
- `marcus-sample-1.mp3` - Cyberpunk Ambience
- `marcus-sample-2.mp3` - Dynamic Combat
- `elena-sample-1.mp3` - Spatial Drift
- `elena-sample-2.mp3` - Binaural Dreams
- `david-sample-1.mp3` - Orchestral Mix
- `david-sample-2.mp3` - Electronic Precision
- `aisha-sample-1.mp3` - Neural Networks
- `aisha-sample-2.mp3` - Algorithmic Bloom
- `james-sample-1.mp3` - Forest Echoes
- `james-sample-2.mp3` - Urban Rhythms

### Image Files (`/images/`)

#### Project Images
- `project-1.jpg` - Cinematic Soundscape visual (16:9 aspect ratio)
- `project-2.jpg` - Interactive Game Audio visual (16:9 aspect ratio)
- `project-3.jpg` - Sonic Installation visual (16:9 aspect ratio)
- `project-4.jpg` - Experimental Composition visual (16:9 aspect ratio)

#### Contributor Photos
- `contributor-1.jpg` - Sarah Chen photo (4:3 aspect ratio)
- `contributor-2.jpg` - Marcus Rodriguez photo (4:3 aspect ratio)
- `contributor-3.jpg` - Elena Vasquez photo (4:3 aspect ratio)
- `contributor-4.jpg` - David Park photo (4:3 aspect ratio)
- `contributor-5.jpg` - Aisha Okafor photo (4:3 aspect ratio)
- `contributor-6.jpg` - James Liu photo (4:3 aspect ratio)

#### Site Assets
- `og-image.jpg` - Social media preview image (1200x630px)
- `default-artwork.jpg` - Default audio player artwork (300x300px)
- `favicon.ico` - Website favicon (32x32px)

## File Specifications

### Audio Files
- **Format**: MP3 (recommended), OGG, WAV
- **Quality**: 192kbps minimum, 320kbps preferred
- **Duration**: 2-6 minutes per sample
- **Volume**: Normalized to -14 LUFS
- **Metadata**: Include title, artist, and album information

### Image Files
- **Format**: JPEG for photos, PNG for graphics with transparency
- **Quality**: 85% JPEG compression
- **Color Space**: sRGB
- **Optimization**: Use modern formats like WebP when possible

#### Specific Dimensions
- Project images: 800x450px (16:9)
- Contributor photos: 400x300px (4:3)
- OG image: 1200x630px
- Default artwork: 300x300px
- Favicon: 32x32px

## Audio Guidelines

### Technical Requirements
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Depth**: 16-bit minimum, 24-bit preferred
- **Dynamic Range**: Maintain good dynamic range (avoid over-compression)
- **Stereo**: All files should be stereo (avoid mono)

### Content Guidelines
- **Showcase Quality**: These are portfolio pieces, ensure highest quality
- **Variety**: Include different styles and techniques
- **Length**: Keep samples engaging but not too long (30 seconds - 3 minutes)
- **Crossfades**: Consider adding subtle crossfades to loop seamlessly

## Image Guidelines

### Photography
- **Professional Quality**: High-resolution, well-lit photos
- **Consistent Style**: Maintain visual consistency across contributor photos
- **Background**: Consider consistent or complementary backgrounds
- **Lighting**: Professional lighting preferred, avoid harsh shadows

### Project Visuals
- **Representative**: Images should represent the audio content
- **Atmospheric**: Dark, moody visuals that match the audio aesthetic
- **High Quality**: Sharp, well-composed images
- **Rights**: Ensure you have rights to use all images

## Placeholder Files

Until you have the actual assets, you can use:
- **Audio**: Generate short sine wave tones or use royalty-free samples
- **Images**: Use placeholder generators like https://picsum.photos/
- **Colors**: Use the website's color palette for temporary graphics

## Optimization

### Audio Optimization
```bash
# Use FFmpeg to optimize audio files
ffmpeg -i input.wav -codec:a libmp3lame -b:a 192k output.mp3
```

### Image Optimization
```bash
# Use ImageMagick to optimize images
convert input.jpg -quality 85 -resize 800x450 output.jpg
```

## Testing

### Audio Testing
- Test playback on different devices and browsers
- Verify volume levels are consistent
- Check for audio artifacts or distortion
- Test with both headphones and speakers

### Image Testing
- Verify images load correctly on different screen sizes
- Check for proper aspect ratios
- Test lazy loading functionality
- Verify accessibility (alt text, etc.)

## Notes

- All audio files are excluded from git tracking due to file size
- Large source image files (PSD, AI, etc.) are also excluded
- Consider using a CDN for better performance in production
- Implement proper caching headers for static assets

## Contact

For questions about assets or media specifications:
- Email: tech@audiessencia.com 