import './MotionSection.css';

const MotionSection = () => {
  return (
    <section className="motion-section">
      <div className="motion-content-left">
        <div className="motion-subtitle">The Art of Motion</div>
        <h2 className="motion-heading">Unleash the Lamb</h2>
        <p className="motion-description">
          Lamb's new sports car is a testament to the brand's unwavering commitment to innovation and excellence. Designed with the discerning enthusiast in mind, this masterpiece combines cutting-edge technology.
        </p>
        <div className="small-car-card glass">
          <img src="/images/blacksportscar.jpg" alt="Black Sports Car" className="small-car-photo" />
        </div>
        <div className="motion-cta">Explore the Lamb &rarr;</div>
      </div>
      <div className="motion-content-right">
        <img src="/images/graaysportcar.jpg" alt="Grey Sports Car" className="large-car-photo" />
      </div>
    </section>
  );
};

export default MotionSection;
