'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">About</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">A bit about me</h2>
        <div className="max-w-2xl space-y-4 text-white/60 text-base leading-relaxed">
          <p>
            Replace this with your actual bio. Talk about your background, what drives you,
            and what kind of problems you love solving.
          </p>
          <p>
            Mention your game dev experience with Godot, Love2D, and OpenGL/C++ here.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
