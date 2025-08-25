# AI Degree Tracker

An intelligent web application that helps college students track their degree progress across **multiple majors, minors, and concentrations**, verify course requirements from university websites, and plan their academic journey with AI-powered assistance.

## ✨ New Enhanced Features

### 🎓 **Multiple Program Support**
- Track **unlimited majors, minors, and concentrations** simultaneously
- Import requirements from university catalog URLs automatically
- Dynamic program configuration and management
- Cross-program requirement analysis

### 🤖 **Advanced AI Assistant**
- Natural language course addition: "Add CS 4000 Advanced Algorithms 4 credits completed"
- URL-based requirement parsing: "Add this minor: [catalog URL]"
- Intelligent course recommendations based on your progress
- Smart graduation timeline analysis across all programs

## Features

### 🎓 **Comprehensive Degree Tracking**
- **Real-time Progress Monitoring**: Track completion of major, minor, and concentration requirements
- **Interactive Dashboard**: Visual progress bars and statistics showing your academic journey
- **Multiple Program Support**: Built-in support for Northeastern University CS program with extensible architecture

### 📚 **Smart Course Management**
- **File Upload Support**: Import course plans from PDF, CSV, or text files
- **Manual Course Entry**: Add courses individually with full details
- **Status Tracking**: Mark courses as completed, in-progress, or planned
- **Intelligent Course Matching**: Automatically matches courses to requirements

### 🤖 **AI-Powered Assistant**
- **Natural Language Chat**: Ask questions about your degree in plain English
- **Personalized Advice**: Get tailored recommendations for course planning
- **Manual Credit Override**: Easily add courses that aren't on your transcript
- **Graduation Timeline**: Check if you're on track to graduate on time

### 📋 **Requirements Analysis**
- **Detailed Requirement Breakdown**: See exactly what you need for graduation
- **Multiple Minor Support**: Track progress on mathematics and other minors  
- **Concentration Tracking**: Monitor specialized program requirements (AI, Software, etc.)
- **Missing Course Identification**: Quickly identify gaps in your academic plan

## How to Run

### Option 1: Simple Browser Opening
1. Navigate to the project folder:
   ```bash
   cd /Users/mayaborkar/Desktop/AI_projects/degree-tracker-ai
   ```

2. Open `index.html` in your browser:
   - Double-click the file, or
   - Right-click → "Open with" → Your browser

### Option 2: Local Server (Recommended)
```bash
cd /Users/mayaborkar/Desktop/AI_projects/degree-tracker-ai

# Using Python 3:
python3 -m http.server 8000

# Using Node.js:
npx http-server -p 8000

# Using PHP:
php -S localhost:8000
```

Then open: http://localhost:8000

## Quick Start Guide

### 1. **Dashboard Overview**
- View your completion statistics and progress
- See recent academic activity
- Monitor major and minor progress

### 2. **Upload Your Courses**
- Click "Upload Course Plan" in the Courses tab
- Drag and drop your transcript, degree audit, or course list
- Supported formats: PDF, CSV, TXT

### 3. **Add Courses Manually**
- Use "Add Course Manually" for individual courses
- Perfect for transfer credits or courses not on your transcript

### 4. **Chat with AI Assistant**
- Ask questions like:
  - "What courses do I still need to take?"
  - "Can I graduate on time?"
  - "I got credit for CS 4000, add it to my transcript"
  - "Should I add a mathematics minor?"

### 5. **Track Requirements**
- View detailed requirement breakdowns
- See which requirements are fulfilled, missing, or in progress
- Export comprehensive graduation reports

## Sample Data Included

The application comes pre-loaded with sample data from a Northeastern CS student to demonstrate functionality:

- **Program**: Computer Science BS
- **Concentration**: Artificial Intelligence (fully satisfied)
- **Minor**: Mathematics (on track)
- **Courses**: 42+ courses across 4 years
- **Status**: On track for graduation

## 🗣️ Enhanced AI Chat Commands

The AI assistant now understands natural language and can help with:

### 🎓 Program Management
- **"Add this minor: https://catalog.northeastern.edu/.../math-minor/"**
- **"Parse requirements from [university catalog URL]"**
- **"Track this concentration: [URL]"**
- "Import my double major requirements"

### 📚 Smart Course Addition  
- **"Add CS 4000 Advanced Algorithms 4 credits completed"**
- **"I got an A in MATH 3150 Real Analysis"**
- **"Completed DS 4400 Machine Learning with B+"**
- "I tested out of CS 2500"

### 📊 Multi-Program Progress
- **"What's my progress across all programs?"**
- **"Am I missing any requirements for my minor?"**
- **"Check status of all my concentrations"**
- "How many total credits do I need?"

### 💡 Intelligent Planning
- **"What courses should I take next semester?"**
- **"Recommend courses that fulfill multiple requirements"**
- **"What prerequisites am I missing?"**
- "Plan my remaining semesters"

### 🎯 Graduation Analysis
- **"Can I graduate on time with all programs?"**
- **"What happens if I drop my minor?"**
- **"Am I overloaded with too many programs?"**
- "When will I finish everything?"

## Customization

### Adding New Universities
1. Create a new requirements object in `data.js`
2. Follow the same structure as `NORTHEASTERN_CS_REQUIREMENTS`
3. Update the UI to allow program selection

### Adding New Majors/Minors
1. Define requirements in `data.js`
2. Add parsing logic in `app.js`
3. Update the requirements matching algorithm

### Extending AI Responses
1. Add new response patterns in `AI_RESPONSES`
2. Extend `generateAIResponse()` method
3. Add new conversation flows

## Technical Architecture

### Frontend Technologies
- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies for maximum compatibility

### Key Components
- **DegreeTracker Class**: Main application controller
- **Requirements Engine**: Matches courses to degree requirements  
- **AI Chat System**: Natural language processing for user queries
- **File Parser**: Handles multiple document formats
- **Progress Calculator**: Real-time requirement completion tracking

### Data Structure
- **Modular Requirements**: Easily configurable degree programs
- **Flexible Course Matching**: Supports alternatives and equivalencies
- **State Management**: Real-time updates across all views

## File Structure
```
degree-tracker-ai/
├── index.html          # Main application interface
├── styles.css          # Complete styling and responsive design
├── app.js              # Core application logic and UI management
├── data.js             # Requirements data and sample student information
└── README.md           # This documentation
```

## Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (responsive design)

## Future Enhancements

### Planned Features
- **Multi-University Support**: Add more schools and programs
- **Course Prerequisite Checking**: Validate course sequences
- **Schedule Builder**: Visual semester planning
- **GPA Calculator**: Track academic performance
- **Export Options**: PDF reports and transcript formatting
- **Real API Integration**: Connect to university systems

### Advanced AI Features
- **Course Recommendations**: ML-powered suggestion engine
- **Graduation Risk Assessment**: Early warning system
- **Career Path Guidance**: Major/minor recommendations
- **Study Abroad Integration**: International course matching

## Contributing

This is an extensible system designed for easy customization:

1. **Add Your University**: Follow the data structure in `data.js`
2. **Enhance AI Responses**: Extend the chat system with new capabilities  
3. **Improve File Parsing**: Add support for more document formats
4. **UI/UX Improvements**: Enhance the interface and user experience

## Support

For questions about this degree tracker:
1. Check the AI chat system first - it can answer most questions
2. Review this documentation for setup and customization help
3. Examine the code comments for technical implementation details

## Acknowledgments

- Built for Northeastern University Computer Science program
- Sample data based on real degree audit structure
- Designed with extensibility for other universities and majors