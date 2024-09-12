import React, { useEffect, useState } from "react";
import "../Styles/Feed.css";

function Feed() {
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    // Set the video source to the Flask endpoint for streaming
    setVideoSrc("http://localhost:5000/video_feed");
  }, []);

  return (
    <div className="feed">
        <p className="title">Video Streaming and accident detection</p>
    <div className="feed-container">
    
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      {/* Left side: Video feed */}
      <div style={{ flex: 1 }}>
        {videoSrc && (
          <img
            src={videoSrc}
            alt="video stream"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </div>
    </div>
    </div>   
    </div>
  );
}

export default Feed;
