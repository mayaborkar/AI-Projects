// Complete Student Data - Maya Borkar CS Degree Plan
const STUDENT_DATA = {
    // Student Information
    name: 'Maya Borkar',
    studentId: '002493352',
    email: 'borkar.m@northeastern.edu',
    program: 'CS-K-CSCI-BSCS',
    major: 'Computer Science',
    concentration: 'Artificial Intelligence',
    minor: 'Mathematics',
    expectedGraduation: 'Spring 2028',
    
    // Academic Progress (will be calculated dynamically)
    completedCredits: 0, // Will be calculated from actual completed courses
    requiredCredits: 134,
    cumulativeGPA: 0, // Will be calculated from actual grades
    
    // Completed Courses (from degree audit PDF)
    completedCourses: [
        // Foundation Courses (Completed Prior)
        { 
            code: 'MATH 1341', 
            title: 'Calculus for Engineers I', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Mathematics'
        },
        { 
            code: 'MATH 1342', 
            title: 'Calculus for Engineers II', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Mathematics'
        },
        { 
            code: 'MATH 2280', 
            title: 'Statistics and Software', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Mathematics'
        },
        { 
            code: 'CS 1800', 
            title: 'Discrete Structures', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Computer Science'
        },
        { 
            code: 'CS 1802', 
            title: 'Seminar for CS 1800', 
            credits: 1, 
            grade: 'P', 
            semester: 'Prior',
            status: 'completed',
            category: 'Computer Science'
        },
        { 
            code: 'CS 2500', 
            title: 'Fundamentals of Computer Science 1', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Computer Science'
        },
        { 
            code: 'CS 2501', 
            title: 'Lab for CS 2500', 
            credits: 1, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Computer Science'
        },
        { 
            code: 'INNO 2301', 
            title: 'Innovation!', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Innovation'
        },
        { 
            code: 'INPR 1000', 
            title: 'First Year Interdisciplinary Seminar', 
            credits: 1, 
            grade: 'P', 
            semester: 'Prior',
            status: 'completed',
            category: 'General'
        },
        { 
            code: 'PHIL 1145', 
            title: 'Technology and Human Values', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Philosophy'
        },
        { 
            code: 'CS 2510', 
            title: 'Fundamentals of Computer Science 2', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Computer Science'
        },
        { 
            code: 'CS 2511', 
            title: 'Lab for CS 2510', 
            credits: 1, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Computer Science'
        },
        { 
            code: 'CY 2550', 
            title: 'Foundations of Cybersecurity', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'Cybersecurity'
        },
        { 
            code: 'ENGW 1111', 
            title: 'First-Year Writing', 
            credits: 4, 
            grade: 'A', 
            semester: 'Prior',
            status: 'completed',
            category: 'English'
        },
        { 
            code: 'MATH 1365', 
            title: 'Introduction to Mathematical Reasoning', 
            credits: 4, 
            grade: 'A-', 
            semester: 'Prior',
            status: 'completed',
            category: 'Mathematics'
        },
        
        // Summer 1 2025 (9 credits)
        { 
            code: 'CS 3500', 
            title: 'Object-Oriented Design', 
            credits: 4, 
            grade: 'A', 
            semester: 'Summer 1 2025',
            status: 'completed',
            category: 'Computer Science'
        },
        { 
            code: 'CS 3501', 
            title: 'Lab for CS 3500', 
            credits: 1, 
            grade: 'A', 
            semester: 'Summer 1 2025',
            status: 'completed',
            category: 'Computer Science'
        },
        { 
            code: 'CS 4100', 
            title: 'Artificial Intelligence', 
            credits: 4, 
            grade: 'A-', 
            semester: 'Summer 1 2025',
            status: 'completed',
            category: 'Computer Science'
        },
        
        // Summer 2 2025 (8 credits)
        { 
            code: 'COMM 1113', 
            title: 'Business and Professional Speaking', 
            credits: 4, 
            grade: 'A-', 
            semester: 'Summer 2 2025',
            status: 'completed',
            category: 'Communication'
        },
        { 
            code: 'DS 3000', 
            title: 'Foundations of Data Science', 
            credits: 4, 
            grade: 'A', 
            semester: 'Summer 2 2025',
            status: 'completed',
            category: 'Data Science'
        },
        
    ],
    
    // Planned Courses (from degree audit PDF)
    plannedCourses: [
        // Fall 2025 (19 credits) - FUTURE COURSES
        { 
            code: 'CS 3000', 
            title: 'Algorithms and Data Structures', 
            credits: 4, 
            semester: 'Fall 2025',
            status: 'planned',
            category: 'Computer Science'
        },
        { 
            code: 'CS 1210', 
            title: 'Professional Development for Co-op', 
            credits: 1, 
            semester: 'Fall 2025',
            status: 'planned',
            category: 'Professional Development'
        },
        { 
            code: 'MATH 2331', 
            title: 'Linear Algebra', 
            credits: 4, 
            semester: 'Fall 2025',
            status: 'planned',
            category: 'Mathematics'
        },
        { 
            code: 'DS 4400', 
            title: 'Machine Learning and Data Mining 1', 
            credits: 4, 
            semester: 'Fall 2025',
            status: 'planned',
            category: 'Data Science'
        },
        { 
            code: 'CS 3950', 
            title: 'Introduction to Computer Science Research', 
            credits: 2, 
            semester: 'Fall 2025',
            status: 'planned',
            category: 'Computer Science'
        },
        { 
            code: 'HIST 1130', 
            title: 'History of the United States', 
            credits: 4, 
            semester: 'Fall 2025',
            status: 'planned',
            category: 'History'
        },
        
        // Spring 2026 - Co-op
        // Summer 1 2026 - Co-op
        
        // Summer 2 2026 (5 credits)
        { 
            code: 'EECE 2310', 
            title: 'Introduction to Digital Design and Computer Architecture', 
            credits: 4, 
            semester: 'Summer 2 2026',
            status: 'planned',
            category: 'Engineering'
        },
        { 
            code: 'EECE 2311', 
            title: 'Lab for EECE 2310', 
            credits: 1, 
            semester: 'Summer 2 2026',
            status: 'planned',
            category: 'Engineering'
        },
        
        // Fall 2026 (16 credits)
        { 
            code: 'CS 3800', 
            title: 'Theory of Computation', 
            credits: 4, 
            semester: 'Fall 2026',
            status: 'planned',
            category: 'Computer Science'
        },
        { 
            code: 'CS 3650', 
            title: 'Computer Systems', 
            credits: 4, 
            semester: 'Fall 2026',
            status: 'planned',
            category: 'Computer Science'
        },
        { 
            code: 'MATH 3081', 
            title: 'Probability and Statistics', 
            credits: 4, 
            semester: 'Fall 2026',
            status: 'planned',
            category: 'Mathematics'
        },
        { 
            code: 'CS 4530', 
            title: 'Fundamentals of Software Engineering', 
            credits: 4, 
            semester: 'Fall 2026',
            status: 'planned',
            category: 'Computer Science'
        },
        
        // Spring 2027 (16 credits)
        { 
            code: 'ENGW 3302', 
            title: 'Advanced Writing in Technical Professions', 
            credits: 4, 
            semester: 'Spring 2027',
            status: 'planned',
            category: 'English'
        },
        { 
            code: 'CS 4120', 
            title: 'Natural Language Processing', 
            credits: 4, 
            semester: 'Spring 2027',
            status: 'planned',
            category: 'Computer Science'
        },
        { 
            code: 'DS 4420', 
            title: 'Machine Learning and Data Mining 2', 
            credits: 4, 
            semester: 'Spring 2027',
            status: 'planned',
            category: 'Data Science'
        },
        { 
            code: 'MATH 4570', 
            title: 'Matrix Methods for Data Analysis', 
            credits: 4, 
            semester: 'Spring 2027',
            status: 'planned',
            category: 'Mathematics'
        },
        
        // Summer 1 2027 (9 credits)
        { 
            code: 'MATH 2321', 
            title: 'Calculus 3 for Science and Engineering', 
            credits: 4, 
            semester: 'Summer 1 2027',
            status: 'planned',
            category: 'Mathematics'
        },
        { 
            code: 'DS 2500', 
            title: 'Intermediate Programming with Data', 
            credits: 4, 
            semester: 'Summer 1 2027',
            status: 'planned',
            category: 'Data Science'
        },
        { 
            code: 'DS 2501', 
            title: 'Lab for DS 2500', 
            credits: 1, 
            semester: 'Summer 1 2027',
            status: 'planned',
            category: 'Data Science'
        },
        
        // Summer 2 2027 - Co-op
        // Fall 2027 - Co-op
        
        // Spring 2028 (8 credits - Final Semester)
        { 
            code: 'CS 3200', 
            title: 'Introduction to Databases', 
            credits: 4, 
            semester: 'Spring 2028',
            status: 'planned',
            category: 'Computer Science'
        },
        { 
            code: 'MATH 3081', 
            title: 'Probability and Statistics', 
            credits: 4, 
            semester: 'Spring 2028',
            status: 'planned',
            category: 'Mathematics',
            note: 'Duplicate - may need to replace'
        }
    ]
};

