// Enhanced AI Assistant with Real Intelligence Integration
class EnhancedAIAssistant {
    constructor(degreeTracker) {
        this.degreeTracker = degreeTracker;
        this.conversationHistory = [];
        this.intentClassifier = new IntentClassifier();
        this.courseDatabase = new CourseDatabase();
        
        // Initialize program tracker after other classes are available
        try {
            if (typeof StudentProgramTracker !== 'undefined') {
                this.programTracker = new StudentProgramTracker();
                this.initializeDefaultPrograms();
            }
        } catch (error) {
            console.log('Using fallback AI assistant (advanced features disabled)');
            this.programTracker = null;
        }
    }

    initializeDefaultPrograms() {
        // Add the main CS major
        if (this.programTracker) {
            this.programTracker.addProgram('northeastern-cs', {
                completedCourses: this.degreeTracker.studentData.completedCourses,
                plannedCourses: this.degreeTracker.studentData.plannedCourses
            });
        }
    }

    async processMessage(message, context = {}) {
        try {
            // Add to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });

            // Classify intent
            const intent = this.intentClassifier.classifyIntent(message);
            
            // Process based on intent
            let response;
            switch (intent.type) {
                case 'add_course':
                    response = await this.handleAddCourse(message, intent.entities);
                    break;
                case 'add_program':
                    response = await this.handleAddProgram(message, intent.entities);
                    break;
                case 'check_progress':
                    response = this.handleProgressCheck(message, intent.entities);
                    break;
                case 'missing_requirements':
                    response = this.handleMissingRequirements(intent.entities);
                    break;
                case 'graduation_check':
                    response = this.handleGraduationCheck(intent.entities);
                    break;
                case 'course_recommendation':
                    response = await this.handleCourseRecommendation(intent.entities);
                    break;
                case 'parse_requirements':
                    response = await this.handleParseRequirements(message, intent.entities);
                    break;
                default:
                    response = await this.handleGeneralQuery(message);
            }

            // Add response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString(),
                intent: intent.type
            });

