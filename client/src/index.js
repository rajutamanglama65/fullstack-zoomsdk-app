import React from 'react';
import ReactDOM from 'react-dom/client';
import ZoomContext from './context/zoom-context';
import './index.css';
import App from './App';
import ZoomVideo from '@zoom/videosdk';
import { devConfig } from './devConfig';

// devConfig object contains meeting credentials
let meetingArgs = {...devConfig}

const getToken = async (options) => {
  /**
   * fetch call to backend /generate end point and store response to variable
   * parse body of response variable as JSON
   * return variable
   */
  let response = await fetch('http://localhost:5000/generate', options).then(response => response.json());
  console.log("Hey, I am called")
  return response
}

if(!meetingArgs.signature && meetingArgs.topic) {
  // create requestOptions object with method, header and body
  const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(meetingArgs)
  }

  // call getToken function with object as argument, set result of resolved promise to signature value in meetingArgs
  getToken(requestOptions).then(res => meetingArgs.signature = res)
}


const client = ZoomVideo.createClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // use contextAPI provider wrapper passing in client as value
  // pass in App component, props drilling meetingArgs object
  <React.StrictMode>
    <ZoomContext.Provider value={client}>
      <App meetingArgs={meetingArgs} />
    </ZoomContext.Provider>
  </React.StrictMode>
);


