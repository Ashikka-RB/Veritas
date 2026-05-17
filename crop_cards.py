import cv2
import numpy as np
import os

def process(input_path, output_path):
    print(f"Processing {input_path}")
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print("Could not read image")
        return
        
    if img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
        
    alpha = img[:, :, 3]
    _, thresh = cv2.threshold(alpha, 10, 255, cv2.THRESH_BINARY)
    
    # Remove the thin silver line using morphological opening
    kernel = np.ones((45, 45), np.uint8)
    opened = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    contours, _ = cv2.findContours(opened, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        print("No contours found")
        return
        
    largest_contour = max(contours, key=cv2.contourArea)
    
    # Create a mask for the clean card shape
    mask = np.zeros(alpha.shape, dtype=np.uint8)
    cv2.drawContours(mask, [largest_contour], -1, 255, thickness=cv2.FILLED)
    
    # Smooth the mask edges slightly to look nice
    mask = cv2.GaussianBlur(mask, (3, 3), 0)
    
    # Apply the mask to the alpha channel
    img[:, :, 3] = cv2.bitwise_and(img[:, :, 3], mask)
    
    # Crop to the bounding box of the card to remove dead space
    x, y, w, h = cv2.boundingRect(largest_contour)
    
    # Add a tiny padding just in case
    padding = 5
    y1 = max(0, y - padding)
    y2 = min(img.shape[0], y + h + padding)
    x1 = max(0, x - padding)
    x2 = min(img.shape[1], x + w + padding)
    
    cropped = img[y1:y2, x1:x2]
    
    cv2.imwrite(output_path, cropped)
    print(f"Saved {output_path}")

process("/Users/ashikkarb/eKYC/public/assets/aadhaar.png", "/Users/ashikkarb/eKYC/public/assets/aadhaar.png")
process("/Users/ashikkarb/eKYC/public/assets/pan.png", "/Users/ashikkarb/eKYC/public/assets/pan.png")
print("Done")
