import { Hono } from "hono";
import { serve } from '@hono/node-server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import 'dotenv/config'

const app = new Hono();

// Initialize database
let db;
(async () => {
  const dbPath = process.env.DB_PATH || '/app/data/calculations.db';
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  await db.exec('CREATE TABLE IF NOT EXISTS calculations (id INTEGER PRIMARY KEY AUTOINCREMENT, operation TEXT, a REAL, b REAL, result REAL)');
})();

app.get("/", (c) => c.text("Hello, World!"));
//make a calculator api with different routes for addition, subtraction, multiplication, and division

app.get("/add/:a/:b", async (c) => {
  const a = parseFloat(c.req.param('a'));
  const b = parseFloat(c.req.param('b'));
  const result = a + b;
  db.run('INSERT INTO calculations (operation, a, b, result) VALUES (?, ?, ?, ?)', ['addition', a, b, result]);
  return c.json({ result });
});

app.get("/subtract/:a/:b", async (c) => {
  const a = parseFloat(c.req.param('a'));
  const b = parseFloat(c.req.param('b'));
  const result = a - b;
  db.run('INSERT INTO calculations (operation, a, b, result) VALUES (?, ?, ?, ?)', ['subtraction', a, b, result]);
  return c.json({ result });
});

app.get("/multiply/:a/:b", async (c) => {
  const a = parseFloat(c.req.param('a'));
  const b = parseFloat(c.req.param('b'));
  const result = a * b;
  db.run('INSERT INTO calculations (operation, a, b, result) VALUES (?, ?, ?, ?)', ['multiplication', a, b, result]);
  return c.json({ result });
});

app.get("/divide/:a/:b", async (c) => {
  const a = parseFloat(c.req.param('a'));
  const b = parseFloat(c.req.param('b'));
  if (b === 0) {
    return c.json({ error: "Cannot divide by zero" }, 400);
  }
  const result = a / b;
  db.run('INSERT INTO calculations (operation, a, b, result) VALUES (?, ?, ?, ?)', ['division', a, b, result]);
  return c.json({ result });
});

// New route to get all calculations
app.get("/history", async (c) => {
  const calculations = await db.all('SELECT * FROM calculations');
  return c.json(calculations);
});

// Route to delete all calculations from the database
app.get("/clear-history", async (c) => {
  try {
    await db.run('DELETE FROM calculations');
    return c.json({ message: "All calculations have been deleted from the database." });
  } catch (error) {
    console.error("Error clearing database:", error);
    return c.json({ error: "An error occurred while clearing the database." }, 500);
  }
});

serve({
    fetch: app.fetch,
    port: 3001,
})