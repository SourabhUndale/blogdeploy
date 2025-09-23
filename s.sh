#!/bin/bash

# Configuration
IMAGE_DIR="/root/blogdeploy/GroupGodown_API_Backend/publish/wwwroot/images"
THUMBNAIL_WIDTH=300
JPEG_QUALITY=80 # Quality for JPEG output (0-100)

echo "Starting thumbnail generation in: $IMAGE_DIR"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null
then
    echo "ImageMagick 'convert' command not found."
    echo "Please install ImageMagick. For example, on Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "On Fedora: sudo dnf install ImageMagick"
    echo "On macOS with Homebrew: brew install imagemagick"
    exit 1
fi

# Create images directory if it doesn't exist (should already exist for existing blogs)
mkdir -p "$IMAGE_DIR"

# Find all image files (jpg, jpeg, png, gif, webp), excluding existing thumbnails
find "$IMAGE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) -not -iname "*_thumb.*" | while read -r ORIGINAL_IMAGE; do
    FILENAME=$(basename -- "$ORIGINAL_IMAGE")
    EXTENSION="${FILENAME##*.}"
    FILENAME_WITHOUT_EXT="${FILENAME%.*}"
    
    THUMBNAIL_IMAGE_NAME="${FILENAME_WITHOUT_EXT}_thumb.${EXTENSION}"
    THUMBNAIL_PATH="$(dirname -- "$ORIGINAL_IMAGE")/$THUMBNAIL_IMAGE_NAME"

    # Skip if thumbnail already exists
    if [ -f "$THUMBNAIL_PATH" ]; then
        echo "Thumbnail already exists for $FILENAME. Skipping."
        continue
    fi

    echo "Generating thumbnail for: $FILENAME"
    
    # Generate thumbnail using ImageMagick's convert command
    # -resize: Resizes the image to the specified width, maintaining aspect ratio.
    #          The ">" ensures it only resizes if the image is larger than the specified dimensions.
    # -quality: Sets the JPEG compression quality (if applicable).
    if convert "$ORIGINAL_IMAGE" -resize "${THUMBNAIL_WIDTH}>" -quality "$JPEG_QUALITY" "$THUMBNAIL_PATH"; then
        echo "Successfully created: $THUMBNAIL_IMAGE_NAME"
    else
        echo "Error creating thumbnail for: $FILENAME"
    fi
done

echo "Thumbnail generation complete."
