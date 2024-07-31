import React from "react";
import SkillCard from "./SkillCard";
import skills from "../data/skill.json";

function createSkill(skill){
    return (
        <SkillCard
            key={skill.id}
            img={skill.image}
            alt={skill.Alt}
            txt={skill.text}
        />
    );
}

function Skills(){
    return (
        <div className="Skills">
            {skills.map(skill => createSkill(skill))}
        </div>
    );
}

export default Skills;
