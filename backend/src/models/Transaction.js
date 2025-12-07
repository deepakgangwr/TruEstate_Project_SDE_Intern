import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  customer: {
    id: String,
    name: {
      type: String,
      index: true
    },
    phone: String,
    gender: String,
    age: Number,
    region: String,
    type: {
      type: String
    }
  },
  product: {
    id: String,
    name: String,
    brand: String,
    category: {
      type: String,
      index: true
    },
    tags: [String]
  },
  sales: {
    quantity: Number,
    pricePerUnit: Number,
    discount: Number,
    totalAmount: Number,
    finalAmount: Number
  },
  meta: {
    date: { type: Date, index: true },
    paymentMethod: String,
    status: String,
    deliveryType: String,
    storeId: String,
    employeeName: String
  }
}, { timestamps: true });

TransactionSchema.index({ "customer.name": "text", "customer.phone": "text" });
TransactionSchema.index({ "customer.region": 1, "meta.date": -1 });
TransactionSchema.index({ "product.category": 1, "sales.quantity": -1 });
TransactionSchema.index({ "customer.gender": 1, "meta.date": -1 });

export default mongoose.model('Transaction', TransactionSchema);

