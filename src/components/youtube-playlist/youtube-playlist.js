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

  useEffect(() => {
    if (playlistItems?.length) {
      setItems(playlistItems);
    }
  }, [playlistItems]);

  if (!items.length) return null;

  const getVideoCounts = (length) => {
    if (length >= 3) return { desktop: 3, tablet: 2 };
    if (length === 2) return { desktop: 2, tablet: 2 };
    return { desktop: 1, tablet: 1 };
  };

  const { desktop: numVideosDesktop, tablet: numVideosTablet } = getVideoCounts(
    items.length
  );

  const renderVideoElements = () => {
    const videoElements = items.map((videoId) => (
      <div
        key={videoId}
        className="gatsby-resp-iframe-wrapper"
        style={{ padding: '0 10px' }}
      >
        <div className="embedVideo-container">
          <Player
            id={videoId}
            imageSize="mqdefault"
            className="embedVideo-iframe"
            styles={{
              width: '300px',
              height: '180px',
            }}
          />
        </div>
      </div>
    ));

    if (items.length > 1) {
      videoElements.push(
        <div key="separator" className="m-auto">
          <img alt="Separator" src={Icon} width="96px" />
        </div>
      );
    }

    return videoElements;
  };

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
          slides={renderVideoElements()}
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
};

YoutubePlaylist.propTypes = {
  youtubePlayListId: PropTypes.string.isRequired,
  playlistItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default YoutubePlaylist;
