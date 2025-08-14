<?php
// Define the base directory where images are stored
$imageDir = __DIR__ . '/';
 

// Get input parameters
$imageFile = isset($_GET['imageFile']) ? basename($_GET['imageFile']) : null;
$maxWidth = isset($_GET['maxWidth']) ? intval($_GET['maxWidth']) : null;
$minWidth = isset($_GET['minWidth']) ? intval($_GET['minWidth']) : null;
$maxHeight = isset($_GET['maxHeight']) ? intval($_GET['maxHeight']) : null;
$minHeight = isset($_GET['minHeight']) ? intval($_GET['minHeight']) : null;

if (!$imageFile) {
    die("Error: No image file specified.");
}

// Full path to the image
$imagePath = $imageDir . $imageFile . ".png";

// Check if file exists
if (!file_exists($imagePath)) {
    die("Error: File not found.");
}

// Get image information
$imageInfo = getimagesize($imagePath);
if (!$imageInfo) {
    die("Error: Invalid image file.");
}

// Extract width, height, and type
list($origWidth, $origHeight, $imageType) = $imageInfo;

// Determine new width and height within constraints
$newWidth = $origWidth;
$newHeight = $origHeight;

if ($maxWidth && $newWidth > $maxWidth) {
    $newWidth = $maxWidth;
}
if ($minWidth && $newWidth < $minWidth) {
    $newWidth = $minWidth;
}
if ($maxHeight && $newHeight > $maxHeight) {
    $newHeight = $maxHeight;
}
if ($minHeight && $newHeight < $minHeight) {
    $newHeight = $minHeight;
}

// Maintain aspect ratio
$aspectRatio = $origWidth / $origHeight;
if ($newWidth / $newHeight > $aspectRatio) {
    $newWidth = intval($newHeight * $aspectRatio);
} else {
    $newHeight = intval($newWidth / $aspectRatio);
}

// Create the new image resource
switch ($imageType) {
    case IMAGETYPE_JPEG:
        $srcImage = imagecreatefromjpeg($imagePath);
        break;
    case IMAGETYPE_PNG:
        $srcImage = imagecreatefrompng($imagePath);
        break;
    case IMAGETYPE_GIF:
        $srcImage = imagecreatefromgif($imagePath);
        break;
    default:
        die("Error: Unsupported image type.");
}

// Create a new blank image with transparency
$resizedImage = imagecreatetruecolor($newWidth, $newHeight);

// Preserve transparency for PNG and GIF
if ($imageType == IMAGETYPE_PNG || $imageType == IMAGETYPE_GIF) {
    imagealphablending($resizedImage, false);
    imagesavealpha($resizedImage, true);
    // Try white transparent background
    $transparent = imagecolorallocatealpha($resizedImage, 255, 255, 255, 127);
    imagefill($resizedImage, 0, 0, $transparent);
}
// Resize image
imagecopyresampled($resizedImage, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
// Scan through the resized image and convert pure black pixels to transparent
$transparentColor = imagecolorallocatealpha($resizedImage, 0, 0, 0, 127);
for ($x = 0; $x < $newWidth; $x++) {
    for ($y = 0; $y < $newHeight; $y++) {
        $rgb = imagecolorat($resizedImage, $x, $y);
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;
        // Check for pure black. Adjust the condition if you need a tolerance for near-black.
        if ($r === 0 && $g === 0 && $b === 0) {
            imagesetpixel($resizedImage, $x, $y, $transparentColor);
        }
    }
}

// Set correct header and output the image
header("Content-Type: " . image_type_to_mime_type($imageType));

switch ($imageType) {
    case IMAGETYPE_JPEG:
        imagejpeg($resizedImage);
        break;
    case IMAGETYPE_PNG:
        ob_start();
	imagepng($resizedImage);
	$data = ob_get_clean();
	echo $data;
        break;
    case IMAGETYPE_GIF:
        imagegif($resizedImage);
        break;
}

// Cleanup
imagedestroy($srcImage);
imagedestroy($resizedImage);
?>