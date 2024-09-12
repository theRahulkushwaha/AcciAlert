import React from "react";

import Visuals from "../Components/Visuals";
import VideoFeed from "../Components/VideoFeed";
import Alert from "../Components/Alerts";
import Map from "../Components/Map";
import Response from "../Components/Response";

import "../Styles/HomeScreen.css";

function HomeScreen() {
  return (
    <div className="HomeScreen">
      <header className="Header">
        <div className="Logo">
          <img></img>
        </div>
        <nav className="Nav">
          <ul className="Menu">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Feeds</a>
            </li>
            <li>
              <a href="#">Report</a>
            </li>
            <li>
              <a href="#">About</a>
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
            <div className="VideoFeed">
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
