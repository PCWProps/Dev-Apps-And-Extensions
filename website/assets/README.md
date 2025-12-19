# Website Assets

This directory contains static assets for the BearBuddy website.

## Structure

- `css/` - Stylesheets
- `js/` - JavaScript files
- `images/` - Images and graphics
- `icons/` - Icons and favicons

## Required Assets

### Images
- Logo (SVG, PNG @1x, @2x, @3x)
- Screenshots for each extension
- Feature illustrations
- Social media preview images (1200x630)

### Icons
- Favicon (16x16, 32x32, 180x180)
- Apple touch icon (180x180)
- Android chrome icons (192x192, 512x512)

### Graphics
- Hero image/illustration
- Feature icons
- Testimonial avatars (if applicable)

## Image Guidelines

- Use WebP format for better compression
- Provide fallbacks for older browsers
- Optimize all images (TinyPNG, ImageOptim)
- Use appropriate sizes (don't serve 4K images for thumbnails)
- Include alt text in markdown

## Adding Assets

1. Place files in appropriate subdirectory
2. Reference using Jekyll syntax: `{{ '/assets/images/logo.png' | relative_url }}`
3. Optimize before committing
4. Update this README with new asset references
