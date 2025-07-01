from PIL import Image, ImageOps

files = [
    'public/avalanche.webp',
    'public/lila.webp',
    'public/storming_tune.webp',
    'public/gorilla.webp',
    'public/fireballsh.webp',
    'public/experienceml.webp',
    'public/figurify.webp',
    'public/headpace.webp',
    'public/snowblog.webp'
]

for path in files:
    img = Image.open(path).convert("RGBA")
    img = ImageOps.pad(
        img,
        (800, 480),
        method=Image.Resampling.LANCZOS,
        color=(0, 0, 0, 0)  # transparent
    )
    img.save(path, 'WEBP', quality=60)
    print(path, '->', img.size)
