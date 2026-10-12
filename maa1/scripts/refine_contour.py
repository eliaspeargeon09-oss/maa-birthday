import os
import cv2
import numpy as np
from PIL import Image

def refine_contour():
    cutout_both_path = "public/images/maa-both-cutout.png"
    orig_path = "public/images/maa-original.jpg"
    out_cutout_path = "public/images/maa-cutout.png"
    out_depth_path = "public/images/maa-depth.png"

    orig_img = Image.open(orig_path).convert("RGBA")
    both_cutout = Image.open(cutout_both_path).convert("RGBA")
    w, h = orig_img.size

    alpha = np.array(both_cutout.split()[-1])
    orig_rgb = np.array(orig_img)

    maa_mask = np.zeros_like(alpha, dtype=np.uint8)

    for y in range(h):
        if y < 290:
            max_x = 0
        elif y < 420:
            max_x = 244 # Maa's head and hair
        elif y < 445:
            max_x = 252 # Neck & upper pallu
        elif y < 475:
            max_x = 254 # Saree pallu across chest
        elif y < 535:
            max_x = 248 # Waist pallu (excludes father's dark sleeve)
        elif y < 585:
            max_x = 246 # Upper hip
        elif y < 925:
            max_x = 256 # Flowing saree pleats to hem
        else:
            max_x = 0

        for x in range(w):
            if alpha[y, x] > 20 and x < max_x:
                if x < max_x - 3:
                    maa_mask[y, x] = alpha[y, x]
                else:
                    feather = (max_x - x) / 3.0
                    maa_mask[y, x] = int(alpha[y, x] * feather)

    # Clean isolated speckles
    nb_components, output, stats, _ = cv2.connectedComponentsWithStats((maa_mask > 30).astype(np.uint8))
    sizes = stats[1:, -1]
    nb_components -= 1
    min_size = 500
    cleaned_mask = np.zeros_like(maa_mask)
    for i in range(0, nb_components):
        if sizes[i] >= min_size:
            cleaned_mask[output == i + 1] = maa_mask[output == i + 1]

    maa_mask = cleaned_mask

    # Crop to Maa's bounding box
    non_zero = np.where(maa_mask > 20)
    y_min, y_max = non_zero[0].min(), non_zero[0].max()
    x_min, x_max = non_zero[1].min(), non_zero[1].max()
    print(f"Refined contour bounding box: x=[{x_min}, {x_max}], y=[{y_min}, {y_max}]")

    pad_x = 16
    pad_y = 16
    x0 = max(0, x_min - pad_x)
    x1 = min(w, x_max + pad_x)
    y0 = max(0, y_min - pad_y)
    y1 = min(h, y_max + pad_y)

    cropped_rgb = orig_rgb[y0:y1, x0:x1].copy()
    cropped_mask = maa_mask[y0:y1, x0:x1]
    cropped_rgb[:, :, 3] = cropped_mask

    # Save cutout
    Image.fromarray(cropped_rgb).save(out_cutout_path)
    print(f"Saved refined cutout to {out_cutout_path} ({x1-x0}x{y1-y0})")

    # Generate aligned depth map
    crop_h, crop_w = y1 - y0, x1 - x0
    depth_map = np.zeros((crop_h, crop_w), dtype=np.uint8)

    dist = cv2.distanceTransform((cropped_mask > 30).astype(np.uint8), cv2.DIST_L2, 5)
    if dist.max() > 0:
        dist_norm = dist / dist.max()
    else:
        dist_norm = dist

    face_y_crop = 345 - y0
    face_x_crop = 205 - x0

    for cy in range(crop_h):
        for cx in range(crop_w):
            if cropped_mask[cy, cx] > 15:
                base = 150 + int(dist_norm[cy, cx] * 65)
                dy = (cy - face_y_crop) / 95.0
                dx = (cx - face_x_crop) / 55.0
                radial = np.exp(-(dx*dx + dy*dy))
                face_boost = int(radial * 40)

                val = min(255, base + face_boost)
                depth_map[cy, cx] = int(val * (cropped_mask[cy, cx] / 255.0))

    depth_map = cv2.GaussianBlur(depth_map, (5, 5), 1.5)
    Image.fromarray(depth_map).save(out_depth_path)
    print(f"Saved refined depth map to {out_depth_path}!")

if __name__ == "__main__":
    refine_contour()
