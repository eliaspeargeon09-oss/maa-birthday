from PIL import Image
import numpy as np

cutout = Image.open("public/images/maa-cutout.png")
rgb = np.array(cutout)

print(f"Cutout size: {cutout.size}")
# In the cutout (which is 209 wide):
# Let's see the rightmost non-transparent pixels row by row
h, w = rgb.shape[:2]
for y in range(80, 250, 10):
    row_alpha = rgb[y, :, 3]
    valid_x = np.where(row_alpha > 30)[0]
    if len(valid_x) > 0:
        right_x = valid_x[-1]
        pixel = rgb[y, right_x, :3]
        print(f"y={y:3d}: right_x={right_x:3d}, RGB={pixel.tolist()}")

