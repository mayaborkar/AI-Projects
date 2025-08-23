# Flyer Information Extractor

A client-side web application that uses OCR (Optical Character Recognition) to extract event information (date, time, location) from flyer images.

## Features

- Drag-and-drop image upload interface
- Extracts event date, time, and location from flyer images
- Supports JPG, PNG, and GIF image formats
- Clean, responsive web interface
- Real-time image preview
- No API keys required - runs entirely in your browser
- Works offline after initial load

## Setup Instructions

Simply open `index.html` in your web browser - no installation required!

### For local development:
1. **Clone or download the files**
2. **Open in browser:**
   - Double-click `index.html`, or
   - Serve with a local HTTP server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Usage

1. Open `index.html` in your web browser
2. Click the upload area or drag and drop a flyer image
3. Click "Extract Event Information" 
4. The OCR will analyze the image and display:
   - Event date
   - Event time  
   - Event location

## Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **OCR Engine**: Tesseract.js (runs in browser)
- **Text Processing**: Regex pattern matching for event information
- **Image Processing**: Client-side image analysis

## How It Works

1. **OCR Processing**: Uses Tesseract.js to extract all text from the image
2. **Pattern Matching**: Applies regex patterns to identify:
   - **Dates**: Various formats (MM/DD/YYYY, Month DD, YYYY, etc.)
   - **Times**: AM/PM formats, time ranges, "doors open" times
   - **Locations**: Street addresses, venue names, city/state patterns
3. **Smart Extraction**: Falls back to contextual clues when exact patterns don't match

## Supported Formats

- **Images**: JPG, PNG, GIF
- **Date Formats**: Jan 15 2024, 01/15/2024, January 15, 2024, etc.
- **Time Formats**: 7:00 PM, 7 PM, 6:00-9:00 PM, Doors: 7:00 PM
- **Location Formats**: Street addresses, venue names, city/state

## Error Handling

The application includes error handling for:
- Invalid file types
- OCR processing failures
- Image loading errors
- Pattern matching edge cases

## Requirements

- Modern web browser with JavaScript enabled
- Internet connection (for initial Tesseract.js library download)
- No API keys or server setup required