import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const YoutubePlaylist = ({ playListIds }) => {
    let videos = playListIds;

    if (videos.length < 1)
    {
        return null;
    }

    function createCarouselItems(videos){
        let carouselRows = []; 

        var numRows = Math.ceil(videos.length / 3);
        var rowIndex;
        for (rowIndex = 0; rowIndex < numRows; rowIndex++) {
            let carouselItems = [];

            var itemIndex;
            var maxPerRow = 3;
            for (itemIndex = rowIndex * 3; itemIndex < videos.length; itemIndex++) {
                if (maxPerRow == 0)
                {
                    break;
                }
                carouselItems.push(
                    <div className="col-4 float-left">
                    <iframe title={itemIndex} src={'https://www.youtube-nocookie.com/embed/' + videos[itemIndex] + '?rel=0'} className="embedVideo-iframe" allowFullScreen=""></iframe>
                    </div>
                );
                maxPerRow--;
            }
         
            var active = "";
            if (rowIndex == 0)
            {
                active = "active";
            }

            carouselRows.push(
                <div className={"carousel-item row no-gutters " + active}>
                    {carouselItems}
                </div>
            )
        }
        return carouselRows
    }

    //TODO: Add jquery script tags into gatsby.. as it's not picking them up
    return (
        <div className="container text-center my-3">
            <Helmet>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"></link>
            </Helmet>
            <div id="youtubePlaylistCarousel" className="carousel slide w-100" data-ride="carousel">
                {createCarouselItems(videos)}
                <a className="carousel-control-prev" href="#youtubePlaylistCarousel" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#youtubePlaylistCarousel" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossOrigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossOrigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossOrigin="anonymous"></script>
        </div>
    );
};

YoutubePlaylist.propTypes = {
    playListIds: PropTypes.array.isRequired,
};

export default YoutubePlaylist;