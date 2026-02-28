import Link from 'next/link'
import type { Project } from '@/lib/types'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block p-6 bg-white/[0.03] border border-white/10 rounded-xl hover:border-sky-500/40 hover:bg-white/[0.05] transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold text-lg group-hover:text-sky-300 transition-colors duration-200">
          {project.title}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ml-3 shrink-0 ${
            project.status === 'live'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-white/5 text-white/40 border border-white/10'
          }`}
        >
          {project.status === 'live' ? 'Live' : 'In Progress'}
        </span>
      </div>
      <p className="text-white/50 text-sm leading-relaxed mb-4">{project.shortDescription}</p>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="text-xs text-sky-400/70 bg-sky-500/10 px-2 py-0.5 rounded">
            {t}
          </span>
        ))}
      </div>
    </Link>
  )
}
