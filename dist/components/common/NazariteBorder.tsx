interface NazariteBorderProps {
  className?: string
}

export function NazariteBorder({ className = "" }: NazariteBorderProps) {
  return (
    <div className={`nazarite-border-container ${className}`}>
      <div className="nazarite-border" />
    </div>
  )
}