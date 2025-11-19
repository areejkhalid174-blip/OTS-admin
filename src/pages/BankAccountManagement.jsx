import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function BankAccountManagement() {
  const [bankAccount, setBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    branchCode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchBankAccount = async () => {
      try {
        const docRef = doc(db, 'settings', 'bankAccount');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBankAccount(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching bank account:', error);
        setMessage({ text: 'Failed to load bank account details', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankAccount();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await setDoc(doc(db, 'settings', 'bankAccount'), bankAccount, { merge: true });
      setMessage({ text: 'Bank account details saved successfully!', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving bank account:', error);
      setMessage({ text: 'Failed to save bank account details', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isEditing) {
    return <div className="p-6">Loading bank account details...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Bank Account Management</h1>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Bank Account Details</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Edit Details
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="font-medium">{bankAccount.bankName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-medium">{bankAccount.accountNumber || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Holder Name</p>
                <p className="font-medium">{bankAccount.accountHolderName || 'Not set'}</p>
              </div>
              {bankAccount.branchCode && (
                <div>
                  <p className="text-sm text-gray-500">Branch Code</p>
                  <p className="font-medium">{bankAccount.branchCode}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={bankAccount.bankName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={bankAccount.accountNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  value={bankAccount.accountHolderName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="branchCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Code
                </label>
                <input
                  type="text"
                  id="branchCode"
                  name="branchCode"
                  value={bankAccount.branchCode || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setMessage({ text: '', type: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
