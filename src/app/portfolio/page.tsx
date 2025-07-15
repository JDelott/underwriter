"use client";

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PortfolioProperty } from '@/types';

export default function PortfolioPage() {
  const [properties, setProperties] = useState<PortfolioProperty[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (propertyData: Partial<PortfolioProperty>) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });
      
      if (response.ok) {
        fetchPortfolio();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-emerald-400 text-xl tracking-wider">LOADING PORTFOLIO...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light text-white tracking-wide mb-2">Portfolio Overview</h1>
            <div className="flex items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">{properties.length} Properties</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">{properties.filter(p => p.status === 'active').length} Active</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
          >
            {showAddForm ? 'CANCEL' : 'ADD PROPERTY'}
          </button>
        </div>

        {showAddForm && (
          <AddPropertyForm onSubmit={handleAddProperty} onCancel={() => setShowAddForm(false)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PortfolioPropertyCard key={property.id} property={property} />
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-600 mb-4">🏢</div>
            <h3 className="text-xl text-gray-400 mb-2">No properties in portfolio</h3>
            <p className="text-gray-500">Add your first property to get started</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

const AddPropertyForm = ({ onSubmit, onCancel }: { onSubmit: (propertyData: Partial<PortfolioProperty>) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    property_type: '',
    units: '',
    square_feet: '',
    year_built: '',
    acquisition_date: '',
    acquisition_price: '',
    current_value: '',
    market_area: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      units: formData.units ? parseInt(formData.units) : undefined,
      square_feet: formData.square_feet ? parseInt(formData.square_feet) : undefined,
      year_built: formData.year_built ? parseInt(formData.year_built) : undefined,
      acquisition_price: formData.acquisition_price ? parseFloat(formData.acquisition_price) : undefined,
      current_value: formData.current_value ? parseFloat(formData.current_value) : undefined,
    });
  };

  return (
    <div className="bg-white/[0.03] border border-emerald-400/20 p-8 shadow-2xl shadow-emerald-400/10">
      <h2 className="text-2xl font-light mb-6 text-white tracking-wide">ADD PORTFOLIO PROPERTY</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2 tracking-wide font-medium">PROPERTY NAME</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 tracking-wide font-medium">ADDRESS</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 tracking-wide font-medium">PROPERTY TYPE</label>
          <select
            value={formData.property_type}
            onChange={(e) => setFormData({...formData, property_type: e.target.value})}
            className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
          >
            <option value="">Select Type</option>
            <option value="Multifamily">Multifamily</option>
            <option value="Office">Office</option>
            <option value="Retail">Retail</option>
            <option value="Industrial">Industrial</option>
            <option value="Mixed Use">Mixed Use</option>
            <option value="Single Family">Single Family</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 tracking-wide font-medium">UNITS</label>
          <input
            type="number"
            value={formData.units}
            onChange={(e) => setFormData({...formData, units: e.target.value})}
            className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 tracking-wide font-medium">ACQUISITION PRICE</label>
          <input
            type="number"
            step="0.01"
            value={formData.acquisition_price}
            onChange={(e) => setFormData({...formData, acquisition_price: e.target.value})}
            className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 tracking-wide font-medium">CURRENT VALUE</label>
          <input
            type="number"
            step="0.01"
            value={formData.current_value}
            onChange={(e) => setFormData({...formData, current_value: e.target.value})}
            className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
          />
        </div>

        <div className="md:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-3 font-bold transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
          >
            ADD PROPERTY
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 font-bold transition-all duration-200 tracking-wide"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

const PortfolioPropertyCard = ({ property }: { property: PortfolioProperty }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] p-6 shadow-2xl shadow-emerald-400/10 hover:border-emerald-400/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-white tracking-wide">{property.name}</h3>
        <div className="bg-emerald-400/20 text-emerald-400 px-3 py-1 text-xs font-bold tracking-wider rounded">
          {property.status.toUpperCase()}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Type:</span>
          <span className="text-white">{property.property_type || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Units:</span>
          <span className="text-white">{property.units || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Current Value:</span>
          <span className="text-white">
            {property.current_value ? formatCurrency(property.current_value) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-emerald-400 font-bold">
              {property.latest_cap_rate ? `${(property.latest_cap_rate * 100).toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-gray-400">Cap Rate</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-bold">
              {property.latest_noi ? formatCurrency(property.latest_noi) : 'N/A'}
            </div>
            <div className="text-gray-400">NOI</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold">
              {property.latest_occupancy ? `${(property.latest_occupancy * 100).toFixed(0)}%` : 'N/A'}
            </div>
            <div className="text-gray-400">Occupancy</div>
          </div>
        </div>
      </div>
    </div>
  );
};
