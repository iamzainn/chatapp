import React from 'react'
import { StarIcon } from 'lucide-react'

const testimonials = [
  {
    name: 'John Doe',
    role: 'CEO, TechCorp',
    content: 'This chat app has revolutionized our team communication. It\'s fast, secure, and packed with features.',
    rating: 5
  },
  {
    name: 'Jane Smith',
    role: 'Freelance Designer',
    content: 'I love how easy it is to use this app. The interface is intuitive, and the performance is top-notch.',
    rating: 5
  },
  {
    name: 'Mike Johnson',
    role: 'Marketing Manager',
    content: 'The group chat feature has made coordinating our marketing campaigns so much easier. Highly recommended!',
    rating: 4
  }
]

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-secondary/20 dark:bg-secondary-dark/10">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card dark:bg-card-dark rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials