import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { cn } from "../utils/cn";

function PricingCard({ name, description, price, highlight, badge, features, membershipType = "Bronze", index = 0 }) {
  async function handleOrder() {
    const response = await axios.post(
      `${BASE_URL}/payment/create`,
      { amount: price, membershipType },
      { withCredentials: true }
    );
    console.log(response.data);

    const options = {
      key: response.data.key,
      amount: response.data.order.amount,
      currency: "INR",
      name: "PIYUSHWEBPAYS",
      description: "Test Transaction",
      order_id: response.data.order.id,
      prefill: {
        name: response.data.order.notes.firstName,
        email: response.data.order.notes.emailId,
        contact: response.data.order.notes.phone,
      },
      theme: {
        color: highlight ? "#8b5cf6" : "#3b82f6",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-sm rounded-2xl p-6 transition-all duration-300 animate-fade-in-up opacity-0",
        "hover:-translate-y-2",
        highlight
          ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-2xl shadow-purple-500/25"
          : "bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-lg"
      )}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Popular badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 badge-glow">
            {badge}
          </span>
        </div>
      )}

      {/* Plan name and description */}
      <div className="text-center mb-6">
        <h3 className={cn(
          "text-xl font-bold mb-1",
          highlight ? "text-white" : "text-slate-900"
        )}>
          {name}
        </h3>
        <p className={cn(
          "text-sm",
          highlight ? "text-white/80" : "text-slate-600"
        )}>
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="text-center mb-8">
        <div className={cn(
          "text-5xl font-bold",
          highlight ? "text-white" : "text-slate-900"
        )}>
          <span className="text-2xl">₹</span>
          {price}
        </div>
        <p className={cn(
          "text-sm mt-1",
          highlight ? "text-white/60" : "text-slate-500"
        )}>
          one-time payment
        </p>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h4 className={cn(
          "text-sm font-semibold mb-4 uppercase tracking-wider",
          highlight ? "text-white/80" : "text-slate-700"
        )}>
          What's included
        </h4>
        <ul className="space-y-3">
          {features.map((item, i) => (
            <li 
              key={i} 
              className={cn(
                "flex items-center text-sm",
                highlight ? "text-white/90" : "text-slate-600"
              )}
            >
              <svg 
                className={cn(
                  "w-5 h-5 mr-3 flex-shrink-0",
                  highlight ? "text-green-300" : "text-green-500"
                )} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Buy button */}
      <button
        onClick={() => handleOrder()}
        className={cn(
          "w-full py-3 rounded-xl font-semibold transition-all duration-300",
          "btn-premium",
          highlight
            ? "bg-white text-purple-700 hover:bg-white/90 shadow-lg"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25"
        )}
      >
        Get Started
      </button>
    </div>
  );
}

export default PricingCard;
