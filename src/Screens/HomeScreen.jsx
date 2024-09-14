import React from "react";
import { useNavigate } from 'react-router-dom';

import Visuals from "../Components/Visuals";
import VideoFeed from "../Components/VideoFeed";
import Alert from "../Components/Alerts";
import Map from "../Components/Map";
import Response from "../Components/Response";
import Profile from "./Profile"; 

import "../Styles/HomeScreen.css";

function HomeScreen() {

  const navigate = useNavigate();

  return (
    <div className="HomeScreen">
      <header className="Header">
        <div className="Logo">
          <img src="src\assets\logo.png" className="LogoImg" />
        </div>
        <nav className="Nav">
          <ul className="Menu">
            <li>
              <a onClick={() => navigate('/')}>Home</a>
            </li>
            <li>
              <a onClick={() => navigate('/feed')}>Feeds</a>
            </li>
            <li>
              <a href="Report">Report</a>
            </li>
            <li>
              <a href="About">About</a>
            </li>
            <li>
              <a onClick={() => navigate('/Profile')}>Profile</a>
            </li>
          </ul>
        </nav>
      </header>

      <div className="Body">
        <div className="VideoContant">
          <div className="VVA">
            <div className="DataVisual">
              <Visuals />
            </div>
            <div className="VideoFeed" onClick={() => navigate('/feed')}>
              <VideoFeed />
            </div>
            <div className="Alerts">
              <Alert />
            </div>
          </div>

          <div className="Map">
            <Map />
          </div>
        </div>

        <div className="Response">
          <Response />
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
