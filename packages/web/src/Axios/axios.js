import axios from "axios";

const environment = process.env.REACT_APP_ENVIRONMENT;
const localUrl = process.env.REACT_APP_BACKEND_URL_LOCAL;
const prodUrl = process.env.REACT_APP_BACKEND_URL_PROD;

const baseURL =
  environment === "development" ? `${localUrl}/api` : `${prodUrl}/api`;

const instance = axios.create({ baseURL });

export default instance;
