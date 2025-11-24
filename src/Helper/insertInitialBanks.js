import { addData } from './firebaseHelper';

/**
 * Function to insert initial banks into Firebase
 * Call this function ONCE to populate the banks collection with default banks
 * 
 * Usage: Call insertInitialBanks() from browser console or a one-time setup script
 */
export const insertInitialBanks = async () => {
  const initialBanks = [
    {
      name: 'JazzCash',
      type: 'mobile_wallet',
      accountNumber: '03001234567',
      accountHolderName: 'ParcelPro Admin',
      branchCode: 'JC-001',
      branchAddress: 'Main Office, Karachi',
      phone: '03001234567',
      email: 'support@jazzcash.com.pk',
      status: 'active',
      icon: 'jazzcash',
      description: 'JazzCash mobile wallet for easy payments',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'EasyPaisa',
      type: 'mobile_wallet',
      accountNumber: '03001234568',
      accountHolderName: 'ParcelPro Admin',
      branchCode: 'EP-001',
      branchAddress: 'Main Office, Lahore',
      phone: '03001234568',
      email: 'support@easypaisa.com.pk',
      status: 'active',
      icon: 'easypaisa',
      description: 'EasyPaisa mobile wallet service',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'UBL',
      type: 'bank',
      accountNumber: '1234567890123',
      accountHolderName: 'ParcelPro Services Pvt Ltd',
      branchCode: 'UBL-001',
      branchAddress: 'Main Branch, I.I. Chundrigar Road, Karachi',
      phone: '021-111-825-888',
      email: 'info@ubl.com.pk',
      status: 'active',
      icon: 'ubl',
      description: 'United Bank Limited - Main Corporate Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'HBL',
      type: 'bank',
      accountNumber: '9876543210987',
      accountHolderName: 'ParcelPro Services Pvt Ltd',
      branchCode: 'HBL-002',
      branchAddress: 'Gulberg Branch, Lahore',
      phone: '021-111-425-225',
      email: 'info@hbl.com',
      status: 'active',
      icon: 'hbl',
      description: 'Habib Bank Limited - Corporate Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'MCB',
      type: 'bank',
      accountNumber: '4567890123456',
      accountHolderName: 'ParcelPro Services Pvt Ltd',
      branchCode: 'MCB-003',
      branchAddress: 'Blue Area Branch, Islamabad',
      phone: '021-111-622-622',
      email: 'info@mcb.com.pk',
      status: 'active',
      icon: 'mcb',
      description: 'Muslim Commercial Bank - Business Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Allied Bank',
      type: 'bank',
      accountNumber: '7890123456789',
      accountHolderName: 'ParcelPro Services Pvt Ltd',
      branchCode: 'ABL-004',
      branchAddress: 'Faisalabad Branch, Faisalabad',
      phone: '021-111-225-243',
      email: 'info@abl.com',
      status: 'active',
      icon: 'allied',
      description: 'Allied Bank Limited - Current Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Bank Alfalah',
      type: 'bank',
      accountNumber: '2345678901234',
      accountHolderName: 'ParcelPro Services Pvt Ltd',
      branchCode: 'BAF-005',
      branchAddress: 'DHA Branch, Karachi',
      phone: '021-111-225-111',
      email: 'info@bankalfalah.com',
      status: 'active',
      icon: 'alfalah',
      description: 'Bank Alfalah Limited - Corporate Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Meezan Bank',
      type: 'bank',
      accountNumber: '5678901234567',
      accountHolderName: 'ParcelPro Services Pvt Ltd',
      branchCode: 'MZB-006',
      branchAddress: 'Model Town Branch, Lahore',
      phone: '021-111-331-331',
      email: 'info@meezanbank.com',
      status: 'active',
      icon: 'meezan',
      description: 'Meezan Bank Limited - Islamic Banking Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Standard Chartered',
      type: 'bank',
      accountNumber: '8901234567890',
      accountHolderName: 'ParcelPro Services Pvt Ltd',
      branchCode: 'SCB-007',
      branchAddress: 'Clifton Branch, Karachi',
      phone: '021-111-002-002',
      email: 'info@sc.com',
      status: 'active',
      icon: 'sc',
      description: 'Standard Chartered Bank - Premium Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'Faysal Bank',
      type: 'bank',
      accountNumber: '3456789012345',
      accountHolderName: 'ParcelPro Services Pvt Ltd',
      branchCode: 'FBL-008',
      branchAddress: 'Rawalpindi Branch, Rawalpindi',
      phone: '021-111-329-329',
      email: 'info@faysalbank.com',
      status: 'active',
      icon: 'faysal',
      description: 'Faysal Bank Limited - Business Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  try {
    console.log('Starting to insert initial banks...');
    let successCount = 0;
    let errorCount = 0;

    for (const bank of initialBanks) {
      try {
        await addData('banks', bank);
        successCount++;
        console.log(`✓ Inserted: ${bank.name}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Failed to insert ${bank.name}:`, error);
      }
    }

    console.log(`\n=== Insertion Complete ===`);
    console.log(`Successfully inserted: ${successCount} banks`);
    console.log(`Failed: ${errorCount} banks`);
    console.log(`Total: ${initialBanks.length} banks`);

    return {
      success: true,
      inserted: successCount,
      failed: errorCount,
      total: initialBanks.length
    };
  } catch (error) {
    console.error('Error inserting initial banks:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export a function that can be called from browser console
// Usage: window.insertInitialBanks()
if (typeof window !== 'undefined') {
  window.insertInitialBanks = insertInitialBanks;
}

