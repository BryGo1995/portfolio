'use client'

import dynamic from 'next/dynamic'

const HeroCanvas = dynamic(() => import('@/components/ui/HeroCanvas'), { ssr: false })

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroCanvas />
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">
          Fullstack &amp; Game Developer
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Bryan Gonzales
        </h1>
        <p className="text-white/60 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          I build web applications and games — from interactive UIs to 3D renderers.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-white/20 hover:border-white/40 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </section>
  )
}
