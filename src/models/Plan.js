import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Plan price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    default: "per month"
  },
  features: [{
    type: String,
    trim: true
  }],
  popular: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: "blue"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update updated_at before saving
planSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.Plan || mongoose.model('Plan', planSchema);