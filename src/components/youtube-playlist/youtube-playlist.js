import { Helmet } from 'react-helmet';
import React, { useState, useEffect } from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import PropTypes from 'prop-types';
import Icon from '../../images/branding/icon.png';
import Player from 'react-lazy-youtube';

const YoutubePlaylist = ({ youtubePlayListId }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButtons, setShowButtons] = useState(true);

  var numVideosDesktop = 0;
  var numVideosTablet = 0;

  const nextSlide = () => setCurrentSlide(currentSlide + 1);
  const previousSlide = () => setCurrentSlide(currentSlide - 1);

  const PLAYING = 1;
  const HideShowArrows = e => {
    if (e.data == PLAYING) {
      setShowButtons(false);
    } else {
      setShowButtons(true);
    }
  };

  const getVideosElements = () => {
    return items.map(item => (
      <div
        key={item.contentDetails.videoId + 1}
        className="gatsby-resp-iframe-wrapper"
      >
        <div className="embedVideo-container">
          {typeof window !== 'undefined' && (
            <Player
              id={item.contentDetails.videoId}
              imageSize="mqdefault"
              className={'embedVideo-iframe'}
              onStateChange={HideShowArrows}
              styles={{
                width: '321px',
                height: '180px',
              }}
            />
          )}
        </div>
      </div>
    ));
  };

  const getVideosElementsWithSeparator = () => {
    if (items.length === 1) {
      return getVideosElements();
    } else {
      return [
        ...getVideosElements(),
        <div key="0" className="m-auto">
          <img alt={'Separator'} src={Icon} width="96px" />
        </div>,
      ];
    }
  };

  useEffect(() => {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (youtubePlayListId == '') {
      return null;
    }

    fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=10&playlistId=${youtubePlayListId}&key=${youtubeApiKey}`
    )
      .then(res => res.json())
      .then(
        result => {
          setIsLoaded(true);
          setItems(result.items);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return null;
  } else if (!isLoaded) {
    return <div></div>;
  } else if (items == null) {
    return null;
  } else {
    if (items.length >= 3) {
      numVideosDesktop = 3;
      numVideosTablet = 2;
    } else if (items.length == 2) {
      numVideosDesktop = 2;
      numVideosTablet = 2;
    } else {
      numVideosDesktop = 1;
      numVideosTablet = 1;
    }

    return (
      <div className="youtube-playlist clearfix">
        <div>
          <h2 className="inline">Videos</h2>&nbsp;(
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.youtube.com/playlist?list=${youtubePlayListId}`}
          >
            View All
          </a>
          )
        </div>
        <div className="container">
          <Helmet
            style={[
              {
                cssText: `
              .BrainhubCarousel__arrows{
                padding: 17px;
                background-color: #CC4141;
              }

              .BrainhubCarousel__arrows:hover{
                background-color: #CC4141;
              }

              .BrainhubCarousel__arrows:hover:enabled{
                background-color:#CC4141
              }
              
            `,
              },
            ]}
          />
          <Carousel
            value={currentSlide}
            slidesPerPage={numVideosDesktop}
            slidesPerScroll={numVideosDesktop}
            infinite
            breakpoints={{
              768: {
                slidesPerPage: 1,
                slidesPerScroll: 1,
              },
              1280: {
                slidesPerPage: numVideosTablet,
                slidesPerScroll: numVideosTablet,
              },
            }}
            slides={getVideosElementsWithSeparator()}
          />
          {items.length > 1 && (
            <>
              <div
                className={`youtube-playlist-arrows arrow-previous clearfix ${(items.length <=
                numVideosTablet
                  ? 'md:hidden '
                  : '') +
                  (items.length <= numVideosDesktop ? 'xl:hidden ' : '') +
                  (showButtons ? 'show-button' : 'hide-button')}`}
              >
                <button
                  className="BrainhubCarousel__arrows BrainhubCarousel__arrowLeft"
                  onClick={previousSlide}
                >
                  <span>pre</span>
                </button>
              </div>
              <div
                className={`youtube-playlist-arrows arrow-next clearfix ${(items.length <=
                numVideosTablet
                  ? 'md:hidden '
                  : '') +
                  (items.length <= numVideosDesktop ? 'xl:hidden ' : '') +
                  (showButtons ? 'show-button' : 'hide-button')}`}
              >
                <button
                  className="BrainhubCarousel__arrows BrainhubCarousel__arrowRight"
                  onClick={nextSlide}
                >
                  <span>next</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

YoutubePlaylist.propTypes = {
  youtubePlayListId: PropTypes.string.isRequired,
};

export default YoutubePlaylist;
