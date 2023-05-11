import { Button, Tooltip } from 'antd';
import { AudioMutedOutlined, AudioOutlined, CameraOutlined, CustomerServiceOutlined, FullscreenExitOutlined, FullscreenOutlined, IconFont, VideoCameraOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useState } from 'react'
import MediaContext from '../../context/media-context';
import ZoomContext from '../../context/zoom-context';
import "./video.css"

const VideoContainer = () => {
  const [videoStarted, setVideoStarted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isShareScreen, setIsShareScreen] = useState(false);
  const [isSAB, setIsSAB] = useState(false);

  const client = useContext(ZoomContext);
  const mediaStream = useContext(MediaContext);

  // API gives access to raw video frames, chunks of audio data, audio and video encoders and decoders
  const isSupportWebCodecs = () => {
    return typeof window.MediaStreamTrackProcessor === "function";
  }

  const startVideoButton = useCallback(async () => {
    if(!videoStarted) {
      if(!!window.chrome && !(typeof SharedArrayBuffer === "function")) {
        setIsSAB(false)
        await mediaStream.startVideo({videoElement: document.querySelector('self-view-video')});
      } else {
        setIsSAB(true)
        await mediaStream.startVideo();
        mediaStream.renderVideo(document.querySelector('#self-view-canvas'), client.getCurrentUserInfo().userId, 1920, 1080, 0, 0, 3)
      }
      setVideoStarted(true)
    } else {
      await mediaStream.startVideo();
      if(isSAB) {
        mediaStream.stopRenderVideo(document.querySelector('#self-view-canvas'), client.getCurrentUserInfo().userId)
      }
      setVideoStarted(false);
    }
  }, [mediaStream, videoStarted, client, isSAB])

  const startAudioButton = useCallback(async () => {
    if(audioStarted) {
      if(isMuted) {
        await mediaStream.unmuteAudio();
        setIsMuted(false)
      } else {
        await mediaStream.muteAudio();
        setIsMuted(true)
      }
    } else {
      await mediaStream.startAudio();
      setAudioStarted()
    }
  }, [mediaStream, audioStarted, isMuted])

  const shareScreen = useCallback(async () => {
    if(isShareScreen) {
      await mediaStream.stopShareScreen();
      setIsShareScreen(false)
    } else {
      if(isSupportWebCodecs()) {
        await mediaStream.startShareScreen(document.querySelector("#share-video"))
      } else {
        await mediaStream.startShareScreen(document.querySelector("share-canvas"))
      }
      setIsShareScreen(true)
    }
  }, [isShareScreen, mediaStream])
  return (
    <div>
      {isSAB ? 
        // <canvas id="self-view-canvas" width="1920" height="1080"></canvas> :
        // <video id="self-view-video" width="1920" height="1080"></video>

        <div id="self-view-canvas" width="1920" height="1080"></div> :
        <div id="self-view-video" width="1920" height="1080"></div>
      }
      {isSupportWebCodecs() ?
      // <canvas id="share-canvas" width="1920" height="1080"></canvas> :
      // <video id="share-video" width="1920" height="1080"></video>
      <div id="share-canvas" width="1920" height="1080"></div> :
      <div id="share-video" width="1920" height="1080"></div>
      }

      <div className='video-footer'>
        <Tooltip title={`${videoStarted ? "Stop Camara" : "Start Camara"}`}>
          <Button 
            className='camara-button'
            icon={videoStarted ? <CameraOutlined /> : <CameraOutlined />}
            shape="circle"
            size='large'
            onClick={startVideoButton}
          />
        </Tooltip>

        <Tooltip title={`${!isShareScreen ? "Share Screen" : "Stop Sharing Screen"}`}>
          <Button 
            className='camara-button'
            icon={isShareScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
            shape="circle"
            size='large'
            onClick={shareScreen}
          />
        </Tooltip>

        <Tooltip title={`${!isShareScreen ? "Share Screen" : "Stop Sharing Screen"}`}>
          <Button 
            className='camara-button'
            icon={audioStarted ? isMuted ? <AudioMutedOutlined /> : <AudioOutlined /> : <CustomerServiceOutlined />}
            shape="circle"
            size='large'
            onClick={startAudioButton}
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default VideoContainer