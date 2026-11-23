import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    mobile: {
      type: String,
      trim: true,
      maxlength: 30,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 4000,
    },
    // "contact" = Get In Touch form, "join" = Join Us / "coffee" CTA
    kind: {
      type: String,
      enum: ['contact', 'join'],
      default: 'contact',
      index: true,
    },
    meta: {
      ip: { type: String, default: '' },
      userAgent: { type: String, default: '' },
      source: { type: String, default: 'website' },
    },
    handled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
