// Northeastern University CS Requirements Data
const NORTHEASTERN_CS_REQUIREMENTS = {
    program: "Computer Science BS",
    totalCredits: 134,
    majorCredits: 72,
    minGPA: 2.0,
    
    coreRequirements: [
        {
            id: 'cs1200',
            name: 'CS 1200',
            title: 'First Year Seminar',
            credits: 1,
            category: 'CS Overview',
            description: 'Introduction to computer science field and career paths'
        },
        {
            id: 'cs1210',
            name: 'CS 1210',
            title: 'Professional Development for Khoury Co-op',
            credits: 1,
            category: 'CS Overview',
            description: 'Professional development for co-op preparation'
        },
        {
            id: 'cs1800',
            name: 'CS 1800',
            title: 'Discrete Structures',
            credits: 4,
            category: 'CS Fundamentals',
            description: 'Discrete mathematics for computer science',
            lab: 'CS 1802'
        },
        {
            id: 'cs1802',
            name: 'CS 1802',
            title: 'Seminar for CS 1800',
            credits: 1,
            category: 'CS Fundamentals',
            description: 'Lab component for CS 1800'
        },
        {
            id: 'cs2000',
            name: 'CS 2000',
            title: 'Introduction to Program Design and Implementation',
            credits: 4,
            category: 'CS Fundamentals',
            description: 'Introduction to programming and design',
            lab: 'CS 2001'
        },
        {
            id: 'cs2001',
            name: 'CS 2001',
            title: 'Lab for CS 2000',
            credits: 1,
            category: 'CS Fundamentals',
            description: 'Lab component for CS 2000'
        },
        {
            id: 'cs2100',
            name: 'CS 2100',
            title: 'Program Design and Implementation 1',
            credits: 4,
            category: 'CS Fundamentals',
            description: 'Advanced programming concepts and design',
            lab: 'CS 2101'
        },
        {
            id: 'cs2101',
            name: 'CS 2101',
            title: 'Lab for CS 2100',
            credits: 1,
            category: 'CS Fundamentals',
            description: 'Lab component for CS 2100'
        },
        {
            id: 'cs3000',
            name: 'CS 3000',
            title: 'Algorithms and Data',
            credits: 4,
            category: 'CS Core',
            description: 'Data structures and algorithms analysis'
        },
        {
            id: 'cs3100',
            name: 'CS 3100',
            title: 'Program Design and Implementation 2',
            credits: 4,
            category: 'CS Core',
            description: 'Advanced programming paradigms',
            lab: 'CS 3101'
        },
        {
            id: 'cs3101',
            name: 'CS 3101',
            title: 'Lab for CS 3100',
            credits: 1,
            category: 'CS Core',
            description: 'Lab component for CS 3100'
        },
        {
            id: 'cs3650',
            name: 'CS 3650',
            title: 'Computer Systems',
            credits: 4,
            category: 'CS Core',
            description: 'Computer systems and architecture'
        },
        {
            id: 'cs3800',
            name: 'CS 3800',
            title: 'Theory of Computation',
            credits: 4,
            category: 'CS Core',
            description: 'Computational theory and complexity'
        },
        {
            id: 'cs4530',
            name: 'CS 4530',
            title: 'Fundamentals of Software Engineering',
            credits: 4,
            category: 'CS Core',
            description: 'Software engineering principles and practices',
            alternatives: ['CS 4535']
        },
        {
            id: 'ds3000',
            name: 'DS 3000',
            title: 'Foundations of Data Science',
            credits: 4,
            category: 'CS Core',
            description: 'Introduction to data science concepts'
        }
    ],
    
    supportingCourses: [
        {
            id: 'math1341',
            name: 'MATH 1341',
            title: 'Calculus 1 for Science and Engineering',
            credits: 4,
            category: 'Mathematics',
            description: 'Differential calculus'
        },
        {
            id: 'math1365',
            name: 'MATH 1365',
            title: 'Introduction to Mathematical Reasoning',
            credits: 4,
            category: 'Mathematics',
            description: 'Mathematical proof techniques',
            alternatives: ['MATH 1465']
        },
        {
            id: 'eece2310',
            name: 'EECE 2310',
            title: 'Introduction to Digital Design and Computer Architecture',
            credits: 4,
            category: 'Electrical Engineering',
            description: 'Digital systems and computer architecture',
            lab: 'EECE 2311'
        },
        {
            id: 'eece2311',
            name: 'EECE 2311',
            title: 'Lab for EECE 2310',
            credits: 1,
            category: 'Electrical Engineering',
            description: 'Lab component for EECE 2310'
        }
    ],
    
    writingRequirements: [
        {
            id: 'engw1111',
            name: 'ENGW 1111',
            title: 'First-Year Writing',
            credits: 4,
            category: 'Writing',
            description: 'College-level writing skills'
        },
        {
            id: 'engw3302',
            name: 'ENGW 3302',
            title: 'Advanced Writing in the Technical Professions',
            credits: 4,
            category: 'Writing',
            description: 'Technical communication skills',
            alternatives: ['ENGW 3315']
        }
    ],
    
    additionalRequirements: [
        {
            id: 'security-course',
            name: 'Security Course',
            title: 'Security Course Requirement',
            credits: 4,
            category: 'Security',
            description: 'One approved cybersecurity course',
            options: ['CY 2550', 'CY 3740', 'CY 4740']
        },
        {
            id: 'presentation-course',
            name: 'Presentation Course',
            title: 'Presentation Course Requirement',
            credits: 4,
            category: 'Communication',
            description: 'One approved presentation/communication course',
            options: ['COMM 1113', 'COMM 1131', 'COMM 2535']
        },
        {
            id: 'computing-social-issues',
            name: 'Computing and Social Issues',
            title: 'Computing and Social Issues',
            credits: 4,
            category: 'Ethics',
            description: 'Course addressing societal impact of computing',
            options: ['PHIL 1145', 'PHIL 1280', 'SOCL 4528']
        }
    ],
    
    scienceRequirement: {
        name: 'Science Requirement',
        description: 'Two courses from Biology, Chemistry, Geology, Mathematics, or Physics',
        credits: 8,
        minCourses: 2
    },
    
    concentrations: {
        'artificial-intelligence': {
            name: 'Artificial Intelligence',
            description: 'Focus on AI, machine learning, and intelligent systems',
            credits: 16,
            requiredCourses: [
                {
                    id: 'cs4100',
                    name: 'CS 4100',
                    title: 'Artificial Intelligence',
                    credits: 4,
                    description: 'Introduction to artificial intelligence'
                },
                {
                    id: 'ds4400',
                    name: 'DS 4400',
                    title: 'Machine Learning and Data Mining 1',
                    credits: 4,
                    description: 'Machine learning algorithms and techniques'
                }
            ],
            electiveCourses: [
                { name: 'CS 4120', title: 'Natural Language Processing', credits: 4 },
                { name: 'CS 4150', title: 'Game Artificial Intelligence', credits: 4 },
                { name: 'CS 4180', title: 'Reinforcement Learning', credits: 4 },
                { name: 'CS 4220', title: 'Information Retrieval', credits: 4 },
                { name: 'CS 4610', title: 'Robotic Science and Systems', credits: 4 },
                { name: 'CY 4100', title: 'AI Security and Privacy', credits: 4 },
                { name: 'DS 4420', title: 'Machine Learning and Data Mining 2', credits: 4 },
                { name: 'DS 4440', title: 'Practical Neural Networks', credits: 4 }
            ],
            minElectives: 2
        },
        'foundations': {
            name: 'Foundations',
            description: 'Focus on theoretical computer science and mathematics',
            credits: 16,
            requiredCourses: [],
            electiveCourses: [
                { name: 'CS 2800', title: 'Logic and Computation', credits: 4 },
                { name: 'CS 4820', title: 'Computer-Aided Reasoning', credits: 4 },
                { name: 'CS 4805', title: 'Fundamentals of Complexity Theory', credits: 4 },
                { name: 'CS 4810', title: 'Advanced Algorithms', credits: 4 },
                { name: 'CS 3950', title: 'Introduction to Research in Computer Science', credits: 2 },
                { name: 'CS 4950', title: 'Research Seminar in Computer Science', credits: 2 },
                { name: 'CS 4830', title: 'System Specification, Verification, and Synthesis', credits: 4 },
                { name: 'CY 4770', title: 'Foundations of Cryptography', credits: 4 }
            ],
            minElectives: 4
        }
    }
};

