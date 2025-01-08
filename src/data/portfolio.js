const about = {
  title: "Philani Mhlongo",
  description:
    "I am  an aspiring software developer with a passion for crafting efficient and creative solutions. With a solid foundation in various programming languages and a keen interest in learning new technologies, I'm eager to embark on a journey in the tech industry. My goal is to secure a junior position in software development where I can contribute, grow, and refine my skills. Explore my portfolio to see my projects and learn more about my journey!",
  github: "https://github.com/PhilaniMhlongo/",
  linkedin: "https://www.linkedin.com/in/philani-mhlongo-720382131/",
  cv: "https://raw.githubusercontent.com/PhilaniMhlongo/PhilaniMhlongo.github.io/main/src/assets/Philani_Mhlongo_CV.pdf",
};

const projects = {
  title: "Projects",
  personalProjects: [
    {
      title: "WordPress Infrastructure on AWS",
      short:
        "Highly available WordPress deployment using AWS CloudFormation with multi-AZ architecture and managed services.",
      description:
        "An end-to-end Infrastructure as Code solution for WordPress hosting includes a multi-tier VPC architecture across three availability zones with segregated subnets, auto-scaling EC2 instances behind an Application Load Balancer, managed RDS for MySQL, EFS for shared storage, comprehensive security with IAM roles and network isolation, and infrastructure automation using CloudFormation templates.",
      technologies: ["#CloudFormation", "#VPC", "#IaC", "#EC2"],
      github: "https://github.com/PhilaniMhlongo/Wordpress-Infrastructure",
      demo: "https://github.com/PhilaniMhlongo/Wordpress-Infrastructure",
    },
    {
      title: "Serverless Self-Storage Management API",
      short:
        "Cloud-native API for self-storage management using AWS serverless technologies.",
      description:
        "A serverless backend system leveraging an event-driven microservices architecture with AWS SAM features secure user authentication using Amazon Cognito, RESTful API endpoints powered by API Gateway and Lambda, and scalable data storage with DynamoDB.",
      technologies: ["#DynamoDB", "AWS-Lambda", "#Python", "#AWS SAM"],
      github: "https://github.com/PhilaniMhlongo/capstone-project",
      demo: "https://github.com/PhilaniMhlongo/capstone-project",
    },
    {
      title: "Simple Flutter Alphabet Book App",
      short:
        "Educational mobile app helping toddlers learn the alphabet through interactive features.",
      description:
        "A child-focused learning application features interactive alphabet learning for ages 2-5, audio pronunciation on tap functionality, an offline-first design for uninterrupted learning, and is built with Flutter and Dart for cross-platform compatibility",
      technologies: ["#Dart", "#Flutter"],
      github: "https://github.com/PhilaniMhlongo/An-Alphabet-Book",
      demo: "https://github.com/PhilaniMhlongo/An-Alphabet-Book",
    },
  ],
};

const experience = {
  title: "Experience",
  experiences: [
    {
      title: "Student",
      company: "Wethinkcode_",
      duration: "Sep 2023 - Dec 2024",
      description:
        "I have been actively honing my skills in software development and cloud technologies at WeThinkCode_ through various my personal project, including creating an end-to-end Infrastructure as Code solution for WordPress hosting with features such as a multi-tier VPC architecture, auto-scaling EC2 instances, managed RDS for MySQL, and infrastructure automation using CloudFormation, as well as designing a serverless backend system leveraging event-driven microservices with AWS SAM, secure user authentication via Amazon Cognito, and scalable data storage using DynamoDB, alongside developing a child-focused learning application built with Flutter and Dart, featuring interactive alphabet learning and offline-first functionality.",
    },
  ],
};

const skills = {
  title: "Skills",
  mySkills: [
    {
      title: "Languages & Frameworks",
      skills: [
        "#HTML",
        "#CSS",
        "#JavaScript",
        "#Java",
        "#React.js",
        "#Flutter",
      ],
    },
    {
      title: "Databases",
      skills: ["#DynamoDB", "#PostgreSQL"],
    },
    {
      title: "Others",
      skills: [
        "#Git",
        "#Docker",
        "#CI/CD",
        "#CloudFormation",
        "#API Gateway",
        "#IaC",
      ],
    },
  ],
};

export { about, projects, experience, skills };
