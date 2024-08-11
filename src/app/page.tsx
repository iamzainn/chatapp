'use client'

import CTA from "@/components/CTA"
import Features from "@/components/Features"
import Hero from "@/components/Hero"
import Pricing from "@/components/Pricing"

import Testimonials from "@/components/Testimonials"



const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
    </div>
  )
}

export default LandingPage