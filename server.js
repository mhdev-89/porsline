const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your Chrome Extension can talk to this server safely
app.use(cors());
app.use(express.json());

// Master database stored in server memory
let globalSavedQuestions = [];

// Endpoint 1: Fetch all answered questions
app.get('/api/questions', (req, res) => {
  res.json({ savedQuestions: globalSavedQuestions });
});

// Endpoint 2: Submit a newly answered question
app.post('/api/questions', (req, res) => {
  const { title, userSelection } = req.body;

  if (!title || !userSelection) {
    return res.status(400).json({ error: "Missing title or selection" });
  }

  // Look for the question in our master database
  const existingIndex = globalSavedQuestions.findIndex(q => q.title === title);

  if (existingIndex > -1) {
    // If it exists, update it with the latest answer choice
    globalSavedQuestions[existingIndex].userSelection = userSelection;
    globalSavedQuestions[existingIndex].updatedAt = new Date().toLocaleString();
  } else {
    // If it's brand new, add it to the stack
    globalSavedQuestions.push({
      id: Date.now() + Math.random(),
      title,
      userSelection,
      savedAt: new Date().toLocaleString()
    });
  }

  res.json({ success: true, count: globalSavedQuestions.length });
});

// Endpoint 3: Clear server data (Utility)
app.delete('/api/questions', (req, res) => {
  globalSavedQuestions = [];
  res.json({ success: true, message: "Server database cleared" });
});

app.listen(PORT, () => {
  console.log(`Porsline sync server running on port ${PORT}`);
});