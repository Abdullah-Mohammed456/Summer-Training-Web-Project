import './TrendVehicles.css';

const vehicles = [
  { id: 1, name: 'BMW i4', price: '$150/day', image: '/images/8bd09784-e1af-45ed-9b36-2c965973000d-removebg-preview.png' },
  { id: 2, name: 'Audi A7', price: '$130/day', image: '/images/6ba8c24a-59a2-437d-9cb6-c7ab6eeb33b6-removebg-preview.png' },
  { id: 3, name: 'Mercedes GLE', price: '$150/day', image: '/images/A7-removebg-preview.png' },
  { id: 4, name: 'Porsche 911', price: '$160/day', image: '/images/Range_Rover_-_New-removebg-preview.png' },
];

const TrendVehicles = () => {
  return (
    <section className="trend-section">
      <h2 className="section-heading">Trend Vehicles</h2>
      <div className="vehicles-grid">
        {vehicles.map((v) => (
          <div key={v.id} className="vehicle-card glass">
            <h3 className="vehicle-name">{v.name}</h3>
            <div className="vehicle-image-wrapper">
              <img src={v.image} alt={v.name} className="vehicle-image" />
            </div>
            <div className="vehicle-footer">
              <span className="vehicle-price">{v.price}</span>
              <button className="book-btn">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendVehicles;
