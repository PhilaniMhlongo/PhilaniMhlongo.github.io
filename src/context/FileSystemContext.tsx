export interface FileSystemItem {
  name: string
  type: "file" | "directory"
  contentPath?: string
  extension?: string
  description?: string
  children?: FileSystemItem[]
}

export const fileSystem: FileSystemItem[] = [
  {
    name: "projects",
    type: "directory",
    description: "A showcase of my recent work.",
    children: [
      {
        name: "terminal-portfolio",
        type: "directory",
        description: "This interactive web-based terminal portfolio.",
        children: [
          {
            name: "readme.md",
            type: "file",
            extension: "md",
            contentPath: "/content/projects/terminal-portfolio/readme.md",
          },

        ],
      },
      
    ],
  },
  {
    name: "blog",
    type: "directory",
    description: "My thoughts and tutorials on DevOps, cloud, and software engineering.",
    children: [
      {
        name: "welcome.md",
        type: "file",
        extension: "md",
        contentPath: "/content/blog/welcome.md",
      },

   
    ],
  },
  {
    name: "education",
    type: "directory",
    description: "Academic background and certifications",
    children: [
      {
        name: "university.md",
        type: "file",
        extension: "md",
        contentPath: "/content/education/university.md",
      },
    ],
  },
  {
    name: "skills",
    type: "directory",
    description: "Technical skills and expertise",
    children: [
      {
        name: "devops-stack.json",
        type: "file",
        extension: "json",
        contentPath: "/content/skills/devops-stack.json",
      },
    ],
  },
  {
    name: "about.md",
    type: "file",
    extension: "md",
    contentPath: "/content/about.md",
  },
]

