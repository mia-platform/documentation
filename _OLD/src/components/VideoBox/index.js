import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

import videoLinks from './videoLinks.json'

const VIMEO_PLY_URL = "https://player.vimeo.com/video";

const getVideoLink = (videoName) => {
  return `${VIMEO_PLY_URL}/${videoLinks[videoName]}`;
};

function VideoBox(props) {
  const {videoName, embedParameters} = props;
  let src=getVideoLink(videoName)

  if(embedParameters) {
    const embedParameterKeys=Object.keys(embedParameters)
    const parsedEmbedParameter=embedParameterKeys.reduce((acc,key)=>acc.concat(`${key}=${String(embedParameters[key])}`),[])
    if(parsedEmbedParameter.length)
      src+=`?${parsedEmbedParameter.join('&')}`
  }

  return (
    <div className={styles.videoCtn} >
      <div className={styles.videoBox}>
        <iframe
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          src={src}
        >
        </iframe>
      </div>
    </div>
  );
}

VideoBox.propTypes = {
  embedParameters: PropTypes.Object,
  videoName: PropTypes.string.isRequired
};

export default VideoBox;
