export type ProjectStatus = 'live' | 'wip'

export type Project = {
  slug: string
  title: string
  shortDescription: string
  longDescription: string
  tech: string[]
  status: ProjectStatus
  github?: string
  demo?: string
  images: string[]
  hasPlayable: boolean
  embedUrl?: string
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Game Dev' | 'Languages'

export type Skill = {
  name: string
  category: SkillCategory
  icon?: string
}
