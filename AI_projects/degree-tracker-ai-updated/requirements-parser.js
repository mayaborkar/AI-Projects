// Requirements Parser for University Websites
class RequirementsParser {
    constructor() {
        this.supportedDomains = [
            'catalog.northeastern.edu',
            'bulletin.uncc.edu',
            'catalog.umd.edu',
            // Add more universities as needed
        ];
    }

    /**
     * Parse requirements from a university catalog URL
     * @param {string} url - University catalog URL
     * @returns {Promise<Object>} Parsed requirements object
     */
    async parseRequirementsFromURL(url) {
        try {
            const domain = new URL(url).hostname;
            
            if (!this.supportedDomains.includes(domain)) {
                throw new Error(`Unsupported domain: ${domain}`);
            }

            // For now, we'll use a proxy approach since direct web scraping
            // from client-side JS has CORS limitations
            const response = await this.fetchWithProxy(url);
            const htmlContent = await response.text();
            
            return this.parseHTMLContent(htmlContent, domain);
        } catch (error) {
            console.error('Error parsing requirements:', error);
            throw error;
        }
    }

    /**
     * Fetch URL content through a proxy service
     * @param {string} url 
     */
    async fetchWithProxy(url) {
        // In a real implementation, you'd use a CORS proxy or server-side endpoint
        // For demo purposes, we'll simulate the parsing
        return {
            text: async () => this.getMockRequirementsHTML(url)
        };
    }

    /**
     * Parse HTML content based on university domain
     * @param {string} htmlContent 
     * @param {string} domain 
     */
    parseHTMLContent(htmlContent, domain) {
        switch (domain) {
            case 'catalog.northeastern.edu':
                return this.parseNortheasternRequirements(htmlContent);
            case 'bulletin.uncc.edu':
                return this.parseUNCCRequirements(htmlContent);
            default:
                return this.parseGenericRequirements(htmlContent);
        }
    }

    /**
     * Parse Northeastern University requirements
     */
    parseNortheasternRequirements(htmlContent) {
        // Mock parsing for demonstration
        return {
            programName: 'Computer Science BS',
            university: 'Northeastern University',
            totalCredits: 134,
            categories: {
                coreComputerScience: [
                    {
                        name: 'CS 1800 - Discrete Structures',
                        description: 'Mathematical foundations of computer science',
                        credits: 4,
                        required: true
                    },
                    {
                        name: 'CS 2500/2501 - Fundamentals of Computer Science 1',
                        description: 'Introduction to programming',
                        credits: 5,
                        required: true
                    }
                ],
                mathematics: [
                    {
                        name: 'MATH 1341 - Calculus I',
                        description: 'Differential calculus',
                        credits: 4,
                        required: true
                    }
                ],
                concentrations: {
                    'Artificial Intelligence': [
                        {
                            name: 'CS 4100 - Artificial Intelligence',
                            credits: 4,
                            required: true
                        },
                        {
                            name: 'DS 4400 - Machine Learning 1',
                            credits: 4,
                            required: true
                        }
                    ]
                }
            }
        };
    }

    /**
     * Parse generic university requirements
     */
    parseGenericRequirements(htmlContent) {
        const requirements = {
            programName: 'Unknown Program',
            university: 'Unknown University',
            totalCredits: 0,
            categories: {}
        };

        // Basic parsing logic for common patterns
        const coursePattern = /([A-Z]{2,4})\s*(\d{3,4})\s*[^\n]*?\((\d+)\s*(?:credit|hour)/gi;
        const matches = [...htmlContent.matchAll(coursePattern)];

        matches.forEach(match => {
            const [, subject, number, credits] = match;
            const courseCode = `${subject} ${number}`;
            
            if (!requirements.categories.general) {
                requirements.categories.general = [];
            }
            
            requirements.categories.general.push({
                name: courseCode,
                description: 'Parsed course requirement',
                credits: parseInt(credits),
                required: true
            });
        });

        return requirements;
    }

    /**
     * Mock HTML content for demonstration
     */
    getMockRequirementsHTML(url) {
        if (url.includes('computer-science')) {
            return `
                <div class="program-requirements">
                    <h2>Computer Science BS Requirements</h2>
                    <h3>Core Courses</h3>
                    <p>CS 1800 Discrete Structures (4 credits)</p>
                    <p>CS 2500 Fundamentals of Computer Science 1 (4 credits)</p>
                    <p>CS 2501 Lab for CS 2500 (1 credit)</p>
                    <p>CS 3000 Algorithms and Data (4 credits)</p>
                    
                    <h3>Mathematics</h3>
                    <p>MATH 1341 Calculus 1 (4 credits)</p>
                    <p>MATH 1342 Calculus 2 (4 credits)</p>
                    <p>MATH 2331 Linear Algebra (4 credits)</p>
                    
                    <h3>AI Concentration</h3>
                    <p>CS 4100 Artificial Intelligence (4 credits)</p>
                    <p>DS 4400 Machine Learning 1 (4 credits)</p>
                </div>
            `;
        }
        return '<div>No requirements found</div>';
    }

    /**
     * Export requirements to the standard format used by the app
     */
    exportToStandardFormat(parsedRequirements) {
        const standardFormat = {};
        
        Object.entries(parsedRequirements.categories).forEach(([category, courses]) => {
            standardFormat[category] = courses.map(course => ({
                name: course.name,
                description: course.description,
                credits: course.credits,
                fulfilled: false,
                planned: false,
                matchingCourses: [course.name.split(' - ')[0]]
            }));
        });
        
        return {
            programInfo: {
                name: parsedRequirements.programName,
                university: parsedRequirements.university,
                totalCredits: parsedRequirements.totalCredits
            },
            requirements: standardFormat
        };
    }
}

// Program Configuration Manager
class ProgramConfigManager {
    constructor() {
        this.programs = new Map();
        this.loadDefaultPrograms();
    }

