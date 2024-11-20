import axios from "axios";
import store from "../store";

if (!process.env.API_HOST) {
  throw new Error("Environment variable API_HOST is not defined!");
}

const API_HOST = process.env.API_HOST;

export default () => {
  return axios.create({
    baseURL: `http://${API_HOST}:8081`,
    headers: {
      Authorization: `Bearer ${store.state.CurrentUser.token}`,
    },
  });
};
