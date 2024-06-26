import React from "react";
import PropTypes from "prop-types";
import SkillCard from "./SkillCard";

const skills = require("../data/skill.json");

const Skills = ({ id }) => (
    <section className="Skills" id={id}>
        <h2>{skills.skillsTitle}</h2>
        <div className="SkillsList">
            {skills.List.map(({ image, Alt, text }) => (
                <SkillCard
                    image={image}
                    alt={Alt}
                    text={text}
                    key={Alt}
                />
            ))}
        </div>
    </section>
);

Skills.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Skills;
