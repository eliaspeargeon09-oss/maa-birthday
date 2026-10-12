import os
from PIL import Image
import numpy as np
import rembg

print("Loading original image...")
img_path = "public/images/maa-original.jpg"
img = Image.open(img_path).convert("RGB")
w, h = img.size
print(f"Image size: {w}x{h}")

# We use u2net_human_seg or u2net
print("Creating rembg session with u2net_human_seg...")
session = rembg.new_session("u2net_human_seg")

print("Removing background with u2net_human_seg...")
cutout = rembg.remove(img, session=session)
cutout.save("public/images/maa-both-cutout.png")
print("Saved public/images/maa-both-cutout.png")

alpha = np.array(cutout.split()[-1])
print(f"Alpha range: {alpha.min()} to {alpha.max()}")
print(f"Non-zero alpha pixels count: {np.count_nonzero(alpha > 10)}")

col_sums = (alpha > 20).sum(axis=0)
for x in range(0, w, 20):
    print(f"x={x:3d}: count={col_sums[x]}")