// Degree Requirements Structure
const DEGREE_REQUIREMENTS = {
    // Core Computer Science Requirements
    coreComputerScience: [
        {
            name: 'CS 1800 - Discrete Structures',
            description: 'Mathematical foundations of computer science',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['CS 1800']
        },
        {
            name: 'CS 2000/2001 - Introduction to Program Design and Implementation',
            description: 'Introduction to program design and implementation fundamentals',
            credits: 5,
            fulfilled: false,
            planned: false,
            matchingCourses: ['CS 2000', 'CS 2001']
        },
        {
            name: 'CS 2500/2501 - Fundamentals of Computer Science 1',
            description: 'Introduction to programming and computational thinking',
            credits: 5,
            fulfilled: true,
            matchingCourses: ['CS 2500', 'CS 2501']
        },
        {
            name: 'CS 2510/2511 - Fundamentals of Computer Science 2',
            description: 'Advanced programming concepts and data structures',
            credits: 5,
            fulfilled: true,
            matchingCourses: ['CS 2510', 'CS 2511']
        },
        {
            name: 'CS 3000 - Algorithms and Data Structures',
            description: 'Analysis and implementation of algorithms',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['CS 3000']
        },
        {
            name: 'CS 3500/3501 - Object-Oriented Design',
            description: 'Software design principles and object-oriented programming',
            credits: 5,
            fulfilled: true,
            matchingCourses: ['CS 3500', 'CS 3501']
        },
        {
            name: 'CS 3650 - Computer Systems',
            description: 'Computer architecture and systems programming',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['CS 3650']
        },
        {
            name: 'CS 3800 - Theory of Computation',
            description: 'Formal languages, automata, and computability',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['CS 3800']
        },
        {
            name: 'CS 4530 - Fundamentals of Software Engineering',
            description: 'Software engineering principles and practices',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['CS 4530']
        },
        {
            name: 'CS 1200 - First Year Seminar',
            description: 'Introduction to the computer science field',
            credits: 1,
            fulfilled: false,
            planned: false,
            matchingCourses: ['CS 1200']
        }
    ],
    
    // Mathematics Requirements
    mathematics: [
        {
            name: 'MATH 1341 - Calculus for Engineers I',
            description: 'Differential calculus with applications',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['MATH 1341']
        },
        {
            name: 'MATH 1342 - Calculus for Engineers II',
            description: 'Integral calculus with applications',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['MATH 1342']
        },
        {
            name: 'MATH 2331 - Linear Algebra',
            description: 'Vector spaces, matrices, and linear transformations',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['MATH 2331']
        },
        {
            name: 'MATH 3081 - Probability and Statistics',
            description: 'Probability theory and statistical inference',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['MATH 3081']
        }
    ],
    
    // Supporting Requirements
    supporting: [
        {
            name: 'EECE 2310/2311 - Digital Design and Computer Architecture',
            description: 'Digital logic and computer architecture fundamentals',
            credits: 5,
            fulfilled: false,
            planned: true,
            matchingCourses: ['EECE 2310', 'EECE 2311']
        },
        {
            name: 'Science Requirement - 8 Credits',
            description: 'Two 4-credit courses from Biology, Chemistry, Geology, Mathematics, or Physics',
            credits: 8,
            fulfilled: false,
            planned: false,
            matchingCourses: ['BIOL', 'CHEM', 'GEOL', 'PHYS', 'MATH 2321', 'MATH 3081', 'MATH 4570']
        }
    ],
    
    // Writing Requirements
    writing: [
        {
            name: 'ENGW 1111 - First-Year Writing',
            description: 'Academic writing and research skills',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['ENGW 1111']
        },
        {
            name: 'ENGW 3302 - Advanced Writing in Technical Professions',
            description: 'Technical communication and professional writing',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['ENGW 3302']
        }
    ],
    
    // AI Concentration Requirements
    aiConcentration: [
        {
            name: 'CS 4100 - Artificial Intelligence',
            description: 'Fundamental concepts in artificial intelligence',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['CS 4100']
        },
        {
            name: 'DS 4400 - Machine Learning and Data Mining 1',
            description: 'Introduction to machine learning algorithms',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['DS 4400']
        },
        {
            name: 'DS 4420 - Machine Learning and Data Mining 2',
            description: 'Advanced machine learning techniques',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['DS 4420']
        },
        {
            name: 'CS 4120 - Natural Language Processing',
            description: 'Computational methods for natural language understanding',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['CS 4120']
        }
    ],
    
    // Data Science Minor Requirements (Note: Normally restricted to non-Khoury majors)
    dataScienceMinor: [
        {
            name: 'CS 2500/2501 - Programming Fundamentals',
            description: 'Introduction to programming (fulfilled by CS major)',
            credits: 5,
            fulfilled: true,
            matchingCourses: ['CS 2500', 'CS 2501']
        },
        {
            name: 'DS 2500/2501 - Intermediate Programming with Data',
            description: 'Advanced programming with data focus',
            credits: 5,
            fulfilled: false,
            planned: true,
            matchingCourses: ['DS 2500', 'DS 2501']
        },
        {
            name: 'DS 3000 - Foundations of Data Science',
            description: 'Core data science concepts and methods',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['DS 3000']
        },
        {
            name: 'MATH 2280 or MATH 3081 - Statistics',
            description: 'Statistical methods and analysis',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['MATH 2280', 'MATH 3081']
        },
        {
            name: 'DS Elective 1 - Machine Learning',
            description: 'Machine learning and data mining',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['DS 4400']
        },
        {
            name: 'DS Elective 2 - Advanced ML',
            description: 'Advanced machine learning techniques',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['DS 4420']
        }
    ],

    // Mathematics Minor Requirements
    mathematicsMinor: [
        {
            name: 'MATH 1341 - Calculus I',
            description: 'Required foundation course',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['MATH 1341']
        },
        {
            name: 'MATH 1342 - Calculus II',
            description: 'Required foundation course',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['MATH 1342']
        },
        {
            name: 'MATH 2321 OR MATH 2331 OR MATH 2341 - Intermediate Math',
            description: 'Choose from specified intermediate courses',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['MATH 2331']
        },
        {
            name: 'MATH 2321 - Calculus 3 (Additional Intermediate)',
            description: 'Second intermediate math course',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['MATH 2321']
        },
        {
            name: 'Math Elective 1 (3000+ level)',
            description: 'Advanced mathematics elective',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['MATH 3081']
        },
        {
            name: 'Math Elective 2 (3000+ level)',
            description: 'Advanced mathematics elective',
            credits: 4,
            fulfilled: false,
            planned: true,
            matchingCourses: ['MATH 4570']
        }
    ],
    
    // Additional Requirements
    additional: [
        {
            name: 'Security Course',
            description: 'One approved cybersecurity course',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['CY 2550']
        },
        {
            name: 'Presentation Course',
            description: 'One approved communication course',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['COMM 1113']
        },
        {
            name: 'Computing and Social Issues',
            description: 'Ethics and societal impact of computing',
            credits: 4,
            fulfilled: true,
            matchingCourses: ['PHIL 1145']
        },
        {
            name: 'CS Research Experience',
            description: 'Introduction to computer science research',
            credits: 2,
            fulfilled: true,
            matchingCourses: ['CS 3950']
        },
        {
            name: 'Khoury Electives',
            description: '8 semester hours from CS, CY, DS courses',
            credits: 8,
            fulfilled: true,
            matchingCourses: ['DS 3000', 'DS 4400']
        }
    ]
};

