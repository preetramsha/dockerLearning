import { Hono } from "hono";
import { serve } from '@hono/node-server'

const app = new Hono();

app.get("/", (c) => c.text("Hello, World!"));
//make a calculator api with different routes for addition, subtraction, multiplication, and division

app.get("/add/:a/:b", async (c) => {
  const a = parseFloat(c.req.param('a'));
  const b = parseFloat(c.req.param('b'));
  const result = a + b;
  return c.json({ result });
});

app.get("/subtract/:a/:b", async (c) => {
  const a = parseFloat(c.req.param('a'));
  const b = parseFloat(c.req.param('b'));
  const result = a - b;
  return c.json({ result });
});

app.get("/multiply/:a/:b", async (c) => {
  const a = parseFloat(c.req.param('a'));
  const b = parseFloat(c.req.param('b'));
  const result = a * b;
  return c.json({ result });
});

app.get("/divide/:a/:b", async (c) => {
  const a = parseFloat(c.req.param('a'));
  const b = parseFloat(c.req.param('b'));
  if (b === 0) {
    return c.json({ error: "Cannot divide by zero" }, 400);
  }
  const result = a / b;
  return c.json({ result });
});

serve({
    fetch: app.fetch,
    port: 3001,
})