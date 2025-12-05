export interface ProjectItem {
  name: string;
  description: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  highlights: ProjectItem[];
}

export interface Skill {
  name: string;
}