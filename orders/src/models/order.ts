import mongoose from 'mongoose';
import { OrderStatus } from '@ts-tickets/common';

// An interface that describes the props
// that are required to create a new Order
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// An interface that describes the properties
// that a Order document has
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
},
 // Redefinind how we return Order schema object to avoid _id 
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

// Pattern for creating a Order with attrs we want to control by TypeScript
// Now we are going to use this method as a constructor: 
// const order = order.build({ userId: '123', status: 'expired' })
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);


export { Order };