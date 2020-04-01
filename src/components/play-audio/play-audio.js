import React, { useState, useEffect, createRef } from 'react';
import PlayIcon from '-!svg-react-loader!../../images/SSWPlay2x.svg';
import PauseIcon from '-!svg-react-loader!../../images/SSWPause2x.svg';
import lottie from 'lottie-web';
import animation from '../../animations/lf30_editor_DirdRw.json';
import PropTypes from 'prop-types';

const PlayAudio = ({ hasAnimation, audioSrc }) => {
  const animationContainer = createRef();
  const [audio, setAudio] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverAudio, setHoverAudio] = useState(false);

  useEffect(() => {
    setAudio(new Audio());
    if (hasAnimation) {
      lottie.loadAnimation({
        container: animationContainer.current,
        render: 'svg',
        loop: true,
        animationData: animation,
      });
      lottie.stop();
      return () => lottie.destroy();
    }
  }, []);

  const playAudio = () => {
    setIsPlaying(true);
    audio.src = audioSrc;
    audio.play();
    if (hasAnimation) {
      lottie.play();
    }
  };
  const pauseAudio = () => {
    setIsPlaying(false);
    audio.pause();
    if (hasAnimation) {
      lottie.stop();
    }
  };

  audio.onended = () => {
    setIsPlaying(false);
    if (hasAnimation) {
      lottie.stop();
    }
  };

  return (
    <>
      {hasAnimation ? (
        <div className={'pt-1 pl-2 flex'}>
          {!isPlaying && (
            <PlayIcon
              aria-label="play audio"
              className={'cursor-pointer mr-2'}
              onClick={() => {
                playAudio();
              }}
            />
          )}
          {isPlaying && (
            <PauseIcon
              aria-label="pause audio"
              className={'cursor-pointer mr-2'}
              onClick={() => {
                pauseAudio();
              }}
            />
          )}
          <div
            className={'overflow-hidden relative'}
            style={{ height: '20px', width: '70%' }}
          >
            <div
              ref={animationContainer}
              className={'absolute'}
              style={{ top: '-54px' }}
            ></div>
          </div>
        </div>
      ) : (
        <div
          className={
            hoverAudio
              ? 'absolute top-0 right-0 p-2 hovered'
              : 'absolute top-0 right-0 p-2 audio-div-dark-translucent'
          }
          onMouseEnter={() => {
            setHoverAudio(true);
          }}
          onMouseLeave={() => {
            setHoverAudio(false);
          }}
        >
          {!isPlaying && (
            <PlayIcon
              aria-label="play audio"
              className={'cursor-pointer h-3'}
              onClick={() => {
                playAudio();
              }}
            />
          )}
          {isPlaying && (
            <PauseIcon
              aria-label="pause audio"
              className={'cursor-pointer h-3'}
              onClick={() => {
                pauseAudio();
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

PlayAudio.propTypes = {
  hasAnimation: PropTypes.bool.isRequired,
  audioSrc: PropTypes.string.isRequired,
};

export default PlayAudio;
