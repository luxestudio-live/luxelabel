"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-serif font-light mb-2 tracking-tight">
          Send us a message
        </h2>
        <div className="w-12 h-[1px] bg-foreground/20 mb-6" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="fullName" className="text-sm font-medium text-foreground/80">
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your Name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="h-12 bg-background border border-border/60 hover:border-border transition-all duration-300 focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
            required
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className="h-12 bg-background border border-border/60 hover:border-border transition-all duration-300 focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
            required
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="subject" className="text-sm font-medium text-foreground/80">
            Subject
          </Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            placeholder="Inquiry Subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="h-12 bg-background border border-border/60 hover:border-border transition-all duration-300 focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
            required
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="message" className="text-sm font-medium text-foreground/80">
            Your Message
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="How can we assist you?"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className="bg-background border border-border/60 hover:border-border transition-all duration-300 focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20 resize-none"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-[1.02] font-medium"
        >
          Send Message
        </Button>
      </form>
    </div>
  )
}