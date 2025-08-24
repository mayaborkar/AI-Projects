class DegreeTracker {
    constructor() {
        this.studentData = { ...SAMPLE_STUDENT_DATA };
        this.requirements = NORTHEASTERN_CS_REQUIREMENTS;
        this.mathMinor = MATHEMATICS_MINOR_REQUIREMENTS;
        this.selectedMinors = [];
        this.selectedConcentration = 'artificial-intelligence';
        
        this.initializeApp();
        this.loadSampleData();
    }

    initializeApp() {
        this.setupTabNavigation();
        this.setupModals();
        this.setupChatInterface();
        this.setupFileUpload();
        this.setupManualCourseForm();
        this.updateDashboard();
    }

    setupTabNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                navButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                if (targetTab === 'dashboard') this.updateDashboard();
                if (targetTab === 'courses') this.updateCoursesView();
                if (targetTab === 'requirements') this.updateRequirementsView();
            });
        });
    }

    setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeBtns = document.querySelectorAll('.close-btn');
        
        document.getElementById('upload-courses-btn').addEventListener('click', () => {
            document.getElementById('upload-modal').classList.add('active');
        });
        
        document.getElementById('add-manual-course-btn').addEventListener('click', () => {
            document.getElementById('manual-course-modal').classList.add('active');
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                document.getElementById(modalId).classList.remove('active');
            });
        });

        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    setupChatInterface() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-chat-btn');
        const chatMessages = document.getElementById('chat-messages');
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');

        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (!message) return;

            this.addChatMessage('user', message);
            chatInput.value = '';
            
            setTimeout(() => {
                const response = this.generateAIResponse(message);
                this.addChatMessage('ai', response);
            }, 500);
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const suggestion = btn.dataset.suggestion;
                chatInput.value = suggestion;
                sendMessage();
            });
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');

        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-color)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            const files = e.dataTransfer.files;
            if (files.length) this.handleFileUpload(files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    }

    setupManualCourseForm() {
        const form = document.getElementById('manual-course-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const courseData = {
                code: document.getElementById('course-code').value.trim(),
                title: document.getElementById('course-title').value.trim(),
                credits: parseFloat(document.getElementById('course-credits').value),
                status: document.getElementById('course-status').value,
                semester: document.getElementById('course-semester').value.trim()
            };

            this.addManualCourse(courseData);
            form.reset();
            document.getElementById('manual-course-modal').classList.remove('active');
        });
    }

    loadSampleData() {
        this.updateDashboard();
        this.updateCoursesView();
        this.updateRequirementsView();
    }

    updateDashboard() {
        const allCourses = [...this.studentData.completedCourses, ...this.studentData.plannedCourses];
        const completedCourses = this.studentData.completedCourses;
        
        document.getElementById('completed-courses').textContent = completedCourses.length;
        document.getElementById('total-credits').textContent = getCompletedCredits(completedCourses);
        
        const majorProgress = this.calculateMajorProgress();
        document.getElementById('completion-percentage').textContent = `${majorProgress.percentage}%`;
        document.getElementById('major-progress').style.width = `${majorProgress.percentage}%`;
        document.getElementById('major-progress-text').textContent = `${majorProgress.fulfilled}/${majorProgress.total} completed`;

        this.updateRecentActivity();
        this.updateMinorSection();
    }

    updateCoursesView() {
        const coursesGrid = document.getElementById('courses-grid');
        const allCourses = [...this.studentData.completedCourses, ...this.studentData.plannedCourses];
        
        if (allCourses.length === 0) {
            coursesGrid.innerHTML = `
                <div class="no-courses">
                    <i class="fas fa-book-open"></i>
                    <h3>No courses added yet</h3>
                    <p>Upload your course plan or add courses manually to get started.</p>
                </div>
            `;
            return;
        }

        coursesGrid.innerHTML = allCourses.map(course => `
            <div class="course-card">
                <div class="course-header">
                    <span class="course-code">${course.code}</span>
                    <span class="course-status ${course.status}">${course.status.replace('-', ' ')}</span>
                </div>
                <div class="course-title">${course.title}</div>
                <div class="course-details">
                    <span>${course.credits} credits</span>
                    <span>${course.semester || 'TBD'}</span>
                </div>
            </div>
        `).join('');

        this.setupCourseFilters();
    }

    setupCourseFilters() {
        const semesterFilter = document.getElementById('semester-filter');
        const courseSearch = document.getElementById('course-search');
        
        const filterCourses = () => {
            const filterValue = semesterFilter.value;
            const searchValue = courseSearch.value.toLowerCase();
            const courseCards = document.querySelectorAll('.course-card');
            
            courseCards.forEach(card => {
                const courseCode = card.querySelector('.course-code').textContent.toLowerCase();
                const courseTitle = card.querySelector('.course-title').textContent.toLowerCase();
                const courseStatus = card.querySelector('.course-status').className;
                
                const matchesFilter = filterValue === 'all' || courseStatus.includes(filterValue);
                const matchesSearch = courseCode.includes(searchValue) || courseTitle.includes(searchValue);
                
                card.style.display = matchesFilter && matchesSearch ? 'block' : 'none';
            });
        };

        semesterFilter.addEventListener('change', filterCourses);
        courseSearch.addEventListener('input', filterCourses);
    }

    updateRequirementsView() {
        this.updateRequirementsSummary();
        this.updateRequirementsSections();
    }

    updateRequirementsSummary() {
        const allCourses = [...this.studentData.completedCourses, ...this.studentData.plannedCourses];
        const allRequirements = [
            ...this.requirements.coreRequirements,
            ...this.requirements.supportingCourses,
            ...this.requirements.writingRequirements,
            ...this.requirements.additionalRequirements
        ];

        let fulfilled = 0, missing = 0, inProgress = 0;

        allRequirements.forEach(req => {
            const status = this.getRequirementStatus(req, allCourses);
            if (status === 'fulfilled') fulfilled++;
            else if (status === 'in-progress') inProgress++;
            else missing++;
        });

        document.getElementById('fulfilled-count').textContent = fulfilled;
        document.getElementById('missing-count').textContent = missing;
        document.getElementById('in-progress-count').textContent = inProgress;
    }

    updateRequirementsSections() {
        this.updateRequirementsSection('core-requirements', this.requirements.coreRequirements);
        this.updateRequirementsSection('concentration-requirements', 
            this.requirements.concentrations[this.selectedConcentration].requiredCourses);
        this.updateRequirementsSection('general-requirements', 
            [...this.requirements.writingRequirements, ...this.requirements.additionalRequirements]);
    }

    updateRequirementsSection(sectionId, requirements) {
        const section = document.getElementById(sectionId);
        const allCourses = [...this.studentData.completedCourses, ...this.studentData.plannedCourses];
        
        section.innerHTML = requirements.map(req => {
            const status = this.getRequirementStatus(req, allCourses);
            const matchingCourses = this.findMatchingCourses(req, allCourses);
            
            return `
                <div class="requirement-item ${status}">
                    <div class="requirement-header">
                        <span class="requirement-title">${req.name || req.title}</span>
                        <span class="requirement-status-badge ${status}">${status.replace('-', ' ')}</span>
                    </div>
                    <div class="requirement-description">${req.description}</div>
                    <div class="requirement-courses">
                        ${matchingCourses.map(course => 
                            `<span class="course-tag">${course.code}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    getRequirementStatus(requirement, courses) {
        const matchingCourses = this.findMatchingCourses(requirement, courses);
        
        if (matchingCourses.some(course => course.status === 'completed')) {
            return 'fulfilled';
        } else if (matchingCourses.some(course => course.status === 'in-progress')) {
            return 'in-progress';
        } else if (matchingCourses.some(course => course.status === 'planned')) {
            return 'in-progress';
        }
        
        return 'missing';
    }

    findMatchingCourses(requirement, courses) {
        const reqName = requirement.name || requirement.title || '';
        const reqOptions = requirement.options || [];
        const reqAlternatives = requirement.alternatives || [];
        
        return courses.filter(course => {
            const courseCode = course.code.toLowerCase().replace(/\s+/g, '');
            const reqCode = reqName.toLowerCase().replace(/\s+/g, '');
            
            return courseCode.includes(reqCode) ||
                   reqOptions.some(option => courseCode.includes(option.toLowerCase().replace(/\s+/g, ''))) ||
                   reqAlternatives.some(alt => courseCode.includes(alt.toLowerCase().replace(/\s+/g, '')));
        });
    }

    calculateMajorProgress() {
        const allRequirements = [
            ...this.requirements.coreRequirements,
            ...this.requirements.supportingCourses,
            ...this.requirements.writingRequirements,
            ...this.requirements.additionalRequirements
        ];
        
        return calculateProgress(allRequirements, this.studentData.completedCourses);
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        const recentCourses = this.studentData.completedCourses
            .slice(-5)
            .reverse();

        if (recentCourses.length === 0) {
            activityList.innerHTML = '<p class="no-activity">No recent activity. Upload your courses to get started!</p>';
            return;
        }

        activityList.innerHTML = recentCourses.map(course => `
            <div class="activity-item">
                <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                <span>Completed <strong>${course.code}</strong> - ${course.title}</span>
                <span class="activity-time">${course.semester}</span>
            </div>
        `).join('');
    }

    updateMinorSection() {
        const minorRequirements = document.getElementById('minor-requirements');
        
        if (this.selectedMinors.includes('mathematics')) {
            const mathProgress = this.calculateMinorProgress('mathematics');
            minorRequirements.innerHTML = `
                <div class="minor-progress">
                    <h4>Mathematics Minor</h4>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${mathProgress.percentage}%"></div>
                        </div>
                        <span class="progress-text">${mathProgress.fulfilled}/${mathProgress.total} completed</span>
                    </div>
                </div>
            `;
        } else {
            minorRequirements.innerHTML = '<p class="no-activity">No minor selected</p>';
        }

        document.getElementById('add-minor-btn').addEventListener('click', () => {
            const selectedMinor = document.getElementById('minor-select').value;
            if (selectedMinor && !this.selectedMinors.includes(selectedMinor)) {
                this.selectedMinors.push(selectedMinor);
                this.updateMinorSection();
            }
        });
    }

    calculateMinorProgress(minorType) {
        if (minorType === 'mathematics') {
            const requiredCourses = [
                ...this.mathMinor.requiredCourses,
                ...this.mathMinor.intermediateCourses.options,
                ...this.mathMinor.electives.examples
            ];
            
            return calculateProgress(requiredCourses, this.studentData.completedCourses);
        }
        
        return { fulfilled: 0, total: 1, percentage: 0 };
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                ${typeof message === 'string' ? `<p>${message}</p>` : message}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('courses') && lowerMessage.includes('need')) {
            return this.generateCoursesNeededResponse();
        }
        
        if (lowerMessage.includes('graduate') && lowerMessage.includes('time')) {
            return this.generateGraduationTimelineResponse();
        }
        
        if (lowerMessage.includes('credit') || lowerMessage.includes('add') || lowerMessage.includes('manual')) {
            return this.generateManualCreditResponse();
        }
        
        if (lowerMessage.includes('minor')) {
            return this.generateMinorResponse();
        }
        
        if (lowerMessage.includes('concentration')) {
            return this.generateConcentrationResponse();
        }
        
        return "I can help you with course planning, requirement checking, and degree progress tracking. What specific question do you have about your degree?";
    }

    generateCoursesNeededResponse() {
        const missingCourses = this.findMissingCourses();
        
        if (missingCourses.length === 0) {
            return "🎉 Great news! Based on your current courses, you've fulfilled all major requirements. You just need to complete your planned courses and ensure you have 134 total credits.";
        }
        
        const coursesList = missingCourses.map(course => `• ${course.name}: ${course.title}`).join('\n');
        
        return `Based on your current transcript, you still need these courses:\n\n${coursesList}\n\nWould you like me to help you plan when to take these courses?`;
    }

    generateGraduationTimelineResponse() {
        const totalCredits = getTotalCredits([...this.studentData.completedCourses, ...this.studentData.plannedCourses]);
        const completedCredits = getCompletedCredits(this.studentData.completedCourses);
        
        if (totalCredits >= 134) {
            return `✅ You're on track to graduate! You have ${completedCredits} completed credits and ${totalCredits - completedCredits} planned credits, totaling ${totalCredits} credits (minimum 134 required).`;
        }
        
        const creditsNeeded = 134 - totalCredits;
        return `You need ${creditsNeeded} more credits to reach the 134 minimum for graduation. Consider adding more courses to your plan or discuss with your advisor about additional requirements.`;
    }

    generateManualCreditResponse() {
        return `I can help you add courses manually! Here's how:

1. **Add via UI**: Click the "Add Course Manually" button in the Courses tab
2. **Tell me directly**: Say something like "I got credit for CS 4000 Advanced Topics"
3. **Course equivalencies**: If you took a course that should count for a requirement, let me know

What course would you like to add to your transcript?`;
    }

    generateMinorResponse() {
        const mathProgress = this.calculateMinorProgress('mathematics');
        
        return `📊 **Mathematics Minor Analysis:**

You've completed ${mathProgress.fulfilled} out of ${mathProgress.total} requirements (${mathProgress.percentage}% complete).

**Your math courses:**
${this.studentData.completedCourses
    .filter(course => course.code.includes('MATH'))
    .map(course => `✅ ${course.code}: ${course.title}`)
    .join('\n')}

**Still need:** 
• 2 math electives from MATH 3001-4699 level

The Data Science minor isn't available to CS majors, but the Math minor looks great for you!`;
    }

    generateConcentrationResponse() {
        const aiCourses = this.studentData.completedCourses.filter(course => 
            ['CS 4100', 'DS 4400', 'CS 4120', 'DS 4420'].includes(course.code)
        );

        return `🤖 **Artificial Intelligence Concentration:**

You've completed all requirements! ✅

**Completed AI courses:**
${aiCourses.map(course => `✅ ${course.code}: ${course.title}`).join('\n')}

You have the required CS 4100 (AI) and DS 4400 (ML1), plus two electives (NLP and ML2). This concentration is fully satisfied!`;
    }

    findMissingCourses() {
        const allCourses = [...this.studentData.completedCourses, ...this.studentData.plannedCourses];
        const allRequirements = [
            ...this.requirements.coreRequirements,
            ...this.requirements.supportingCourses,
            ...this.requirements.writingRequirements
        ];

        return allRequirements.filter(req => {
            const matchingCourses = this.findMatchingCourses(req, allCourses);
            return matchingCourses.length === 0;
        });
    }

    async handleFileUpload(file) {
        document.getElementById('upload-progress').style.display = 'block';
        document.getElementById('upload-progress-fill').style.width = '0%';
        
        try {
            const content = await this.readFileContent(file);
            const courses = this.parseCoursesFromContent(content, file.type);
            
            document.getElementById('upload-progress-fill').style.width = '100%';
            document.getElementById('upload-progress-text').textContent = 'Upload complete!';
            
            this.mergeCourses(courses);
            this.updateDashboard();
            this.updateCoursesView();
            
            setTimeout(() => {
                document.getElementById('upload-modal').classList.remove('active');
                document.getElementById('upload-progress').style.display = 'none';
            }, 1000);
            
        } catch (error) {
            console.error('File upload error:', error);
            document.getElementById('upload-progress-text').textContent = 'Upload failed. Please try again.';
        }
    }

    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    parseCoursesFromContent(content, fileType) {
        const courses = [];
        const lines = content.split('\n');
        
        lines.forEach(line => {
            const courseMatch = line.match(/([A-Z]{2,4})\s*(\d{3,4})\s*(?:\(([0-9.]+)\s*(?:Hours?|Credits?)\))?\s*(.+)/i);
            if (courseMatch) {
                courses.push({
                    code: `${courseMatch[1]} ${courseMatch[2]}`,
                    title: courseMatch[4] ? courseMatch[4].trim() : 'Unknown Title',
                    credits: courseMatch[3] ? parseFloat(courseMatch[3]) : 4,
                    status: 'completed',
                    semester: 'Uploaded'
                });
            }
        });
        
        return courses;
    }

    mergeCourses(newCourses) {
        newCourses.forEach(newCourse => {
            const existingIndex = this.studentData.completedCourses.findIndex(
                course => course.code === newCourse.code
            );
            
            if (existingIndex === -1) {
                this.studentData.completedCourses.push(newCourse);
            }
        });
    }

    addManualCourse(courseData) {
        if (courseData.status === 'completed') {
            this.studentData.completedCourses.push(courseData);
        } else {
            this.studentData.plannedCourses.push(courseData);
        }
        
        this.addChatMessage('ai', `✅ Added ${courseData.code}: ${courseData.title} (${courseData.credits} credits, ${courseData.status})`);
        this.updateDashboard();
        this.updateCoursesView();
        this.updateRequirementsView();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new DegreeTracker();
    window.degreeTracker = app; // Make it globally accessible for debugging
});