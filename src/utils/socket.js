// socket.js
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";
const socket = io(BASE_URL, {
  withCredentials:true,
 autoConnect: true
});

export default socket;
