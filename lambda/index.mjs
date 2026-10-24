import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME || "guestbook";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

const reply = (statusCode, data) => ({
  statusCode,
  headers,
  body: JSON.stringify(data), // body має бути рядком
});

export const handler = async (event) => {
  const method = event.httpMethod;

  try {
    if (method === "OPTIONS") return reply(200, {});

    if (method === "GET") {
      const { Items = [] } = await db.send(new ScanCommand({ TableName: TABLE }));
      Items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return reply(200, Items);
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const name = String(body.name || "").trim().slice(0, 60);
      const text = String(body.text || "").trim().slice(0, 500);
      if (!name || !text) return reply(400, { error: "Потрібні поля name і text" });

      const item = { id: randomUUID(), name, text, createdAt: new Date().toISOString() };
      await db.send(new PutCommand({ TableName: TABLE, Item: item }));
      return reply(201, item);
    }

    return reply(405, { error: "Метод не підтримується" });
  } catch (err) {
    console.error(err);
    return reply(500, { error: "Помилка сервера" });
  }
};
