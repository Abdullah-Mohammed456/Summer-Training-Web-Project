import './Hero.css';
import Navbar from './Navbar';

const Hero = () => {
  return (
    <div className="hero-container">
      <Navbar />
      <img src="/images/Home Page.png" alt="Sleek Ride Car" className="hero-car-image" />
      <div className="hero-content">
        <h1 className="hero-title">The Sleek<br />Ride</h1>
        <p className="hero-description">
          Discover the epitome of automotive engineering, where design and performance seamlessly
          converge. Witness the unveiling of Lamb's latest creation — a stunning sports car that pushes the boundaries of speed, innovation, and luxury.
        </p>
      </div>
    </div>
  );
};

export default Hero;
