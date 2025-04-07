// HomePage.jsx
import React from "react";
import "./HomePage.scss"; 

const HomePage = () => {
  return (
    <div className="main-page">
      <div className="content-container">
        <h1 className="main-title">
          <span className="title-highlight">Empower</span> Your Business, <br /> 
          <span className="title-accent">Elevate</span> Your Success
        </h1>
        <div className="paragraph-container">
          <p className="main-paragraph">
            In today's competitive market, success depends on integrating 
            <span className="highlight"> intelligent, adaptable, and effortless </span> 
            solutions. Smart businesses harness data-driven insights to make informed decisions. 
            Scalability ensures growth without compromising performance. 
            Seamless integration minimizes disruptions, enhancing efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;