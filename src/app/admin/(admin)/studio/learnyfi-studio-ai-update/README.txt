Learnyfi Studio AI Background Removal update

1. Replace:
   src/app/admin/(admin)/studio/page.tsx
   with page.tsx from this package.

2. From the project root run in PowerShell:
   npm install @imgly/background-removal onnxruntime-web@1.21.0-dev.20250206-d981b153d3

3. Restart the Next.js dev server:
   npm run dev

How it works:
- Select an IMAGE clip on the timeline.
- Click “Remove selected image background” in the Inspector.
- The first run downloads/caches the AI model and can take a while.
- A transparent PNG is added to the Overlay / BG track.
- The original media is not changed.

Important limitation:
This integration processes image clips only. Video frame-by-frame background removal is not implemented in this update. The AI model files are fetched from IMG.LY by default; there is no paid API call, but an internet connection is needed on first use. Check the package license before distributing this app commercially.
