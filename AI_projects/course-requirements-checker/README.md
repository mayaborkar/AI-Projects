# Course Requirements Checker

A web application that helps college students verify if their planned courses fulfill all major, minor, or concentration requirements.

## Features

- **Multiple Requirement Sources**: Add URLs from university websites listing course requirements
- **File Upload Support**: Upload your 4-year course plan in various formats (CSV, text, PDF)
- **Automated Analysis**: Automatically extracts requirements from websites and matches against your courses
- **Clear Results**: Shows which requirements are fulfilled and which are still missing
- **Responsive Design**: Works on desktop and mobile devices

## How to Run

### Terminal Instructions (Recommended)

**Step 1: Navigate to the project folder**
```bash
cd /Users/mayaborkar/Desktop/AI_projects/course-requirements-checker
```

**Step 2: Start a local web server**

Choose one of these options based on what you have installed:

**Option A: Python (most common)**
```bash
# For Python 3:
python3 -m http.server 8000

# For Python 2:
python -m SimpleHTTPServer 8000
```

**Option B: Node.js**
```bash
# If you have Node.js installed:
npx http-server -p 8000
```

**Option C: PHP**
```bash
# If you have PHP installed:
php -S localhost:8000
```

**Step 3: Open in your browser**
- Open your web browser
- Go to: `http://localhost:8000`
- The application will load automatically

**To stop the server:**
- Press `Ctrl+C` in the terminal

### Alternative Methods

**Option A: Double-click**
- Find the `index.html` file in your file explorer
- Double-click to open in your default browser

**Option B: Open in browser**
- Open your web browser (Chrome, Firefox, Safari, etc.)
- Press `Ctrl+O` (Windows/Linux) or `Cmd+O` (Mac)
- Navigate to the `course-requirements-checker` folder
- Select `index.html` and click "Open"

## How to Use

### Step 1: Add Requirement Sources
1. Find your university's major requirements page (e.g., Computer Science degree requirements)
2. Copy the URL
3. Paste it into the "Requirements Website URL" field
4. Click "Add URL"
5. Repeat for multiple sources (major, minor, concentration requirements)

### Step 2: Upload Your Course Plan
1. Prepare your course plan in one of these formats:
   - **CSV format** (recommended): `Course Code, Course Title, Credits`
   - **Text format**: List courses like "MATH 151: Calculus I (4 credits)"
2. Click "Choose File" and select your course plan
3. The file info will appear below

### Step 3: Analyze Requirements
1. Click the "Analyze Requirements" button
2. Wait for the analysis to complete
3. Review the results showing:
   - ✅ **Fulfilled Requirements**: Requirements you've met with your planned courses
   - ❌ **Missing Requirements**: Requirements you still need to fulfill

## Sample Data

Use the included `sample-courses.csv` file to test the application:
- Contains typical engineering/computer science courses
- Shows proper CSV format for your own course plans
- Includes course codes, titles, and credit hours

## File Formats Supported

### CSV Format (Recommended)
```csv
Course Code,Course Title,Credits
MATH 151,Calculus I,4
CSCE 121,Introduction to Programming,4
ENGL 104,Composition and Rhetoric,3
```

### Text Format
```
MATH 151: Calculus I (4 credits)
CSCE 121: Introduction to Programming (4 credits)
ENGL 104: Composition and Rhetoric (3 credits)
```

## Tips for Best Results

1. **Use official university requirement pages** - The more structured the requirements, the better the extraction
2. **Include course codes in your plan** - Use standard format like "MATH 151" or "CSCE 221"
3. **Review results manually** - The tool provides a starting point, but always verify with your academic advisor
4. **Update regularly** - Re-run the analysis when you change your course plan

## Troubleshooting

- **No requirements extracted**: The website structure might not be compatible. Try a different requirements page or contact your academic advisor
- **File upload issues**: Ensure your file is in CSV or text format and contains course information
- **CORS errors**: Use the local server option (Step 2, Option C) for better website access

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- No server required for basic functionality
- Uses CORS proxy for accessing external websites
- Supports multiple file formats for course plans
- Responsive design works on all devices