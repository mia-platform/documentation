import React, {useEffect, useRef, useState} from 'react';
import YouTube from 'react-youtube';
import PropTypes from "prop-types";
import Classes from "./styles.module.css";

/* YouTubeVideoPlayer component
* Props:
    - videoId: string
    - subtitle: array of objects with the following format:
        {
            startTimeString: string,
            endTimeString: string,
            text: string
        }
* Description:
    - This component renders a YouTube video and a list of subtitles.
    - When the user clicks on a subtitle, the video starts playing from that point.
    - When the video is playing, the subtitle that is currently being played is highlighted.
    - The subtitles are scrollable and the subtitle that is currently being played is always visible.
 */

const YouTubeVideoPlayer = (props) => {
    /* Refs
    youtubePlayerRef: reference to the YouTube player
    intervalRef: reference to the interval that checks the current time of the video
    containerRef: reference to the container of the subtitles
    elementRefs: object that contains references to each subtitle element
     */
    const youtubePlayerRef = useRef(null);
    const intervalRef = useRef();
    const containerRef = useRef();
    const elementRefs = useRef({});
    const [pastSecond, setPastSecond] = useState(0);
    const {videoId, subtitle} = props;

    /*
    Styles

    const styles = {
        container: {
            display: 'flex'
        },
        leftDiv: {},
        rightDiv: {
            height: '320px',
            padding: '10px',
            overflow: 'auto'
        },
        link: {
            cursor: 'pointer',
            fontWeight: 'normal',
            fontSize: '1em',
            padding: '2px'
        },
        underline: {
            textDecoration: 'underline',
            color: 'blue',
        },
        linkSelected: {
            cursor: 'pointer',
            fontWeight: 'normal',
            fontSize: '1em',
            backgroundColor: '#e6e6e6',
            borderRadius: '8px',
            padding: '2px'
        },
        'linkSelected[data-theme=dark]': {
            cursor: 'pointer',
            fontWeight: 'normal',
            fontSize: '1em',
            backgroundColor: 'red',
            borderRadius: '8px',
            padding: '2px'
        }
    };
 */
    /*
    Functions to convert between timestamp and seconds
     */
    const timestampToSeconds = (timestamp) => {
        const parts = timestamp.split(':');
        const hours = Number(parts[0]);
        const minutes = Number(parts[1]);
        const seconds = Number(parts[2].replace(',', '.'));

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        return totalSeconds;
    }
    /*
    Function to convert seconds to timestamp
     */
    const secondsToTimestamp = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds - (hours * 3600)) / 60);
        const secs = Math.floor(seconds - (hours * 3600) - (minutes * 60));

        let hoursString = hours < 10 ? `0${hours}` : `${hours}`;
        let minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
        let secondsString = secs < 10 ? `0${secs}` : `${secs}`;

        return `${hoursString}:${minutesString}:${secondsString}`;
    }
    /*
    Function to get the closest past subtitle to the current time
     */
    const closestPastSecond = (currentTime, timesList) => {
        const pastTimes = timesList.filter(time => time <= currentTime);
        return Math.max(...pastTimes);
    }
    /*
    Function to scroll smoothly to a given position
     */
    const smoothScrollTo = (targetY) => {

        const step = timestamp => {
            if (containerRef.current) {
                if (!start) start = timestamp;
                let progress = timestamp - start;
                scrollContainerY += speed;
                containerRef.current.scrollTop = scrollContainerY;
                if (progress < 1000) {
                    window.requestAnimationFrame(step);
                }
            }
        };

        let scrollContainerY = containerRef.current.scrollTop;
        let diff = targetY - scrollContainerY;
        let speed = diff / 100;

        let start = null;

        window.requestAnimationFrame(step);

    };
    /*
    Function to scroll to a given subtitle
     */
    const scrollToElement = (key) => {
        if (elementRefs.current[key]) {
            const element = elementRefs.current[key];
            smoothScrollTo(element.offsetTop - 200);
        }
    };
    /*
    Function onReady to get the reference to the YouTube player
     */
    const onReady = (event) => {
        youtubePlayerRef.current = event.target;
    }
    /*
    Function to handle the click on a subtitle
     */
    const onPlayVideo = (time) => {
        if (youtubePlayerRef.current && youtubePlayerRef.current.seekTo) {
            youtubePlayerRef.current.seekTo(time);
        }
    }

    /*
    Function to handle the click on a subtitle
     */
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, []);

    /*
    Options for the YouTube player based on the YouTube API and the react-youtube library
     */
    const opts = {
        height: '360',
        width: '510',
        playerVars: {
            autoplay: 0,
        },
    };

    /*
    Parse the subtitle to add the seconds to each subtitle
     */
    const parsedSubtitle = subtitle.map((item) => {
        const seconds = timestampToSeconds(item.startTimeString);
        return {
            ...item,
            seconds
        }
    });

    /*
    Function to handle the state change of the YouTube player
        when the video is playing, the closest past subtitle is highlighted
        when the video is paused, the interval is cleared
        when the video is ended, the interval is cleared
        when the video is buffering, the interval is cleared
        when the video is playing, the interval is set to check the current time of the video every second
            in each interval the closest past subtitle is highlighted and scrolled to
     */
    const onStateChange = (event) => {
        if (event.data === YouTube.PlayerState.PLAYING) {
            intervalRef.current = setInterval(() => {
                const lastSubtitle = closestPastSecond(event.target.getCurrentTime(), parsedSubtitle.map(item => item.seconds));
                setPastSecond(lastSubtitle);
                scrollToElement(lastSubtitle);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }

    /*
    Render the component with the YouTube player and the subtitles
     */
    return (
        <div>
            <div className={Classes.container}>
                <div className={Classes.leftDiv}>
                    <YouTube onReady={onReady} onStateChange={onStateChange} opts={opts} videoId={videoId}/>
                </div>
                <div>
                    <div className={Classes.rightSessionTitle}>{"In this video:"}</div>
                    <div className={Classes.rightDiv} ref={containerRef}>

                        {parsedSubtitle.map((item) => {
                            // return a string with the format time: text inside a span
                            return (
                                <div
                                    className={pastSecond === item.seconds ? Classes.linkSelected : Classes.link}
                                    key={item.seconds}
                                    onClick={() => onPlayVideo(item.seconds)}
                                    ref={el => elementRefs.current[item.seconds] = el}
                                >
                                    <span className={Classes.underline}>{secondsToTimestamp(item.seconds)}</span> {item.text} <br/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

/*
PropTypes for the component
 */
YouTubeVideoPlayer.propTypes = {
    subtitle: PropTypes.arrayOf(PropTypes.shape({
        startTimeString: PropTypes.string,
        endTimeString: PropTypes.string,
        text: PropTypes.string
    })),
    videoId: PropTypes.string.isRequired
};

export default YouTubeVideoPlayer;
