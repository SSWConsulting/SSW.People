import { Helmet } from 'react-helmet';
import React, { Component } from 'react';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import PropTypes from 'prop-types';

export default class YoutubePlaylist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
          };
    }

    componentDidMount() {
        const youtubeApiKey = process.env.YOUTUBE_API_KEY;
        const youtubePlayListId = this.props.youtubePlayListId;

        if (youtubePlayListId == '') {
            return null;
        }

        fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId='
                + youtubePlayListId + '&key=' + youtubeApiKey)
          .then(res => res.json())
          .then(
            result => {
              this.setState({
                isLoaded: true,
                items: result.items,
              });
            },
            error => {
              this.setState({
                isLoaded: true,
                error,
              });
            }
          )
      }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div></div>;
        } else {
            return (
                <div className="container text-center my-3">
                    <Helmet
                        style={[{
                            'cssText': `
                            .BrainhubCarousel__arrows{
                                    background-color: #CC4141;
                            }

                            .BrainhubCarousel__arrows:hover{
                                    background-color: #CC4141;
                            }

                            .BrainhubCarousel__arrows:hover:enabled{
                                    background-color:#CC4141
                                }
                            `
                        }]}
                    />
                    <Carousel
                        slidesPerPage={3}
                        slidesPerScroll={3}
                        arrows
                        infinite
                    >
                        {items.map(item => (
                            <iframe key={item.contentDetails.videoId} title='1' 
                                src={'https://www.youtube-nocookie.com/embed/' + item.contentDetails.videoId + '?rel=0'}
                                className="embedVideo-iframe" allowFullScreen="allowfullscreen" frameBorder="0">
                            </iframe>
                        ))}
                    </Carousel>
                </div>
            );
        }
    }
}

YoutubePlaylist.propTypes = {
    youtubePlayListId: PropTypes.string.isRequired,
};