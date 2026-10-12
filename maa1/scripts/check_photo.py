import os
from PIL import Image

image_path = "public/images/maa-original.jpg"
if os.path.exists(image_path):
    img = Image.open(image_path)
    print(f"Image size: {img.size}, Mode: {img.mode}")
else:
    print(f"Image not found at {image_path}")
