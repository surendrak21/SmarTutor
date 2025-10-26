import React from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaSearch,
  FaShieldAlt,
  FaClock,
  FaBookOpen,
  FaComments,
  FaArrowRight,
} from "react-icons/fa";
import "./Home.css";

const Home = () => {
  return (
    <div className="st-home">
      {/* Hero */}
      <section className="st-hero container">
        <div className="st-hero__text">
          <span className="st-badge">SmartTutor • IITK prereg assistant</span>
          <h1>Plan your semester in minutes, not hours.</h1>
          <p className="st-hero__sub">
            Search courses, avoid clashes, and lock your pre-registration with
            confidence. SmartTutor turns the chaos into a clear, personalized
            timetable.
          </p>

          <div className="st-cta">
            <Link to="/preregistration" className="st-btn st-btn--primary">
              Start Pre-Registration <FaArrowRight />
            </Link>
            <Link to="/courses" className="st-btn st-btn--ghost">
              Browse Courses
            </Link>
          </div>

          <div className="st-kpis">
            <div>
              <strong>1,200+</strong>
              <span>course combinations tested</span>
            </div>
            <div>
              <strong>0</strong>
              <span>clashes after validation</span>
            </div>
            <div>
              <strong>~3 min</strong>
              <span>to create a timetable</span>
            </div>
          </div>
        </div>

        <div className="st-hero__art">
          <svg viewBox="0 0 400 300" className="st-hero__svg" aria-hidden="true">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <linearGradient id="g2" x1="0" x2="1">
                <stop offset="0%" stopColor="#fecaca" />
                <stop offset="100%" stopColor="#fcd34d" />
              </linearGradient>
            </defs>
            <rect x="20" y="30" width="360" height="220" rx="16" fill="url(#g1)" opacity="0.25" />
            <rect x="40" y="50" width="320" height="50" rx="10" fill="white" opacity="0.95" />
            <rect x="40" y="115" width="140" height="100" rx="12" fill="white" opacity="0.95" />
            <rect x="220" y="115" width="140" height="100" rx="12" fill="url(#g2)" opacity="0.9" />
            <circle cx="80" cy="75" r="6" fill="#60a5fa" />
            <circle cx="100" cy="75" r="6" fill="#f59e0b" />
            <circle cx="120" cy="75" r="6" fill="#10b981" />
          </svg>
        </div>
      </section>


      <section className="st-team container">
        <div className="st-section-head">
          <h2>Team&nbsp;16</h2>
          <p>SmartTutor is crafted by students for students.</p>
        </div>
        <div className="st-team__grid">
          {[
            
            ["Surendra Kumar", "211083", "surendrak21@iitk.ac.in"],
            ["Kantule Ritesh Ramdas", "210488", "kantulerr21@iitk.ac.in"],
            ["Sarthak Paswan", "220976", "sarthakp22@iitk.ac.in"],
            ["Saurav Kumar", "210950", "sauravk21@iitk.ac.in"],
            ["Sonu Kumar", "211052", "sonuk21@iitk.ac.in"],
            ["Yash Gothwal", "211189", "yashg21@iitk.ac.in"],
          ].map(([name, roll, mail]) => (
            <div className="st-team__card" key={roll}>
              <div className="avatar">{name.charAt(0)}</div>
              <div>
                <h4>{name}</h4>
                <p>{roll}</p>
                <a href={`mailto:${mail}`}>{mail}</a>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
