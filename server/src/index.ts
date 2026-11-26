import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { createMongoAbility, subject } from "@casl/ability";
import { z } from "zod";
import { facilities, grievances, inspections, paginate } from "./data.js";

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  { id: "sara", name: "Sara Ahmed", password: "demo123", region: "Cairo", module: "Grievance", action: "approve", facilityAction: "activate" },
  { id: "omar", name: "Omar Hassan", password: "demo123", region: "Alexandria", module: "Inspection", action: "complete", facilityAction: "deactivate" },
];
const sessions = new Map<string, string>();

function profile(user: typeof users[number]) {
  return {
    user: { id: user.id, name: user.name, region: user.region },
    rules: [
      { action: "read", subject: user.module },
      { action: user.action, subject: user.module },
      { action: "read", subject: "Facility", conditions: { region: user.region } },
      { action: user.facilityAction, subject: "Facility", conditions: { region: user.region } },
    ],
  };
}

app.post("/api/login", (req, res) => {
  const user = users.find((item) => item.id === req.body?.username && item.password === req.body?.password);
  if (!user) {
    res.status(401).json({ error: "Incorrect username or password" });
    return;
  }
  const token = randomUUID();
  sessions.set(token, user.id);
  res.json({ token });
});

app.use("/api", (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer /, "");
  const user = users.find((item) => item.id === sessions.get(token ?? ""));
  if (!user) {
    res.status(401).json({ error: "Please log in" });
    return;
  }
  res.locals.user = user;
  res.locals.token = token;
  next();
});

app.get("/api/me", (_req, res) => res.json(profile(res.locals.user)));
app.post("/api/logout", (_req, res) => {
  sessions.delete(res.locals.token);
  res.json({ ok: true });
});

const pagination = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

for (const [path, type, records] of [
  ["grievances", "Grievance", grievances],
  ["inspections", "Inspection", inspections],
  ["facilities", "Facility", facilities],
] as const) {
  app.get(`/api/${path}`, (req, res) => {
    const ability = createMongoAbility(profile(res.locals.user).rules);
    if (!ability.can("read", type)) {
      res.status(403).json({ error: "You cannot access this module" });
      return;
    }
    const query = pagination.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid pagination" });
      return;
    }
    const visible = records.filter((record) => ability.can("read", subject(type, record)));
    res.json(paginate(visible, query.data.page, query.data.pageSize));
  });

  app.get(`/api/${path}/:id`, (req, res) => {
    const ability = createMongoAbility(profile(res.locals.user).rules);
    const record = records.find((item) => item.id === Number(req.params.id));
    if (!ability.can("read", type)) {
      res.status(403).json({ error: "You cannot access this module" });
      return;
    }
    if (!record) {
      res.status(404).json({ error: "Record not found" });
      return;
    }
    if (!ability.can("read", subject(type, record))) {
      res.status(403).json({ error: "You cannot access this record" });
      return;
    }
    res.json(record);
  });

  app.post(`/api/${path}/:id/actions/:action`, (req, res) => {
    const record = records.find((item) => item.id === Number(req.params.id));
    const ability = createMongoAbility(profile(res.locals.user).rules);
    const action = req.params.action;
    if (!record || !ability.can(action, subject(type, record))) {
      res.status(403).json({ error: "You cannot perform this action on this record" });
      return;
    }
    if (type === "Facility" && (action === "activate" || action === "deactivate")) {
      Object.assign(record, { status: action === "activate" ? "active" : "inactive" });
    } else if (type === "Grievance" && action === "approve") {
      Object.assign(record, { status: "resolved" });
    } else if (type === "Inspection" && action === "complete") {
      Object.assign(record, { result: "pass" });
    } else {
      res.status(400).json({ error: "Unknown action" });
      return;
    }
    res.json(record);
  });
}

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`Express API running at http://localhost:${port}`));
