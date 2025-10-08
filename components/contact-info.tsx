"use client"

import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-serif font-light mb-2 tracking-tight">
          Direct Contact Information
        </h2>
        <div className="w-12 h-[1px] bg-foreground/20 mb-6" />
      </div>

      <div className="space-y-8">
        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 border border-border/40 shrink-0">
            <MapPin className="h-5 w-5 text-foreground/70" />
          </div>
          <div className="pt-2">
            <h3 className="font-semibold text-foreground mb-2 text-base">Address:</h3>
            <p className="text-muted-foreground leading-relaxed">
              123 Elegance XYZ Street<br />
              Mumbai, India
            </p>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 border border-border/40 shrink-0">
            <Phone className="h-5 w-5 text-foreground/70" />
          </div>
          <div className="pt-2">
            <h3 className="font-semibold text-foreground mb-2 text-base">Phone:</h3>
            <p className="text-muted-foreground">
              +91 2 23 45 67 89
            </p>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 border border-border/40 shrink-0">
            <Mail className="h-5 w-5 text-foreground/70" />
          </div>
          <div className="pt-2">
            <h3 className="font-semibold text-foreground mb-2 text-base">Email:</h3>
            <p className="text-muted-foreground">
              contact@luxxelabels.com
            </p>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 border border-border/40 shrink-0">
            <Clock className="h-5 w-5 text-foreground/70" />
          </div>
          <div className="pt-2">
            <h3 className="font-semibold text-foreground mb-2 text-base">Office Hours:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Mon-Fri: 9:00 AM - 6:00 PM IST
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border/40">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Our team is dedicated to providing you with the finest service. We look forward to hearing from you.
        </p>
      </div>
    </div>
  )
}