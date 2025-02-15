const express = require('express');
const app = express();

// For parsing JSON bodies in requests:
app.use(express.json());


// All the data of the PhoneBook
const data = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


// GET request route
app.get('/api/persons', (req, res) => {
  res.json(data);
});

// Get request route
app.get('/info' , (req, res) => {

  // const that create a new Date object
  const dateNow = new Date().toString();

  res.send(`
    <p>PhoneBook has info for 2 people</p>
    <p>${dateNow}</p>
    `)

  

});



// Start the server:
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
