// Temporary script to set admin token for testing
// Run this in browser console or add to your app

// Set admin token in localStorage
localStorage.setItem('admin_token', 'temp-admin-token-for-testing');

console.log('Admin token set! You can now access the admin panel.');
console.log('Token:', localStorage.getItem('admin_token'));

// Reload page to apply changes
window.location.reload();
