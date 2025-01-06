import React, { useState, useEffect, useRef } from 'react';
import PlayIcon from '-!svg-react-loader!../../images/SSWPlay2x.svg';
import PauseIcon from '-!svg-react-loader!../../images/SSWPause2x.svg';
import lottie from 'lottie-web';
import animation from '../../animations/lf30_editor_DirdRw.json';
import PropTypes from 'prop-types';

const PlayAudio = ({ hasAnimation, audioSrc }) => {
  const animationContainer = useRef(null);
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverAudio, setHoverAudio] = useState(false);

  const playAudio = () => {
    const audio = audioRef.current;
    setIsPlaying(true);
    audio.src = audioSrc;
    audio.play();
    if (hasAnimation) {
      lottie.play();
    }
  };
  const pauseAudio = () => {
    const audio = audioRef.current;
    setIsPlaying(false);
    audio.pause();
    if (hasAnimation) {
      lottie.stop();
    }
  };

  const handleClick = (e) => {
    if (!isPlaying) {
      playAudio();
    } else {
      pauseAudio();
    }
    // outside click
    e.preventDefault();
  };

  useEffect(() => {
    const audio = audioRef.current;

    // Handle audio playback ending
    audio.onended = () => {
      setIsPlaying(false);
      if (hasAnimation) {
        lottie.stop();
      }
    };

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
  }, [hasAnimation]);

  return (
    <>
      {hasAnimation ? (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className="cursor-pointer flex mr-1 ml-1 bg-grey-translucent h-30px print-hidden"
          onMouseEnter={() => {
            setHoverAudio(true);
          }}
          onMouseLeave={() => {
            setHoverAudio(false);
          }}
          onClick={(e) => handleClick(e)}
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
          <div className="overflow-hidden relative h-30px w-70pc">
            <div
              ref={animationContainer}
              className={'absolute'}
              style={{ top: '-48px' }}
            ></div>
          </div>
        </div>
      ) : (
        <div
          className={
            'absolute top-0 right-0 p-2 h-30px' +
            (hoverAudio ? ' hovered' : ' bg-grey-translucent')
          }
          role="button"
          tabIndex="0"
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
