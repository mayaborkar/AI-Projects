let requirementUrls = [];
let uploadedFile = null;

function addRequirementUrl() {
    const input = document.getElementById('requirements-url');
    const url = input.value.trim();
    
    if (url && isValidUrl(url)) {
        if (!requirementUrls.includes(url)) {
            requirementUrls.push(url);
            updateUrlList();
            input.value = '';
            updateAnalyzeButton();
        } else {
            alert('This URL has already been added.');
        }
    } else {
        alert('Please enter a valid URL.');
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function updateUrlList() {
    const urlList = document.getElementById('url-list');
    urlList.innerHTML = '';
    
    requirementUrls.forEach((url, index) => {
        const urlItem = document.createElement('div');
        urlItem.className = 'url-item';
        urlItem.innerHTML = `
            <span>${url}</span>
            <button class="remove-url" onclick="removeUrl(${index})">Remove</button>
        `;
        urlList.appendChild(urlItem);
    });
}

function removeUrl(index) {
    requirementUrls.splice(index, 1);
    updateUrlList();
    updateAnalyzeButton();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        uploadedFile = file;
        const fileInfo = document.getElementById('file-info');
        fileInfo.style.display = 'block';
        fileInfo.innerHTML = `
            <strong>Selected file:</strong> ${file.name}<br>
            <strong>Size:</strong> ${(file.size / 1024).toFixed(1)} KB<br>
            <strong>Type:</strong> ${file.type || 'Unknown'}
        `;
        updateAnalyzeButton();
    }
}

function updateAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyze-btn');
    analyzeBtn.disabled = !(requirementUrls.length > 0 && uploadedFile);
}

async function analyzeRequirements() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.getElementById('results-container');
    
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="loading"></span>Analyzing...';
    
    try {
        const requirements = await extractRequirements();
        const coursePlan = await parseCourses();
        const analysis = await matchRequirements(requirements, coursePlan);
        
        displayResults(analysis);
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        resultsContainer.innerHTML = `
            <div class="requirement-status requirement-missing">
                <h3>Error</h3>
                <p>An error occurred while analyzing requirements: ${error.message}</p>
            </div>
        `;
        resultsSection.style.display = 'block';
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = 'Analyze Requirements';
        updateAnalyzeButton();
    }
}

async function extractRequirements() {
    const requirements = [];
    
    for (const url of requirementUrls) {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            
            const extractedReqs = parseRequirementsFromHTML(doc, url);
            requirements.push(...extractedReqs);
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            requirements.push({
                category: 'Error',
                description: `Failed to load requirements from ${url}`,
                credits: 0,
                courses: [],
                source: url,
                fulfilled: false
            });
        }
    }
    
    return requirements;
}

function parseRequirementsFromHTML(doc, sourceUrl) {
    const requirements = [];
    const text = doc.body.textContent || '';
    
    const creditPattern = /(\d+)\s*(?:credit|unit|hour)s?\s*(?:of|in)?\s*([^.!?\n]+)/gi;
    const coursePattern = /([A-Z]{2,4})\s*(\d{3,4})/g;
    
    let match;
    while ((match = creditPattern.exec(text)) !== null) {
        const credits = parseInt(match[1]);
        const description = match[2].trim();
        
        const courses = [];
        let courseMatch;
        const courseRegex = new RegExp(coursePattern.source, 'g');
        while ((courseMatch = courseRegex.exec(description)) !== null) {
            courses.push(`${courseMatch[1]} ${courseMatch[2]}`);
        }
        
        requirements.push({
            category: 'General Requirement',
            description: description,
            credits: credits,
            courses: courses,
            source: sourceUrl,
            fulfilled: false
        });
    }
    
    if (requirements.length === 0) {
        requirements.push({
            category: 'General Requirement',
            description: 'Requirements extracted from provided website',
            credits: 0,
            courses: [],
            source: sourceUrl,
            fulfilled: false,
            note: 'Manual review recommended - automated extraction may be incomplete'
        });
    }
    
    return requirements;
}

async function parseCourses() {
    const courses = [];
    
    if (!uploadedFile) {
        throw new Error('No file uploaded');
    }
    
    const fileContent = await readFileContent(uploadedFile);
    
    if (uploadedFile.type === 'text/csv' || uploadedFile.name.endsWith('.csv')) {
        return parseCSVCourses(fileContent);
    } else {
        return parseTextCourses(fileContent);
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

function parseCSVCourses(content) {
    const courses = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return;
        
        const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
        if (columns.length >= 2) {
            const courseCode = columns[0];
            const courseTitle = columns[1];
            const credits = columns[2] ? parseFloat(columns[2]) : 3;
            
            if (courseCode && /[A-Z]{2,4}\s*\d{3,4}/.test(courseCode)) {
                courses.push({
                    code: courseCode,
                    title: courseTitle,
                    credits: credits
                });
            }
        }
    });
    
    return courses;
}

