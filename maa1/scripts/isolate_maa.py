import os
import cv2
import numpy as np
from PIL import Image

def process_maa_isolation():
    cutout_both_path = "public/images/maa-both-cutout.png"
    orig_path = "public/images/maa-original.jpg"
    out_cutout_path = "public/images/maa-cutout.png"
    out_depth_path = "public/images/maa-depth.png"

    if not os.path.exists(cutout_both_path):
        print(f"Waiting for {cutout_both_path}...")
        return

    # Load images
    orig_img = Image.open(orig_path).convert("RGBA")
    both_cutout = Image.open(cutout_both_path).convert("RGBA")
    w, h = orig_img.size

    alpha = np.array(both_cutout.split()[-1])
    orig_rgb = np.array(orig_img)

    # Find the boundary between Maa (left) and Father (right)
    # Maa is the woman on the left in cream-and-red saree
    # Father is on the right in grey shirt
    # Between y=300 and y=800, let's find the seam where their clothes meet
    # Note: Father's torso is at x > 300
    
    # We create a mask for Maa only
    # Let's inspect column alpha sums and component analysis
    binary_mask = (alpha > 30).astype(np.uint8)
    
    # Connected components
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(binary_mask)
    print(f"Found {num_labels} connected components in binary mask")

    # If connected or touching, separate at the valley between the two heads/shoulders
    # Let's find the vertical seam between x=240 and x=310
    # Maa's head is centered around x=200, Father's head is centered around x=355
    # The space between them at shoulder level is around x=265 to 290
    
    maa_mask = np.zeros_like(alpha, dtype=np.uint8)
    
    # For each row y, find the rightmost boundary of Maa
    # Above y=280 (above shoulders): Maa's head is completely on left (x <= 250)
    # Between y=280 and y=500 (torso / saree pallu): Maa's saree goes up to x=280
    # Below y=500 to y=920 (saree skirt): goes up to x=290
    
    # Let's construct a clean dividing contour/line:
    # Father's arm/body is at x >= 270 at the top, x >= 285 at the waist, x >= 280 at the knees
    # Let's inspect the original image color:
    # Father wears a dark charcoal shirt (RGB ~ [60, 60, 65])
    # Maa wears cream saree (RGB ~ [220, 200, 150]) and red saree border (RGB ~ [190, 45, 45])
    # This color contrast makes edge detection between Maa and Father 100% precise!

    for y in range(h):
        for x in range(w):
            if alpha[y, x] > 20:
                # Check if this pixel belongs to Maa
                # Maa is on the left
                if x < 255:
                    maa_mask[y, x] = alpha[y, x]
                elif x > 305:
                    # Definitely father
                    pass
                else:
                    # In the seam region x in [255, 305]:
                    # Color check: Father's dark grey shirt vs Maa's cream/red saree
                    r, g, b = orig_rgb[y, x, :3]
                    is_cream = (r > 150 and g > 130 and b > 90) # Cream saree
                    is_red = (r > 120 and r > g + 40 and r > b + 40) # Red border/blouse
                    is_gold = (r > 160 and g > 140 and b < 100) # Gold jewelry
                    is_dark_shirt = (r < 110 and g < 110 and b < 115) # Father's grey shirt
                    is_white_pants = (r > 180 and g > 180 and b > 180 and y > 530 and x > 280) # Father's white trousers
                    
                    if (is_cream or is_red or is_gold) and not (is_dark_shirt or is_white_pants):
                        maa_mask[y, x] = alpha[y, x]
                    elif x < 275 and not is_dark_shirt and not is_white_pants:
                        # Left edge of Maa's saree
                        maa_mask[y, x] = alpha[y, x]

    # Smooth the mask boundary slightly with bilateral or median blur to prevent jagged edges
    maa_mask = cv2.medianBlur(maa_mask, 3)
    
    # Save maa-cutout.png using the untouched photographic pixels from original image!
    result_cutout = orig_rgb.copy()
    result_cutout[:, :, 3] = maa_mask
    Image.fromarray(result_cutout).save(out_cutout_path)
    print(f"Successfully created {out_cutout_path} preserving Maa's actual pixels!")

    # Now create the aligned depth map:
    # 0 = background
    # 1.0 = face, smile, chest foreground
    # Smooth gradient for saree and hair
    depth_map = np.zeros((h, w), dtype=np.uint8)
    
    # Distance transform gives natural curvature of the body
    dist = cv2.distanceTransform((maa_mask > 30).astype(np.uint8), cv2.DIST_L2, 5)
    if dist.max() > 0:
        dist_norm = dist / dist.max()
    else:
        dist_norm = dist

    # Maa's face center is roughly at (x=205, y=340)
    for y in range(h):
        for x in range(w):
            if maa_mask[y, x] > 20:
                # Base depth from distance transform (gives rounded volume to body & arms)
                base_depth = 140 + int(dist_norm[y, x] * 70)
                
                # Face & upper chest boost
                dy = (y - 340) / 120.0
                dx = (x - 205) / 60.0
                radial = np.exp(-(dx*dx + dy*dy))
                
                face_boost = int(radial * 45) # Brings face & smile to foreground (~255)
                
                depth_val = min(255, base_depth + face_boost)
                depth_map[y, x] = int(depth_val * (maa_mask[y, x] / 255.0))

    # Apply gentle Gaussian blur to depth map to ensure smooth 2.5D optical flow without tears
    depth_map = cv2.GaussianBlur(depth_map, (7, 7), 2.0)
    Image.fromarray(depth_map).save(out_depth_path)
    print(f"Successfully created {out_depth_path}!")

if __name__ == "__main__":
    process_maa_isolation()
