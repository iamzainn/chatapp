import React from 'react'
import { Button } from "@/components/ui/button"
import { MessageSquare } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <section className="pt-24 pb-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background dark:from-primary/5 dark:to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Connect and Chat <br />
              <span className="text-primary">Anytime, Anywhere</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Experience seamless communication with our intuitive chat application. Stay connected with friends, family, and colleagues effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="w-full h-[400px] bg-gradient-to-br from-primary to-primary-light rounded-lg shadow-2xl overflow-hidden">
              <MessageSquare className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-white opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero