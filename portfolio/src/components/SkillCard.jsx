import React from "react";
import PropTypes from "prop-types";
import Picture from "./Picture"

function SkillCard(props){
    return (
        <div className="SkillCard">
        <Picture img={props.img} alt={props.alt} txt={props.txt}/>

        </div>

    );
}


SkillCard.propTypes = {
    img: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    txt: PropTypes.string.isRequired
};

export default SkillCard;
