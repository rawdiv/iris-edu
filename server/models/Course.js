const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: [
            'Web Development',
            'Data Science',
            'Digital Marketing',
            'UI/UX Design',
            'Mobile Development',
            'Business',
            'Other'
        ]
    },
    duration: {
        type: Number,
        required: [true, 'Please add duration in weeks']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price must be a positive number']
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals
CourseSchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});

// Cascade delete applications when a course is deleted
CourseSchema.pre('remove', async function(next) {
    await this.model('Application').deleteMany({ course: this._id });
    next();
});

module.exports = mongoose.model('Course', CourseSchema);
