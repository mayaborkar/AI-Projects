# 📊 YouTube Comment Analyzer

A powerful web application that transforms YouTube comments into actionable content insights and video ideas for creators.

## 🚀 Features

- **Comment Extraction**: Fetches comments from any public YouTube video
- **AI-Powered Analysis**: Uses OpenAI to identify patterns, sentiment, and insights
- **Video Ideas Generation**: Creates specific, actionable video suggestions
- **Professional UI**: Clean, YouTube-branded interface optimized for creators
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Export Results**: Download analysis as JSON for future reference

## 📋 What It Analyzes

### Comment Insights
- **Frequently Asked Questions**: Most common questions from viewers
- **Pain Points**: Issues and problems mentioned by viewers
- **Content Requests**: What viewers want to see next
- **Emotional Sentiment**: Frustrated, excited, confused, or satisfied viewers
- **Learning Topics**: Subjects viewers want to learn more about
- **Misconceptions**: Common misunderstandings that need clarification

### Generated Content Ideas
- **FAQ Videos**: Address top questions from comments
- **Tutorial Videos**: Solve common problems mentioned
- **Deep Dive Videos**: Explore topics with high interest
- **Clarification Videos**: Address misconceptions

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- YouTube Data API v3 key
- OpenAI API key

### Installation

1. **Clone or download the project**:
   ```bash
   cd youtube-comment-analyzer
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   SECRET_KEY=your_secret_key_here
   ```

### Getting API Keys

#### YouTube Data API v3 Key
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Create a new API key
4. Copy the key to your `.env` file

### Running the Application

```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 🎯 How to Use

1. **Enter YouTube URL**: Paste any public YouTube video URL
2. **Click Analyze**: The tool will extract and analyze comments
3. **Review Insights**: Examine the categorized feedback and sentiment
4. **Generate Ideas**: Get specific video suggestions based on comments
5. **Export Results**: Download the analysis for future reference

## 📱 Mobile Support

The application is fully responsive and optimized for mobile use, perfect for creators who want to analyze comments on-the-go.

## 🔒 Privacy & Security

- No comments or video data are stored permanently
- All analysis happens in real-time
- API keys are kept secure in environment variables
- Results can be exported locally by the user

## 🚨 Limitations

- Requires public videos with comments enabled
- Limited to analyzing up to 500 comments per video
- Requires active internet connection for API calls
- Subject to YouTube API rate limits

## 📄 Export Format

Results are exported as JSON with the following structure:
```json
{
  "video_info": { "title": "...", "stats": "..." },
  "analysis_summary": { "insights": "..." },
  "video_ideas": [{ "title": "...", "description": "..." }],
  "export_date": "2024-01-01T00:00:00Z"
}
```

## 🤝 Support

For issues or questions:
1. Check your API keys are correctly set in `.env`
2. Ensure the YouTube video is public with comments enabled
3. Verify your internet connection and API quotas

## 📊 Perfect for Content Creators Who Want To

- **Understand their audience better**
- **Generate data-driven content ideas**
- **Address viewer concerns proactively**
- **Improve audience engagement**
- **Create more targeted content**

---

Built with ❤️ for YouTube creators who want to turn comments into content gold!