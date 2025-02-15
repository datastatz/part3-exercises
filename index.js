const express = require('express');
const app = express();

// For parsing JSON bodies in requests:
app.use(express.json());

// Example route:
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start the server:
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
