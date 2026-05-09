import axios from "axios";

export const api = axios.create({
  baseURL: "https://ageix-backend.onrender.com",
  timeout: 20_000,
});

