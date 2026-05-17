import os
from rembg import remove
from PIL import Image

def process_img(input_path, output_path):
    print(f"Processing {input_path}...")
    input_image = Image.open(input_path)
    output_image = remove(input_image)
    
    # Save the output
    output_image.save(output_path)
    print(f"Saved {output_path}")

base_dir = "/Users/ashikkarb/.gemini/antigravity/brain/33422cf3-17b8-47ee-807b-11089be123ef"
out_dir = "/Users/ashikkarb/eKYC/public/assets"
os.makedirs(out_dir, exist_ok=True)

process_img(f"{base_dir}/media__1778911069463.png", f"{out_dir}/glass.png")
process_img(f"{base_dir}/media__1778911075555.png", f"{out_dir}/aadhaar.png")
process_img(f"{base_dir}/media__1778911083075.png", f"{out_dir}/pan.png")
print("All done!")
