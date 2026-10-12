import os
from PIL import Image
import numpy as np

# Load original image
img_path = "public/images/maa-original.jpg"
img = Image.open(img_path)
w, h = img.size
print(f"Original size: {w}x{h}")

# In the image, Maa is on the left:
# Her head is around y=290 to 400, x=150 to 250.
# Her body extends down to the floor y=910.
# Her width is roughly x=90 to 280.
# The father is to her right, starting around x=240-270 (where their shoulders/arms meet or touch) to x=480.

# Let's test rembg import and session
try:
    import rembg
    print("rembg imported successfully")
except Exception as e:
    print(f"Error importing rembg: {e}")
