'use client'

import { motion } from 'framer-motion'
import { projects } from '@/content/projects'
import ProjectCard from '@/components/ui/ProjectCard'

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">Projects</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Things I&apos;ve built</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
