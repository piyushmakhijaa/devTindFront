import PricingCard from "../components/PricingCard";
import { cn } from "../utils/cn";

function Premium() {
  const plans = [
    {
      name: "Bronze",
      description: "Great for trying out",
      price: 300,
      highlight: false,
      membershipType: "Bronze",
      features: [
        "50 Swipes/Day",
        "2-Days Validity",
        "Basic Support",
      ],
    },
    {
      name: "Silver",
      description: "Best for most users",
      price: 500,
      highlight: true,
      badge: "Most Popular",
      membershipType: "Silver",
      features: [
        "100 Swipes/Day",
        "Boost Reach",
        "7-Days Validity",
        "Priority Support",
        "See who liked you",
      ],
    },
    {
      name: "Gold",
      description: "For power users",
      price: 700,
      highlight: false,
      membershipType: "Gold",
      features: [
        "Unlimited Swipes",
        "30-Days Validity",
        "Personalized Filtering",
        "Boost Reach",
        "AI-based suggestions",
        "Premium Support",
      ],
    },
  ];

  return (
    <div className="min-h-[80vh] py-16 px-4 bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" 
          style={{ animationDelay: "1s" }} 
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span 
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-4 animate-bounce-in opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            💎 Premium Plans
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            Choose the right plan for you
          </h2>
          <p 
            className="text-lg text-slate-600 max-w-2xl mx-auto animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            Unlock your full potential with our premium features. Find your perfect match faster.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {plans.map((plan, i) => (
            <PricingCard key={i} {...plan} index={i} />
          ))}
        </div>

        {/* Trust badges */}
        <div 
          className="mt-16 text-center animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.8s" }}
        >
          <p className="text-slate-600 mb-4">Trusted by over 10,000+ developers worldwide</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {["🔒 Secure Payment", "💳 Razorpay", "📱 Instant Access", "🔄 Cancel Anytime"].map((badge, idx) => (
              <span 
                key={idx}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Premium;