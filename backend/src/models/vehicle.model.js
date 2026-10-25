import mongoose from 'mongoose';
import { VEHICLE_CATEGORIES } from '../constants/vehicleCategories.js';

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: VEHICLE_CATEGORIES,
        message: '{VALUE} is not a valid vehicle category',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} must be an integer',
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: Number,
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 2, 'Year cannot be in the distant future'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for fast searching and sorting
vehicleSchema.index({ make: 1, model: 1 });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ price: 1 });
vehicleSchema.index({ createdAt: -1 });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