const MATHEMATICS_MINOR_REQUIREMENTS = {
    name: 'Mathematics Minor',
    totalCourses: 6,
    totalCredits: 24,
    minGPA: 2.0,
    
    requiredCourses: [
        {
            id: 'math1341',
            name: 'MATH 1341',
            title: 'Calculus 1 for Science and Engineering',
            credits: 4,
            category: 'Calculus Sequence'
        },
        {
            id: 'math1342',
            name: 'MATH 1342',
            title: 'Calculus 2 for Science and Engineering',
            credits: 4,
            category: 'Calculus Sequence'
        }
    ],
    
    intermediateCourses: {
        description: 'Choose 2 courses from the following',
        required: 2,
        options: [
            {
                name: 'MATH 2321',
                title: 'Calculus 3 for Science and Engineering',
                credits: 4
            },
            {
                name: 'MATH 2341',
                title: 'Differential Equations and Linear Algebra for Engineering',
                credits: 4
            },
            {
                name: 'MATH 2331',
                title: 'Linear Algebra',
                credits: 4
            }
        ]
    },
    
    electives: {
        description: 'Select 2 courses from MATH 3001 to MATH 4699',
        required: 2,
        exclude: ['MATH 4000'],
        examples: [
            { name: 'MATH 3081', title: 'Probability and Statistics', credits: 4 },
            { name: 'MATH 4570', title: 'Matrix Methods in Data Analysis', credits: 4 },
            { name: 'MATH 3150', title: 'Real Analysis', credits: 4 },
            { name: 'MATH 4000', title: 'Abstract Algebra', credits: 4 }
        ]
    }
};

