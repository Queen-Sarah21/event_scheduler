const express = require("express");
const mysql = require("mysql2/promise");
const cors = require('cors');

const app = express();
app.use(cors());

const port = 3001;

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "event-scheduler",
    port: 3312
};

// JSON
/*

{
    id: 1
    name: "Allan"
}

*/

app.use(express.json()); // express.json() => middleware 


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
        res.status(200).json(rows); // array of objects with our data
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