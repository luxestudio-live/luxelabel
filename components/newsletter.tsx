"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const { ref, isVisible } = useScrollAnimation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container px-4">
        <div
          className={`max-w-2xl mx-auto text-center space-y-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-balance">
            Stay Connected with LuxeLabels
          </h2>
          <p className="text-muted-foreground text-balance">
            Receive exclusive updates, styling inspiration, and special offers directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto mt-8">
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-secondary/50 border-border/50 transition-all duration-300 focus:scale-105"
            />
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 transition-all duration-300 hover:scale-105"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
