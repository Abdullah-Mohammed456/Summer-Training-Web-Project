import './AdminPages.css';
import { FaUsers, FaShoppingCart, FaCar, FaDollarSign } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here is what is happening today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon" style={{color: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)'}}>
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>1,245</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{color: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)'}}>
            <FaShoppingCart />
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p>384</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{color: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.1)'}}>
            <FaCar />
          </div>
          <div className="stat-info">
            <h3>Vehicles</h3>
            <p>56</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{color: '#f1c40f', backgroundColor: 'rgba(241, 196, 15, 0.1)'}}>
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <p>$45,200</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content" style={{marginTop: '40px'}}>
        <div className="glass" style={{padding: '30px', borderRadius: '12px'}}>
          <h2>Recent Activity</h2>
          <p style={{color: 'var(--text-muted)', marginTop: '10px'}}>Dashboard analytics and charts would go here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
