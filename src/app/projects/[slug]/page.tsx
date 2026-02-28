import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllSlugs } from '@/content/projects'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <main className="min-h-screen px-6 py-32 max-w-3xl mx-auto">
      <Link
        href="/#projects"
        className="text-sm text-white/40 hover:text-white transition-colors mb-8 inline-flex items-center gap-2"
      >
        ← Back to projects
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-4xl font-bold text-white">{project.title}</h1>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              project.status === 'live'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            {project.status === 'live' ? 'Live' : 'In Progress'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((t) => (
            <span key={t} className="text-xs text-sky-400/70 bg-sky-500/10 px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              GitHub →
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white bg-sky-500 hover:bg-sky-400 px-4 py-2 rounded-lg transition-colors"
            >
              Live Demo →
            </a>
          )}
        </div>
      </div>

      {project.hasPlayable && project.embedUrl && (
        <div className="mb-10 rounded-xl overflow-hidden border border-white/10 bg-white/5">
          <p className="text-xs text-white/30 px-4 py-2 border-b border-white/5">Playable Demo</p>
          <iframe
            src={project.embedUrl}
            className="w-full h-[500px]"
            allowFullScreen
          />
        </div>
      )}

      {project.images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-10">
          {project.images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img} alt={`${project.title} screenshot ${i + 1}`} className="rounded-lg w-full" />
          ))}
        </div>
      )}

      <div className="prose prose-invert max-w-none">
        <p className="text-white/60 leading-relaxed">{project.longDescription}</p>
      </div>
    </main>
  )
}
