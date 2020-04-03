import { Helmet } from 'react-helmet';
import React, { useState, useEffect } from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import PropTypes from 'prop-types';

const YoutubePlaylist = ({ youtubePlayListId }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (youtubePlayListId == '') {
      return null;
    }

    fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${youtubePlayListId}&key=${youtubeApiKey}`
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
      <div className="container text-center my-3">
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
        <Carousel slidesPerPage={3} slidesPerScroll={3} arrows infinite>
          {items.map(item => (
            <iframe
              key={item.contentDetails.videoId}
              title="1"
              src={`https://www.youtube-nocookie.com/embed/${item.contentDetails.videoId}?rel=0`}
              className="embedVideo-iframe"
              allowFullScreen="allowfullscreen"
              frameBorder="0"
            ></iframe>
          ))}
        </Carousel>
      </div>
    );
  }
};

YoutubePlaylist.propTypes = {
  youtubePlayListId: PropTypes.string.isRequired,
};

export default YoutubePlaylist;
