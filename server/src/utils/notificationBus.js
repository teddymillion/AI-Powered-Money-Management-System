// Shared in-memory SSE client registry
// Kept in its own module to avoid circular imports between profile.js and transactions.js

const sseClients = new Map();

export function registerClient(userId, res) {
  sseClients.set(String(userId), res);
}

export function removeClient(userId) {
  sseClients.delete(String(userId));
}

export function pushNotification(userId, notification) {
  const client = sseClients.get(String(userId));
  if (client) {
    try {
      client.write(`data: ${JSON.stringify(notification)}\n\n`);
    } catch {
      sseClients.delete(String(userId));
    }
  }
}
