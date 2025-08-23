import re
import os
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


class YouTubeService:
    def __init__(self, api_key):
        self.youtube = build('youtube', 'v3', developerKey=api_key)
    
    def extract_video_id(self, url):
        """Extract video ID from various YouTube URL formats"""
        patterns = [
            r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
            r'(?:embed\/)([0-9A-Za-z_-]{11})',
            r'(?:watch\?v=)([0-9A-Za-z_-]{11})',
            r'(?:youtu\.be\/)([0-9A-Za-z_-]{11})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    def get_video_info(self, video_id):
        """Get basic video information"""
        try:
            request = self.youtube.videos().list(
                part="snippet,statistics",
                id=video_id
            )
            response = request.execute()
            
            if not response['items']:
                return None
                
            video = response['items'][0]
            return {
                'title': video['snippet']['title'],
                'channel_title': video['snippet']['channelTitle'],
                'view_count': int(video['statistics'].get('viewCount', 0)),
                'like_count': int(video['statistics'].get('likeCount', 0)),
                'comment_count': int(video['statistics'].get('commentCount', 0)),
                'published_at': video['snippet']['publishedAt']
            }
        except HttpError as e:
            print(f"Error fetching video info: {e}")
            return None
    
    def get_comments(self, video_id, max_comments=500):
        """Extract comments from a YouTube video"""
        comments = []
        
        try:
            request = self.youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=100,
                order="relevance"
            )
            
            while request and len(comments) < max_comments:
                response = request.execute()
                
                for item in response['items']:
                    comment = item['snippet']['topLevelComment']['snippet']
                    comments.append({
                        'text': comment['textDisplay'],
                        'author': comment['authorDisplayName'],
                        'like_count': comment['likeCount'],
                        'published_at': comment['publishedAt'],
                        'reply_count': item['snippet']['totalReplyCount']
                    })
                
                # Check if there are more comments
                if 'nextPageToken' in response and len(comments) < max_comments:
                    request = self.youtube.commentThreads().list(
                        part="snippet",
                        videoId=video_id,
                        maxResults=100,
                        order="relevance",
                        pageToken=response['nextPageToken']
                    )
                else:
                    break
                    
        except HttpError as e:
            if e.resp.status == 403:
                raise Exception("Comments are disabled for this video or API quota exceeded")
            else:
                raise Exception(f"Error fetching comments: {e}")
        
        return comments[:max_comments]