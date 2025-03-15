import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div>
      {/* Hero Section */}
      <section className="about-hero text-center text-white d-flex align-items-center">
        <div className="container">
          <h1 className="display-4 fw-bold">About Our Organic Journey</h1>
          <p className="lead">Bringing fresh, healthy, and sustainable organic fruits directly to your table.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img src="./../../../Images/aboutus/oraganicfarm.jpg" alt="Organic Farm" className="img-fluid rounded-3 shadow" />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold">Our Story</h2>
            <p>
              We started with a vision to promote healthy living through organic fruits. 
              Our farm-to-table approach ensures the freshest produce, free from harmful chemicals and pesticides.
            </p>
            <p>
              Every fruit is handpicked with care, grown in harmony with nature, and delivered with love. 
              Join us in making healthier choices for you and the planet!
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us? */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold">Why Choose Us?</h2>
          <div className="row mt-4">
            <div className="col-md-4">
              <img src="/images/freshness.png" alt="Freshness" width="80" className="mb-3" />
              <h4>100% Fresh & Organic</h4>
              <p>We provide farm-fresh fruits with zero artificial preservatives.</p>
            </div>
            <div className="col-md-4">
              <img src="/images/sustainable.png" alt="Sustainability" width="80" className="mb-3" />
              <h4>Eco-Friendly & Sustainable</h4>
              <p>We use sustainable farming techniques to protect the environment.</p>
            </div>
            <div className="col-md-4">
              <img src="/images/quality.png" alt="Quality" width="80" className="mb-3" />
              <h4>Guaranteed Quality</h4>
              <p>Every fruit is carefully inspected to ensure premium quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="container py-5">
        <h2 className="text-center fw-bold">Meet Our Team</h2>
        <div className="row text-center mt-4">
          <div className="col-md-4">
            <img src="/images/farmer.jpg" alt="Founder" className="team-img rounded-circle shadow" />
            <h4>John Doe</h4>
            <p>Founder & Organic Farming Expert</p>
          </div>
          <div className="col-md-4">
            <img src="/images/nutritionist.jpg" alt="Nutritionist" className="team-img rounded-circle shadow" />
            <h4>Sarah Green</h4>
            <p>Certified Nutritionist</p>
          </div>
          <div className="col-md-4">
            <img src="/images/customer-support.jpg" alt="Customer Support" className="team-img rounded-circle shadow" />
            <h4>Emily Brown</h4>
            <p>Customer Support Manager</p>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold">What Our Customers Say</h2>
          <div className="row mt-4">
            <div className="col-md-4">
              <p>"The best organic fruits I’ve ever had! Fresh and delicious!"</p>
              <strong>- Alice Johnson</strong>
            </div>
            <div className="col-md-4">
              <p>"A great way to eat healthy and support sustainable farming."</p>
              <strong>- Michael Smith</strong>
            </div>
            <div className="col-md-4">
              <p>"Highly recommended! Quality fruits with fast delivery."</p>
              <strong>- Jennifer Lee</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section text-center text-white py-5">
        <div className="container">
          <h2 className="fw-bold">Join Our Organic Movement Today!</h2>
          <p>Experience the freshest, healthiest organic fruits delivered to your door.</p>
          <Link to="/category" className="btn btn-success btn-lg">Shop Now</Link>
        </div>
      </section>

      {/* CSS Styling */}
      <style>{`
        .about-hero {
          background: url('/images/about-bg.jpg') center/cover no-repeat;
          height: 50vh;
        }
        .team-img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border: 3px solid #ff6f61;
        }
        .cta-section {
          background: #ff6f61;
        }
      `}</style>
    </div>
  );
}
