import { Helmet } from 'react-helmet';
import React, { useState, useEffect } from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import PropTypes from 'prop-types';

const YoutubePlaylist = ({ youtubePlayListId }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide(currentSlide + 1);
  const previousSlide = () => setCurrentSlide(currentSlide - 1);

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
    return (
      <div className="youtube-playlist container">
        <Helmet
          style={[
            {
              cssText: `
              .BrainhubCarousel__arrows{
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
          slidesPerPage={3}
          slidesPerScroll={3}
          infinite
          breakpoints={{
            770: {
              slidesPerPage: 1,
              slidesPerScroll: 1,
            },
            1290: {
              slidesPerPage: 2,
              slidesPerScroll: 2,
            },
          }}
        >
          {items.map(item => (
            <div
              key={item.contentDetails.videoId + 1}
              className="gatsby-resp-iframe-wrapper"
            >
              <div className="embedVideo-container">
                <iframe
                  key={item.contentDetails.videoId}
                  title="1"
                  src={`https://www.youtube-nocookie.com/embed/${item.contentDetails.videoId}?rel=0`}
                  allowFullScreen="allowfullscreen"
                  frameBorder="0"
                  width="321"
                  height="180"
                  className="embedVideo-iframe"
                ></iframe>
              </div>
            </div>
          ))}
        </Carousel>
        <div className="youtube-playlist-arrows">
          <button
            className="BrainhubCarousel__arrows BrainhubCarousel__arrowLeft"
            onClick={previousSlide}
          >
            <span>pre</span>
          </button>
          <button
            className="BrainhubCarousel__arrows BrainhubCarousel__arrowRight"
            onClick={nextSlide}
          >
            <span>next</span>
          </button>
        </div>
      </div>
    );
  }
};

YoutubePlaylist.propTypes = {
  youtubePlayListId: PropTypes.string.isRequired,
};

export default YoutubePlaylist;
