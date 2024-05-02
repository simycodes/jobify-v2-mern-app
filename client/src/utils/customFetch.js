import axios from "axios";

// Creating an axios instance that will have a base url "/api/v1" but all http functions 
// such as get and post can be used on it
const customFetch = axios.create({
  baseURL: "/api/v1",
});

export default customFetch;