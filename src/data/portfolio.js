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
      technologies: ["#React.js"],
      github: "#",
      demo: "#",
    },
    {
      title: "Simple Flutter Alphabet Book App",
      short:
        "Educational mobile app helping toddlers learn the alphabet through interactive features.",
      description:
        "This Online Store is a comprehensive e-commerce platform designed for a seamless shopping experience. Built with a modern tech stack, it features a user-friendly interface, product categorization, search functionality, and secure checkout processes. Customers can browse products, view detailed descriptions, add items to their cart, and complete purchases with ease. The store also includes an administrative dashboard for managing inventory, orders, and customer information. With a focus on performance and usability, this project highlights the potential of technology in creating efficient and engaging online shopping experiences.",
      technologies: ["#React.js", "#Node.js", "#MongoDB"],
      github: "#",
      demo: "#",
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
        "I have been actively honing my skills in software development through various projects and coursework. My hands-on experience includes developing applications like a React-based blog and an interactive typing tutorial program using Java. These projects have provided me with a solid foundation in programming languages, frameworks, and software development principles",
    },
  ],
};

const skills = {
  title: "Skills",
  mySkills: [
    {
      title: "Languages & Frameworks",
      skills: ["#HTML", "#CSS", "#JavaScript", "#Java", "#React.js"],
    },
    {
      title: "Databases",
      skills: ["#MongoDB", "#PostgreSQL"],
    },
    {
      title: "Others",
      skills: ["#Git", "#Docker", "#CI/CD"],
    },
  ],
};

export { about, projects, experience, skills };
