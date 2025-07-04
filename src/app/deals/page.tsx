"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import DeleteModal from '@/components/ui/DeleteModal';

interface Deal {
  id: number;
  name: string;
  property_type?: string;
  address?: string;
  status: string;
  created_at: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDeal, setNewDeal] = useState({ name: '', property_type: '', address: '' });
  const [showForm, setShowForm] = useState(false);
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    dealId: 0,
    dealName: '',
    isDeleting: false
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      const data = await response.json();
      setDeals(data);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeal),
      });

      if (response.ok) {
        setNewDeal({ name: '', property_type: '', address: '' });
        setShowForm(false);
        fetchDeals();
      }
    } catch (error) {
      console.error('Failed to create deal:', error);
    }
  };

  const handleDeleteClick = (deal: Deal) => {
    setDeleteModal({
      isOpen: true,
      dealId: deal.id,
      dealName: deal.name,
      isDeleting: false
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    
    try {
      const response = await fetch(`/api/deals/${deleteModal.dealId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove deal from local state
        setDeals(deals.filter(deal => deal.id !== deleteModal.dealId));
        
        // Close modal
        setDeleteModal({
          isOpen: false,
          dealId: 0,
          dealName: '',
          isDeleting: false
        });
      } else {
        console.error('Failed to delete deal');
        setDeleteModal(prev => ({ ...prev, isDeleting: false }));
      }
    } catch (error) {
      console.error('Delete error:', error);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      dealId: 0,
      dealName: '',
      isDeleting: false
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'analyzing': return 'text-yellow-400';
      case 'uploaded': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-400/10 border-emerald-400/30';
      case 'analyzing': return 'bg-yellow-400/10 border-yellow-400/30';
      case 'uploaded': return 'bg-blue-400/10 border-blue-400/30';
      default: return 'bg-gray-400/10 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <AppLayout title="DEAL PORTFOLIO">
        <div className="flex items-center justify-center h-64">
          <div className="text-emerald-400 text-xl tracking-wider">LOADING...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="DEAL PORTFOLIO">
      {/* Create Deal Section */}
      <div className="mb-12">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
        >
          {showForm ? 'CANCEL' : 'CREATE NEW DEAL'}
        </button>

        {showForm && (
          <div className="mt-6 bg-white/[0.03] border border-emerald-400/20 p-8 shadow-2xl shadow-emerald-400/10">
            <h2 className="text-2xl font-light mb-6 text-white tracking-wide">CREATE NEW DEAL</h2>
            <form onSubmit={createDeal} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 tracking-wide">DEAL NAME</label>
                <input
                  type="text"
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({...newDeal, name: e.target.value})}
                  className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="Enter deal name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 tracking-wide">PROPERTY TYPE</label>
                <select
                  value={newDeal.property_type}
                  onChange={(e) => setNewDeal({...newDeal, property_type: e.target.value})}
                  className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
                >
                  <option value="">Select Property Type</option>
                  <option value="multifamily">Multifamily</option>
                  <option value="retail">Retail</option>
                  <option value="office">Office</option>
                  <option value="industrial">Industrial</option>
                  <option value="mixed_use">Mixed Use</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 tracking-wide">ADDRESS</label>
                <input
                  type="text"
                  value={newDeal.address}
                  onChange={(e) => setNewDeal({...newDeal, address: e.target.value})}
                  className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="Enter property address"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
              >
                CREATE DEAL
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white/[0.03] border border-white/[0.08] p-8 hover:bg-emerald-400/5 hover:border-emerald-400/40 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-400/40 text-black">
                {deal.id}
              </div>
              <div className="flex items-center space-x-2">
                <div className={`text-xs tracking-widest font-bold px-3 py-1 border ${getStatusBg(deal.status)} ${getStatusColor(deal.status)}`}>
                  {deal.status.toUpperCase()}
                </div>
                <button
                  onClick={() => handleDeleteClick(deal)}
                  className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 hover:border-red-400 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center justify-center group"
                  title="Delete Deal"
                >
                  <span className="text-xs group-hover:scale-110 transition-transform">🗑</span>
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-normal mb-4 text-white tracking-wide">{deal.name}</h3>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
                <span className="text-gray-300 text-sm tracking-wide">TYPE: {deal.property_type?.toUpperCase() || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
                <span className="text-gray-300 text-sm tracking-wide">ADDRESS: {deal.address || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
                <span className="text-gray-300 text-sm tracking-wide">
                  CREATED: {new Date(deal.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <Link
              href={`/deals/${deal.id}`}
              className="block w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-6 py-3 font-bold text-center transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
            >
              ANALYZE DEAL
            </Link>

            {deals.some(d => d.status === 'completed') && (
              <Link
                href={`/deals/${deal.id}/analysis`}
                className="bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-300 hover:to-purple-400 text-black px-4 py-2 font-bold text-sm transition-all duration-200 shadow-lg shadow-violet-400/40 hover:shadow-violet-400/60 tracking-wide"
              >
                VIEW ANALYSIS
              </Link>
            )}
          </div>
        ))}
      </div>

      {deals.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl text-gray-600 mb-4">📊</div>
          <h3 className="text-xl text-gray-400 mb-2">No deals yet</h3>
          <p className="text-gray-500">Create your first deal to get started</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="DELETE DEAL"
        message="Are you sure you want to delete this deal? This action cannot be undone and will remove all associated documents and analysis."
        dealName={deleteModal.dealName}
        isDeleting={deleteModal.isDeleting}
      />
    </AppLayout>
  );
}
