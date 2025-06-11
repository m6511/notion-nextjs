interface SectionHeaderProps {
  title: string
  description: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ title, description, centered = true, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl font-bold text-foreground mb-4">
        {title}
      </h2>
      <p className={`text-lg text-muted-foreground ${centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
        {description}
      </p>
    </div>
  )
}