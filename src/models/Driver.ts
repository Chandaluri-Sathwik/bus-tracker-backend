import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IDriver extends Document {
  username: string;
  password: string;
  busNumber: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const DriverSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  busNumber: { type: String, required: true }
});

// Password hashing middleware
// DriverSchema.pre<IDriver>('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// Password comparison method
DriverSchema.methods.comparePassword = function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const Driver: Model<IDriver> = mongoose.model<IDriver>('Driver', DriverSchema);
export default Driver;
