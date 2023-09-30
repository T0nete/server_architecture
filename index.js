const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add routes
const posts = require('./routes/posts');
app.use('/api', posts);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
