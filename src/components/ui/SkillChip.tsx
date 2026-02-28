export default function SkillChip({ name }: { name: string }) {
  return (
    <span className="px-3 py-1.5 text-sm text-white/70 bg-white/5 border border-white/10 rounded-full hover:border-sky-500/40 hover:text-sky-300 transition-colors duration-200">
      {name}
    </span>
  )
}
