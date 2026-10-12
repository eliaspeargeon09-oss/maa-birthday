import os
import cv2
import numpy as np
from PIL import Image
import rembg

def process_cartoon():
    raw_path = "public/images/maa-cartoon-raw.jpg"
    out_cutout_path = "public/images/maa-cartoon.png"
    out_depth_path = "public/images/maa-cartoon-depth.png"

    img = Image.open(raw_path).convert("RGB")
    print(f"Loaded raw image, size: {img.size}")

    print("Removing background with rembg...")
    session = rembg.new_session("u2net_human_seg")
    cutout = rembg.remove(img, session=session)

    # Convert to numpy array
    cutout_np = np.array(cutout)
    alpha = cutout_np[:, :, 3]

    # Find character bounds
    non_zero = np.where(alpha > 25)
    y_min, y_max = non_zero[0].min(), non_zero[0].max()
    x_min, x_max = non_zero[1].min(), non_zero[1].max()
    print(f"Character bounds: x=[{x_min}, {x_max}], y=[{y_min}, {y_max}]")

    # Add gentle padding
    pad_x = 24
    pad_y = 20
    h, w = alpha.shape
    x0 = max(0, x_min - pad_x)
    x1 = min(w, x_max + pad_x)
    y0 = max(0, y_min - pad_y)
    y1 = min(h, y_max + pad_y)

    cropped_cutout = cutout_np[y0:y1, x0:x1]
    Image.fromarray(cropped_cutout).save(out_cutout_path)
    print(f"Saved transparent cartoon cutout to {out_cutout_path} ({x1-x0}x{y1-y0})")

    # Also overwrite/update maa-cutout.png so any existing fallback component immediately picks it up
    Image.fromarray(cropped_cutout).save("public/images/maa-cutout.png")

    # Generate aligned smooth depth map
    crop_h, crop_w = y1 - y0, x1 - x0
    cropped_mask = cropped_cutout[:, :, 3]
    depth_map = np.zeros((crop_h, crop_w), dtype=np.uint8)

    dist = cv2.distanceTransform((cropped_mask > 25).astype(np.uint8), cv2.DIST_L2, 5)
    if dist.max() > 0:
        dist_norm = dist / dist.max()
    else:
        dist_norm = dist

    # Find face center dynamically
    face_y_crop = int(crop_h * 0.16)
    face_x_crop = int(crop_w * 0.50)

    for cy in range(crop_h):
        for cx in range(crop_w):
            if cropped_mask[cy, cx] > 15:
                # Base volume from distance transform
                base = 150 + int(dist_norm[cy, cx] * 65)

                # Face and chest highlight
                dy = (cy - face_y_crop) / (crop_h * 0.18)
                dx = (cx - face_x_crop) / (crop_w * 0.22)
                radial = np.exp(-(dx*dx + dy*dy))
                face_boost = int(radial * 40)

                val = min(255, base + face_boost)
                depth_map[cy, cx] = int(val * (cropped_mask[cy, cx] / 255.0))

    depth_map = cv2.GaussianBlur(depth_map, (5, 5), 1.5)
    Image.fromarray(depth_map).save(out_depth_path)
    Image.fromarray(depth_map).save("public/images/maa-depth.png")
    print(f"Saved aligned depth map to {out_depth_path} and maa-depth.png!")

if __name__ == "__main__":
    process_cartoon()
