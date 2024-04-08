const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const net = require('net');

function findAvailablePort(startPort, callback) {
    const server = net.createServer();

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            // Port is already in use, try the next one
            findAvailablePort(startPort + 1, callback);
        } else {
            // Other error occurred, notify the callback
            callback(err);
        }
    });

    server.listen(startPort, () => {
        // Port is available
        server.close(() => {
            callback(null, startPort);
        });
    });
}

// Create an HTTP server
findAvailablePort(3000, (err, port) => {
    if (err) {
        console.error('Error finding available port:', err);
    } else {
        const server = http.createServer((req, res) => {
            // Set response headers
            res.writeHead(200, {'Content-Type': 'application/json'});

            // Open SQLite database
            let sqlite = new sqlite3.Database('your_database_file.sqlite');

            // Query to retrieve all users
            sqlite.all('SELECT * FROM Users', (err, users) => {
                if (err) {
                    console.error(err.message);
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    // Query to retrieve all incidents
                    sqlite.all('SELECT * FROM Incidents', (err, incidents) => {
                        if (err) {
                            console.error(err.message);
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            // Query to retrieve all ambulances
                            sqlite.all('SELECT * FROM Ambulances', (err, ambulances) => {
                                if (err) {
                                    console.error(err.message);
                                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                                } else {
                                    // Query to retrieve all communication messages
                                    sqlite.all('SELECT * FROM Communication', (err, messages) => {
                                        if (err) {
                                            console.error(err.message);
                                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                                        } else {
                                            // Prepare data object with results from all tables
                                            const data = {
                                                users: users,
                                                incidents: incidents,
                                                ambulances: ambulances,
                                                messages: messages
                                            };
                                            // Send the data as JSON response
                                            res.end(JSON.stringify(data));

                                            // Close the database connection
                                            sqlite.close();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });

        // Start the server
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
});
