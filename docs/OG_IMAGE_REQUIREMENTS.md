# Open Graph Preview Image Requirements

## Current Status

The app references an Open Graph preview image at `/og-preview.png` for social media sharing. This image is **required** for proper social media previews.

## Image Specifications

**File Location:** `public/og-preview.png`

**Dimensions:** 1200 x 630 pixels (recommended for all social platforms)

**Format:** PNG or JPG

**File Size:** Under 1MB (recommended under 300KB for faster loading)

## What to Include in the Image

The OG preview image should visually represent Pelican AI and include:

1. **Brand Identity:**
   - Pelican AI logo/icon
   - Brand colors (blue theme: #1e40af)
   - "Pelican AI" text

2. **Value Proposition:**
   - "Intelligent Coaching for Louisiana Educators"
   - Brief tagline: "Navigate AI with Confidence"

3. **Visual Elements:**
   - Professional, clean design
   - Louisiana education context (subtle, not overwhelming)
   - Modern, approachable aesthetic

## Design Recommendations

- Use a clean, professional layout
- Ensure text is readable at small sizes (social platforms may crop)
- Use high contrast for accessibility
- Keep important content in the center (safe zone: 1200x630, but platforms may crop edges)

## Testing Your OG Image

After adding `og-preview.png` to the `public/` directory:

1. **Facebook Debugger:** https://developers.facebook.com/tools/debug/
   - Enter your URL
   - Click "Scrape Again" to refresh cache

2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
   - Enter your URL
   - Check preview

3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
   - Enter your URL
   - View preview

4. **Vercel Preview:** Check your preview deployment to see if the image loads

## Current Implementation

The metadata is configured in:
- `index.html` - Static fallback metadata
- `src/components/shared/Metadata.tsx` - Dynamic metadata component
- All routes use the Metadata component for proper social sharing

## Quick Fix for Blank Previews

If you're seeing blank previews:

1. **Create the image:** Add `og-preview.png` (1200x630px) to `public/` directory
2. **Clear social media caches:** Use the testing tools above to refresh cached previews
3. **Verify the path:** Ensure the image is accessible at `https://www.pelicanai.org/og-preview.png`

## Alternative: Use a Service

If you don't have design resources, consider using:
- **OG Image Service:** https://og-image.vercel.app/ (Vercel's OG image generator)
- **Canva:** Free templates for social media images
- **Figma:** Design tool with OG image templates

## Notes

- The image URL is absolute (`https://www.pelicanai.org/og-preview.png`) for proper social media crawling
- Vercel will serve files from `public/` at the root URL
- Social platforms cache images aggressively - use the debugger tools to refresh

