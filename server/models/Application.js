const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    processedAt: Date,
    processedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    notes: String
});

// Prevent user from applying to the same course multiple times
ApplicationSchema.index({ user: 1, course: 1 }, { unique: true });

// Static method to get average course tuition
ApplicationSchema.statics.getAverageCost = async function(courseId) {
    const obj = await this.aggregate([
        {
            $match: { course: courseId }
        },
        {
            $group: {
                _id: '$course',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {
        await this.model('Course').findByIdAndUpdate(courseId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageCost after save
ApplicationSchema.post('save', async function() {
    await this.constructor.getAverageCost(this.course);
});

// Call getAverageCost before remove
ApplicationSchema.post('remove', async function() {
    await this.constructor.getAverageCost(this.course);
});

module.exports = mongoose.model('Application', ApplicationSchema);
