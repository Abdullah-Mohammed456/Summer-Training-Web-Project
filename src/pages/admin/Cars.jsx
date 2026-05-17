import './AdminPages.css';
import { FaTrash } from 'react-icons/fa';

const Cars = () => {
  const carsData = [
    { id: 1, name: 'Renault', img: '/images/4ce40142-ebc9-4940-9c09-67d4c6fe6af4.jpeg' },
    { id: 2, name: 'Mercedes', img: '/images/download (11).jpeg' },
    { id: 3, name: 'Audi', img: '/images/ville-kaisla-HNCSCpWrVJA-unsplash.jpg' },
    { id: 4, name: 'Porsche', img: '/images/Porsche.jpeg' },
    { id: 5, name: 'BMW', img: '/images/Vistale_ Image.jpeg' },
    { id: 6, name: 'Volkswagen', img: '/images/Volkswagen Virtus GT Line 2025_ The Ultimate Performance Sedan Redefining Driving Pleasure.jpeg' },
  ];

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1>Cars Inventory</h1>
          <p>Manage all vehicles currently listed on NetClaks.</p>
        </div>
        <button className="action-btn" style={{background: 'var(--primary)', color: 'white', padding: '10px 20px', fontWeight: 'bold'}}>+ Add New Car</button>
      </div>

      <div className="admin-table-container glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Brand / Model</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carsData.map((car) => (
              <tr key={car.id}>
                <td><img src={car.img} alt={car.name} className="car-thumb" /></td>
                <td style={{fontWeight: '600'}}>{car.name}</td>
                <td><span className="status-badge approved">Active</span></td>
                <td>
                  <button className="action-btn delete"><FaTrash /> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cars;
