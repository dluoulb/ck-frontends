import axios from "axios";
import { getSession } from "next-auth/react";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: headers,
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    console.log("Session in interceptor:", session);
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
