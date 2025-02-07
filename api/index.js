const express = require("express");
const mysql = require("mysql2/promise");
const cors = require('cors');

const app = express();
app.use(cors());

const port = 3000;

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "event-scheduler",
    port: 3313
};

// JSON
/*

{
    id: 1
    name: "Allan"
}

*/

app.use(express.json()); // express.json() => middleware 

// DELETE endpoint to remove an event
app.delete("/api/schedule/:id", async (req, res) => {
    const { id } = req.params;
    console.log(`Received request to delete schedule with ID: ${id}`);

    try {
        const conn = await mysql.createConnection(dbConfig);
        const query = "DELETE FROM events WHERE id = ?";
        const [result] = await conn.execute(query, [id]);
        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: `Failed to delete event: ${e.message}` });
    }
});

app.put("/api/schedule/:id", async (req, res) => {
    const { id } = req.params;
    const { title, date, description } = req.body;

    console.log("Received update for event:", { id, title, date, description });

    if (!title || !date || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const conn = await mysql.createConnection(dbConfig);
        const query = "UPDATE events SET title = ?, date = ?, description = ? WHERE id = ?";
        const [result] = await conn.execute(query, [title, date, description, id]);
        await conn.end();

        console.log("Update result:", result); // Log the result from MySQL

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully" });
    } catch (e) {
        console.error("Error while updating event:", e);
        res.status(500).json({ error: `Failed to update event: ${e.message}` });
    }
});


// POST, GET, PUT, PATCH, DELETE 
// "/api/register" endpoint > http://localhost/api/register
app.post("/api/schedule", async (req, res) => { /// every time we want create something

    const { title, date, description } = req.body;

    if(!title || !date || !description){
        return res.status(400).json({error: "All fields are required"});
    }

    try {
        const conn = await mysql.createConnection(dbConfig);

        const query = "INSERT INTO events (title, date, description) VALUES (?, ?, ?)";
        await conn.execute(query, [title, date, description]);
        await conn.end();
        res.status(201).json({message: "Created with success"});

    } catch (e) {
        res.status(500).json({error: `Something happens in the server: ${e}` });
    }
});


//
app.get("/api/schedule", async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute("SELECT * FROM events");
        await conn.end();
        console.log("Fetched events from the database:", rows); // Log events data
        res.status(200).json(rows);
    } catch (e) {
        res.status(500).json({ error: `Failed to retrieve events: ${e.message}` });
    }
});


//
app.get("/", async (req, res) => {

        res.status(200).json({message: "API now running"}); // array of objects with our data

});


//

async function initDatabase() {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [tables] = await conn.query("SHOW TABLES like 'events'");

        if(tables.length === 0){
            const createTableQuery = `
                CREATE TABLE events (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    date DATE NOT NULL,
                    description VARCHAR(100) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;

            await conn.query(createTableQuery);
            console.log("Table created");
        }

        await conn.end();

    } catch (error) {
        console.error("Database error ", error);
        process.exit(1);
    }
}

initDatabase().then(() => {
    app.listen(port, () => {
        console.log(`The server is running, PORT: ${port}`)
    })
})

// promises: 2 states in promises ... reject(),  resolve()