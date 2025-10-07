"use client"

import { Star, Leaf, Shield, Lightbulb, Gem, Eye } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function GuidingPrinciples() {
  const { ref, isVisible } = useScrollAnimation()

  const principles = [
    {
      icon: Star,
      title: "Excellence",
      description: "Unyielding dedication to superior quality and design in every stitch and detail."
    },
    {
      icon: Leaf,
      title: "Sustainability", 
      description: "Committed to ethical sourcing, eco-conscious practices, and responsible production."
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "Building trust through transparency, honest communications, and genuine craftsmanship."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Pushing creative boundaries while honoring traditional artistry and modern sensitivities."
    },
    {
      icon: Gem,
      title: "Timelessness",
      description: "Creating pieces that transcend fleeting trends, designed to be cherished for generations."
    },
    {
      icon: Eye,
      title: "Vision",
      description: "Shaping the future of luxury fashion with purpose, elegance, and global impact."
    }
  ]

  return (
    <section ref={ref} className="py-20 md:py-32 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 
            className={`text-4xl md:text-5xl font-serif font-light tracking-tight mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Our Guiding Principles
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {principles.map((principle, index) => {
            const IconComponent = principle.icon
            return (
              <div
                key={principle.title}
                className={`text-center space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-background shadow-lg">
                    <IconComponent className="h-8 w-8 text-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-medium">{principle.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {principle.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}