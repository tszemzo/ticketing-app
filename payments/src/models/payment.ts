import mongoose from 'mongoose';

// An interface that describes the props
// that are required to create a new Payment
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// An interface that describes the properties
// that a Payment Model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

// An interface that describes the properties that a Payment document has
// No version required as a Payment won't change in the future
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  },
},
 // Redefinind how we return Payment schema object to avoid _id 
 // toJSON is the JSON.stringify() method, we are redifining it
 // This is not very typical to do it here at the Model
 {
   toJSON: {
    transform(doc, ret) {
      // delete the props of the object we are returning
      ret.id = ret._id;
      delete ret._id;
    }
   } 
 }
);

// Pattern for creating a Payment with attrs we want to control by TypeScript
// Now we are going to use this method as a constructor: 
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };

