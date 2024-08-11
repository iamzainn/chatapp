import React from 'react'
import { MessageSquare, Lock, Zap, Users } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Real-time Messaging',
    description: 'Instant message delivery for seamless conversations.'
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Your conversations are secure and private.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed and performance.'
  },
  {
    icon: Users,
    title: 'Group Chats',
    description: 'Create and manage group conversations easily.'
  }
]

const Features: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-secondary/20 dark:bg-secondary-dark/10">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Features for Seamless Communication
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card dark:bg-card-dark rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features