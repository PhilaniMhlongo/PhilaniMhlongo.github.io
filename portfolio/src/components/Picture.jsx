import React from "react";
import PropTypes from "prop-types";

function Picture({ img, alt, txt }){
    return (
        <div className="Picture">
            <img src={img} alt={alt} />
            <p>{txt}</p>
        </div>
    );
}

Picture.propTypes = {
    img: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    txt: PropTypes.string.isRequired
};

export default Picture;