const mongoose = require('mongoose')
require('dotenv').config() // Load environment variables

console.log('Connecting to MongoDB...')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,  // Enforce minimum length of 3 characters
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: 8, // Ensuring at least 8 characters are in place
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v) // Validates phone format XX-XXXXXX or XXX-XXXXXX
      },

      message: props => `${props.value} is not a valid phone number!`

    },
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


const Person = mongoose.model('Person', personSchema)
module.exports = Person
