import { useState } from "react";

// Plan Modal Component
function PlanModal({ plan, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    price: plan?.price || '',
    duration: plan?.duration || 'per month',
    features: plan?.features?.join('\n') || '',
    popular: plan?.popular || false,
    color: plan?.color || 'blue',
    isActive: plan?.isActive !== undefined ? plan.isActive : true
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name.trim()) {
      alert('Plan name is required');
      return;
    }

    if (!formData.price || formData.price < 0) {
      alert('Valid plan price is required');
      return;
    }

    if (!formData.features.trim()) {
      alert('At least one feature is required');
      return;
    }

    const planData = {
      ...formData,
      price: Number(formData.price),
      features: formData.features.split('\n').filter(f => f.trim() !== '')
    };

    if (plan?._id) {
      planData._id = plan._id;
    }

    // Loading state start karo
    setIsLoading(true);

    try {
      await onSave(planData);
      // onSave successful hoga to modal automatically close ho jayega
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error saving plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {plan ? 'Edit Plan' : 'Add New Plan'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Basic Plan, Professional Plan"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="999"
              min="0"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <option value="per month">Per Month</option>
              <option value="per year">Per Year</option>
              <option value="one-time">One Time</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (One per line) *
            </label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              rows="4"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="5 Level Commission&#10;Basic Support&#10;Access to Dashboard"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">Popular Plan</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">Active Plan</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="indigo">Indigo</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#8200DB] hover:bg-[#6E11B0] px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {plan ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                plan ? 'Update Plan' : 'Create Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanModal;