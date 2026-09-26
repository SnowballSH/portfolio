---
title: "Yue"
shortDescription: "A desktop music visualizer I built for my own EDM tracks: an audio-reactive circular spectrum with supersampled rendering and one-click MP4 export."
date: "2025-11-12"
technologies: ["Rust", "Raylib", "FFT", "FFmpeg"]
featured: false
status: "completed"
image: "/yue.webp"
imageAlt: "Yue visualizing the track Twilight: a ring of audio-reactive dots around a snowball logo over a frozen river"
githubUrl: "https://github.com/SnowballSH/yue"
links:
  - label: "My music on YouTube"
    url: "https://www.youtube.com/@SnowballSH"
    type: "other"
category: "tools"
priority: 1
---

# Yue

Yue (乐, "music") is a desktop music visualizer and video exporter in the style of NCS releases, written in Rust with Raylib. I use it to make the videos for my own tracks.

## Features

- A live, audio-reactive preview: a pulsing center ring and a circular spectrum with trails, driven by an FFT of the playing track.
- Loads WAV, MP3, OGG, and FLAC, with a custom background image and center logo.
- **High-quality export.** Frames are composed at 1920×1080, rendered supersampled at 3840×2160, downscaled with Lanczos, and encoded to H.264 with lossless ALAC audio through FFmpeg.
- Export runs asynchronously with a progress overlay, so the UI stays responsive while the video renders.
- Unit tests cover the FFT peak detection, RMS levels, the ring and spectrum updates, and the export math.
