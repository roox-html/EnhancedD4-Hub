const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FEEDBACK_FILE = "feedback.json";

// Load existing feedback
app.get("/feedback", (req, res) => {
    fs.readFile(FEEDBACK_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading feedback file" });
        }
        res.json(JSON.parse(data));
    });
});

// Save new feedback
app.post("/submit-feedback", (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).json({ error: "Username and message required" });
    }

    const newFeedback = { username, message, date: new Date().toLocaleString() };

    fs.readFile(FEEDBACK_FILE, "utf8", (err, data) => {
        let feedbackData = [];
        if (!err && data) {
            feedbackData = JSON.parse(data);
        }

        feedbackData.push(newFeedback);
        fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error saving feedback" });
            }
            res.json({ success: true });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});