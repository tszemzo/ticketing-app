import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the props
// that are required to create a new user

interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User document has

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},
 // Redefinind how we return user schema object to avoid _id or password 
 // toJSON is the JSON.stringify() method, we are redifining it
 // This is not very typical to do it here at the Model
 {
   toJSON: {
    transform(doc, ret) {
      // delete the props of the object we are returning
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
   } 
 });

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
})

// Pattern for creating a user with attrs we want to control by TypeScript
// Now we are going to use this method as a constructor: 
// const user = User.build({ email: 'test@test.com', password: 'sarasa' })
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export { User };