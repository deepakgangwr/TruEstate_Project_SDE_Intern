import dotenv from 'dotenv';
import mongoose from 'mongoose';
import csv from 'csvtojson';
import Transaction from './src/models/Transaction.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to DB. Starting stream...');

    // Clear old data first
    await Transaction.deleteMany({});
    console.log(' Old data cleared.');

    const csvFilePath = path.join(__dirname, 'truestate_assignment_dataset.csv');
    
    // Batch Processing Configuration
    const BATCH_SIZE = 1000; 
    let batch = [];
    let counter = 0;

    // Stream the file row by row
    await csv()
      .fromFile(csvFilePath)
      .subscribe(async (json) => {
        // 1. Format the single row
        const formattedItem = {
          customer: {
            id: json['Customer ID'],
            name: json['Customer Name'],
            phone: json['Phone Number'],
            gender: json['Gender'],
            age: Number(json['Age']),
            region: json['Customer Region'],
            type: json['Customer Type']
          },
          product: {
            id: json['Product ID'],
            name: json['Product Name'],
            brand: json['Brand'],
            category: json['Product Category'],
            tags: json['Tags'] ? json['Tags'].split(',').map(t => t.trim()) : []
          },
          sales: {
            quantity: Number(json['Quantity']),
            pricePerUnit: Number(json['Price per Unit']),
            discount: Number(json['Discount Percentage']),
            totalAmount: Number(json['Total Amount']),
            finalAmount: Number(json['Final Amount'])
          },
          meta: {
            date: new Date(json['Date']),
            paymentMethod: json['Payment Method'],
            status: json['Order Status'],
            deliveryType: json['Delivery Type'],
            storeId: json['Store ID'],
            employeeName: json['Employee Name']
          }
        };

        // 2. Add to batch
        batch.push(formattedItem);

        // 3. If batch is full, save to DB and clear memory
        if (batch.length >= BATCH_SIZE) {
          await Transaction.insertMany(batch);
          counter += batch.length;
          console.log(`Processed ${counter} records...`);
          batch = []; // Free up memory
        }
      });

    // 4. Save any remaining records (the final partial batch)
    if (batch.length > 0) {
      await Transaction.insertMany(batch);
      counter += batch.length;
      console.log(` Processed ${counter} records...`);
    }

    console.log(' Data Import Completed Successfully!');
    process.exit();

  } catch (error) {
    console.error(' Error:', error);
    process.exit(1);
  }
};

seedDB();

