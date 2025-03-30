const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost", 
    user: "root",       
    password: "Abc@123", 
    database: "users"
});




db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Signup Route
app.post("/signup", async (req, res) => {
    const { fullname, contact, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const sql = "INSERT INTO users_data(fullname, contact, email, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [fullname, contact, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Email already exists or error in database" });
        }
        res.status(200).json({ message: "Signup successful!" });
    });
});


// Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Fetch user from database
    const sql = "SELECT * FROM users_data WHERE fullname = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = results[0];

        // Check hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.status(200).json({ message: "Login successful!" });
        render
    });
});

// Start Server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
