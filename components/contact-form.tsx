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
    phone: "",
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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    try {
      const { db } = await import("../lib/firebaseClient");
      const { collection, addDoc, Timestamp } = await import("firebase/firestore");
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: Timestamp.now(),
      });
      setSubmitSuccess(true);
      setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setSubmitError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
          <Label htmlFor="phone" className="text-sm font-medium text-foreground/80">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Your Phone Number"
            value={formData.phone}
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

        {submitError && <div className="text-red-600 text-sm text-center">{submitError}</div>}
        {submitSuccess && <div className="text-green-600 text-sm text-center">Message sent successfully!</div>}

        <Button
          type="submit"
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-[1.02] font-medium"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  )
}