// Semester Planning Data
const SEMESTER_PLAN = [
    {
        semester: 'Spring 2026',
        type: 'Co-op',
        courses: [],
        credits: 0,
        note: 'Co-op Work Experience'
    },
    {
        semester: 'Summer 1 2026',
        type: 'Co-op',
        courses: [],
        credits: 0,
        note: 'Co-op Work Experience'
    },
    {
        semester: 'Summer 2 2026',
        type: 'Academic',
        courses: ['EECE 2310', 'EECE 2311'],
        credits: 5,
        note: 'Light course load during summer'
    },
    {
        semester: 'Fall 2026',
        type: 'Academic',
        courses: ['CS 3800', 'CS 3650', 'MATH 3081', 'CS 4530'],
        credits: 16,
        note: 'Core CS courses and math requirement'
    },
    {
        semester: 'Spring 2027',
        type: 'Academic',
        courses: ['ENGW 3302', 'CS 4120', 'DS 4420', 'MATH 4570'],
        credits: 16,
        note: 'AI concentration and writing requirement'
    },
    {
        semester: 'Summer 1 2027',
        type: 'Academic',
        courses: ['MATH 2321', 'DS 2500', 'DS 2501'],
        credits: 9,
        note: 'Math minor completion'
    },
    {
        semester: 'Summer 2 2027',
        type: 'Co-op',
        courses: [],
        credits: 0,
        note: 'Co-op Work Experience'
    },
    {
        semester: 'Fall 2027',
        type: 'Co-op',
        courses: [],
        credits: 0,
        note: 'Co-op Work Experience'
    },
    {
        semester: 'Spring 2028',
        type: 'Academic',
        courses: ['CS 3200'],
        credits: 4,
        note: 'Final semester - light load'
    }
];

// Export data for use in application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STUDENT_DATA,
        DEGREE_REQUIREMENTS,
        SEMESTER_PLAN
    };
}