    loadDefaultPrograms() {
        // Load the existing Northeastern CS program
        this.programs.set('northeastern-cs', {
            id: 'northeastern-cs',
            name: 'Computer Science BS',
            university: 'Northeastern University',
            type: 'major',
            requirements: DEGREE_REQUIREMENTS
        });

        // Add sample programs for demonstration
        this.programs.set('northeastern-math-minor', {
            id: 'northeastern-math-minor',
            name: 'Mathematics Minor',
            university: 'Northeastern University',
            type: 'minor',
            requirements: {
                mathematicsMinor: DEGREE_REQUIREMENTS.mathematicsMinor
            }
        });
    }

    addProgram(programData) {
        const id = this.generateProgramId(programData.name, programData.university, programData.type);
        
        this.programs.set(id, {
            id,
            ...programData,
            addedDate: new Date().toISOString()
        });
        
        return id;
    }

    getProgram(id) {
        return this.programs.get(id);
    }

    getAllPrograms() {
        return Array.from(this.programs.values());
    }

    getProgramsByType(type) {
        return Array.from(this.programs.values()).filter(program => program.type === type);
    }

    removeProgram(id) {
        return this.programs.delete(id);
    }

    generateProgramId(name, university, type) {
        const cleanName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const cleanUniv = university.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return `${cleanUniv}-${cleanName}-${type}`;
    }

    async importProgramFromURL(url, programType = 'major') {
        const parser = new RequirementsParser();
        
        try {
            const parsedRequirements = await parser.parseRequirementsFromURL(url);
            const standardFormat = parser.exportToStandardFormat(parsedRequirements);
            
            const programData = {
                name: standardFormat.programInfo.name,
                university: standardFormat.programInfo.university,
                type: programType,
                requirements: standardFormat.requirements,
                totalCredits: standardFormat.programInfo.totalCredits,
                sourceURL: url,
                importedDate: new Date().toISOString()
            };
            
            return this.addProgram(programData);
        } catch (error) {
            console.error('Failed to import program from URL:', error);
            throw error;
        }
    }
}

// Student Program Tracker
class StudentProgramTracker {
    constructor() {
        this.activePrograms = new Map(); // programId -> student progress data
        this.configManager = new ProgramConfigManager();
    }

    addProgram(programId, studentData = {}) {
        const program = this.configManager.getProgram(programId);
        if (!program) {
            throw new Error(`Program not found: ${programId}`);
        }

        this.activePrograms.set(programId, {
            program,
            studentProgress: {
                completedCourses: studentData.completedCourses || [],
                plannedCourses: studentData.plannedCourses || [],
                ...studentData
            },
            addedDate: new Date().toISOString()
        });

        return programId;
    }

    removeProgram(programId) {
        return this.activePrograms.delete(programId);
    }

    getActivePrograms() {
        return Array.from(this.activePrograms.values());
    }

    calculateOverallProgress() {
        const programs = this.getActivePrograms();
        let totalCompleted = 0;
        let totalRequired = 0;

        programs.forEach(({ program }) => {
            const progress = this.calculateProgramProgress(program.id);
            totalCompleted += progress.completed;
            totalRequired += progress.total;
        });

        return {
            completed: totalCompleted,
            total: totalRequired,
            percentage: totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0
        };
    }

    calculateProgramProgress(programId) {
        const programData = this.activePrograms.get(programId);
        if (!programData) return { completed: 0, total: 0, percentage: 0 };

        const { program } = programData;
        let completed = 0;
        let total = 0;

        Object.values(program.requirements).forEach(category => {
            if (Array.isArray(category)) {
                category.forEach(req => {
                    total++;
                    if (req.fulfilled) completed++;
                });
            }
        });

        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    getMissingRequirements() {
        const missing = [];
        
        this.activePrograms.forEach((programData, programId) => {
            const { program } = programData;
            
            Object.entries(program.requirements).forEach(([category, requirements]) => {
                if (Array.isArray(requirements)) {
                    requirements.forEach(req => {
                        if (!req.fulfilled && !req.planned) {
                            missing.push({
                                programId,
                                programName: program.name,
                                category,
                                requirement: req
                            });
                        }
                    });
                }
            });
        });

        return missing;
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RequirementsParser,
        ProgramConfigManager,
        StudentProgramTracker
    };
}