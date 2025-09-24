const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

// Disable CORS restrictions for all origins

app.use(cors());

exec("adb devices", () => {});

// Core: Run command from ?command= and return JSON
app.get("/exec", (req, res) => {
  const { command } = req.query;

  if (!command) {
    return res.status(400).json({ error: "No command provided." });
  }

  exec(`zsh -c 'source ~/.zshrc && ${command}'`, (error, stdout, stderr) => {
    res.json({
      command: command,
      stdout: stdout,
      stderr: stderr,
      error: error ? error.message : null,
    });
  });
});

app.get("/test", (req, res) => {
  res.json("Works fine");
});

const PORT = 8321;

app.listen(PORT, () => {
  console.log(`Proxy server started on port ${PORT}`);
});
