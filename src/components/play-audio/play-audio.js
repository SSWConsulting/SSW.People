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

  const playAudio = () => {
    setIsPlaying(true);
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

  const handleClick = e => {
    if (!isPlaying) {
      playAudio();
    } else {
      pauseAudio();
    }
    // outside click
    e.preventDefault();
  };

  audio.onended = () => {
    setIsPlaying(false);
    if (hasAnimation) {
      lottie.stop();
    }
  };

  useEffect(() => {
    setAudio(new Audio(audioSrc));

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

  return (
    <>
      {hasAnimation ? (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          style={{ height: '30px' }}
          className={'cursor-pointer flex mr-1 ml-1 audio-div-dark-translucent'}
          onMouseEnter={() => {
            setHoverAudio(true);
          }}
          onMouseLeave={() => {
            setHoverAudio(false);
          }}
          onClick={e => handleClick(e)}
          onKeyPress={handleClick}
        >
          <div className={'pt-2 pl-2' + (hoverAudio ? ' hovered' : '')}>
            {!isPlaying && (
              <PlayIcon aria-label="play audio" className={'mr-2'} />
            )}
            {isPlaying && (
              <PauseIcon aria-label="pause audio" className={'mr-2'} />
            )}
          </div>
          <div
            className={'overflow-hidden relative'}
            style={{ height: '30px', width: '70%' }}
          >
            <div
              ref={animationContainer}
              className={'absolute'}
              style={{ top: '-48px' }}
            ></div>
          </div>
        </div>
      ) : (
        <div
          style={{ height: '30px' }}
          className={
            'absolute top-0 right-0 p-2' +
            (hoverAudio ? ' hovered' : ' audio-div-dark-translucent')
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
