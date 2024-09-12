
import React, { useEffect, useState } from 'react';

function VideoFeed() {
    const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    // Set the video source to the Flask endpoint for streaming
    setVideoSrc('http://localhost:5000/video_feed');
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%',  }}>
      {/* Left side: Video feed */}
      <div style={{ flex: 1,  }}>
        {videoSrc && (
          <img 
            src={videoSrc} 
            alt="video stream" 
            style={{ width: '100%', height: '100%' , objectFit:'contain',}}
          />
        )}
      </div>
    </div>
  );
}

export default VideoFeed;