            return response;

        } catch (error) {
            console.error('Error processing message:', error);
            return this.generateErrorResponse(error);
        }
    }

    async handleAddCourse(message, entities) {
        const courseInfo = this.extractCourseInfo(message);
        
        if (!courseInfo.code || !courseInfo.credits) {
            return `I need more information to add the course. Please provide:
            - Course code (e.g., CS 4000)
            - Credits (e.g., 4)
            - Title (optional)
            - Status (completed/planned/in-progress)
            
            Example: "Add CS 4000 Advanced Algorithms 4 credits completed"`;
        }

        // Add to student data
        const course = {
            code: courseInfo.code,
            title: courseInfo.title || 'Added via AI Assistant',
            credits: courseInfo.credits,
            status: courseInfo.status || 'completed',
            semester: courseInfo.semester || 'AI Added',
            category: this.degreeTracker.determineCourseCategory(courseInfo.code),
            grade: courseInfo.grade || 'P',
            addedBy: 'ai-assistant',
            addedDate: new Date().toISOString()
        };

        if (course.status === 'completed') {
            this.degreeTracker.studentData.completedCourses.push(course);
            this.degreeTracker.studentData.completedCredits += course.credits;
        } else {
            this.degreeTracker.studentData.plannedCourses.push(course);
        }

        // Update UI
        this.degreeTracker.updateAllData();

        // Check if this fulfills any requirements
        const fulfilledReqs = this.checkRequirementFulfillment(course);
        
        let fulfillmentText = '';
        if (fulfilledReqs.length > 0) {
            fulfillmentText = `\n\n✅ **Requirements Fulfilled:**\n${fulfilledReqs.map(req => `- ${req}`).join('\n')}`;
        }

        return `✅ Successfully added **${course.code}: ${course.title}**
        
📊 **Course Details:**
- Credits: ${course.credits}
- Status: ${course.status}
- Category: ${course.category}
- Semester: ${course.semester}${fulfillmentText}`;
    }

    async handleAddProgram(message, entities) {
        const url = this.extractURL(message);
        const programType = this.extractProgramType(message);

        if (!url) {
            return `To add a new program, please provide a university catalog URL. For example:
            
"Add this minor: https://catalog.northeastern.edu/undergraduate/science/mathematics/mathematics-minor/"
            
I can parse requirements from major universities and add them to your tracker.`;
        }

        try {
            const programId = await this.programTracker.configManager.importProgramFromURL(url, programType);
            this.programTracker.addProgram(programId);

            const program = this.programTracker.configManager.getProgram(programId);
            
            return `🎓 Successfully added **${program.name}** from ${program.university}!
            
📋 **Program Details:**
- Type: ${program.type}
- Total Requirements: ${this.countRequirements(program.requirements)}
- Credits: ${program.totalCredits || 'TBD'}
- Source: ${url}

I've analyzed your current courses and will now track this program's requirements. Check the Requirements tab to see your progress!`;

        } catch (error) {
            return `❌ I couldn't parse the requirements from that URL. This might be because:

- The website structure isn't supported yet
- The URL is incorrect or inaccessible
- The page doesn't contain clear requirement information

Please try:
1. Double-check the URL
2. Use the manual "Add Course" feature for individual requirements
3. Provide a different format (PDF, text list, etc.)`;
        }
    }

    handleProgressCheck(message, entities) {
        const overall = this.programTracker.calculateOverallProgress();
        const programs = this.programTracker.getActivePrograms();

        let response = `📊 **Overall Progress: ${overall.percentage}%**\n\n`;

        programs.forEach(({ program }) => {
            const progress = this.programTracker.calculateProgramProgress(program.id);
            const icon = program.type === 'major' ? '🎓' : program.type === 'minor' ? '📐' : '🏆';
            
            response += `${icon} **${program.name}** (${program.type}): ${progress.completed}/${progress.total} (${progress.percentage}%)\n`;
        });

        const missing = this.programTracker.getMissingRequirements();
        const completedCredits = this.degreeTracker.studentData.completedCredits;
        const totalCredits = this.degreeTracker.studentData.requiredCredits;

        response += `\n📈 **Academic Summary:**
- **Completed Courses:** ${this.degreeTracker.studentData.completedCourses.length}
- **Credits Earned:** ${completedCredits}/${totalCredits}
- **Missing Requirements:** ${missing.length}
- **Expected Graduation:** ${this.degreeTracker.studentData.expectedGraduation}`;

        if (missing.length > 0 && missing.length <= 5) {
            response += `\n\n🎯 **Next Steps:**\n${missing.slice(0, 3).map(m => `- ${m.requirement.name}`).join('\n')}`;
        }

        return response;
    }

    handleMissingRequirements(entities) {
        const missing = this.programTracker.getMissingRequirements();

        if (missing.length === 0) {
            return `🎉 **Congratulations!** You've fulfilled all requirements for your active programs!
            
✅ All major requirements complete
✅ All minor requirements complete
✅ All concentration requirements complete

You're on track to graduate as planned!`;
        }

        let response = `📋 **Missing Requirements (${missing.length} total):**\n\n`;

        // Group by program
        const byProgram = missing.reduce((acc, item) => {
            if (!acc[item.programName]) acc[item.programName] = [];
            acc[item.programName].push(item);
            return acc;
        }, {});

        Object.entries(byProgram).forEach(([programName, requirements]) => {
            const icon = requirements[0].requirement.type === 'major' ? '🎓' : '📐';
            response += `${icon} **${programName}:**\n`;
            
            requirements.slice(0, 5).forEach(req => {
                response += `- **${req.requirement.name}** (${req.requirement.credits} credits)\n`;
                if (req.requirement.description) {
                    response += `  *${req.requirement.description}*\n`;
                }
            });
            
            if (requirements.length > 5) {
                response += `- ...and ${requirements.length - 5} more\n`;
            }
            response += '\n';
        });

        // Add recommendations
        response += `💡 **Recommendations:**\n`;
        response += `- Plan ${Math.min(missing.length, 4)} courses for your next semester\n`;
        response += `- Check for prerequisite chains\n`;
        response += `- Consider summer courses to stay on track\n`;

        return response;
    }

    handleGraduationCheck(entities) {
        const overall = this.programTracker.calculateOverallProgress();
        const missing = this.programTracker.getMissingRequirements();
        const completedCredits = this.degreeTracker.studentData.completedCredits;
        const plannedCredits = this.degreeTracker.studentData.plannedCourses.reduce((sum, course) => sum + course.credits, 0);
        const totalCredits = completedCredits + plannedCredits;
        const requiredCredits = this.degreeTracker.studentData.requiredCredits;

        const onTrack = missing.length === 0 && totalCredits >= requiredCredits;
        const expectedGrad = this.degreeTracker.studentData.expectedGraduation;

        if (onTrack) {
            return `🎓 **Graduation Status: ON TRACK!**

✅ **All requirements fulfilled or planned**
✅ **Credits: ${totalCredits}/${requiredCredits} (${totalCredits - requiredCredits >= 0 ? 'Complete' : 'Need ' + (requiredCredits - totalCredits)})**
✅ **Expected graduation: ${expectedGrad}**

🎉 You're perfectly positioned to graduate on time! Just complete your planned courses and you'll have your degree with all concentrations and minors.

**Final semester preview:**
- Complete remaining ${missing.length} requirements
- Finish your planned courses
- Maintain good academic standing
- Apply for graduation by the deadline`;
        }

        const creditsNeeded = Math.max(0, requiredCredits - totalCredits);
        const reqsNeeded = missing.length;

        return `⚠️ **Graduation Status: Needs Attention**

📊 **Current Status:**
- Requirements: ${overall.completed}/${overall.total} (${reqsNeeded} missing)
- Credits: ${totalCredits}/${requiredCredits} (${creditsNeeded} needed)
- Expected: ${expectedGrad}

🎯 **Action Plan:**
${creditsNeeded > 0 ? `- Add ${Math.ceil(creditsNeeded / 4)} more courses (${creditsNeeded} credits)` : ''}
${reqsNeeded > 0 ? `- Complete ${reqsNeeded} missing requirements` : ''}
- Consider summer courses or overload semesters
- Meet with your academic advisor
- Review prerequisite chains

💪 **Don't worry!** With planning, you can still graduate on time or with minimal delay.`;
    }

    async handleCourseRecommendation(entities) {
        const missing = this.programTracker.getMissingRequirements();
        const completedCodes = this.degreeTracker.studentData.completedCourses.map(c => c.code);
        
        if (missing.length === 0) {
            return `🎉 Great news! You don't have any missing requirements. 

Consider these options:
- **Additional electives** in your areas of interest
- **Advanced courses** to deepen your expertise  
- **Research opportunities** or independent studies
- **Internships** or co-op experiences

What specific area interests you most? I can suggest relevant courses.`;
        }

        // Group recommendations by priority
        const highPriority = missing.filter(m => m.requirement.credits >= 4);
        const prerequisites = missing.filter(m => 
            this.hasPrerequisites(m.requirement.matchingCourses[0])
        );

        let response = `📚 **Course Recommendations:**\n\n`;

        if (highPriority.length > 0) {
            response += `🔥 **High Priority (Major Requirements):**\n`;
            highPriority.slice(0, 3).forEach(req => {
                response += `- **${req.requirement.name}** (${req.requirement.credits} credits)\n`;
                response += `  ${req.requirement.description}\n`;
                
                // Check availability
                const availability = this.checkCourseAvailability(req.requirement.matchingCourses[0]);
                response += `  📅 ${availability}\n\n`;
            });
        }

        response += `💡 **Smart Scheduling Tips:**\n`;
        response += `- Take prerequisite chains early\n`;
        response += `- Balance difficult courses with easier ones\n`;
        response += `- Consider course scheduling (some offered only in fall/spring)\n`;
        response += `- Plan around co-op rotations\n\n`;

        response += `Would you like specific recommendations for next semester?`;

        return response;
    }

    async handleParseRequirements(message, entities) {
        const url = this.extractURL(message);
        
        if (!url) {
            return `To parse requirements, please provide a university catalog URL. Examples:

**Majors:**
- https://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/

**Minors:**  
- https://catalog.northeastern.edu/undergraduate/science/mathematics/mathematics-minor/

**Concentrations:**
- Look for specific concentration pages within degree programs

I'll extract the requirements and add them to your tracker automatically!`;
        }

        try {
            const parser = new RequirementsParser();
            const parsed = await parser.parseRequirementsFromURL(url);
            const standard = parser.exportToStandardFormat(parsed);

            return `📋 **Requirements Parsed Successfully!**

**Program:** ${standard.programInfo.name}
**University:** ${standard.programInfo.university}
**Total Credits:** ${standard.programInfo.totalCredits}

**Categories Found:**
${Object.entries(standard.requirements).map(([category, reqs]) => 
    `- **${category}**: ${reqs.length} requirements`
).join('\n')}

**Sample Requirements:**
${Object.values(standard.requirements)[0]?.slice(0, 3).map(req => 
    `- ${req.name} (${req.credits} credits)`
).join('\n') || 'No requirements found'}

Would you like me to add this program to your tracker? Say "yes" to add it!`;

        } catch (error) {
            return `❌ I couldn't parse the requirements from that URL. 

**Possible issues:**
- Website structure not yet supported
- URL might be incorrect
- Page requires authentication
- Content is dynamically loaded

**Try this instead:**
1. Copy and paste the text requirements
2. Upload a PDF of the requirements
3. Use the manual "Add Course" feature
4. Provide a different URL format`;
        }
    }

    async handleGeneralQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Handle common questions
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return this.getHelpResponse();
        }
        
        if (lowerMessage.includes('how') && lowerMessage.includes('add')) {
            return this.getAddHelpResponse();
        }

        // Default conversational response
        return `I'm your AI academic advisor! I can help you with:

🎓 **Degree Planning:**
- "What courses do I still need?"
- "Am I on track to graduate?"
- "Check my progress"

📚 **Course Management:**
- "Add CS 4000 Advanced Algorithms 4 credits completed"
- "Add this minor: [URL]"
- "Recommend courses for next semester"

📊 **Requirements Tracking:**
- "Parse requirements from [URL]"
- "What are my missing requirements?"
- "Add this major/minor/concentration"

📅 **Graduation Planning:**
- "Can I graduate on time?"
- "What should I take next semester?"
- "How many credits do I need?"

What would you like to know about your academic progress?`;
    }

    // Helper methods
    extractCourseInfo(message) {
        const coursePattern = /([A-Z]{2,4})\s*(\d{3,4})/i;
        const creditsPattern = /(\d+)\s*(?:credit|hour)/i;
        const statusPattern = /\b(completed|planned|in-progress)\b/i;
        const gradePattern = /\b([A-F][+-]?|P|IP)\b/i;
        
        const courseMatch = message.match(coursePattern);
        const creditsMatch = message.match(creditsPattern);
        const statusMatch = message.match(statusPattern);
        const gradeMatch = message.match(gradePattern);
        
        return {
            code: courseMatch ? `${courseMatch[1].toUpperCase()} ${courseMatch[2]}` : null,
            credits: creditsMatch ? parseInt(creditsMatch[1]) : null,
            status: statusMatch ? statusMatch[1].toLowerCase() : null,
            grade: gradeMatch ? gradeMatch[1] : null,
            title: null // Could be extracted with more complex parsing
        };
    }

    extractURL(message) {
        const urlPattern = /https?:\/\/[^\s]+/i;
        const match = message.match(urlPattern);
        return match ? match[0] : null;
    }

    extractProgramType(message) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('minor')) return 'minor';
        if (lowerMessage.includes('concentration')) return 'concentration';
        if (lowerMessage.includes('major')) return 'major';
        return 'major'; // default
    }

    checkRequirementFulfillment(course) {
        const fulfilled = [];
        
        // Check all active programs for requirement matches
        this.programTracker.getActivePrograms().forEach(({ program }) => {
            Object.entries(program.requirements).forEach(([category, requirements]) => {
                if (Array.isArray(requirements)) {
                    requirements.forEach(req => {
                        if (req.matchingCourses.some(code => 
                            code.toLowerCase().includes(course.code.toLowerCase()) ||
                            course.code.toLowerCase().includes(code.toLowerCase())
                        )) {
                            req.fulfilled = true;
                            fulfilled.push(`${program.name}: ${req.name}`);
                        }
                    });
                }
            });
        });
        
        return fulfilled;
    }

    countRequirements(requirements) {
        let count = 0;
        Object.values(requirements).forEach(category => {
            if (Array.isArray(category)) {
                count += category.length;
            }
        });
        return count;
    }

    hasPrerequisites(courseCode) {
        // Simple heuristic - advanced courses typically have prerequisites
        const courseNum = parseInt(courseCode.match(/\d+/)?.[0] || '0');
        return courseNum >= 3000;
    }

    checkCourseAvailability(courseCode) {
        // Mock availability check
        const availability = ['Fall 2024', 'Spring 2025', 'Summer 2025'];
        return `Next offered: ${availability[0]}`;
    }

    getHelpResponse() {
        return `🤖 **AI Academic Assistant Help**

I'm designed to help you track multiple degree programs simultaneously! Here's what I can do:

**🎯 Smart Course Addition:**
- "Add CS 4000 Advanced Algorithms 4 credits completed"
- "I got an A in MATH 3150 Real Analysis"

**🎓 Program Management:**
- "Add this minor: [catalog URL]"
- "Parse requirements from [URL]"
- "Track this concentration"

**📊 Progress Tracking:**
- "What's my progress?" 
- "Am I on track to graduate?"
- "What requirements am I missing?"

**💡 Intelligent Planning:**
- "What courses should I take next?"
- "Recommend courses for next semester"
- "Check graduation timeline"

**🔗 URL Integration:**
- Paste any university catalog URL
- I'll automatically parse requirements
- Supports major universities

Just ask naturally - I understand conversational language!`;
    }

    getAddHelpResponse() {
        return `➕ **Adding Programs & Courses**

**Add Individual Courses:**
\`Add [COURSE CODE] [TITLE] [CREDITS] credits [STATUS]\`
- Example: "Add CS 4000 Advanced Algorithms 4 credits completed"
- Status: completed, planned, in-progress

**Add Programs from URLs:**
\`Add this [TYPE]: [UNIVERSITY CATALOG URL]\`
- Example: "Add this minor: https://catalog.northeastern.edu/.../math-minor/"
- Types: major, minor, concentration

**Add by Copy-Paste:**
- Paste requirements text
- Upload PDF files
- I'll parse automatically

**Supported Universities:**
- Northeastern University
- UNC Charlotte  
- University of Maryland
- More being added!

The more details you provide, the better I can help track your progress!`;
    }

    generateErrorResponse(error) {
        return `❌ I encountered an error: ${error.message}

**Try this:**
1. Check your input format
2. Verify any URLs are accessible
3. Use the manual "Add Course" button for complex cases
4. Ask me for help: "How do I add a course?"

I'm constantly learning and improving. Thanks for your patience!`;
    }
}

