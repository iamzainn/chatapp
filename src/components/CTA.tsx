import React from 'react'
import { Button } from "@/components/ui/button"

const CTA: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-7xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Chatting?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already enjoying seamless communication with our chat app.
        </p>
        <Button size="lg" variant="secondary">
          Get Started Now
        </Button>
      </div>
    </section>
  )
}

export default CTA