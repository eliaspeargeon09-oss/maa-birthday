from PIL import Image
import numpy as np

cutout = Image.open("public/images/maa-cutout.png")
depth = Image.open("public/images/maa-depth.png")

alpha = np.array(cutout.split()[-1])
non_zero = np.where(alpha > 15)

y_min, y_max = non_zero[0].min(), non_zero[0].max()
x_min, x_max = non_zero[1].min(), non_zero[1].max()

print(f"Maa bounding box: x=[{x_min}, {x_max}], y=[{y_min}, {y_max}]")
print(f"Width: {x_max - x_min}, Height: {y_max - y_min}")

# Let's add graceful padding around her so edges aren't tightly clipped
pad_x = 24
pad_y = 20

crop_x0 = max(0, x_min - pad_x)
crop_x1 = min(cutout.width, x_max + pad_x)
crop_y0 = max(0, y_min - pad_y)
crop_y1 = min(cutout.height, y_max + pad_y)

print(f"Cropped box: ({crop_x0}, {crop_y0}, {crop_x1}, {crop_y1})")
print(f"New size: {crop_x1 - crop_x0} x {crop_y1 - crop_y0}")

# Save centered, high-res cutout and depth
cropped_cutout = cutout.crop((crop_x0, crop_y0, crop_x1, crop_y1))
cropped_depth = depth.crop((crop_x0, crop_y0, crop_x1, crop_y1))

cropped_cutout.save("public/images/maa-cutout.png")
cropped_depth.save("public/images/maa-depth.png")
print("Cropped and saved perfectly centered maa-cutout.png and maa-depth.png!")
