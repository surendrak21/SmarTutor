import React from "react";
import "./MarqueeBar.css";

const MarqueeBar = () => {
  // You can customize these messages
  const messages = [

    "👨‍💻 Built by Surendra (IIT Kanpur) — LinkedIn: https://www.linkedin.com/in/surendrak21/• ",
    "⭐ SmartTutor — helping students plan courses faster • ",
    "⭐ SmartTutor — For any suggestion please contact over sk1757417@gmail.com • ",
  ];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-inner">
        <div className="marquee-track">
          {messages.map((msg, idx) => (
            <span className="marquee-text" key={idx}>
              {msg}
            </span>
          ))}

          {/* duplicate once more so scrolling feels continuous */}
          {messages.map((msg, idx) => (
            <span className="marquee-text" key={`dup-${idx}`}>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeBar;
