const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Application = require('../models/Application');

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Course.deleteMany({});
    await Application.deleteMany({});
    console.log('Database cleared');
  } catch (err) {
    console.error('Error clearing database:', err.message);
    process.exit(1);
  }
};

// Import sample data
const importData = async () => {
  try {
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@irisdigital.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create instructor
    const instructor = await User.create({
      name: 'John Doe',
      email: 'instructor@irisdigital.com',
      password: 'instructor123',
      role: 'instructor',
    });

    // Create student
    const student = await User.create({
      name: 'Jane Smith',
      email: 'student@irisdigital.com',
      password: 'student123',
      role: 'user',
    });

    // Create courses
    const courses = [
      {
        title: 'Web Development Bootcamp',
        description: 'Learn full-stack web development with modern technologies',
        category: 'Web Development',
        duration: 12,
        price: 499,
        instructor: instructor._id,
        isPublished: true,
        image: 'web-dev.jpg',
      },
      {
        title: 'Data Science Fundamentals',
        description: 'Introduction to data science and machine learning',
        category: 'Data Science',
        duration: 16,
        price: 599,
        instructor: instructor._id,
        isPublished: true,
        image: 'data-science.jpg',
      },
      {
        title: 'Digital Marketing Masterclass',
        description: 'Master digital marketing strategies and tools',
        category: 'Digital Marketing',
        duration: 8,
        price: 399,
        instructor: instructor._id,
        isPublished: true,
        image: 'digital-marketing.jpg',
      },
    ];

    const createdCourses = await Course.create(courses);

    // Create applications
    const applications = [
      {
        user: student._id,
        course: createdCourses[0]._id,
        status: 'approved',
        phone: '1234567890',
        address: '123 Main St, City',
        education: 'Bachelor\'s in Computer Science',
      },
      {
        user: student._id,
        course: createdCourses[1]._id,
        status: 'pending',
        phone: '1234567890',
        address: '123 Main St, City',
        education: 'Bachelor\'s in Computer Science',
      },
    ];

    await Application.create(applications);

    console.log('Sample data imported');
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err.message);
    process.exit(1);
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await clearData();
  await importData();
};

// Check if run directly
if (require.main === module) {
  runSeeder();
}

module.exports = runSeeder;
