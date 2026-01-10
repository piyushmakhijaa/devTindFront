import axios from "axios";
import { BASE_URL } from "../utils/constants";

function PricingCard(props) {

async function handleOrder(){
 const response  =   await axios.post(`${BASE_URL}` + `/payment/create`, {amount:props.price, membershipType : "Bronze" },{withCredentials:true})
 console.log(response.data);        // backend response
  console.log(response.data.order);
  
   const options = {
        key: response.data.key, // Replace with your Razorpay key_id
        amount: response.data.order.amount, // Amount is in currency subunits.
        currency: 'INR',
        name: 'PIYUSHWEBPAYS',
        description: 'Test Transaction',
        order_id: response.data.order.id , // This is the order_id created in the backend
        prefill: {
          name: response.data.order.notes.firstName,
          email: 'piyush.test@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();



}



  return (
    <div className="border border-gray-300 shadow-sm rounded-md p-6 bg-white w-full max-w-sm">
      <h3 className="text-slate-900 text-xl font-semibold mb-3">
        {props.name}
      </h3>

      <p className="text-[15px] text-slate-600">
        {props.description}
      </p>

      <div className="mt-8">
        <h3 className="text-slate-900 text-3xl font-semibold">
          ₹{props.price}
        </h3>
      </div>

      <div className="mt-6">
        <h4 className="text-slate-900 text-lg font-semibold mb-3">Include</h4>

        <ul className="mt-6 space-y-4">
          {props.features.map((item, i) => (
            <li key={i} className="flex items-center text-[15px] text-slate-600">
              {item}
            </li>
          ))}
        </ul>

        <button onClick={()=>handleOrder()}  className="w-full mt-8 px-4 py-2.5 text-[15px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
          Buy Plan
        </button>
      </div>
    </div>
  );
}

export default PricingCard;
