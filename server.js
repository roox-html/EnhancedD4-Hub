const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Create and connect to SQLite database
const db = new sqlite3.Database("./feedback.db", (err) => {
    if (err) {
        console.error("Error connecting to SQLite database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create feedback table
db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Route to submit feedback
app.post("/submit-feedback", (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).json({ error: "Username and message are required." });
    }

    db.run(`INSERT INTO feedback (username, message) VALUES (?, ?)`, 
        [username, message], 
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        }
    );
});

// Route to get all feedback
app.get("/feedback", (req, res) => {
    db.all("SELECT * FROM feedback ORDER BY timestamp DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});