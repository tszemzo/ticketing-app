import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the props
// that are required to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties
// that a Ticket document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string; // possibly undefined
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
  }
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

ticketSchema.set('versionKey', 'version');
// Plugs in the version updater on the each ticket schema
ticketSchema.plugin(updateIfCurrentPlugin);

// Pattern for creating a Ticket with attrs we want to control by TypeScript
// Now we are going to use this method as a constructor: 
// const ticket = Ticket.build({ title: 'A title', prize: 10 })
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export { Ticket };