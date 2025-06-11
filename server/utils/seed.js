const User = require('../models/User');

// Create admin user if not exists
const createAdminUser = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        
        if (!adminExists) {
            // Create admin
            await User.create({
                name: 'Admin User',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin'
            });
            
            console.log('Admin user created successfully');
        }
    } catch (err) {
        console.error('Error creating admin user:', err);
    }
};

module.exports = { createAdminUser };
