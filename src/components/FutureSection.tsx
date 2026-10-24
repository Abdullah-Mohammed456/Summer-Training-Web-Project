import { ShieldCheck, Zap, Star } from 'lucide-react';
import './FutureSection.css';

const FutureSection = () => {
  return (
    <section className="future-section">
      <div className="future-header">
        <div className="future-left">
          <div className="future-subtitle">Redefining the Future</div>
          <h2 className="future-heading">Lamb's Visionary Approach</h2>
        </div>
      </div>

      <div className="future-content">
        <div className="car-image-left">
          <img src="/images/BLACKsports-car.jpg" alt="Black Sports Car" className="black-car-photo" />
        </div>

        <div className="info-cards-right">
          <div className="info-card glass">
            <div className="card-icon"><ShieldCheck className="lucide-icon" /></div>
            <h3 className="card-title">Discover the Difference</h3>
            <p className="card-description">Lamb's commitment to innovation and excellence is evident in every aspect of their new sports car. From the sleek design to the cutting-edge technology.</p>
          </div>

          <div className="info-card glass">
            <div className="card-icon"><Star className="lucide-icon" /></div>
            <h3 className="card-title">Elevate Your Passion</h3>
            <p className="card-description">Witness the Lamb's uncompromising pursuit of perfection and experience automotive excellence like never before.</p>
          </div>

          <div className="info-card glass">
            <div className="card-icon"><Zap className="lucide-icon" /></div>
            <h3 className="card-title">Unleash the Power</h3>
            <p className="card-description">Experience the raw power and unmatched performance that defines the Lamb brand.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSection;
