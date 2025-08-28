import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const AdminPanel = ({ onAddMenuItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      alert('Name, Price and Stock are required');
      return;
    }

    // Convert price and stock to numbers
    const newItem = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    onAddMenuItem(newItem);

    setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '' });
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#fff', marginBottom: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Admin: Add Menu Item</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <input placeholder="Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        <input placeholder="Price *" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
        <input placeholder="Stock *" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
        <input placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
        <input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem' }}>
          <Plus /> Add Item
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
