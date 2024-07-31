const about = {
  title: "Philani Mhlongo",
  description:
    "I am  an aspiring software developer with a passion for crafting efficient and creative solutions. With a solid foundation in various programming languages and a keen interest in learning new technologies, I'm eager to embark on a journey in the tech industry. My goal is to secure a junior position in software development where I can contribute, grow, and refine my skills. Explore my portfolio to see my projects and learn more about my journey!",
  github: "https://github.com/PhilaniMhlongo/",
  linkedin: "https://www.linkedin.com/in/philani-mhlongo-720382131/",
  cv: "#",
};

const projects = {
  title: "Projects",
  personalProjects: [
    {
      title: "Typing Tutorial Program",
      short:
        "Features  GUI and concurrency.",
      description:
        "This interactive typing tutorial program is designed to improve users' typing speed and accuracy. Developed using Java, the program leverages concurrency and a graphical user interface to create an engaging experience. The game features falling words that users must type as quickly and accurately as possible before they reach the bottom of the screen. The program tracks and displays real-time progress, including words typed correctly, speed, and accuracy. It's an excellent tool for anyone looking to enhance their typing skills in a fun and challenging way.",
      technologies: ["#Java"],
      github: "#",
      demo: "#",
    },
    {
      title: "React Blog",
      short:
        "Features Category filtering, Search, and Commenting",
      description:
        "This dynamic blog platform was developed using React, offering a sleek and responsive user experience. The blog allows users to easily browse and read posts, with features like category filtering, search functionality, and comment sections. It also includes an intuitive content management system for creating and editing posts, making it simple for administrators to manage content. The application leverages React's powerful component-based architecture, ensuring smooth navigation and efficient data handling. This project showcases modern web development techniques and highlights the potential of React in building interactive and user-friendly web applications.",
      technologies: ["#React.js"],
      github: "#",
      demo: "#",
    },
    {
      title: "Online Store",
      short:
        "Features categorization, search functionality, and secure checkout processes",
      description:
        "This Online Store is a comprehensive e-commerce platform designed for a seamless shopping experience. Built with a modern tech stack, it features a user-friendly interface, product categorization, search functionality, and secure checkout processes. Customers can browse products, view detailed descriptions, add items to their cart, and complete purchases with ease. The store also includes an administrative dashboard for managing inventory, orders, and customer information. With a focus on performance and usability, this project highlights the potential of technology in creating efficient and engaging online shopping experiences.",
      technologies: [
        "#React.js",
        "#Node.js",
        "#MongoDB",
      ],
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
      company: "WTC_",
      duration: "Sep 2023 - Present",
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
      skills: [
        "#HTML",
        "#CSS",
        "#JavaScript",
        "#Java",
        "#React.js",

      ],
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
