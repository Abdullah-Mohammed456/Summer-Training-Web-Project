import './AdvantageSection.css';

const AdvantageSection = () => {
  return (
    <section className="advantage-section">
      <div className="advantage-content">
        <div className="car-image-left">
          <img src="/images/silvar sport car.jpg" alt="Silver Sports Car" className="silver-car-photo" />
        </div>

        <div className="content-right">
          <h2 className="advantage-title">The Lamb Advantage</h2>
          <div className="advantage-text">
            <p>
              With the Lamb, you don't just own a car - you possess a work of art that redefines the driving
              experience. Meticulously engineered and crafted with uncompromising attention to detail.
            </p>
            <p>
              Prepare to be captivated by the Lamb's exceptional design and engineering. This sports car is
              more than just a mode of transportation - it's a testament to the brand's unwavering commitment
              to excellence.
            </p>
            <p>
              Discover the Lamb's unrivaled craftsmanship and attention to detail. This sports car is a
              masterpiece of engineering, combining cutting-edge technology with timeless design.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantageSection;