// Sample student data (Maya's courses)
const SAMPLE_STUDENT_DATA = {
    name: 'Maya Borkar',
    studentId: '002493352',
    program: 'CS-K-CSCI-BSCS',
    
    completedCourses: [
        { code: 'MATH 1341', title: 'Calculus BC ++', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'MATH 1342', title: 'Calculus BC ++', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'MATH 2280', title: 'Statistics and Software', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'CS 1800', title: 'Discrete Structures', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'CS 1802', title: 'Seminar for CS 1800', credits: 1, status: 'completed', semester: 'Previous' },
        { code: 'CS 2500', title: 'Fundamentals of Computer Sci', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'CS 2501', title: 'Lab for CS 2500', credits: 1, status: 'completed', semester: 'Previous' },
        { code: 'INNO 2301', title: 'Innovation!', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'INPR 1000', title: 'First Yr Interdisciplinary Se', credits: 1, status: 'completed', semester: 'Previous' },
        { code: 'PHIL 1145', title: 'Technology and Human Values', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'CS 2510', title: 'Fundamentals of Computer Sci', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'CS 2511', title: 'Lab for CS 2510', credits: 1, status: 'completed', semester: 'Previous' },
        { code: 'CY 2550', title: 'Foundations of Cybersecurity', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'ENGW 1111', title: 'First-Year Writing', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'MATH 1365', title: 'Intro to Math Reasoning', credits: 4, status: 'completed', semester: 'Previous' },
        { code: 'CS 3500', title: 'Object-Oriented Design', credits: 4, status: 'completed', semester: 'Summer 1 2025' },
        { code: 'CS 3501', title: 'Lab for CS 3500', credits: 1, status: 'completed', semester: 'Summer 1 2025' },
        { code: 'CS 4100', title: 'Artificial Intelligence', credits: 4, status: 'completed', semester: 'Summer 1 2025' },
        { code: 'COMM 1113', title: 'Business/Professional Speaking', credits: 4, status: 'completed', semester: 'Summer 2 2025' },
        { code: 'DS 3000', title: 'Foundations of Data Science', credits: 4, status: 'completed', semester: 'Summer 2 2025' },
        { code: 'CS 3000', title: 'Algorithms & Data', credits: 4, status: 'completed', semester: 'Fall 2025' },
        { code: 'CS 1210', title: 'Professional Development Co-op', credits: 1, status: 'completed', semester: 'Fall 2025' },
        { code: 'MATH 2331', title: 'Linear Algebra', credits: 4, status: 'completed', semester: 'Fall 2025' },
        { code: 'DS 4400', title: 'Machine Learning/Data Mining 1', credits: 4, status: 'completed', semester: 'Fall 2025' },
        { code: 'CS 3950', title: 'Intro to CS Research', credits: 2, status: 'completed', semester: 'Fall 2025' },
        { code: 'HIST 1130', title: 'History of the United States', credits: 4, status: 'completed', semester: 'Fall 2025' }
    ],
    
    plannedCourses: [
        { code: 'EECE 2310', title: 'Intro Digital Design Comp Arch', credits: 4, status: 'planned', semester: 'Summer 2 2026' },
        { code: 'EECE 2311', title: 'Lab for EECE 2310', credits: 1, status: 'planned', semester: 'Summer 2 2026' },
        { code: 'CS 3800', title: 'Theory of Computation', credits: 4, status: 'planned', semester: 'Fall 2026' },
        { code: 'CS 3650', title: 'Computer Systems', credits: 4, status: 'planned', semester: 'Fall 2026' },
        { code: 'MATH 3081', title: 'Probability and Statistics', credits: 4, status: 'planned', semester: 'Fall 2026' },
        { code: 'CS 4530', title: 'Fundamentals of Software Engin', credits: 4, status: 'planned', semester: 'Fall 2026' },
        { code: 'ENGW 3302', title: 'Advanced Writing in Tech Prof', credits: 4, status: 'planned', semester: 'Spring 2027' },
        { code: 'CS 4120', title: 'Natural Language Processing', credits: 4, status: 'planned', semester: 'Spring 2027' },
        { code: 'DS 4420', title: 'Machine Learning/Data Mining 2', credits: 4, status: 'planned', semester: 'Spring 2027' },
        { code: 'MATH 4570', title: 'Matrix Methods Data Analysis', credits: 4, status: 'planned', semester: 'Spring 2027' },
        { code: 'MATH 2321', title: 'Calculus 3 for Sci/Engr', credits: 4, status: 'planned', semester: 'Summer 1 2027' },
        { code: 'DS 2500', title: 'Int. Programming with Data', credits: 4, status: 'planned', semester: 'Summer 1 2027' },
        { code: 'DS 2501', title: 'Lab for DS 2500', credits: 1, status: 'planned', semester: 'Summer 1 2027' },
        { code: 'CS 3200', title: 'Introduction to Databases', credits: 4, status: 'planned', semester: 'Spring 2028' }
    ]
};

