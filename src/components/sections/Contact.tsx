'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const [state, setState] = useState<FormState>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setState(res.ok ? 'success' : 'error')
    if (res.ok) form.reset()
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-lg"
      >
        <p className="text-sky-400 text-sm font-mono tracking-widest uppercase mb-4">Contact</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in touch</h2>
        <p className="text-white/50 mb-10">
          Open to fullstack and game dev roles. Drop me a message and I&apos;ll get back to you.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Your name"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
          <input
            name="email"
            type="email"
            placeholder="Your email"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
          <textarea
            name="message"
            placeholder="Your message"
            rows={5}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            {state === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          {state === 'success' && (
            <p className="text-emerald-400 text-sm">Message sent! I&apos;ll be in touch.</p>
          )}
          {state === 'error' && (
            <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
          )}
        </form>
      </motion.div>
    </section>
  )
}
