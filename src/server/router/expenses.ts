import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {} from "hono";

export const expenseSchema = z.object({
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
  id: z.number().int().positive().min(1),
});

type Expenses = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

export const fakeExpenses: Expenses[] = [
  {
    id: 1,
    title: "test",
    amount: 100,
  },
  {
    id: 2,
    title: "test2",
    amount: 200,
  },
  {
    id: 3,
    title: "test3",
    amount: 300,
  },
];

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expenses = c.req.valid("json");

    fakeExpenses.push({ ...expenses, id: fakeExpenses.length });
    c.status(201);
    return c.json({ post: expenses });
  })
  .get("/total-spent", async (c) => {
    const total = fakeExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    return c.json({ total });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number(c.req.param("id"));

    const expense = fakeExpenses.find((expense) => expense.id === id);

    if (!expense) return c.notFound();
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number(c.req.param("id"));

    const index = fakeExpenses.findIndex((expense) => expense.id === id);

    if (index === -1) return c.notFound();
    const delteedExpense = fakeExpenses.splice(index, 1)[0];
    return c.json({ expense: delteedExpense });
  });
