const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

console.log('Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error.message));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// ✅ FIX: Ensure correct export
const Person = mongoose.model('Person', personSchema);
module.exports = Person;
