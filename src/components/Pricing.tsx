import React from 'react'
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    features: ['Real-time messaging', 'Group chats', 'File sharing', '1GB storage']
  },
  {
    name: 'Pro',
    price: '$9.99',
    features: ['All Basic features', 'Voice calls', 'Video calls', '10GB storage', 'Priority support']
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['All Pro features', 'Custom integrations', 'Dedicated support', 'Unlimited storage', 'Advanced analytics']
  }
]

const Pricing: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Choose the Perfect Plan for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-card dark:bg-card-dark rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-3xl font-bold text-primary mb-6">{plan.price}</p>
              <ul className="mb-8 space-y-2">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">Choose Plan</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing