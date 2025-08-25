// Modern Degree Tracker Application
class DegreeTracker {
    constructor() {
        this.studentData = STUDENT_DATA;
        this.requirements = DEGREE_REQUIREMENTS;
        this.semesterPlan = SEMESTER_PLAN;
        this.currentView = 'overview';
        this.theme = localStorage.getItem('theme') || 'light';
        
        // Initialize enhanced AI assistant if available
        if (typeof EnhancedAIAssistant !== 'undefined') {
            this.enhancedAI = new EnhancedAIAssistant(this);
        }
        
        // Initialize program tracker for multiple programs
        this.activePrograms = new Map();
        this.programHistory = [];
        
        // Update requirements based on actual completed/planned courses
        this.updateRequirementFulfillment();
        
        // Calculate actual completed credits
        this.updateCompletedCredits();
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.loadView('overview');
        this.updateAllData();
        
        console.log('🎓 Degree Tracker initialized successfully');
        console.log(`📊 Student: ${this.studentData.name}`);
        console.log(`✅ Completed: ${this.studentData.completedCourses.length} courses`);
        console.log(`📅 Planned: ${this.studentData.plannedCourses.length} courses`);
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Add course button
        const addCourseBtn = document.getElementById('add-course-btn');
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', () => this.openModal('add-course-modal'));
        }

        // Upload transcript button
        const uploadBtn = document.getElementById('upload-transcript-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.openModal('upload-modal'));
        }

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Modal controls
        this.setupModalControls();
        
        // Chat functionality
        this.setupChat();
        
        // Course filters
        this.setupFilters();
        
        // File upload
        this.setupFileUpload();
    }

    setupModalControls() {
        const modalOverlay = document.getElementById('modal-overlay');
        
        // Close modal when clicking overlay
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeAllModals();
                }
            });
        }

        // Close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Course form submission
        const courseForm = document.getElementById('add-course-form');
        if (courseForm) {
            courseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddCourse();
            });
        }

        // Edit course form submission
        const editCourseForm = document.getElementById('edit-course-form');
        if (editCourseForm) {
            editCourseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEditCourse();
            });
        }

        // Delete course button
        const deleteCourseBtn = document.getElementById('delete-course-btn');
        if (deleteCourseBtn) {
            deleteCourseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDeleteCourse();
            });
        }
    }

    setupChat() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');
        const clearBtn = document.getElementById('clear-chat');

        const sendMessage = () => {
            const message = chatInput?.value.trim();
            if (!message) return;

            this.addChatMessage('user', message);
            chatInput.value = '';

            // Simulate AI response
            setTimeout(async () => {
                const response = await this.generateAIResponse(message);
                this.addChatMessage('ai', response);
            }, 1000);
        };

        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearChat());
        }

        // Suggestion chips
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.text;
                if (chatInput) {
                    chatInput.value = text;
                    sendMessage();
                }
            });
        });
    }

    setupFilters() {
        const semesterFilter = document.getElementById('semester-filter');
        const subjectFilter = document.getElementById('subject-filter');
        const searchInput = document.getElementById('course-search');

        [semesterFilter, subjectFilter, searchInput].forEach(element => {
            if (element) {
                element.addEventListener('change', () => this.filterCourses());
                element.addEventListener('input', () => this.filterCourses());
            }
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');

        if (uploadArea && fileInput) {
            // Click to select file
            uploadArea.addEventListener('click', () => fileInput.click());

            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
            });

            // File selection
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.setupTheme();
    }

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

        // Update view content
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`)?.classList.add('active');

        this.currentView = viewName;
        this.loadView(viewName);
    }

    loadView(viewName) {
        switch(viewName) {
            case 'overview':
                this.updateOverview();
                break;
            case 'courses':
                this.updateCoursesView();
                break;
            case 'requirements':
                this.updateRequirementsView();
                break;
            case 'planner':
                this.updatePlannerView();
                break;
            case 'chat':
                // Chat is always loaded
                break;
        }
    }

    updateAllData() {
        this.updateOverview();
        this.updateCoursesView();
        this.updateRequirementsView();
        this.updatePlannerView();
    }

    updateOverview() {
        // Update statistics
        const completedCourses = this.studentData.completedCourses.length;
        const totalCredits = this.studentData.completedCredits;
        const gpa = this.calculateCurrentGPA();

        document.getElementById('completed-courses').textContent = completedCourses;
        document.getElementById('total-credits').textContent = totalCredits;
        document.getElementById('gpa-display').textContent = gpa !== null ? gpa.toFixed(3) : 'N/A';

        // Update progress bars
        this.updateProgressBars();

        // Update recent activity
        this.updateRecentActivity();

        // Update upcoming courses
        this.updateUpcomingCourses();
    }

    updateProgressBars() {
        // Major progress
        const majorProgress = this.calculateMajorProgress();
        const majorProgressEl = document.getElementById('major-progress');
        const majorPercentageEl = document.getElementById('major-percentage');
        const majorCompletedEl = document.getElementById('major-completed');
        const majorTotalEl = document.getElementById('major-total');

        if (majorProgressEl) {
            majorProgressEl.style.width = `${majorProgress.percentage}%`;
        }
        if (majorPercentageEl) {
            majorPercentageEl.textContent = `${majorProgress.percentage}%`;
        }
        if (majorCompletedEl) {
            majorCompletedEl.textContent = majorProgress.completed;
        }
        if (majorTotalEl) {
            majorTotalEl.textContent = majorProgress.total;
        }

        // Mathematics Minor progress
        const mathMinorProgress = this.calculateMinorProgress('mathematics');
        const mathMinorProgressEl = document.getElementById('math-minor-progress');
        const mathMinorPercentageEl = document.getElementById('math-minor-percentage');
        const mathMinorCompletedEl = document.getElementById('math-minor-completed');
        const mathMinorTotalEl = document.getElementById('math-minor-total');

        if (mathMinorProgressEl) {
            mathMinorProgressEl.style.width = `${mathMinorProgress.percentage}%`;
        }
        if (mathMinorPercentageEl) {
            mathMinorPercentageEl.textContent = `${mathMinorProgress.percentage}%`;
        }
        if (mathMinorCompletedEl) {
            mathMinorCompletedEl.textContent = mathMinorProgress.completed;
        }
        if (mathMinorTotalEl) {
            mathMinorTotalEl.textContent = mathMinorProgress.total;
        }

        // Data Science Minor progress
        const dsMinorProgress = this.calculateMinorProgress('dataScience');
        const dsMinorProgressEl = document.getElementById('ds-minor-progress');
        const dsMinorPercentageEl = document.getElementById('ds-minor-percentage');
        const dsMinorCompletedEl = document.getElementById('ds-minor-completed');
        const dsMinorTotalEl = document.getElementById('ds-minor-total');

        if (dsMinorProgressEl) {
            dsMinorProgressEl.style.width = `${dsMinorProgress.percentage}%`;
        }
        if (dsMinorPercentageEl) {
            dsMinorPercentageEl.textContent = `${dsMinorProgress.percentage}%`;
        }
        if (dsMinorCompletedEl) {
            dsMinorCompletedEl.textContent = dsMinorProgress.completed;
        }
        if (dsMinorTotalEl) {
            dsMinorTotalEl.textContent = dsMinorProgress.total;
        }
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        if (!activityList) return;

        const recentCourses = this.studentData.completedCourses
            .slice(-5)
            .reverse();

        if (recentCourses.length === 0) {
            activityList.innerHTML = '<p>No recent activity</p>';
            return;
        }

        activityList.innerHTML = recentCourses.map((course, index) => {
            const actualIndex = this.studentData.completedCourses.length - 1 - index;
            return `
            <div class="course-item activity-item">
                <div class="course-info">
                    <i class="fas fa-check-circle"></i>
                    <div class="activity-text">
                        Completed <strong>${course.code}</strong> - ${course.title}
                    </div>
                    <div class="activity-meta">${course.semester} • ${course.grade || 'No grade'}</div>
                </div>
                <div class="course-actions">
                    <button class="course-action-btn course-edit-btn" onclick="window.degreeTracker.openEditModal(${actualIndex}, 'completed')" title="Edit Course">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="course-action-btn course-delete-btn" onclick="window.degreeTracker.promptDeleteCourse(${actualIndex}, 'completed')" title="Delete Course">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `}).join('');
    }

    updateUpcomingCourses() {
        const upcomingList = document.getElementById('upcoming-courses');
        if (!upcomingList) return;

        const upcomingCourses = this.studentData.plannedCourses
            .slice(0, 5);

        if (upcomingCourses.length === 0) {
            upcomingList.innerHTML = '<p>No upcoming courses</p>';
            return;
        }

        upcomingList.innerHTML = upcomingCourses.map((course, index) => `
            <div class="course-item upcoming-item">
                <div class="course-info">
                    <div class="upcoming-course">${course.code} - ${course.title}</div>
                    <div class="upcoming-semester">${course.semester} • ${course.credits} credits</div>
                </div>
                <div class="course-actions">
                    <button class="course-action-btn course-edit-btn" onclick="window.degreeTracker.openEditModal(${index}, 'planned')" title="Edit Course">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="course-action-btn course-delete-btn" onclick="window.degreeTracker.promptDeleteCourse(${index}, 'planned')" title="Delete Course">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateCoursesView() {
        const coursesGrid = document.getElementById('courses-grid');
        if (!coursesGrid) return;

        const allCourses = [
            ...this.studentData.completedCourses,
            ...this.studentData.plannedCourses
        ];

        if (allCourses.length === 0) {
            coursesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <h3>No courses found</h3>
                    <p>Add some courses to get started!</p>
                </div>
            `;
            return;
        }

        coursesGrid.innerHTML = allCourses.map(course => this.createCourseCard(course)).join('');
        this.filterCourses();
    }

    createCourseCard(course) {
        const gradeDisplay = course.grade ? `<div class="course-grade">${course.grade}</div>` : '';
        
        return `
            <div class="course-card ${course.status}" data-status="${course.status}" data-category="${course.category}" data-semester="${course.semester}">
                ${gradeDisplay}
                <div class="course-header">
                    <div class="course-code">${course.code}</div>
                    <div class="course-status-badge ${course.status}">${course.status}</div>
                </div>
                <div class="course-title">${course.title}</div>
                <div class="course-details">
                    <div class="course-credits">${course.credits} credits</div>
                    <div class="course-semester">${course.semester || 'TBD'}</div>
                </div>
            </div>
        `;
    }

    filterCourses() {
        const semesterFilter = document.getElementById('semester-filter')?.value || 'all';
        const subjectFilter = document.getElementById('subject-filter')?.value || 'all';
        const searchTerm = document.getElementById('course-search')?.value.toLowerCase() || '';

        document.querySelectorAll('.course-card').forEach(card => {
            const status = card.dataset.status;
            const category = card.dataset.category;
            const semester = card.dataset.semester;
            const code = card.querySelector('.course-code')?.textContent.toLowerCase() || '';
            const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';

            let show = true;

            // Filter by semester/status
            if (semesterFilter === 'completed' && status !== 'completed') show = false;
            if (semesterFilter === 'planned' && status !== 'planned') show = false;

            // Filter by subject
            if (subjectFilter !== 'all') {
                if (subjectFilter === 'CS' && !category.includes('Computer Science')) show = false;
                if (subjectFilter === 'MATH' && !category.includes('Mathematics')) show = false;
                if (subjectFilter === 'DS' && !category.includes('Data Science')) show = false;
                if (subjectFilter === 'other' && ['Computer Science', 'Mathematics', 'Data Science'].some(cat => category.includes(cat))) show = false;
            }

            // Filter by search
            if (searchTerm && !code.includes(searchTerm) && !title.includes(searchTerm)) {
                show = false;
            }

            card.style.display = show ? 'block' : 'none';
        });
    }

    updateRequirementsView() {
        this.updateRequirementsSummary();
        this.updateRequirementCategories();
    }

    updateRequirementsSummary() {
        let fulfilled = 0;
        let missing = 0;
        let planned = 0;

        Object.values(this.requirements).forEach(category => {
            if (Array.isArray(category)) {
                category.forEach(req => {
                    if (req.fulfilled) fulfilled++;
                    else if (req.planned) planned++;
                    else missing++;
                });
            }
        });

        document.getElementById('fulfilled-count').textContent = fulfilled;
        document.getElementById('missing-count').textContent = missing;
        document.getElementById('planned-count').textContent = planned;
    }

    updateRequirementCategories() {
        const categories = {
            'cs-core-requirements': this.requirements.coreComputerScience,
            'math-science-requirements': [...this.requirements.mathematics, ...this.requirements.supporting],
            'writing-requirements': this.requirements.writing,
            'concentration-requirements': this.requirements.aiConcentration,
            'math-minor-requirements': this.requirements.mathematicsMinor,
            'ds-minor-requirements': this.requirements.dataScienceMinor
        };

        Object.entries(categories).forEach(([elementId, requirements]) => {
            const container = document.getElementById(elementId);
            if (container && requirements) {
                container.innerHTML = requirements.map(req => this.createRequirementItem(req)).join('');
            }
        });
    }

    createRequirementItem(requirement) {
        const status = requirement.fulfilled ? 'fulfilled' : 
                     requirement.planned ? 'planned' : 'missing';
        
        const courseTags = requirement.matchingCourses
            .map(code => `<span class="course-tag">${code}</span>`)
            .join('');

        return `
            <div class="requirement-item ${status}">
                <div class="requirement-header">
                    <div class="requirement-name">${requirement.name}</div>
                    <div class="requirement-status ${status}">${status}</div>
                </div>
                <div class="requirement-description">${requirement.description}</div>
                <div class="requirement-courses">${courseTags}</div>
            </div>
        `;
    }

    updatePlannerView() {
        const timeline = document.querySelector('.planner-timeline');
        if (!timeline) return;

        timeline.innerHTML = this.semesterPlan.map(semester => {
            const coursesHtml = semester.courses.length > 0 
                ? semester.courses.map(courseCode => {
                    const course = this.findCourseByCode(courseCode);
                    return course ? this.createPlannerCourseCard(course) : '';
                }).join('')
                : `<p style="color: var(--text-muted); font-style: italic;">${semester.note}</p>`;

            return `
                <div class="timeline-semester">
                    <h3>${semester.semester}</h3>
                    <div class="semester-courses" data-semester="${semester.semester}">
                        ${coursesHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    createPlannerCourseCard(course) {
        return `
            <div class="course-card ${course.status}">
                <div class="course-header">
                    <div class="course-code">${course.code}</div>
                    <div class="course-status-badge ${course.status}">${course.status}</div>
                </div>
                <div class="course-title">${course.title}</div>
                <div class="course-details">
                    <div class="course-credits">${course.credits} credits</div>
                </div>
            </div>
        `;
    }

    findCourseByCode(code) {
        return [...this.studentData.completedCourses, ...this.studentData.plannedCourses]
            .find(course => course.code === code);
    }

    calculateMajorProgress() {
        const allReqs = [
            ...this.requirements.coreComputerScience,
            ...this.requirements.mathematics,
            ...this.requirements.supporting,
            ...this.requirements.writing,
            ...this.requirements.additional
        ];

        const completed = allReqs.filter(req => req.fulfilled).length;
        const total = allReqs.length;
        const percentage = Math.round((completed / total) * 100);

        return { completed, total, percentage };
    }

    calculateMinorProgress(minorType = 'mathematics') {
        let minorRequirements;
        
        if (minorType === 'dataScience') {
            minorRequirements = this.requirements.dataScienceMinor || [];
        } else {
            minorRequirements = this.requirements.mathematicsMinor || [];
        }
        
        const completed = minorRequirements.filter(req => req.fulfilled).length;
        const total = minorRequirements.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percentage };
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        
        if (modal) {
            // Handle different modal structures
            if (modalId === 'edit-course-modal') {
                // Edit modal has its own overlay structure
                modal.classList.add('active');
            } else {
                // Other modals use the main overlay
                const overlay = document.getElementById('modal-overlay');
                if (overlay) {
                    overlay.classList.add('active');
                    modal.classList.add('active');
                }
            }
        }
    }

    closeAllModals() {
        const overlay = document.getElementById('modal-overlay');
        const modals = document.querySelectorAll('.modal');
        
        if (overlay) {
            overlay.classList.remove('active');
        }
        modals.forEach(modal => modal.classList.remove('active'));
        
        // Also handle edit modal specifically
        const editModal = document.getElementById('edit-course-modal');
        if (editModal) {
            editModal.classList.remove('active');
        }
    }

    // Quick Actions
    handleQuickAction(action) {
        switch(action) {
            case 'add-course':
                this.openModal('add-course-modal');
                break;
            case 'plan-semester':
                this.switchView('planner');
                break;
            case 'view-transcript':
                this.switchView('courses');
                break;
        }
    }

    // Course Management
    handleAddCourse() {
        const form = document.getElementById('add-course-form');
        const formData = new FormData(form);
        
        const course = {
            code: formData.get('course-code') || document.getElementById('course-code').value,
            title: formData.get('course-title') || document.getElementById('course-title').value,
            credits: parseInt(formData.get('course-credits') || document.getElementById('course-credits').value),
            status: formData.get('course-status') || document.getElementById('course-status').value,
            semester: formData.get('course-semester') || document.getElementById('course-semester').value || 'Manual Entry',
            grade: formData.get('course-grade') || document.getElementById('course-grade').value || '',
            category: this.determineCourseCategory(formData.get('course-code') || document.getElementById('course-code').value)
        };

        if (!course.code || !course.title) {
            alert('Please fill in all required fields');
            return;
        }

        // Add to appropriate list
        if (course.status === 'completed') {
            this.studentData.completedCourses.push(course);
            this.studentData.completedCredits += course.credits;
        } else {
            this.studentData.plannedCourses.push(course);
        }

        // Update requirement fulfillment, credits, and displays
        this.updateRequirementFulfillment();
        this.updateCompletedCredits();
        this.updateAllData();
        this.closeAllModals();
        form.reset();

        // Add success message
        this.addChatMessage('ai', `✅ Successfully added ${course.code}: ${course.title} (${course.credits} credits, ${course.status})`);
    }

    // Edit existing course
    handleEditCourse() {
        const form = document.getElementById('edit-course-form');
        const formData = new FormData(form);
        
        const courseIndex = parseInt(formData.get('courseIndex'));
        const courseType = formData.get('courseType'); // 'completed' or 'planned'
        
        const updatedCourse = {
            code: formData.get('courseCode'),
            title: formData.get('courseTitle'),
            credits: parseInt(formData.get('courseCredits')),
            grade: formData.get('courseGrade'),
            semester: formData.get('courseSemester'),
            status: formData.get('courseStatus'),
            category: this.determineCourseCategory(formData.get('courseCode'))
        };

        // Update the course in the appropriate array
        if (courseType === 'completed' && courseIndex < this.studentData.completedCourses.length) {
            this.studentData.completedCourses[courseIndex] = updatedCourse;
        } else if (courseType === 'planned' && courseIndex < this.studentData.plannedCourses.length) {
            this.studentData.plannedCourses[courseIndex] = updatedCourse;
        }

        // If status changed, move course to appropriate array
        if (updatedCourse.status !== courseType) {
            this.moveCourseToCorrectArray(courseIndex, courseType, updatedCourse);
        }

        // Update requirement fulfillment, credits, and displays
        this.updateRequirementFulfillment();
        this.updateCompletedCredits();
        this.updateAllData();
        this.closeAllModals();
        form.reset();

        this.addChatMessage('ai', `📝 Successfully updated ${updatedCourse.code}: ${updatedCourse.title}`);
    }

    // Delete existing course
    handleDeleteCourse() {
        const form = document.getElementById('edit-course-form');
        const formData = new FormData(form);
        
        const courseIndex = parseInt(formData.get('courseIndex'));
        const courseType = formData.get('courseType');
        
        let deletedCourse;
        
        // Remove course from appropriate array
        if (courseType === 'completed' && courseIndex < this.studentData.completedCourses.length) {
            deletedCourse = this.studentData.completedCourses.splice(courseIndex, 1)[0];
        } else if (courseType === 'planned' && courseIndex < this.studentData.plannedCourses.length) {
            deletedCourse = this.studentData.plannedCourses.splice(courseIndex, 1)[0];
        }

        if (deletedCourse) {
            // Update requirement fulfillment, credits, and displays
            this.updateRequirementFulfillment();
            this.updateCompletedCredits();
            this.updateAllData();
            this.closeAllModals();
            
            this.addChatMessage('ai', `🗑️ Successfully deleted ${deletedCourse.code}: ${deletedCourse.title}`);
        }
    }

    // Helper method to move course between arrays when status changes
    moveCourseToCorrectArray(originalIndex, originalType, course) {
        // Remove from original array
        if (originalType === 'completed') {
            this.studentData.completedCourses.splice(originalIndex, 1);
        } else {
            this.studentData.plannedCourses.splice(originalIndex, 1);
        }
        
        // Add to correct array based on new status
        if (course.status === 'completed') {
            this.studentData.completedCourses.push(course);
        } else {
            this.studentData.plannedCourses.push(course);
        }
    }

    // Open edit modal for a specific course
    openEditModal(courseIndex, courseType) {
        const course = courseType === 'completed' ? 
            this.studentData.completedCourses[courseIndex] : 
            this.studentData.plannedCourses[courseIndex];

        if (!course) return;

        // Populate form fields
        document.getElementById('edit-course-index').value = courseIndex;
        document.getElementById('edit-course-type').value = courseType;
        document.getElementById('edit-course-code').value = course.code;
        document.getElementById('edit-course-title').value = course.title;
        document.getElementById('edit-course-credits').value = course.credits;
        document.getElementById('edit-course-grade').value = course.grade || '';
        document.getElementById('edit-course-semester').value = course.semester || '';
        document.getElementById('edit-course-status').value = course.status;

        // Open modal
        this.openModal('edit-course-modal');
    }

    // Prompt user to confirm course deletion
    promptDeleteCourse(courseIndex, courseType) {
        const course = courseType === 'completed' ? 
            this.studentData.completedCourses[courseIndex] : 
            this.studentData.plannedCourses[courseIndex];

        if (!course) return;

        const confirmMessage = `Are you sure you want to delete this course?\n\n${course.code}: ${course.title}\n${course.credits} credits • ${course.status}`;
        
        if (confirm(confirmMessage)) {
            this.deleteCourse(courseIndex, courseType);
        }
    }

    // Direct course deletion method
    deleteCourse(courseIndex, courseType) {
        let deletedCourse;
        
        // Remove course from appropriate array
        if (courseType === 'completed' && courseIndex < this.studentData.completedCourses.length) {
            deletedCourse = this.studentData.completedCourses.splice(courseIndex, 1)[0];
        } else if (courseType === 'planned' && courseIndex < this.studentData.plannedCourses.length) {
            deletedCourse = this.studentData.plannedCourses.splice(courseIndex, 1)[0];
        }

        if (deletedCourse) {
            // Update requirement fulfillment, credits, and displays
            this.updateRequirementFulfillment();
            this.updateCompletedCredits();
            this.updateAllData();
            
            this.addChatMessage('ai', `🗑️ Successfully deleted ${deletedCourse.code}: ${deletedCourse.title} (${deletedCourse.credits} credits)`);
        }
    }

    determineCourseCategory(courseCode) {
        const code = courseCode.toUpperCase();
        if (code.startsWith('CS')) return 'Computer Science';
        if (code.startsWith('MATH')) return 'Mathematics';
        if (code.startsWith('DS')) return 'Data Science';
        if (code.startsWith('CY')) return 'Cybersecurity';
        if (code.startsWith('ENGW')) return 'English';
        return 'Other';
    }

    // File Upload
    async handleFileUpload(file) {
        try {
            const content = await this.readFileContent(file);
            const courses = this.parseTranscriptContent(content);
            
            if (courses.length === 0) {
                alert('No courses found in the uploaded file. Please check the format.');
                return;
            }

            // Add courses to completed list
            courses.forEach(course => {
                const exists = this.studentData.completedCourses.some(existing => 
                    existing.code === course.code
                );
                if (!exists) {
                    this.studentData.completedCourses.push(course);
                    this.studentData.completedCredits += course.credits;
                }
            });

            this.updateRequirementFulfillment();
            this.updateCompletedCredits();
            this.updateAllData();
            this.closeAllModals();
            
            this.addChatMessage('ai', `📁 Successfully uploaded ${courses.length} courses from ${file.name}!`);
            
        } catch (error) {
            console.error('File upload error:', error);
            alert('Error reading file. Please try again.');
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

    parseTranscriptContent(content) {
        const courses = [];
        const lines = content.split('\n');
        
        lines.forEach(line => {
            // Match patterns like "CS 3000 (4.0 Hours) Course Title"
            const match = line.match(/([A-Z]{2,4})\s*(\d{3,4})\s*(?:\(([0-9.]+)\s*(?:Hours?|Credits?)\))?\s*(.+)/i);
            if (match) {
                const code = `${match[1].toUpperCase()} ${match[2]}`;
                const title = match[4] ? match[4].trim() : 'Uploaded Course';
                const credits = match[3] ? parseFloat(match[3]) : 4;
                
                courses.push({
                    code,
                    title,
                    credits,
                    status: 'completed',
                    semester: 'Uploaded',
                    category: this.determineCourseCategory(code),
                    grade: 'P'
                });
            }
        });
        
        return courses;
    }

    // Chat Functions
    addChatMessage(sender, content) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                ${this.formatChatContent(content)}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatChatContent(content) {
        // Convert markdown-like formatting to HTML
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        content = content.replace(/\n/g, '<br>');
        
        // Convert bullet points
        if (content.includes('- ')) {
            const lines = content.split('<br>');
            let inList = false;
            let result = [];
            
            lines.forEach(line => {
                if (line.trim().startsWith('- ')) {
                    if (!inList) {
                        result.push('<ul>');
                        inList = true;
                    }
                    result.push(`<li>${line.replace(/^- /, '').trim()}</li>`);
                } else {
                    if (inList) {
                        result.push('</ul>');
                        inList = false;
                    }
                    result.push(line);
                }
            });
            
            if (inList) {
                result.push('</ul>');
            }
            
            content = result.join('');
        }
        
        return `<p>${content}</p>`;
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        // Keep the initial AI message
        const initialMessage = messagesContainer.querySelector('.ai-message');
        messagesContainer.innerHTML = '';
        if (initialMessage) {
            messagesContainer.appendChild(initialMessage);
        }
    }

    async generateAIResponse(message) {
        // Use the enhanced AI assistant if available
        if (typeof EnhancedAIAssistant !== 'undefined' && this.enhancedAI) {
            try {
                return await this.enhancedAI.processMessage(message);
            } catch (error) {
                console.error('Enhanced AI error, falling back to basic responses:', error);
            }
        }
        
        // Enhanced flexible response system
        return this.generateFlexibleResponse(message);
    }

    generateFlexibleResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // URL parsing requests
        if (lowerMessage.includes('add') && (lowerMessage.includes('minor') || lowerMessage.includes('major') || lowerMessage.includes('concentration')) && lowerMessage.includes('http')) {
            return this.handleURLRequirementParsing(message);
        }
        
        // Course addition requests
        if (lowerMessage.includes('add') && (lowerMessage.includes('course') || lowerMessage.includes('credit'))) {
            return this.handleAddCourseRequest(message);
        }
        
        // Academic questions - be more flexible
        if (this.matchesAcademicQuestions(lowerMessage)) {
            return this.handleAcademicQuestion(message);
        }
        
        // Personal questions about the student
        if (this.matchesPersonalQuestions(lowerMessage)) {
            return this.handlePersonalQuestion(message);
        }
        
        // General conversation and questions
        if (this.matchesConversationalQuestions(lowerMessage)) {
            return this.handleConversationalQuestion(message);
        }
        
        // Specific data requests
        if (this.matchesDataRequests(lowerMessage)) {
            return this.handleDataRequest(message);
        }
        
        // Default helpful response
        return this.generateHelpfulResponse(message);
    }

    matchesAcademicQuestions(message) {
        const academicKeywords = [
            'progress', 'doing', 'courses', 'need', 'graduate', 'graduation', 
            'minor', 'major', 'concentration', 'requirements', 'credits', 
            'gpa', 'grades', 'semester', 'class', 'take', 'complete',
            'math', 'computer science', 'data science', 'artificial intelligence'
        ];
        return academicKeywords.some(keyword => message.includes(keyword));
    }

    matchesPersonalQuestions(message) {
        const personalKeywords = [
            'you', 'your', 'who are you', 'what are you', 'tell me about',
            'maya', 'name', 'student', 'major is', 'studying'
        ];
        return personalKeywords.some(keyword => message.includes(keyword));
    }

    matchesConversationalQuestions(message) {
        const conversationalKeywords = [
            'hello', 'hi', 'hey', 'thanks', 'thank you', 'help',
            'how', 'what', 'when', 'where', 'why', 'can you',
            'weather', 'time', 'date', 'joke', 'story'
        ];
        return conversationalKeywords.some(keyword => message.includes(keyword));
    }

    matchesDataRequests(message) {
        const dataKeywords = [
            'list', 'show', 'display', 'tell me', 'what is', 'explain',
            'breakdown', 'summary', 'details', 'information', 'status'
        ];
        return dataKeywords.some(keyword => message.includes(keyword));
    }

    handleAcademicQuestion(message) {
        const lowerMessage = message.toLowerCase();
        
        // Progress questions
        if (lowerMessage.includes('progress') || (lowerMessage.includes('how') && lowerMessage.includes('doing'))) {
            return this.generateProgressResponse();
        }
        
        // Course needs
        if (lowerMessage.includes('courses') && lowerMessage.includes('need')) {
            return this.generateCoursesNeededResponse();
        }
        
        // Graduation timeline
        if (lowerMessage.includes('graduate') || lowerMessage.includes('graduation')) {
            return this.generateGraduationResponse();
        }
        
        // Minor questions
        if (lowerMessage.includes('minor')) {
            return this.generateMinorResponse();
        }
        
        // Concentration questions
        if (lowerMessage.includes('concentration') || lowerMessage.includes('artificial intelligence')) {
            return this.generateConcentrationResponse();
        }
        
        // Credit questions
        if (lowerMessage.includes('credit') || lowerMessage.includes('total')) {
            return this.generateCreditResponse();
        }
        
        // GPA questions
        if (lowerMessage.includes('gpa') || lowerMessage.includes('grade')) {
            return this.generateGPAResponse();
        }
        
        // Requirements
        if (lowerMessage.includes('requirement')) {
            return this.generateCoursesNeededResponse();
        }
        
        // General academic response
        return `I can help you with your academic planning! Here are some things you can ask me:

**🎓 About Your Progress:**
- "How am I doing academically?"
- "What's my GPA breakdown?"
- "Show me my completed courses"

**📚 Course Planning:**
- "What courses do I still need?"
- "Can I graduate on time?"
- "What should I take next semester?"

**📊 Specific Programs:**
- "How's my math minor going?"
- "What about my data science minor?"
- "AI concentration status?"

Feel free to ask me anything about your degree!`;
    }

    handlePersonalQuestion(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
            return `I'm your personal AI academic assistant! I help Maya Borkar track her Computer Science degree progress at Northeastern University.

**👩‍🎓 About Maya:**
- **Major**: Computer Science BS
- **Concentration**: Artificial Intelligence  
- **Minors**: Mathematics + Data Science (dual minor!)
- **Expected Graduation**: Spring 2028
- **Current Status**: Rising junior with excellent grades

I can answer questions about course planning, requirements, GPA, graduation timeline, and more! What would you like to know?`;
        }
        
        if (lowerMessage.includes('maya')) {
            return `Maya Borkar is a Computer Science student at Northeastern University! 

**🎯 Current Academic Status:**
- **GPA**: ${this.calculateCurrentGPA()?.toFixed(3) || 'Calculating...'}
- **Credits Completed**: ${this.studentData.completedCredits}
- **Planned Programs**: CS Major + AI Concentration + Math & DS Minors
- **Expected Graduation**: Spring 2028

She's doing exceptionally well academically and is on track for graduation with multiple specializations!`;
        }
        
        return `I'm here to help with Maya's academic journey! I track her CS degree progress, calculate her GPA using Northeastern's grading scale, monitor her dual minor progress, and help plan future semesters. 

What would you like to know about her academic progress?`;
    }

    handleConversationalQuestion(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return `Hi there! 👋 I'm Maya's academic AI assistant. I'm here to help with degree planning, course tracking, and graduation timeline questions.

**Quick Stats:**
- **GPA**: ${this.calculateCurrentGPA()?.toFixed(3) || 'Calculating...'} 
- **Completed**: ${this.studentData.completedCourses.length} courses
- **Programs**: CS Major + AI Concentration + 2 Minors

What would you like to know about Maya's academic progress?`;
        }
        
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return `You're welcome! 😊 I'm always here to help with academic planning and degree tracking. Feel free to ask me anything about courses, requirements, GPA, or graduation planning!`;
        }
        
        if (lowerMessage.includes('help')) {
            return `I'm here to help! I can answer questions about:

**📊 Academic Progress**
- GPA calculation and grade breakdown  
- Course completion status
- Credit summaries

**🎓 Degree Requirements**
- Missing courses for major/minors
- Graduation timeline analysis
- Program progress tracking

**📚 Course Planning** 
- Course recommendations
- Semester planning
- Prerequisite checking

**💬 Natural Conversation**
- Ask me anything in plain English!
- I understand context and can chat naturally

What specific question do you have?`;
        }
        
        if (lowerMessage.includes('weather') || lowerMessage.includes('time') || lowerMessage.includes('date')) {
            return `I focus on academic advising rather than general information! But I can tell you it's currently **Fall 2024** in Maya's academic timeline, with Fall 2025 courses coming up next.

Is there anything about Maya's degree progress I can help you with?`;
        }
        
        if (lowerMessage.includes('joke')) {
            return `Here's a computer science joke for you:

Why do programmers prefer dark mode?
Because light attracts bugs! 🐛

Speaking of debugging, Maya's academic plan is running bug-free - she's on track for graduation! Want to see her progress?`;
        }
        
        // General conversational response
        return `I'm Maya's AI academic advisor, and I love chatting about her degree progress! 

**Current Focus Areas:**
- **Computer Science Major** with excellent grades
- **AI Concentration** (already completed core requirements!)
- **Dual Minors** in Math and Data Science
- **Graduation Planning** for Spring 2028

What aspects of her academic journey interest you most?`;
    }

    handleDataRequest(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('list') && lowerMessage.includes('courses')) {
            const completed = this.studentData.completedCourses;
            const planned = this.studentData.plannedCourses;
            
            return `📚 **Maya's Course List:**

**✅ Completed Courses (${completed.length}):**
${completed.slice(0, 10).map(course => 
    `- **${course.code}**: ${course.title} (${course.grade || 'No grade'})`
).join('\n')}${completed.length > 10 ? `\n- ...and ${completed.length - 10} more completed courses` : ''}

**📅 Planned Courses (${planned.length}):**
${planned.slice(0, 5).map(course => 
    `- **${course.code}**: ${course.title} (${course.semester})`
).join('\n')}${planned.length > 5 ? `\n- ...and ${planned.length - 5} more planned courses` : ''}

Want details about any specific course or semester?`;
        }
        
        if (lowerMessage.includes('breakdown') || lowerMessage.includes('summary')) {
            return this.generateProgressResponse();
        }
        
        if (lowerMessage.includes('status')) {
            return this.generateProgressResponse();
        }
        
        // Default data response
        return `I have comprehensive data about Maya's academic journey! I can provide:

**📊 Progress Summaries**
- Overall degree progress
- Individual program status  
- GPA breakdowns

**📚 Course Information**
- Completed course lists
- Planned course schedules
- Grade distributions

**🎯 Requirement Analysis**
- Missing requirements
- Fulfilled requirements
- Credit summaries

What specific information would you like to see?`;
    }

    generateHelpfulResponse(message) {
        // Try to be helpful even for unexpected questions
        return `I'm Maya's AI academic advisor, and while I specialize in degree planning and course tracking, I'll do my best to help!

**Your message**: "${message}"

I'm designed to help with academic questions like:
- **Degree Progress**: "How is Maya doing academically?"
- **Course Planning**: "What courses does she need?"  
- **GPA Analysis**: "What's her current GPA?"
- **Requirements**: "Is she on track to graduate?"
- **Program Status**: "How are her minors progressing?"

I can also have natural conversations about her academic journey. What would you like to know about Maya's CS degree progress?

**💡 Tip**: Try asking me anything in plain English - I understand context!`;
    }

    handleAddCourseRequest(message) {
        // Try to extract course information from the message
        const courseMatch = message.match(/([A-Z]{2,4})\s*(\d{3,4})/i);
        
        if (courseMatch) {
            const code = `${courseMatch[1].toUpperCase()} ${courseMatch[2]}`;
            return `I found course code **${code}** in your message. To add it properly, please use the **Add Course** button and fill in all the details including title, credits, and status.`;
        }
        
        return `To add a course, click the **Add Course** button (+ icon) in the header or the "Add Course" quick action. I can help you track any course you've completed or are planning to take!`;
    }

    handleURLRequirementParsing(message) {
        const urlMatch = message.match(/https?:\/\/[^\s]+/i);
        
        if (!urlMatch) {
            return `I didn't find a valid URL in your message. Please provide a university catalog URL like:
            
**Examples:**
- https://catalog.northeastern.edu/undergraduate/science/mathematics/mathematics-minor/
- https://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/

I'll parse the requirements automatically and add them to your tracker!`;
        }

        const url = urlMatch[0];
        const programType = message.toLowerCase().includes('minor') ? 'minor' : 
                           message.toLowerCase().includes('concentration') ? 'concentration' : 'major';

        // For demo purposes, simulate requirement parsing
        setTimeout(() => {
            const mockProgram = this.generateMockRequirements(url, programType);
            this.addChatMessage('ai', `🎓 **Requirements Parsed Successfully!**

**Program:** ${mockProgram.name}
**Type:** ${mockProgram.type}
**University:** ${mockProgram.university}
**Requirements Found:** ${mockProgram.requirementCount}

**Sample Requirements:**
${mockProgram.sampleRequirements.map(req => `- ${req}`).join('\n')}

I've added this program to your tracker! Check the Requirements tab to see how your current courses align with these new requirements.

**Note:** This is a demo version. The full implementation would:
- Parse actual HTML content from the URL
- Extract specific course requirements 
- Match courses to your transcript automatically
- Handle different university formats`);
        }, 2000);

        return `🔄 **Parsing Requirements from URL...**

Fetching content from: ${url}

This may take a moment as I analyze the requirements structure and extract course information...`;
    }

    generateMockRequirements(url, type) {
        const mockPrograms = {
            'minor': {
                name: 'Mathematics Minor',
                type: 'minor',
                university: 'Northeastern University', 
                requirementCount: 6,
                sampleRequirements: [
                    'MATH 1341 - Calculus 1 (4 credits)',
                    'MATH 1342 - Calculus 2 (4 credits)',
                    'MATH 2331 - Linear Algebra (4 credits)',
                    'MATH 3081 - Probability and Statistics (4 credits)'
                ]
            },
            'major': {
                name: 'Computer Science BS',
                type: 'major',
                university: 'Northeastern University',
                requirementCount: 15,
                sampleRequirements: [
                    'CS 1800 - Discrete Structures (4 credits)',
                    'CS 2500 - Fundamentals of CS 1 (4 credits)', 
                    'CS 3000 - Algorithms and Data (4 credits)',
                    'CS 3500 - Object-Oriented Design (4 credits)'
                ]
            },
            'concentration': {
                name: 'Artificial Intelligence Concentration',
                type: 'concentration',
                university: 'Northeastern University',
                requirementCount: 4,
                sampleRequirements: [
                    'CS 4100 - Artificial Intelligence (4 credits)',
                    'DS 4400 - Machine Learning 1 (4 credits)',
                    'CS 4120 - Natural Language Processing (4 credits)',
                    'DS 4420 - Machine Learning 2 (4 credits)'
                ]
            }
        };

        return mockPrograms[type] || mockPrograms['major'];
    }

    generateProgressResponse() {
        const majorProgress = this.calculateMajorProgress();
        const mathMinorProgress = this.calculateMinorProgress('mathematics');
        const dsMinorProgress = this.calculateMinorProgress('dataScience');
        const currentGPA = this.calculateCurrentGPA();
        const gpaBreakdown = this.getGPABreakdown();
        
        return `📊 **Your Degree Progress:**
        
        **🎓 Major Requirements**: ${majorProgress.completed}/${majorProgress.total} completed (${majorProgress.percentage}%)
        **📐 Mathematics Minor**: ${mathMinorProgress.completed}/${mathMinorProgress.total} completed (${mathMinorProgress.percentage}%)
        **💻 Data Science Minor**: ${dsMinorProgress.completed}/${dsMinorProgress.total} completed (${dsMinorProgress.percentage}%)
        
        **📈 Academic Status:**
        - **${this.studentData.completedCourses.length} courses completed** (${this.studentData.completedCredits} credits)
        - **${this.studentData.plannedCourses.length} courses planned** 
        - **Current GPA**: ${currentGPA ? currentGPA.toFixed(3) : 'N/A'} (Northeastern scale)
        - **Graded Courses**: ${gpaBreakdown.courseCount} courses contributing to GPA
        
        **🎯 Grade Distribution:**
        ${Object.entries(gpaBreakdown.gradeDistribution).map(([grade, count]) => 
            `- **${grade}**: ${count} course${count > 1 ? 's' : ''}`
        ).join('\n')}
        
        You're making excellent progress toward your Spring 2028 graduation with **dual minors**! 🎉`;
    }

    generateCoursesNeededResponse() {
        const majorProgress = this.calculateMajorProgress();
        const remaining = majorProgress.total - majorProgress.completed;
        
        const missingReqs = [];
        Object.values(this.requirements).forEach(category => {
            category.forEach(req => {
                if (!req.fulfilled && !req.planned) {
                    missingReqs.push(req.name);
                }
            });
        });
        
        if (remaining === 0) {
            return `🎉 **Congratulations!** You've fulfilled all major requirements! Just complete your planned courses and you'll be ready to graduate.`;
        }
        
        return `📚 **Courses Still Needed:**
        
        You have **${remaining} major requirements** still to fulfill.
        
        **Missing Requirements:**
        ${missingReqs.map(req => `- ${req}`).join('\n')}
        
        Check the **Requirements** tab for detailed information about each requirement. Based on your current plan, you should complete everything by Spring 2028! 🎓`;
    }

    generateGraduationResponse() {
        const totalCredits = this.studentData.completedCredits;
        const plannedCredits = this.studentData.plannedCourses.reduce((sum, course) => sum + course.credits, 0);
        const totalPlanned = totalCredits + plannedCredits;
        
        if (totalPlanned >= this.studentData.requiredCredits) {
            return `🎓 **Graduation Timeline: ON TRACK!**
            
            **Credit Status:**
            - ✅ Completed: **${totalCredits} credits**
            - 📅 Planned: **${plannedCredits} credits**  
            - 🎯 Total: **${totalPlanned} credits** (${this.studentData.requiredCredits} required)
            
            **Expected Graduation**: **${this.studentData.expectedGraduation}** ✨
            
            You're perfectly on track to graduate on time! Keep following your current plan and you'll have your CS degree with AI concentration and Mathematics minor. 🎉`;
        }
        
        const needed = this.studentData.requiredCredits - totalPlanned;
        return `⚠️ **Graduation Status: Needs Attention**
        
        You're currently **${needed} credits short** of the ${this.studentData.requiredCredits} required.
        
        **Recommendations:**
        - Add ${Math.ceil(needed / 4)} more courses to your plan
        - Consider summer courses or increasing course load
        - Meet with your advisor to adjust your timeline
        
        Don't worry - there's still time to get back on track! 💪`;
    }

    generateMinorResponse() {
        const mathMinorProgress = this.calculateMinorProgress('mathematics');
        const dsMinorProgress = this.calculateMinorProgress('dataScience');
        
        const mathCourses = this.studentData.completedCourses.filter(course => 
            course.category === 'Mathematics'
        );
        
        const dsCourses = this.studentData.completedCourses.filter(course => 
            course.category === 'Data Science'
        );
        
        const mathCompleted = this.requirements.mathematicsMinor.filter(req => req.fulfilled);
        const mathRemaining = this.requirements.mathematicsMinor.filter(req => !req.fulfilled);
        
        const dsCompleted = this.requirements.dataScienceMinor.filter(req => req.fulfilled);
        const dsRemaining = this.requirements.dataScienceMinor.filter(req => !req.fulfilled);
        
        return `📊 **Dual Minor Progress:**

📐 **Mathematics Minor: ${mathMinorProgress.percentage}%**
        
**✅ Completed Requirements (${mathCompleted.length}/${mathMinorProgress.total}):**
${mathCompleted.map(req => `- ${req.name}`).join('\n') || '- None completed yet'}
        
**📅 Still Need (${mathRemaining.length}):**
${mathRemaining.slice(0, 3).map(req => `- ${req.name}`).join('\n')}${mathRemaining.length > 3 ? `\n- ...and ${mathRemaining.length - 3} more` : ''}

💻 **Data Science Minor: ${dsMinorProgress.percentage}%**

**✅ Completed Requirements (${dsCompleted.length}/${dsMinorProgress.total}):**
${dsCompleted.map(req => `- ${req.name}`).join('\n') || '- None completed yet'}
        
**📅 Still Need (${dsRemaining.length}):**
${dsRemaining.slice(0, 3).map(req => `- ${req.name}`).join('\n')}${dsRemaining.length > 3 ? `\n- ...and ${dsRemaining.length - 3} more` : ''}

**📚 Your Relevant Courses:**
**Math**: ${mathCourses.length > 0 ? mathCourses.map(course => `${course.code}`).join(', ') : 'None yet'}
**Data Science**: ${dsCourses.length > 0 ? dsCourses.map(course => `${course.code}`).join(', ') : 'None yet'}

**📝 Note**: The Data Science minor is normally restricted to non-CS majors, but we're tracking it for your reference.

You're pursuing an ambitious **dual minor** path! 🎯`;
    }

    generateConcentrationResponse() {
        const aiCourses = this.studentData.completedCourses.filter(course => 
            ['CS 4100', 'DS 4400'].some(reqCode => course.code.includes(reqCode))
        );
        
        return `🤖 **AI Concentration Status: EXCELLENT!**
        
        **✅ Completed AI Courses:**
        ${aiCourses.map(course => `- **${course.code}**: ${course.title} (Grade: ${course.grade || 'N/A'})`).join('\n')}
        
        **📅 Planned AI Courses:**
        - **DS 4420**: Machine Learning and Data Mining 2 (Spring 2027)
        - **CS 4120**: Natural Language Processing (Spring 2027)
        
        You've already completed the foundational AI courses with excellent grades! The concentration will be fully satisfied when you complete your planned ML2 and NLP courses. 
        
        **Fun fact**: Your AI concentration combined with the Math minor makes you extremely well-prepared for ML engineering roles! 🚀`;
    }

    generateCreditResponse() {
        const completed = this.studentData.completedCredits;
        const planned = this.studentData.plannedCourses.reduce((sum, course) => sum + course.credits, 0);
        const required = this.studentData.requiredCredits;
        const remaining = Math.max(0, required - completed - planned);
        
        return `📊 **Credit Summary:**
        
        **Current Status:**
        - ✅ **Completed**: ${completed} credits
        - 📅 **Planned**: ${planned} credits  
        - 🎯 **Total**: ${completed + planned} credits
        - 📋 **Required**: ${required} credits
        
        ${remaining > 0 
            ? `⚠️ **Need ${remaining} more credits** (about ${Math.ceil(remaining / 4)} courses)`
            : `✅ **You have enough credits to graduate!** Actually ${completed + planned - required} credits over the minimum! 🎉`
        }
        
        **Credit Distribution:**
        - Major Requirements: ~90 credits
        - Mathematics Minor: ~24 credits  
        - General Education: ~20 credits`;
    }

    // GPA Calculation using Northeastern University's grading scale
    getGradePoints(grade) {
        const gradeScale = {
            'A': 4.000,
            'A-': 3.667,
            'B+': 3.333,
            'B': 3.000,
            'B-': 2.667,
            'C+': 2.333,
            'C': 2.000,
            'C-': 1.667,
            'D+': 1.333,
            'D': 1.000,
            'D-': 0.667,
            'F': 0.000
        };
        
        // Grades that don't count toward GPA
        const nonGpaGrades = ['I', 'IP', 'S', 'U', 'X', 'P', 'W', 'AU'];
        
        if (nonGpaGrades.includes(grade)) {
            return null; // Not included in GPA calculation
        }
        
        return gradeScale[grade] || null;
    }

    calculateCurrentGPA() {
        let totalWeightedPoints = 0;
        let totalCredits = 0;
        
        // Only calculate for completed courses with grades
        const gradedCourses = this.studentData.completedCourses.filter(course => 
            course.grade && course.status === 'completed'
        );
        
        for (const course of gradedCourses) {
            const gradePoints = this.getGradePoints(course.grade);
            
            if (gradePoints !== null) {
                const weightedPoints = gradePoints * course.credits;
                totalWeightedPoints += weightedPoints;
                totalCredits += course.credits;
            }
        }
        
        return totalCredits > 0 ? totalWeightedPoints / totalCredits : null;
    }

    // Enhanced GPA display with breakdown
    getGPABreakdown() {
        const gradedCourses = this.studentData.completedCourses.filter(course => 
            course.grade && course.status === 'completed'
        );
        
        const breakdown = {
            totalWeightedPoints: 0,
            totalCredits: 0,
            courseCount: 0,
            gradeDistribution: {}
        };
        
        for (const course of gradedCourses) {
            const gradePoints = this.getGradePoints(course.grade);
            
            if (gradePoints !== null) {
                breakdown.totalWeightedPoints += gradePoints * course.credits;
                breakdown.totalCredits += course.credits;
                breakdown.courseCount++;
                
                // Track grade distribution
                if (!breakdown.gradeDistribution[course.grade]) {
                    breakdown.gradeDistribution[course.grade] = 0;
                }
                breakdown.gradeDistribution[course.grade]++;
            }
        }
        
        breakdown.gpa = breakdown.totalCredits > 0 ? 
            breakdown.totalWeightedPoints / breakdown.totalCredits : null;
        
        return breakdown;
    }

    // Update requirement fulfillment based on actual completed/planned courses
    updateRequirementFulfillment() {
        const completedCourses = this.studentData.completedCourses.map(course => course.code);
        const plannedCourses = this.studentData.plannedCourses.map(course => course.code);
        const allCourses = [...completedCourses, ...plannedCourses];

        console.log('Updating requirements based on courses:');
        console.log('Completed:', completedCourses);
        console.log('Planned:', plannedCourses);

        // Update each category of requirements
        Object.entries(this.requirements).forEach(([categoryName, requirements]) => {
            if (Array.isArray(requirements)) {
                requirements.forEach(req => {
                    // Reset fulfillment status
                    req.fulfilled = false;
                    req.planned = false;

                    // Check if any matching courses are completed
                    const hasCompleted = req.matchingCourses.some(courseCode => 
                        completedCourses.some(completed => 
                            this.courseCodesMatch(completed, courseCode)
                        )
                    );

                    // Check if any matching courses are planned
                    const hasPlanned = req.matchingCourses.some(courseCode => 
                        plannedCourses.some(planned => 
                            this.courseCodesMatch(planned, courseCode)
                        )
                    );

                    if (hasCompleted) {
                        req.fulfilled = true;
                        console.log(`✅ ${req.name} - FULFILLED`);
                    } else if (hasPlanned) {
                        req.planned = true;
                        console.log(`📅 ${req.name} - PLANNED`);
                    } else {
                        console.log(`❌ ${req.name} - MISSING`);
                    }
                });
            }
        });
    }

    // Helper function to match course codes (handles variations like "CS 1800" vs "CS1800")
    courseCodesMatch(studentCourse, requirementCourse) {
        const normalize = (code) => code.toUpperCase().replace(/\s+/g, '');
        return normalize(studentCourse) === normalize(requirementCourse) ||
               studentCourse.toUpperCase().includes(requirementCourse.toUpperCase()) ||
               requirementCourse.toUpperCase().includes(studentCourse.toUpperCase());
    }

    // Calculate completed credits from actual completed courses
    updateCompletedCredits() {
        const completedCredits = this.studentData.completedCourses
            .filter(course => course.status === 'completed')
            .reduce((total, course) => total + (course.credits || 0), 0);
        
        this.studentData.completedCredits = completedCredits;
        console.log(`Updated completed credits: ${completedCredits}`);
    }

    generateGPAResponse() {
        const currentGPA = this.calculateCurrentGPA();
        const breakdown = this.getGPABreakdown();
        
        if (currentGPA === null) {
            return `📊 **GPA Information:**
            
            **Current GPA**: Not available (no graded courses found)
            
            **Note**: Only completed courses with letter grades (A, B, C, D, F) are included in GPA calculations. Courses with grades like P (Pass), I (Incomplete), or IP (In Progress) don't affect your GPA.
            
            Once you complete more courses with letter grades, I'll be able to calculate your GPA using Northeastern's official grading scale.`;
        }

        const gradeDistribution = Object.entries(breakdown.gradeDistribution)
            .sort(([a], [b]) => {
                const gradeOrder = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
                return gradeOrder.indexOf(a) - gradeOrder.indexOf(b);
            });

        return `📊 **GPA Analysis (Northeastern Scale):**
        
        **🎯 Current GPA**: ${currentGPA.toFixed(3)} / 4.000
        **📚 Graded Courses**: ${breakdown.courseCount} courses
        **📊 Total Quality Points**: ${breakdown.totalWeightedPoints.toFixed(3)}
        **📊 Total GPA Credits**: ${breakdown.totalCredits}
        
        **🎓 Grade Distribution:**
        ${gradeDistribution.map(([grade, count]) => {
            const gradePoints = this.getGradePoints(grade);
            return `- **${grade}** (${gradePoints.toFixed(3)} pts): ${count} course${count > 1 ? 's' : ''}`;
        }).join('\n')}
        
        **💡 GPA Calculation (Northeastern Method):**
        - Each grade has a point value (A=4.000, A-=3.667, B+=3.333, etc.)
        - Quality points = grade points × credit hours for each course
        - GPA = total quality points ÷ total credit hours
        
        **🎯 Performance Level:**
        ${currentGPA >= 3.5 ? '🌟 **Excellent** - Dean\'s List eligible!' :
          currentGPA >= 3.0 ? '✅ **Good** - Above average performance' :
          currentGPA >= 2.0 ? '⚠️ **Satisfactory** - Meeting minimum requirements' :
          '🔴 **Below Standards** - Consider academic support'}
        
        ${currentGPA < 3.0 ? '\n💪 **Improvement Tips:**\n- Focus on core courses in your major\n- Consider retaking lower-grade courses\n- Utilize tutoring and office hours\n- Plan lighter course loads to focus on quality' : ''}`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Modern Degree Tracker...');
    window.degreeTracker = new DegreeTracker();
});