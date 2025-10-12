"use client"

import React from "react"
import Image from "next/image"

export function FlagshipStore() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif font-light tracking-tight mb-8">
            Find Our Flagship Store
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Located in the heart of Mumbai's premier fashion district
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Map Section - Larger */}
            <div className="lg:col-span-2">
              <div className="bg-background/80 backdrop-blur-sm border border-border/40 p-6 rounded-lg h-full">
                {/* Map Grid */}
                <div className="relative h-96 bg-secondary/10 rounded-lg overflow-hidden mb-6">
                  {/* Grid lines */}
                  <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                      <div key={`grid-horizontal-${i}`} className="absolute w-full h-[1px] bg-border/20" style={{top: `${i * 10}%`}} />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <div key={`grid-vertical-${i}`} className="absolute h-full w-[1px] bg-border/20" style={{left: `${i * 10}%`}} />
                    ))}
                  </div>
                  
                  {/* Streets */}
                  <div className="absolute inset-0">
                    <div className="absolute w-full h-1 bg-border/40" style={{top: '30%'}} />
                    <div className="absolute w-full h-1 bg-border/40" style={{top: '50%'}} />
                    <div className="absolute w-full h-1 bg-border/40" style={{top: '70%'}} />
                    <div className="absolute h-full w-1 bg-border/40" style={{left: '35%'}} />
                    <div className="absolute h-full w-1 bg-border/40" style={{left: '55%'}} />
                    <div className="absolute h-full w-1 bg-border/40" style={{left: '75%'}} />
                  </div>
                  
                  {/* Store Location Marker */}
                  <div className="absolute" style={{top: '45%', left: '55%'}}>
                    <div className="relative">
                      <div className="w-8 h-8 bg-foreground rounded-full border-4 border-background shadow-lg"></div>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded text-sm font-medium whitespace-nowrap">
                        Luxxe Labels Flagship
                      </div>
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-6 border-transparent border-t-foreground"></div>
                    </div>
                  </div>
                  
                  {/* Additional Landmarks */}
                  <div className="absolute" style={{top: '20%', left: '40%'}}>
                    <div className="w-3 h-3 bg-muted-foreground/60 rounded-full"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">Fashion District</div>
                  </div>
                  
                  <div className="absolute" style={{top: '75%', left: '70%'}}>
                    <div className="w-3 h-3 bg-muted-foreground/60 rounded-full"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">Metro Station</div>
                  </div>

                  <div className="absolute" style={{top: '25%', left: '75%'}}>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">Mall</div>
                  </div>

                  <div className="absolute" style={{top: '65%', left: '45%'}}>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">Parking</div>
                  </div>
                </div>
                
                {/* Address & Directions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center md:text-left">
                    <h4 className="text-lg font-serif font-light mb-2">Store Address</h4>
                    <p className="text-lg font-medium mb-1">123 Elegance XYZ Street</p>
                    <p className="text-muted-foreground">Mumbai, India 400001</p>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-lg font-serif font-light mb-2">Getting Here</h4>
                    <p className="text-sm text-muted-foreground mb-1">5 min walk from Metro Station</p>
                    <p className="text-sm text-muted-foreground">Valet parking available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information - Compact */}
            <div className="space-y-6">
              <div className="bg-background/80 backdrop-blur-sm border border-border/40 p-6 rounded-lg">
                <h3 className="text-xl font-serif font-light mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-foreground rounded-full"></div>
                    <span className="font-medium">+91 2 23 45 67 89</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-foreground rounded-full"></div>
                    <span className="text-muted-foreground text-sm">contact@luxxelabels.com</span>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-sm border border-border/40 p-6 rounded-lg">
                <h3 className="text-xl font-serif font-light mb-4">Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mon - Fri</span>
                    <span className="font-medium">10AM - 8PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10AM - 9PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">12PM - 6PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-sm border border-border/40 p-6 rounded-lg">
                <h3 className="text-xl font-serif font-light mb-4">Services</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-1.5 h-1.5 bg-foreground rounded-full"></div>
                    <span>Personal Styling</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-1.5 h-1.5 bg-foreground rounded-full"></div>
                    <span>Exclusive Collections</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-1.5 h-1.5 bg-foreground rounded-full"></div>
                    <span>Private Shopping</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-1.5 h-1.5 bg-foreground rounded-full"></div>
                    <span>Alterations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Experience Section */}
          <div className="bg-background/80 backdrop-blur-sm border border-border/40 p-6 rounded-lg">
            <div className="text-center mb-6">
              <h3 className="text-xl font-serif font-light mb-3">The Luxxe Labels Experience</h3>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Step into our flagship store and discover a world where luxury meets personalized service.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <div className="text-lg font-serif font-light text-foreground/60 mb-1">01</div>
                <h4 className="font-medium mb-1 text-sm">Curated Collections</h4>
                <p className="text-xs text-muted-foreground">Handpicked luxury pieces from renowned designers</p>
              </div>
              <div className="p-3">
                <div className="text-lg font-serif font-light text-foreground/60 mb-1">02</div>
                <h4 className="font-medium mb-1 text-sm">Expert Styling</h4>
                <p className="text-xs text-muted-foreground">Professional stylists with years of fashion expertise</p>
              </div>
              <div className="p-3">
                <div className="text-lg font-serif font-light text-foreground/60 mb-1">03</div>
                <h4 className="font-medium mb-1 text-sm">Private Consultations</h4>
                <p className="text-xs text-muted-foreground">One-on-one sessions in our exclusive styling suites</p>
              </div>
              <div className="p-3">
                <div className="text-lg font-serif font-light text-foreground/60 mb-1">04</div>
                <h4 className="font-medium mb-1 text-sm">Premium Service</h4>
                <p className="text-xs text-muted-foreground">Complimentary alterations and personal shopping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}