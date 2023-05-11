import './App.css';
import React, { useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { message } from "antd";
import ZoomVideo from '@zoom/videosdk';
import ZoomContext from './context/zoom-context';
import MediaContext from './context/media-context';
import LoadingLayout from './Feature/Loading/loading-layout';
import VideoContainer from "./Feature/Video/Video";
import Home from "./Feature/Home/Home";

function App(props) {
  // destructure props object
  const {meetingArgs: {sdkKey, topic, signature, name, passWord}} = props;

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [mediaStream, setMediaStream] = useState();
  const [status, setStatus] = useState(false);

  // use useContest hook to grab passed down value and create client variable
  const client = useContext(ZoomContext);

  useEffect(() => {
    // create init async function with try...catch block
    const init = async () => {
      client.init("US-EN", "CDN")

      try {
        setLoadingText("Joining Session...");
        await client.join(topic, name, passWord, signature);
        const stream = client.getMediaStream();
        setMediaStream(stream)
        setLoading(false)

      } catch (err) {
        console.log("Error Joining Meeting", err);
        setLoading(false);
        message.error(err.reason)
      }

      // call function and create clean up functionality
    init();
    return () => {
      ZoomVideo.destroyClient();
    }
    }

    
  }, [sdkKey, signature, client, topic, name, passWord])
  return (
    <div className="App">
      {loading && <LoadingLayout content={loadingText} />}
      {!loading && (
        <MediaContext.Provider value={mediaStream}>
          <Router>
            <Routes>
              <Route path='/' element={<Home props={props} status={status} />} />
              <Route path='/video' element={<VideoContainer />} />
            </Routes>
          </Router>
        </MediaContext.Provider>
      )}
    </div>
  );
}

export default App;
