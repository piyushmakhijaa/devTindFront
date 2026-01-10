import PricingCard from "../components/PricingCard";
function Premium(){


    const plans = [
  {
    name: "Bronze",
    description: "Boost",
    price: 300,
    highlight: false,
    features: [
      "50 Swipes/Day",
      "2-Days Validity",
    ],
  },
  {
    name: "Silver",
    description: "Premium",
    price: 500,
    highlight: true,
    badge: "Best Deal",
    features: [
      "100 Swipes/Day",
      "Boost Reach",
      "7-Days Validity"
    ],
  },
  {
    name: "Gold",
    description: "Premium+",
    price: 700,
    highlight: false,
    features: [
      "Unlimited Swipes",
      "30-Days Validity",
      "Personalized Filtering",
      "Boost Reach",
      "AI-based suggestions",
    ],
  },
];


   return (
    <div className="p-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-slate-900 text-3xl font-bold mb-4">
            Choose the right plan for you
          </h2>
          <p className="text-[15px] text-slate-600">
            Flexible plans designed for individuals, teams, and growing businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 place-items-center">
          {plans.map((plan, i) => (
            <PricingCard key={i} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );

}

export default Premium;