class SimpleDegreeTracker {
    constructor() {
        this.studentData = { ...SAMPLE_STUDENT_DATA };
        this.currentMajor = 'northeastern-cs';
        this.requirements = AVAILABLE_PROGRAMS[this.currentMajor];
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
        this.setupMajorSelector();
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

    setupMajorSelector() {
        const majorSelect = document.getElementById('major-select');
        if (majorSelect) {
            majorSelect.value = this.currentMajor;
            
            majorSelect.addEventListener('change', (e) => {
                this.currentMajor = e.target.value;
                this.requirements = AVAILABLE_PROGRAMS[this.currentMajor];
                this.studentData.selectedMajor = this.currentMajor;
                
                this.updateDashboard();
                this.updateCoursesView();
                this.updateRequirementsView();
                
                this.addChatMessage('ai', `📚 Switched to ${this.requirements.program}. Updated all requirements!`);
            });
        }
    }

    setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeBtns = document.querySelectorAll('.close-btn');
        
        const uploadBtn = document.getElementById('upload-courses-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                document.getElementById('upload-modal').classList.add('active');
            });
        }
        
        const addManualBtn = document.getElementById('add-manual-course-btn');
        if (addManualBtn) {
            addManualBtn.addEventListener('click', () => {
                document.getElementById('manual-course-modal').classList.add('active');
            });
        }

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

        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const suggestion = btn.dataset.suggestion;
                if (chatInput) {
                    chatInput.value = suggestion;
                    sendMessage();
                }
            });
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');

        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        }
    }

    setupManualCourseForm() {
        const form = document.getElementById('manual-course-form');
        
        if (form) {
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
    }

    loadSampleData() {
        this.updateDashboard();
        this.updateCoursesView();
        this.updateRequirementsView();
    }

    updateDashboard() {
        const allCourses = [...this.studentData.completedCourses, ...this.studentData.plannedCourses];
        const completedCourses = this.studentData.completedCourses;
        
        const completedElement = document.getElementById('completed-courses');
        const creditsElement = document.getElementById('total-credits');
        const percentageElement = document.getElementById('completion-percentage');
        
        if (completedElement) completedElement.textContent = completedCourses.length;
        if (creditsElement) creditsElement.textContent = this.getCompletedCredits(completedCourses);
        
        const majorProgress = this.calculateMajorProgress();
        if (percentageElement) percentageElement.textContent = `${majorProgress.percentage}%`;
        
        const progressBar = document.getElementById('major-progress');
        const progressText = document.getElementById('major-progress-text');
        
        if (progressBar) progressBar.style.width = `${majorProgress.percentage}%`;
        if (progressText) progressText.textContent = `${majorProgress.fulfilled}/${majorProgress.total} completed`;

        this.updateRecentActivity();
        this.updateMinorSection();
    }

    updateCoursesView() {
        const coursesGrid = document.getElementById('courses-grid');
        if (!coursesGrid) return;
        
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
    }

    updateRequirementsView() {
        // Simplified requirements view
        console.log('Requirements updated for:', this.requirements.program);
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        if (!activityList) return;
        
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
        const activeMinors = document.getElementById('active-minors');
        const addMinorBtn = document.getElementById('add-minor-btn');
        
        if (activeMinors) {
            if (this.selectedMinors.length === 0) {
                activeMinors.innerHTML = '<p class="no-activity">No minors added yet</p>';
            } else {
                activeMinors.innerHTML = this.selectedMinors.map(minorKey => {
                    const minor = AVAILABLE_MINORS[minorKey];
                    return `
                        <div class="active-minor-item">
                            <div class="active-minor-info">
                                <h4>${minor.name}</h4>
                                <p>Active minor</p>
                            </div>
                            <button class="remove-minor-btn" onclick="window.degreeTracker.removeMinor('${minorKey}')">Remove</button>
                        </div>
                    `;
                }).join('');
            }
        }

        if (addMinorBtn) {
            addMinorBtn.onclick = () => {
                const selectedMinor = document.getElementById('minor-select').value;
                if (selectedMinor && !this.selectedMinors.includes(selectedMinor)) {
                    this.selectedMinors.push(selectedMinor);
                    this.updateMinorSection();
                    this.addChatMessage('ai', `✅ Added ${AVAILABLE_MINORS[selectedMinor].name} to your degree plan!`);
                    document.getElementById('minor-select').value = '';
                }
            };
        }
    }

    removeMinor(minorKey) {
        this.selectedMinors = this.selectedMinors.filter(m => m !== minorKey);
        this.updateMinorSection();
        this.addChatMessage('ai', `Removed ${AVAILABLE_MINORS[minorKey].name} from your degree plan.`);
    }

    calculateMajorProgress() {
        const allRequirements = [
            ...(this.requirements.coreRequirements || []),
            ...(this.requirements.supportingCourses || []),
            ...(this.requirements.writingRequirements || []),
            ...(this.requirements.additionalRequirements || [])
        ];
        
        return this.calculateProgress(allRequirements, this.studentData.completedCourses);
    }

    calculateProgress(requirements, completedCourses) {
        let fulfilled = 0;
        let total = requirements.length;
        
        requirements.forEach(req => {
            if (this.isRequirementFulfilled(req, completedCourses)) {
                fulfilled++;
            }
        });
        
        return { fulfilled, total, percentage: Math.round((fulfilled / total) * 100) };
    }

    isRequirementFulfilled(requirement, courses) {
        return courses.some(course => 
            course.code.toLowerCase().includes(requirement.name.toLowerCase()) ||
            (requirement.alternatives && requirement.alternatives.some(alt => 
                course.code.toLowerCase().includes(alt.toLowerCase())
            ))
        );
    }

    getCompletedCredits(courses) {
        return courses
            .filter(course => course.status === 'completed')
            .reduce((total, course) => total + course.credits, 0);
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('courses') && lowerMessage.includes('need')) {
            return `Based on your ${this.requirements.program}, you're making good progress! I can see you have ${this.studentData.completedCourses.length} completed courses.`;
        }
        
        if (lowerMessage.includes('graduate') && lowerMessage.includes('time')) {
            const totalCredits = this.getCompletedCredits([...this.studentData.completedCourses, ...this.studentData.plannedCourses]);
            return `You have ${this.getCompletedCredits(this.studentData.completedCourses)} completed credits. Your program requires ${this.requirements.totalCredits} total credits.`;
        }
        
        if (lowerMessage.includes('minor')) {
            if (this.selectedMinors.length === 0) {
                return "You haven't added any minors yet. You can add minors using the dropdown in the dashboard.";
            } else {
                return `You have ${this.selectedMinors.length} active minor(s): ${this.selectedMinors.map(m => AVAILABLE_MINORS[m].name).join(', ')}`;
            }
        }
        
        return "I can help you with course planning, requirement checking, and degree progress tracking. What would you like to know?";
    }

    handleFileUpload(file) {
        // Simplified file upload
        this.addChatMessage('ai', `📁 File uploaded: ${file.name}. File parsing functionality is simplified in this version.`);
        document.getElementById('upload-modal').classList.remove('active');
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
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new SimpleDegreeTracker();
    window.degreeTracker = app; // Make it globally accessible
});