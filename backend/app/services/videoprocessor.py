from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

def get_video_id(url: str):
    parsed = urlparse(url)

    if parsed.hostname in ["www.youtube.com", "youtube.com", "m.youtube.com"]:
        return parse_qs(parsed.query).get("v", [None])[0]

    if parsed.hostname in ["youtu.be", "www.youtu.be"]:
        return parsed.path.lstrip("/")

    return None

def extract_transcript(url: str):
    try:
        video_id = get_video_id(url)

        if not video_id:
            raise Exception("Invalid YouTube URL")

        ytt_api = YouTubeTranscriptApi()
        fetched_transcript = ytt_api.fetch(video_id)

        text = " ".join(snippet.text for snippet in fetched_transcript)
        return text

    except Exception as e:
        raise Exception(f"Failed to fetch YouTube transcript: {str(e)}")