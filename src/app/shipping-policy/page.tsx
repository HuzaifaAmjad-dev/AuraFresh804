export const metadata = {
    title: "Shipping Policy | AuraFresh",
    description: "Learn about our dispatch process, delivery timelines, and shipping terms.",
  }
  
  export default function ShippingPolicyPage() {
    return (
      <main className="min-h-screen bg-[#FAF8F5] text-stone-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
  
          {/* Heading */}
          <h1
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-4xl font-bold mb-10 text-stone-900"
          >
            Shipping & Dispatch Policy
          </h1>
  
          {/* Dispatch Policy */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Dispatch Policy</h2>
            <p className="text-stone-600 leading-relaxed">
              At Aura Fresh 804, we prioritize speed and precision. Once your order and payment are successfully confirmed,
              our team ensures your signature scent is meticulously prepared and dispatched within <strong>2 business days</strong>.
              We maintain a rigorous schedule to guarantee that your package enters the shipping transition without delay.
            </p>
          </section>
  
          {/* Delivery Timelines */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Delivery Timelines</h2>
            <p className="text-stone-600 leading-relaxed">
              While we guarantee a swift 2-day dispatch, final delivery arrival is subject to our courier and your specific location.
              On average, you can expect your Aura Fresh 804 parcel to arrive within <strong>2 to 5 business days</strong> following dispatch.
            </p>
          </section>
  
          {/* Courier */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Our Shipping Courier</h2>
            <p className="text-stone-600 leading-relaxed">
              To ensure nationwide reliability across Pakistan, we exclusively deliver parcels through
              <strong> Quickkar Courier Service</strong>, known for secure and timely logistics.
            </p>
          </section>
  
          {/* Tracking */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Real-Time Tracking</h2>
            <p className="text-stone-600 leading-relaxed">
              Stay updated on your fragrance’s journey. Once your order is dispatched, a unique tracking ID can be provided
              upon request via WhatsApp, allowing you to monitor your delivery in real time.
            </p>
          </section>
  
          {/* Divider */}
          <hr className="my-12 border-stone-200" />
  
          {/* Returns Shipping Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Return Shipping Policy</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Please note the following conditions regarding returns and exchanges:
            </p>
  
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li>
                You will be responsible for paying your own shipping costs when returning a product.
              </li>
              <li>
                Shipping costs are non-refundable.
              </li>
              <li>
                In case of an exchange, the shipping cost for the replacement product will also be covered by the customer.
              </li>
              <li>
                Delivery time for exchanged products may vary depending on your location.
              </li>
            </ul>
          </section>
  
        </div>
      </main>
    )
  }