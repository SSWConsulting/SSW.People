import { Helmet } from 'react-helmet';
import React, { useState, useEffect } from 'react';
import Carousel, {
  slidesToShowPlugin,
  slidesToScrollPlugin,
} from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import PropTypes from 'prop-types';
import Icon from '../../images/branding/icon.png';
import Player from 'react-lazy-youtube';

const YoutubePlaylist = ({ youtubePlayListId, playlistItems }) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  var numVideosDesktop = 0;
  var numVideosTablet = 0;

  useEffect(() => {
    if (playlistItems && playlistItems.length > 0) {
      setItems(playlistItems);
      setIsLoaded(true);
    }
  }, [playlistItems]);

  const getVideosElements = () => {
    return items.map((videoId) => (
      <div
        key={videoId}
        className="gatsby-resp-iframe-wrapper"
        style={{ padding: '0 10px' }}
      >
        <div className="embedVideo-container">
          {typeof window !== 'undefined' && (
            <Player
              id={videoId}
              imageSize="mqdefault"
              className={'embedVideo-iframe'}
              styles={{
                width: '300px',
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

  if (!isLoaded) {
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

    const slidesPerPage = (slideAmount) => {
      return {
        resolve: slidesToShowPlugin,
        options: {
          numberOfSlides: slideAmount,
        },
      };
    };

    const slidesPerScroll = (slideScrollAmount) => {
      return {
        resolve: slidesToScrollPlugin,
        options: {
          numberOfSlides: slideScrollAmount,
        },
      };
    };

    const renderArrows = () => {
      return items.length > 1 ? ['arrows'] : [];
    };

    return (
      <div className="youtube-playlist clearfix">
        <div>
          <h2 className="inline">Videos</h2>
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

              .BrainhubCarousel__trackContainer{
                margin-left: 10px;
                margin-right: 10px;
              }
            `,
              },
            ]}
          />

          <Carousel
            plugins={[
              'infinite',
              ...renderArrows(),
              slidesPerPage(numVideosDesktop),
              slidesPerScroll(numVideosDesktop),
            ]}
            slides={getVideosElementsWithSeparator()}
            breakpoints={{
              768: {
                plugins: [
                  'infinite',
                  ...renderArrows(),
                  slidesPerPage(1),
                  slidesPerScroll(1),
                ],
              },
              1280: {
                plugins: [
                  'infinite',
                  ...renderArrows(),
                  slidesPerPage(numVideosTablet),
                  slidesPerScroll(numVideosTablet),
                ],
              },
            }}
          />
          <a
            className="flex w-full justify-center text-center top-2 pt-4 text-ssw-red hover:text-black"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.youtube.com/playlist?list=${youtubePlayListId}`}
          >
            View all
          </a>
        </div>
      </div>
    );
  }
};

YoutubePlaylist.propTypes = {
  youtubePlayListId: PropTypes.string.isRequired,
  playlistItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default YoutubePlaylist;
