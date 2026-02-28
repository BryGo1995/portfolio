'use client'

import { motion } from 'framer-motion'
import { skills } from '@/content/skills'
import SkillChip from '@/components/ui/SkillChip'
import type { SkillCategory } from '@/lib/types'

const categories: SkillCategory[] = ['Frontend', 'Backend', 'Game Dev', 'Languages']

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">Skills</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">What I work with</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category)
            if (categorySkills.length === 0) return null
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <SkillChip key={skill.name} name={skill.name} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
