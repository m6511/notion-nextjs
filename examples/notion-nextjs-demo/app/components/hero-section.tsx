import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star } from 'lucide-react'
import { CodeBlock } from './code-block'

interface HeroSectionProps {
  code: string
}

export function HeroSection({ code }: HeroSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div>
          <Badge variant="outline" className="mb-6">
            Open Source
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Notion as CMS for Next.js
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Transform your Notion pages into a powerful, type-safe content management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/docs" className="flex items-center gap-2">
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link 
                href="https://github.com/m6511/notion-nextjs" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-primary" />
              <span>3.7k</span>
            </div>
            <span>•</span>
            <span>Used by 10k+ projects</span>
          </div>
        </div>

        {/* Right Column - Code Example */}
        <div className="lg:pl-8">
          <CodeBlock 
            code={code}
            filename="types/blog.ts"
          />
        </div>
      </div>
    </section>
  )
}