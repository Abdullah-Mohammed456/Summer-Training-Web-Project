import { useState } from 'react';
import Layout from '../components/Layout';
import './About.css';

const About = () => {
  const [activeTab, setActiveTab] = useState('who');

  return (
    <Layout>
      <div className="about-hero">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">Learn more about NetClaks, our journey, and our vision for the future of automotive excellence.</p>
      </div>

      <section className="about-section">
        <aside className="about-tabs glass">
          <button className={`tab-btn ${activeTab === 'who' ? 'active' : ''}`} onClick={() => setActiveTab('who')}>Who are we?</button>
          <button className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`} onClick={() => setActiveTab('vision')}>Our vision</button>
          <button className={`tab-btn ${activeTab === 'message' ? 'active' : ''}`} onClick={() => setActiveTab('message')}>Our message</button>
          <button className={`tab-btn ${activeTab === 'goal' ? 'active' : ''}`} onClick={() => setActiveTab('goal')}>Our goal</button>
        </aside>

        <main className="about-content glass">
          {activeTab === 'who' && (
            <div className="tab-content animate-fade-in">
              <h2>Who We Are</h2>
              <p>Founded in 2013, <strong>Netclaks</strong> has grown into one of the leading car trading companies in Egypt. Over the years, we have built a strong reputation by offering a wide range of renowned international brands and delivering flexible sales solutions tailored to the diverse needs of our customers.</p>
              <p>Guided by a customer-first philosophy, we exceeded our highest sales milestone in 2018 and continue to prioritize trust, transparency, and innovation. Our dedicated team ensures that every customer receives the support they need—whether it’s answering inquiries, providing installment plans, or offering financing facilities through Netclaks. More than just a trading company, we are committed to creating a smarter, simpler, and more enjoyable car ownership experience.</p>
            </div>
          )}
          {activeTab === 'vision' && (
            <div className="tab-content animate-fade-in">
              <h2>Our Vision</h2>
              <p>At <strong>Netclaks</strong>, our vision is to be the trusted partner for every driver in choosing their car. We strive to offer a wide range of major brands while making every step of the car-buying journey simple, transparent, and truly enjoyable.</p>
            </div>
          )}
          {activeTab === 'message' && (
            <div className="tab-content animate-fade-in">
              <h2>Our Message</h2>
              <p>At <strong>Netclaks</strong>, we are here to support every customer with flexible offers and convenient installment systems. Our expert consultants work closely with you to help choose the option that fits your needs best, while we remain committed to delivering exceptional service and an experience you can rely on.</p>
            </div>
          )}
          {activeTab === 'goal' && (
            <div className="tab-content animate-fade-in">
              <h2>Our Goal</h2>
              <p>Our goal at <strong>Netclaks</strong> is to make car ownership both enjoyable and practical. Through our dedicated team, we support you at every step of the journey while offering flexible payment options and installment plans with competitive banking rates—ensuring convenience, trust, and peace of mind in every purchase.</p>
            </div>
          )}
        </main>
      </section>
    </Layout>
  );
};

export default About;
