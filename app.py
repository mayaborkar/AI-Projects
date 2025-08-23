from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
from youtube_service import YouTubeService
from ai_analyzer import CommentAnalyzer

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Initialize services
youtube_service = YouTubeService(os.getenv('YOUTUBE_API_KEY'))
analyzer = CommentAnalyzer(os.getenv('OPENAI_API_KEY'))

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_video():
    """Analyze YouTube video comments"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'YouTube URL is required'}), 400
        
        # Extract video ID
        video_id = youtube_service.extract_video_id(url)
        if not video_id:
            return jsonify({'error': 'Invalid YouTube URL format'}), 400
        
        # Get video information
        video_info = youtube_service.get_video_info(video_id)
        if not video_info:
            return jsonify({'error': 'Video not found or is private'}), 404
        
        # Check if video has comments
        if video_info['comment_count'] == 0:
            return jsonify({'error': 'This video has no comments to analyze'}), 400
        
        # Extract comments
        try:
            comments = youtube_service.get_comments(video_id, max_comments=500)
        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
        if not comments:
            return jsonify({'error': 'Unable to fetch comments. They may be disabled.'}), 400
        
        # Analyze comments with AI
        analysis_result = analyzer.analyze_comments(comments, video_info['title'])
        
        # Prepare response
        response_data = {
            'video_info': video_info,
            'comment_count': len(comments),
            'analysis': analysis_result['analysis'],
            'video_ideas': analysis_result['video_ideas'],
            'engagement_metrics': analysis_result['engagement_metrics']
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Analysis error: {e}")
        return jsonify({'error': 'Internal server error. Please try again.'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'YouTube Comment Analyzer'})

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Check for required environment variables
    required_env_vars = ['YOUTUBE_API_KEY', 'OPENAI_API_KEY']
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
        print("Please create a .env file based on .env.example")
        exit(1)
    
    print("🚀 Starting YouTube Comment Analyzer...")
    print("📊 Access the application at: http://localhost:5001")
    
    app.run(debug=True, port=5001, host='0.0.0.0')