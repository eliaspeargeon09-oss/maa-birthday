from PIL import Image
import numpy as np

both = Image.open("public/images/maa-both-cutout.png")
orig = Image.open("public/images/maa-original.jpg")
w, h = both.size

print(f"Both cutout size: {w}x{h}")
alpha = np.array(both.split()[-1])
rgb = np.array(orig)

# Let's inspect the row slices:
# Where is Maa's head?
# Maa's head is at x: 160-245, y: 295-420.
# Maa's neck & gold necklace: x: 180-230, y: 390-440.
# Maa's left arm (screen right): she stands beside father.
# Her cream-and-red saree covers her torso from x: 120 to 285.
# Father's shirt starts at x > 280. Father's shirt is grey.
# Father's white trousers start at y > 530, x: 275 to 440.
# Notice in the previous screenshot, at y > 530, there was white trousers included on the right!
# Why? Because in isolate_maa.py:
# `is_cream = (r > 150 and g > 130 and b > 90)`
# White trousers have r=210, g=210, b=210! Which matched `is_cream`!
# Ah! White trousers are grey/white (r ≈ g ≈ b)!
# Cream saree is yellow/golden: r > g > b, and specifically r - b > 40!
# In white trousers, r ≈ g ≈ b (r - b < 20)!
print("Difference between cream saree and white trousers:")
for y_test in [600, 700, 800]:
    for x_test in range(250, 310, 10):
        r, g, b = rgb[y_test, x_test]
        print(f"y={y_test}, x={x_test}: RGB=({r}, {g}, {b}), r-b={int(r)-int(b)}, r-g={int(r)-int(g)}")