// Intent Classification System
class IntentClassifier {
    constructor() {
        this.patterns = {
            add_course: [
                /add\s+([A-Z]{2,4}\s*\d{3,4})/i,
                /got\s+credit\s+for/i,
                /completed\s+([A-Z]{2,4}\s*\d{3,4})/i,
                /took\s+([A-Z]{2,4}\s*\d{3,4})/i
            ],
            add_program: [
                /add.*(?:major|minor|concentration)/i,
                /parse.*requirements/i,
                /import.*program/i,
                /track.*(?:minor|major)/i
            ],
            check_progress: [
                /(?:what|how).*progress/i,
                /how.*doing/i,
                /status.*degree/i,
                /track.*progress/i
            ],
            missing_requirements: [
                /what.*(?:need|missing|required)/i,
                /missing.*(?:courses|requirements)/i,
                /still.*need/i,
                /requirements.*left/i
            ],
            graduation_check: [
                /graduate.*time/i,
                /on.*track/i,
                /can.*graduate/i,
                /graduation.*status/i
            ],
            course_recommendation: [
                /what.*take/i,
                /recommend.*courses/i,
                /suggest.*classes/i,
                /next.*semester/i
            ],
            parse_requirements: [
                /parse.*from/i,
                /requirements.*from.*url/i,
                /extract.*requirements/i
            ]
        };
    }

