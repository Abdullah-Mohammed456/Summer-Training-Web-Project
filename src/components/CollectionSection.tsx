import './CollectionSection.css';

const collections = [
  { main: 'Discover the Latest', sub: 'Versions' },
  { main: 'Experience the', sub: 'Most Enjoy Cars' },
  { main: 'Redefine', sub: 'Unleash Your Passion' },
  { main: 'Elevate', sub: 'Embrace the Future' },
  { main: 'Crafted', sub: 'Unparalleled Elegance' }
];

const CollectionSection = () => {
  return (
    <section className="collection-section">
      <h2 className="collection-title">Explore the Lamb Collection</h2>
      <div className="collection-cards">
        {collections.map((item, idx) => (
          <div key={idx} className="collection-card glass">
            <div className="card-main-text">{item.main}</div>
            <div className="card-sub-text">{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionSection;
