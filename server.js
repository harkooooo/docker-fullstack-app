const http = require("http");
const { Client } = require("pg");

const client = new Client({
  host: "db",
  user: "user",
  password: "password",
  database: "mydb",
  port: 5432,
});

async function startServer() {
  let connected = false;

  while (!connected) {
    try {
      await client.connect();
      console.log("Connected to DB");
      connected = true;
    } catch (err) {
      console.log("Waiting for DB...");
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  const server = http.createServer(async (req, res) => {
    if (req.url === "/api") {
      const result = await client.query("SELECT NOW()");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows[0]));
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  server.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

startServer();