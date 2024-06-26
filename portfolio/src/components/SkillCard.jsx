import React from "react";
import PropTypes from "prop-types";

const SkillCard = ({ image, alt, text }) => (
    <div className="SkillCard">
        <img src={image} alt={alt} />
        <p>{text}</p>
    </div>
);

SkillCard.propTypes = {
    image: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default SkillCard;
