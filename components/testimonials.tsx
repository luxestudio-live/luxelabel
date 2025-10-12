"use client"

import { Star } from "lucide-react"

interface Testimonial {
  name: string
  rating: number
  comment: string
  date: string
  location?: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  className?: string
}

export function Testimonials({ testimonials, className = "" }: TestimonialsProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hear from our valued customers who have experienced the luxury and quality of Luxxe Labels
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div 
            key={`testimonial-${testimonial.name}-${index}`} 
            className="bg-card p-6 rounded-lg border hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={`${testimonial.name}-star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <p className="text-muted-foreground mb-4 italic">
              "{testimonial.comment}"
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{testimonial.name}</p>
                {testimonial.location && (
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{testimonial.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}