import { Gift, Users, DollarSign, Percent, Star } from 'lucide-react'
import Link from 'next/link'

export function InfoBanner() {
  const features = [
    {
      icon: <Gift className="h-5 w-5" />,
      title: "Free Delivery",
      description: "All shards, no minimum order",
      link: "/delivery-returns",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Military Discount",
      description: "Veterans get 15% global cashback",
      link: "/account",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      icon: <Percent className="h-5 w-5" />,
      title: "Volume Discounts",
      description: "Save up to 20% on bulk orders",
      link: "/special-deals",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Referral Program",
      description: "Earn 10% cashback for every friend",
      link: "/account",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Loyalty Cashback",
      description: "Get 5% back on every purchase",
      link: "/account",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    }
  ]

  return (
    <section className="py-8 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 border-y border-amber-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        {/* Main Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Why Shop at UO King?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Enjoy exclusive benefits, discounts, and rewards with every purchase
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group block p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {/* Icon */}
                <div className={`p-3 rounded-full ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            New to UO King?{' '}
            <Link 
              href="/signup" 
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
            >
              Sign up now
            </Link>
            {' '}and start earning rewards!
          </p>
        </div>
      </div>
    </section>
  )
}
