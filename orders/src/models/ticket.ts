import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// An interface that describes the props
// that are required to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties
// that a Ticket document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
},
 // Redefinind how we return Ticket schema object to avoid _id 
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

// Pattern for creating a Ticket with attrs we want to control by TypeScript
// Now we are going to use this method as a constructor: 
// const ticket = ticket.build({ title: 'A title', price: 12 })
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function() {
  // this === the ticket document we just called 'isReserved'
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
