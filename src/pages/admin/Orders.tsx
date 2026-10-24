import './AdminPages.css';

const Orders = () => {
  const ordersData = [
    { id: '#12345', customer: 'Ethan Carter', car: 'Porsche', price: '$55,000', date: '2024-07-20', status: 'approved' },
    { id: '#12346', customer: 'Olivia Bennett', car: 'Audi', price: '$75,000', date: '2024-07-19', status: 'pending' },
    { id: '#12347', customer: 'Noah Thompson', car: 'Porsche', price: '$45,000', date: '2024-07-18', status: 'shipped' },
    { id: '#12348', customer: 'Ava Rodriguez', car: 'Audi', price: '$60,000', date: '2024-07-17', status: 'completed' },
    { id: '#12349', customer: 'Liam Walker', car: 'Porsche', price: '$55,000', date: '2024-07-16', status: 'cancelled' },
    { id: '#12350', customer: 'Sophia Lewis', car: 'Audi', price: '$75,000', date: '2024-07-15', status: 'pending' },
  ];

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page-header">
        <h1>Orders</h1>
        <p>Manage and track all customer orders.</p>
      </div>

      <div className="admin-table-container glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Car Model</th>
              <th>Price</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.map((order) => (
              <tr key={order.id}>
                <td style={{fontWeight: '600'}}>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.car}</td>
                <td>{order.price}</td>
                <td>{order.date}</td>
                <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                <td>
                  <button className="action-btn">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
