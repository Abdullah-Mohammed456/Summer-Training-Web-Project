import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import './Products.css';

const initialProductsList = [
  { id: 1, title: 'Porsche 911 Carrera', type: 'sports', brand: 'porsche', desc: 'Iconic sports car with legendary performance.', price: 150000, img: '/images/Porsche.jpeg' },
  { id: 2, title: 'Mercedes-AMG C63', type: 'sports', brand: 'mercedes', desc: 'Powerful AMG performance with sophisticated design.', price: 95000, img: '/images/BLACKsports-car.jpg' },
  { id: 3, title: 'BMW M3 Competition', type: 'sedan', brand: 'bmw', desc: 'High-performance luxury sedan with advanced technology.', price: 85000, img: '/images/blacksportscar.jpg' },
  { id: 4, title: 'Audi RS6 Avant', type: 'sports', brand: 'audi', desc: 'Ultimate performance wagon combining power and luxury.', price: 120000, img: '/images/silvar sport car.jpg' },
  { id: 5, title: 'BMW X5 M', type: 'suv', brand: 'bmw', desc: 'Luxury SUV with M performance.', price: 110000, img: '/images/graaysportcar.jpg' },
  { id: 6, title: 'Lamborghini Huracán', type: 'sports', brand: 'lamborghini', desc: 'Exotic supercar with breathtaking performance.', price: 250000, img: '/images/lamb.jpg' },
  { id: 7, title: 'Range Rover Sport', type: 'suv', brand: 'range-rover', desc: 'Luxury SUV with off-road capability.', price: 130000, img: '/images/Range_Rover_-_New-removebg-preview.png' },
  { id: 8, title: 'Audi A8 L', type: 'sedan', brand: 'audi', desc: 'Flagship luxury sedan with premium features.', price: 130000, img: '/images/A7-removebg-preview.png' },
];

const Products = () => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedTypes([]);
  };

  const filteredProducts = useMemo(() => {
    return initialProductsList.filter(product => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(product.type);
      return brandMatch && typeMatch;
    });
  }, [selectedBrands, selectedTypes]);

  const activeFilterCount = selectedBrands.length + selectedTypes.length;

  return (
    <Layout>
      <div className="products-container">
        <aside className="products-sidebar glass">
          <h3 className="filter-title">Brand</h3>
          <div className="filter-option">
            <input type="checkbox" id="bmw" checked={selectedBrands.includes('bmw')} onChange={() => handleBrandChange('bmw')} /> 
            <label htmlFor="bmw">BMW</label>
          </div>
          <div className="filter-option">
            <input type="checkbox" id="mercedes" checked={selectedBrands.includes('mercedes')} onChange={() => handleBrandChange('mercedes')} /> 
            <label htmlFor="mercedes">Mercedes</label>
          </div>
          <div className="filter-option">
            <input type="checkbox" id="audi" checked={selectedBrands.includes('audi')} onChange={() => handleBrandChange('audi')} /> 
            <label htmlFor="audi">Audi</label>
          </div>
          <div className="filter-option">
            <input type="checkbox" id="porsche" checked={selectedBrands.includes('porsche')} onChange={() => handleBrandChange('porsche')} /> 
            <label htmlFor="porsche">Porsche</label>
          </div>
          <div className="filter-option">
            <input type="checkbox" id="lamborghini" checked={selectedBrands.includes('lamborghini')} onChange={() => handleBrandChange('lamborghini')} /> 
            <label htmlFor="lamborghini">Lamborghini</label>
          </div>
          <div className="filter-option">
            <input type="checkbox" id="range-rover" checked={selectedBrands.includes('range-rover')} onChange={() => handleBrandChange('range-rover')} /> 
            <label htmlFor="range-rover">Range Rover</label>
          </div>

          <h3 className="filter-title" style={{ marginTop: '20px' }}>Type</h3>
          <div className="filter-option">
            <input type="checkbox" id="sedan" checked={selectedTypes.includes('sedan')} onChange={() => handleTypeChange('sedan')} /> 
            <label htmlFor="sedan">Sedan</label>
          </div>
          <div className="filter-option">
            <input type="checkbox" id="suv" checked={selectedTypes.includes('suv')} onChange={() => handleTypeChange('suv')} /> 
            <label htmlFor="suv">SUV</label>
          </div>
          <div className="filter-option">
            <input type="checkbox" id="sports" checked={selectedTypes.includes('sports')} onChange={() => handleTypeChange('sports')} /> 
            <label htmlFor="sports">Sports Car</label>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="product-button" style={{width: '100%', marginTop: '20px', background: 'rgba(228,61,52,0.2)', border: '1px solid var(--primary)'}}>
              Clear All Filters
            </button>
          )}
        </aside>

        <main style={{flex: 1}}>
          <div id="filter-status" style={{
            gridColumn: '1 / -1', 
            padding: '15px', 
            background: activeFilterCount > 0 ? '#fff3cd' : '#e8f5e8', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            textAlign: 'center', 
            color: activeFilterCount > 0 ? '#856404' : '#2d5a2d', 
            fontWeight: '600'
          }}>
            {activeFilterCount > 0 
              ? `Showing ${filteredProducts.length} cars (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)` 
              : `Showing all ${filteredProducts.length} cars`}
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card glass animate-fade-in">
                <div className="product-image-wrapper">
                  <img src={product.img} alt={product.title} />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">{product.desc}</p>
                  <div className="product-footer">
                    <span className="product-price">${product.price.toLocaleString()}</span>
                    <button className="product-button">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Products;
