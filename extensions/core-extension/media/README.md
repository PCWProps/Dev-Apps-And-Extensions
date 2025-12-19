# BearBuddy Core Extension Icon

This directory contains icons and media assets for the BearBuddy Core extension.

## Required Icons

- `icon.png` - 128x128px extension icon
- `icon@2x.png` - 256x256px high-resolution icon
- `banner.png` - 1280x640px marketplace banner

## Usage

Icons should be referenced in `package.json`:

```json
{
  "icon": "media/icon.png"
}
```

## Design Guidelines

- Use transparent PNG format
- Follow VS Code extension icon guidelines
- Maintain consistent branding with BearBuddy theme
- Use high-quality assets (300 DPI for print)

## Asset Creation

Icons can be created using:
- Figma (recommended)
- Canva
- Adobe Illustrator
- Sketch

See `docs/diagrams/` for design system reference.
