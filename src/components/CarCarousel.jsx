import './CarCarousel.css';

const brands = [
  { name: 'Mercedes-Benz', image: '/images/download (11).jpeg' },
  { name: 'Audi', image: '/images/ville-kaisla-HNCSCpWrVJA-unsplash.jpg' },
  { name: 'Porsche', image: '/images/Porsche.jpeg' },
  { name: 'BMW', image: '/images/Vistale_ Image.jpeg' },
  { name: 'Volkswagen', image: '/images/Volkswagen Virtus GT Line 2025_ The Ultimate Performance Sedan Redefining Driving Pleasure.jpeg' },
  { name: 'Renault', image: '/images/4ce40142-ebc9-4940-9c09-67d4c6fe6af4.jpeg' },
];

const CarCarousel = () => {
  // Duplicate array for infinite scroll effect
  const trackItems = [...brands, ...brands];

  return (
    <section className="carousel-section" id="categories">
      <div className="carousel-container">
        <div className="carousel-track">
          {trackItems.map((brand, index) => (
            <div key={index} className="carousel-item">
              <img src={brand.image} alt={brand.name} />
              <span className="brand-label">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarCarousel;
