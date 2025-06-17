# Project Template

Copy this template to `/src/content/projects/your-project-name.md` to add a new project:

```markdown
---
title: "Your Project Title"
shortDescription: "Brief description that appears on project cards (1-2 sentences)"
date: "2024-01-15" # YYYY-MM-DD format
technologies: ["React", "Node.js", "PostgreSQL", "Docker"] # Array of tech stack
featured: true # true = shows on homepage, false = only on projects page
status: "completed" # "completed", "in-progress", or "planned"
image: "/images/projects/your-project.jpg" # Optional: path to project screenshot
imageAlt: "Screenshot description for accessibility" # Optional: alt text for image
githubUrl: "https://github.com/username/repo" # Optional: GitHub repository
liveUrl: "https://yourproject.com" # Optional: live website
demoUrl: "https://demo.yourproject.com" # Optional: demo version
links: # Optional: additional links
  - label: "Documentation"
    url: "https://docs.yourproject.com"
    type: "docs"
  - label: "Blog Post"
    url: "https://blog.com/post"
    type: "other"
category: "web" # "web", "mobile", "desktop", "api", "library", or "other"
priority: 1 # Lower numbers appear first (1 = highest priority)
---

# Your Project Name

Write your detailed project description here using **markdown**. This content will appear on the individual project page.

## Features

- Feature 1
- Feature 2
- Feature 3

## Technical Details

Describe the technical implementation, challenges solved, architecture decisions, etc.

## Results

Share metrics, user feedback, lessons learned, or impact of the project.

You can include:

- **Bold text**
- `code snippets`
- [Links](https://example.com)
- Images: ![Description](path/to/image.jpg)
- Lists and more!
```

## Quick Tips:

1. **File naming**: Use kebab-case for the filename (e.g., `my-awesome-project.md`)
2. **Featured projects**: Set `featured: true` for projects you want on the homepage (limit to 3-4)
3. **Priority**: Use 1-10 where 1 is highest priority (appears first)
4. **Images**: Place images in `/public/images/projects/` folder
5. **Status badges**: Use "in-progress" or "planned" to show work-in-progress projects
6. **Categories**: Choose the most appropriate category for organization

The system will automatically:

- Generate the project page at `/projects/your-project-name`
- Add it to the projects listing
- Show it on homepage if featured
- Sort by priority and date
- Handle all the styling and responsive design
