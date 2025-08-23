// YouTube Comment Analyzer - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('analyze-form');
    const urlInput = document.getElementById('url-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const resultsSection = document.getElementById('results');
    const exportBtn = document.getElementById('export-btn');

    let analysisData = null;

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await analyzeVideo();
    });

    // Export functionality
    exportBtn.addEventListener('click', function() {
        if (analysisData) {
            exportResults();
        }
    });

    async function analyzeVideo() {
        const url = urlInput.value.trim();
        
        if (!url) {
            showError('Please enter a YouTube URL');
            return;
        }

        // Validate YouTube URL
        if (!isValidYouTubeUrl(url)) {
            showError('Please enter a valid YouTube video URL');
            return;
        }

        // Start analysis
        setLoading(true);
        showProgress();
        hideResults();
        clearMessages();

        try {
            // Update progress
            updateProgress(20, 'Extracting video information...');
            
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });

            updateProgress(50, 'Fetching comments...');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            updateProgress(80, 'Analyzing with AI...');

            const data = await response.json();
            analysisData = data;

            updateProgress(100, 'Complete!');
            
            setTimeout(() => {
                hideProgress();
                displayResults(data);
                setLoading(false);
            }, 500);

        } catch (error) {
            console.error('Analysis error:', error);
            hideProgress();
            showError(error.message || 'Failed to analyze video. Please try again.');
            setLoading(false);
        }
    }

    function displayResults(data) {
        // Video Info
        displayVideoInfo(data.video_info);
        
        // Analysis Insights
        displayAnalysisInsights(data.analysis);
        
        // Video Ideas
        displayVideoIdeas(data.video_ideas);
        
        // Show results section
        resultsSection.style.display = 'block';
        
        // Smooth scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function displayVideoInfo(videoInfo) {
        document.getElementById('video-title').textContent = videoInfo.title;
        document.getElementById('channel-name').textContent = videoInfo.channel_title;
        document.getElementById('view-count').textContent = formatNumber(videoInfo.view_count);
        document.getElementById('like-count').textContent = formatNumber(videoInfo.like_count);
        document.getElementById('comment-count').textContent = formatNumber(videoInfo.comment_count);
    }

    function displayAnalysisInsights(analysis) {
        // FAQs
        displayInsightsList('faqs-list', analysis.frequently_asked_questions, (item) => ({
            text: item.question,
            details: `Asked ${item.frequency} times`,
            examples: item.example_comments
        }));

        // Pain Points
        displayInsightsList('pain-points-list', analysis.pain_points, (item) => ({
            text: item.issue,
            details: `Severity: ${item.severity}`,
            examples: item.example_comments
        }));

        // Content Requests
        displayInsightsList('content-requests-list', analysis.content_requests, (item) => ({
            text: item.request,
            details: `Interest level: ${item.interest_level}`,
            examples: item.example_comments
        }));

        // Learning Topics
        displayInsightsList('learning-topics-list', analysis.learning_topics, (item) => ({
            text: item.topic,
            details: `Demand: ${item.demand}`,
            examples: item.example_comments
        }));

        // Misconceptions
        displayInsightsList('misconceptions-list', analysis.misconceptions, (item) => ({
            text: item.misconception,
            details: item.clarification_needed,
            examples: item.example_comments
        }));

        // Sentiment Analysis
        displaySentimentChart(analysis.emotional_sentiment);
    }

    function displayInsightsList(containerId, items, formatter) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        if (!items || items.length === 0) {
            container.innerHTML = '<p class="text-muted">No insights found for this category.</p>';
            return;
        }

        items.forEach(item => {
            const formatted = formatter(item);
            const div = document.createElement('div');
            div.className = 'insight-item';
            
            div.innerHTML = `
                <div class="insight-text">${formatted.text}</div>
                <div class="insight-details">${formatted.details}</div>
                ${formatted.examples && formatted.examples.length > 0 ? 
                    `<div class="example-comments">Example: "${formatted.examples[0].substring(0, 100)}..."</div>` : ''}
            `;
            
            container.appendChild(div);
        });
    }

    function displaySentimentChart(sentiment) {
        const container = document.getElementById('sentiment-chart');
        container.innerHTML = '';

        const sentiments = [
            { key: 'excited', emoji: '😊', label: 'Excited' },
            { key: 'satisfied', emoji: '😌', label: 'Satisfied' },
            { key: 'confused', emoji: '😕', label: 'Confused' },
            { key: 'frustrated', emoji: '😤', label: 'Frustrated' }
        ];

        sentiments.forEach(s => {
            const data = sentiment[s.key] || { percentage: 0 };
            const div = document.createElement('div');
            div.className = 'sentiment-item';
            
            div.innerHTML = `
                <div class="sentiment-emoji">${s.emoji}</div>
                <div class="sentiment-percent">${data.percentage}%</div>
                <div class="sentiment-label">${s.label}</div>
            `;
            
            container.appendChild(div);
        });
    }

    function displayVideoIdeas(ideas) {
        const container = document.getElementById('video-ideas-list');
        container.innerHTML = '';

        if (!ideas || ideas.length === 0) {
            container.innerHTML = '<p class="text-muted">No video ideas generated.</p>';
            return;
        }

        ideas.forEach(idea => {
            const div = document.createElement('div');
            div.className = 'video-idea';
            
            div.innerHTML = `
                <div class="idea-header">
                    <div class="idea-title">${idea.title}</div>
                    <div class="idea-type">${idea.type}</div>
                </div>
                <div class="idea-description">${idea.description}</div>
                <div class="idea-meta">
                    <span class="reasoning">${idea.reasoning}</span>
                    <span class="interest-level interest-${idea.estimated_interest}">
                        ${idea.estimated_interest.toUpperCase()} INTEREST
                    </span>
                </div>
            `;
            
            container.appendChild(div);
        });
    }

    function exportResults() {
        if (!analysisData) return;

        const exportData = {
            video_info: analysisData.video_info,
            analysis_summary: {
                total_comments_analyzed: analysisData.comment_count,
                key_insights: {
                    faqs: analysisData.analysis.frequently_asked_questions.length,
                    pain_points: analysisData.analysis.pain_points.length,
                    content_requests: analysisData.analysis.content_requests.length,
                    misconceptions: analysisData.analysis.misconceptions.length
                }
            },
            video_ideas: analysisData.video_ideas,
            export_date: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `youtube-analysis-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showSuccess('Analysis exported successfully!');
    }

    // Utility Functions
    function isValidYouTubeUrl(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
        ];
        return patterns.some(pattern => pattern.test(url));
    }

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    function setLoading(loading) {
        analyzeBtn.disabled = loading;
        analyzeBtn.innerHTML = loading ? 
            '<span class="loading-spinner"></span>Analyzing...' : 
            'Analyze Comments';
    }

    function showProgress() {
        progressContainer.style.display = 'block';
    }

    function hideProgress() {
        progressContainer.style.display = 'none';
        updateProgress(0, '');
    }

    function updateProgress(percent, text) {
        progressFill.style.width = percent + '%';
        progressText.textContent = text;
    }

    function hideResults() {
        resultsSection.style.display = 'none';
    }

    function showError(message) {
        clearMessages();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        form.parentNode.insertBefore(errorDiv, form.nextSibling);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    function showSuccess(message) {
        clearMessages();
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        exportBtn.parentNode.insertBefore(successDiv, exportBtn.nextSibling);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }

    function clearMessages() {
        const messages = document.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        });
    }
});