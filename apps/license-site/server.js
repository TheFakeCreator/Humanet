const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3002;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(
    `Open Idea Commons License site listening at http://localhost:${port}`
  );
});
