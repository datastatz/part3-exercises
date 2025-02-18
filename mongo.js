const mongoose = require('mongoose');

// Get the password from the command-line arguments
const password = process.argv[2];

// MongoDB Atlas connection URL (replace `<password>` with actual password)
const url = `mongodb+srv://amellouk600:${password}@cluster0.yq3oa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
mongoose.connect(url);

// Define the Schema (Structure of the Collection)
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Define the Model
const Person = mongoose.model('Person', personSchema);

// If user provides only password -> List all contacts
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} 
// If user provides password, name, and number -> Add new contact
else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} 
// If incorrect arguments are provided
else {
  console.log("Usage:");
  console.log("To list contacts: node mongo.js <password>");
  console.log("To add a contact: node mongo.js <password> <name> <number>");
  mongoose.connection.close();
}
