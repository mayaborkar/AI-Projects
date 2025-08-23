import openai
import json
from collections import Counter
import re


class CommentAnalyzer:
    def __init__(self, api_key):
        self.client = openai.OpenAI(api_key=api_key)
    
    def analyze_comments(self, comments, video_title):
        """Analyze comments and extract insights"""
        if not comments:
            return self._empty_analysis()
        
        # Prepare comment text for analysis
        comment_texts = [comment['text'] for comment in comments]
        sample_comments = comment_texts[:50]  # Analyze top 50 comments for efficiency
        
        # Get AI analysis
        analysis = self._get_ai_analysis(sample_comments, video_title)
        
        # Generate video ideas
        video_ideas = self._generate_video_ideas(analysis, video_title)
        
        return {
            'comment_count': len(comments),
            'analysis': analysis,
            'video_ideas': video_ideas,
            'engagement_metrics': self._calculate_engagement_metrics(comments)
        }
    
    def _get_ai_analysis(self, comment_texts, video_title):
        """Use OpenAI to analyze comment themes and sentiments"""
        comments_text = "\n".join(comment_texts)
        
        prompt = f"""
        Analyze these YouTube comments for the video titled "{video_title}".
        
        Comments:
        {comments_text}
        
        Please provide a JSON response with the following structure:
        {{
            "frequently_asked_questions": [
                {{"question": "What question?", "frequency": 5, "example_comments": ["comment1", "comment2"]}}
            ],
            "pain_points": [
                {{"issue": "What issue?", "severity": "high/medium/low", "example_comments": ["comment1", "comment2"]}}
            ],
            "content_requests": [
                {{"request": "What do they want?", "interest_level": "high/medium/low", "example_comments": ["comment1", "comment2"]}}
            ],
            "emotional_sentiment": {{
                "frustrated": {{"percentage": 20, "examples": ["comment1"]}},
                "excited": {{"percentage": 40, "examples": ["comment1"]}},
                "confused": {{"percentage": 15, "examples": ["comment1"]}},
                "satisfied": {{"percentage": 25, "examples": ["comment1"]}}
            }},
            "learning_topics": [
                {{"topic": "What topic?", "demand": "high/medium/low", "example_comments": ["comment1", "comment2"]}}
            ],
            "misconceptions": [
                {{"misconception": "What misconception?", "clarification_needed": "What needs clarifying?", "example_comments": ["comment1"]}}
            ]
        }}
        
        Keep responses concise and focus on actionable insights for content creators.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert YouTube content strategist who analyzes comments to help creators understand their audience and generate content ideas."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            result = response.choices[0].message.content
            # Extract JSON from the response
            json_match = re.search(r'\{.*\}', result, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return self._empty_analysis()
                
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            return self._empty_analysis()
    
    def _generate_video_ideas(self, analysis, video_title):
        """Generate specific video ideas based on analysis"""
        ideas = []
        
        # FAQ videos
        if analysis.get('frequently_asked_questions'):
            top_questions = [q['question'] for q in analysis['frequently_asked_questions'][:3]]
            ideas.append({
                'title': f"FAQ: Top Questions from '{video_title}' Viewers",
                'description': f"Answering the most common questions: {', '.join(top_questions)}",
                'type': 'FAQ',
                'estimated_interest': 'high',
                'reasoning': f"Based on {len(analysis['frequently_asked_questions'])} frequently asked questions"
            })
        
        # Problem-solving videos
        for pain_point in analysis.get('pain_points', [])[:2]:
            if pain_point['severity'] in ['high', 'medium']:
                ideas.append({
                    'title': f"How to Fix: {pain_point['issue']}",
                    'description': f"Step-by-step solution for viewers struggling with {pain_point['issue']}",
                    'type': 'Tutorial',
                    'estimated_interest': pain_point['severity'],
                    'reasoning': f"Addresses {pain_point['severity']}-priority pain point from comments"
                })
        
        # Content request videos
        for request in analysis.get('content_requests', [])[:2]:
            ideas.append({
                'title': f"Deep Dive: {request['request']}",
                'description': f"Detailed exploration of {request['request']} as requested by viewers",
                'type': 'Deep Dive',
                'estimated_interest': request['interest_level'],
                'reasoning': f"Direct audience request with {request['interest_level']} interest level"
            })
        
        # Clarification videos
        for misconception in analysis.get('misconceptions', [])[:1]:
            ideas.append({
                'title': f"Clearing Up Confusion: {misconception['misconception']}",
                'description': f"Addressing common misconceptions: {misconception['clarification_needed']}",
                'type': 'Clarification',
                'estimated_interest': 'medium',
                'reasoning': "Helps prevent audience confusion and builds authority"
            })
        
        return ideas
    
    def _calculate_engagement_metrics(self, comments):
        """Calculate engagement statistics"""
        if not comments:
            return {}
        
        total_likes = sum(comment['like_count'] for comment in comments)
        total_replies = sum(comment['reply_count'] for comment in comments)
        
        # Analyze comment lengths
        lengths = [len(comment['text']) for comment in comments]
        avg_length = sum(lengths) / len(lengths) if lengths else 0
        
        return {
            'total_likes_on_comments': total_likes,
            'total_replies': total_replies,
            'average_comment_length': round(avg_length, 1),
            'engagement_quality': 'high' if avg_length > 100 else 'medium' if avg_length > 50 else 'low'
        }
    
    def _empty_analysis(self):
        """Return empty analysis structure"""
        return {
            'frequently_asked_questions': [],
            'pain_points': [],
            'content_requests': [],
            'emotional_sentiment': {
                'frustrated': {'percentage': 0, 'examples': []},
                'excited': {'percentage': 0, 'examples': []},
                'confused': {'percentage': 0, 'examples': []},
                'satisfied': {'percentage': 0, 'examples': []}
            },
            'learning_topics': [],
            'misconceptions': []
        }