function parseTextCourses(content) {
    const courses = [];
    const coursePattern = /([A-Z]{2,4})\s*(\d{3,4})\s*[-:]?\s*([^(\n]*?)(?:\((\d+)\s*credits?\))?/gi;
    
    let match;
    while ((match = coursePattern.exec(content)) !== null) {
        const code = `${match[1]} ${match[2]}`;
        const title = match[3] ? match[3].trim() : '';
        const credits = match[4] ? parseInt(match[4]) : 3;
        
        courses.push({
            code: code,
            title: title,
            credits: credits
        });
    }
    
    return courses;
}

async function matchRequirements(requirements, courses) {
    const analysis = {
        fulfilled: [],
        missing: [],
        totalCreditsRequired: 0,
        totalCreditsFulfilled: 0
    };
    
    requirements.forEach(req => {
        analysis.totalCreditsRequired += req.credits;
        
        const matchingCourses = courses.filter(course => {
            if (req.courses.length > 0) {
                return req.courses.some(reqCourse => 
                    course.code.toLowerCase().includes(reqCourse.toLowerCase())
                );
            }
            
            return course.title.toLowerCase().includes(req.description.toLowerCase()) ||
                   req.description.toLowerCase().includes(course.title.toLowerCase());
        });
        
        const fulfilledCredits = matchingCourses.reduce((sum, course) => sum + course.credits, 0);
        
        if (fulfilledCredits >= req.credits || matchingCourses.length > 0) {
            analysis.fulfilled.push({
                ...req,
                fulfilled: true,
                matchingCourses: matchingCourses,
                fulfilledCredits: fulfilledCredits
            });
            analysis.totalCreditsFulfilled += Math.min(fulfilledCredits, req.credits);
        } else {
            analysis.missing.push({
                ...req,
                fulfilled: false,
                matchingCourses: matchingCourses,
                fulfilledCredits: fulfilledCredits
            });
        }
    });
    
    return analysis;
}

function displayResults(analysis) {
    const resultsContainer = document.getElementById('results-container');
    
    let html = `
        <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Requirements:</strong> ${analysis.fulfilled.length + analysis.missing.length}</p>
            <p><strong>Fulfilled:</strong> ${analysis.fulfilled.length}</p>
            <p><strong>Missing:</strong> ${analysis.missing.length}</p>
            <p><strong>Credits Fulfilled:</strong> ${analysis.totalCreditsFulfilled} / ${analysis.totalCreditsRequired}</p>
        </div>
    `;
    
    if (analysis.fulfilled.length > 0) {
        html += '<h3>✅ Fulfilled Requirements</h3>';
        analysis.fulfilled.forEach(req => {
            html += `
                <div class="requirement-status requirement-fulfilled">
                    <h4>${req.category}</h4>
                    <p><strong>Description:</strong> ${req.description}</p>
                    <p><strong>Credits Required:</strong> ${req.credits} | <strong>Credits Fulfilled:</strong> ${req.fulfilledCredits}</p>
                    ${req.matchingCourses.length > 0 ? `
                        <div class="course-list">
                            <strong>Matching Courses:</strong><br>
                            ${req.matchingCourses.map(course => 
                                `<span class="course-item">${course.code}: ${course.title} (${course.credits} credits)</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
    }
    
    if (analysis.missing.length > 0) {
        html += '<h3>❌ Missing Requirements</h3>';
        analysis.missing.forEach(req => {
            html += `
                <div class="requirement-status requirement-missing">
                    <h4>${req.category}</h4>
                    <p><strong>Description:</strong> ${req.description}</p>
                    <p><strong>Credits Required:</strong> ${req.credits}</p>
                    ${req.courses.length > 0 ? `
                        <p><strong>Suggested Courses:</strong> ${req.courses.join(', ')}</p>
                    ` : ''}
                    ${req.note ? `<p><em>${req.note}</em></p>` : ''}
                </div>
            `;
        });
    }
    
    resultsContainer.innerHTML = html;
}

document.getElementById('requirements-url').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addRequirementUrl();
    }
});