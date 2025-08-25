// GPA Test to check current calculation
console.log('=== GPA CALCULATION TEST ===');

// Northeastern grading scale
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

// Non-GPA grades
const nonGpaGrades = ['I', 'IP', 'S', 'U', 'X', 'P', 'W', 'AU'];

// Calculate GPA from completed courses
function calculateGPA(courses) {
    let totalWeightedPoints = 0;
    let totalCredits = 0;
    const gradedCourses = [];
    
    console.log('\n=== COMPLETED COURSES WITH GRADES ===');
    
    courses.forEach(course => {
        if (course.status === 'completed' && course.grade && !nonGpaGrades.includes(course.grade)) {
            const gradePoints = gradeScale[course.grade];
            if (gradePoints !== undefined) {
                const weightedPoints = gradePoints * course.credits;
                totalWeightedPoints += weightedPoints;
                totalCredits += course.credits;
                gradedCourses.push(course);
                
                console.log(`${course.code.padEnd(12)} | ${course.grade.padEnd(3)} | ${course.credits} credits | ${gradePoints.toFixed(3)} pts | ${weightedPoints.toFixed(3)} weighted`);
            }
        } else if (course.status === 'completed' && course.grade) {
            console.log(`${course.code.padEnd(12)} | ${course.grade.padEnd(3)} | ${course.credits} credits | NON-GPA GRADE`);
        }
    });
    
    const gpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
    
    console.log('\n=== GPA CALCULATION ===');
    console.log(`Total Quality Points: ${totalWeightedPoints.toFixed(3)}`);
    console.log(`Total Credits: ${totalCredits}`);
    console.log(`Calculated GPA: ${gpa.toFixed(3)}`);
    console.log(`Graded Courses: ${gradedCourses.length}`);
    
    return { gpa, totalWeightedPoints, totalCredits, gradedCourses };
}

// What grades would give us a 3.943 GPA?
function findCorrectGrades(courses, targetGPA = 3.943) {
    console.log('\n=== ANALYZING FOR TARGET GPA OF', targetGPA, '===');
    
    // First, let's see what we have
    const result = calculateGPA(courses);
    
    if (Math.abs(result.gpa - targetGPA) < 0.01) {
        console.log('✅ Current grades already give target GPA!');
        return;
    }
    
    console.log(`\n❌ Current GPA (${result.gpa.toFixed(3)}) differs from target (${targetGPA})`);
    
    // Let's try correcting B+ grades to A grades
    console.log('\n=== SUGGESTED GRADE CORRECTIONS ===');
    const correctedCourses = courses.map(course => {
        if (course.status === 'completed' && course.grade === 'B+') {
            console.log(`Suggest changing ${course.code} from B+ to A`);
            return { ...course, grade: 'A' };
        }
        return course;
    });
    
    const correctedResult = calculateGPA(correctedCourses);
    console.log(`\nWith B+ → A corrections: GPA = ${correctedResult.gpa.toFixed(3)}`);
    
    return correctedCourses;
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateGPA, findCorrectGrades, gradeScale };
}

// Run test if in Node.js environment
if (typeof require !== 'undefined' && require.main === module) {
    // This would require the data file
    console.log('Run this in the browser console with STUDENT_DATA loaded');
}