// AI Chat responses template
const AI_RESPONSES = {
    greetings: [
        "Hi! I'm here to help you track your degree progress and plan your courses.",
        "Hello! Ready to analyze your degree requirements?",
        "Hey there! Let's make sure you're on track for graduation."
    ],
    
    courseAnalysis: {
        fulfilled: "✅ Great! This requirement is fulfilled by your completed courses:",
        missing: "❌ You still need to complete this requirement:",
        inProgress: "🔄 This requirement is partially fulfilled, with courses in progress:"
    },
    
    graduation: {
        onTrack: "🎉 Congratulations! You're on track to graduate on time.",
        needsCourses: "You need to complete {count} more courses to meet graduation requirements.",
        creditDeficit: "You need {credits} more credits to reach the 134 credit minimum."
    },
    
    manualCredit: {
        added: "✅ I've added {course} to your completed courses with {credits} credits.",
        updated: "✅ I've updated {course} in your transcript.",
        error: "❌ I couldn't add that course. Please check the course code and try again."
    }
};

// Helper functions for data manipulation
function calculateProgress(requirements, completedCourses) {
    let fulfilled = 0;
    let total = requirements.length;
    
    requirements.forEach(req => {
        if (isRequirementFulfilled(req, completedCourses)) {
            fulfilled++;
        }
    });
    
    return { fulfilled, total, percentage: Math.round((fulfilled / total) * 100) };
}

function isRequirementFulfilled(requirement, courses) {
    return courses.some(course => 
        course.code.toLowerCase().includes(requirement.name.toLowerCase()) ||
        (requirement.alternatives && requirement.alternatives.some(alt => 
            course.code.toLowerCase().includes(alt.toLowerCase())
        ))
    );
}

function getTotalCredits(courses) {
    return courses.reduce((total, course) => total + course.credits, 0);
}

function getCompletedCredits(courses) {
    return courses
        .filter(course => course.status === 'completed')
        .reduce((total, course) => total + course.credits, 0);
}