import React, { useState } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faEye, faDownload } from "@fortawesome/free-solid-svg-icons";

const Main = () => {
  const [videoRecording, setVideoRecording] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const startRecording = async () => {
    const constraints = {
      video: true,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const mediaBlob = new Blob(chunks);
      setVideoBlob(mediaBlob);
    };

    setVideoRecording(recorder);
    recorder.start();
  };

  const stopRecording = () => {
    if (videoRecording) {
      videoRecording.stop();
    }
  };

  const handleVideoPreview = () => {
    const video = document.getElementById("recordedVideo");
    video.play();
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recorded_video.mp4`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>RecDor</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className={styles.recording_container}>
        <a
          href="#"
          onClick={startRecording}
          className={videoRecording ? styles.disabled : ""}
        >
          <FontAwesomeIcon icon={faPlay} size="lg" />
          
        </a>
        <a
          href="#"
          onClick={stopRecording}
          className={!videoRecording ? styles.disabled : ""}
        >
          <FontAwesomeIcon icon={faStop} size="lg" />
          
        </a>
        <a
          href="#"
          onClick={handleVideoPreview}
          className={!videoBlob ? styles.disabled : ""}
        >
          <FontAwesomeIcon icon={faEye} size="lg" />
        </a>
        <a
          href="#"
          onClick={handleDownload}
          className={!videoBlob ? styles.disabled : ""}
        >
          <FontAwesomeIcon icon={faDownload} size="lg" />
        
        </a>
      </div>
      <div className={styles.preview_container}>
        {videoBlob && <video id="recordedVideo" controls src={URL.createObjectURL(videoBlob)} />}
      </div>
    </div>
  );
};

export default Main;
