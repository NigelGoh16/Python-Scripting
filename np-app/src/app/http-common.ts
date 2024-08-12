import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "http://ils.limitprime.com/",
  headers: {
    "Content-type": "application/json",
  },
});
