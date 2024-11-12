import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: 'Users' } // Se asegura de que la colección sea "Users"
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
