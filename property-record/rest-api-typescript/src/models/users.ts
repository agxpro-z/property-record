import mongoose from "mongoose";
import * as config from './../config';

mongoose.connect(config.mongoUri);

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  orgId: String,
  mspId: String
});

const User = mongoose.model('User', userSchema);
export { User };
