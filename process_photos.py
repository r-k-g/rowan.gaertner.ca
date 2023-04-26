from datetime import datetime
import os
from PIL import Image, ExifTags

def get_date(img):
    exif = img.getexif()
    
    if 0x9003 in exif: # DateTimeOriginal
        return datetime.strptime(exif[0x9003], r"%Y:%m:%d %H:%M:%S")
    elif 0x9004 in exif: # DateTimeDigitized
        return datetime.strptime(exif[0x9004], r"%Y:%m:%d %H:%M:%S")
    elif 0x0132 in exif: # DateTime
        return datetime.strptime(exif[0x0132], r"%Y:%m:%d %H:%M:%S")
    else:
        return datetime.fromtimestamp(os.path.getctime(img.filename))
    
def shrink_image(img, max_dim):
    w, h =  img.size
    if w < h:
        w, h = h, w
    
    if w <= max_dim:
        return img.copy()
    
    scale = max_dim / w

    return img.resize(
        (round(img.width * scale), round(img.height * scale)),
        resample=Image.LANCZOS
    )

def main():
    photos = [
        f for f in os.listdir(os.getcwd())
        if f.rsplit(".", 1)[-1].lower() in {"jpg", "jpeg", "png"}
    ]

    for i, p in enumerate(photos, start=1):
        with Image.open(p) as img:
            date = get_date(img).strftime(r"%Y-%m-%d__%H-%M-%S")

            os.makedirs("large", exist_ok=True)
            shrink_image(img, 1920).save(
                os.path.join(os.getcwd(), "large", f"{date}.{img.format}")
            )

            shrink_image(img, 480).save(
                os.path.join(os.getcwd(), f"{date}.{img.format}")
            )
        print(f"Photo {i}/{len(photos)} processed")

if __name__ == "__main__":
    main()