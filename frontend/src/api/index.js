import client from "./client";

export const authApi = {
  login: (email, password) => client.post("/api/auth/login", { email, password }),
  me: () => client.get("/api/auth/me"),
};

export const fieldsApi = {
  list: () => client.get("/api/fields"),
  get: (id) => client.get(`/api/fields/${id}`),
  create: (data) => client.post("/api/fields", data),
  update: (id, data) => client.patch(`/api/fields/${id}`, data),
  remove: (id) => client.delete(`/api/fields/${id}`),
  getUpdates: (id) => client.get(`/api/fields/${id}/updates`),
  addUpdate: (id, data) => client.post(`/api/fields/${id}/updates`, data),
};

export const usersApi = {
  agents: () => client.get("/api/users/agents"),
};