    classifyIntent(message) {
        for (const [intentType, patterns] of Object.entries(this.patterns)) {
            for (const pattern of patterns) {
                if (pattern.test(message)) {
                    return {
                        type: intentType,
                        confidence: 0.8,
                        entities: this.extractEntities(message, intentType)
                    };
                }
            }
        }

        return {
            type: 'general_query',
            confidence: 0.5,
            entities: {}
        };
    }

    extractEntities(message, intentType) {
        const entities = {};

        // Extract course codes
        const courseMatch = message.match(/([A-Z]{2,4})\s*(\d{3,4})/gi);
        if (courseMatch) {
            entities.courses = courseMatch;
        }

        // Extract URLs
        const urlMatch = message.match(/https?:\/\/[^\s]+/gi);
        if (urlMatch) {
            entities.urls = urlMatch;
        }

        // Extract credits
        const creditsMatch = message.match(/(\d+)\s*(?:credit|hour)/gi);
        if (creditsMatch) {
            entities.credits = creditsMatch;
        }

        return entities;
    }
}

// Course Database (for enhanced recommendations)
class CourseDatabase {
    constructor() {
        this.courses = new Map();
        this.loadBasicCourses();
    }

    loadBasicCourses() {
        // This would typically be loaded from an API or database
        const basicCourses = [
            { code: 'CS 1800', title: 'Discrete Structures', prerequisites: [], offered: ['Fall', 'Spring'] },
            { code: 'CS 2500', title: 'Fundamentals of CS 1', prerequisites: [], offered: ['Fall', 'Spring'] },
            { code: 'CS 3000', title: 'Algorithms & Data', prerequisites: ['CS 2500'], offered: ['Fall', 'Spring'] },
            { code: 'CS 4100', title: 'Artificial Intelligence', prerequisites: ['CS 3000'], offered: ['Fall'] }
        ];

        basicCourses.forEach(course => {
            this.courses.set(course.code, course);
        });
    }

    getCourse(courseCode) {
        return this.courses.get(courseCode);
    }

    getPrerequisites(courseCode) {
        const course = this.courses.get(courseCode);
        return course ? course.prerequisites : [];
    }

    isOffered(courseCode, semester) {
        const course = this.courses.get(courseCode);
        return course ? course.offered.includes(semester) : true; // Default to available
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedAIAssistant,
        IntentClassifier,
        CourseDatabase
    };
}