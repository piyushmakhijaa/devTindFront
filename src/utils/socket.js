// socket.js
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";
let socket;
if(location.hostname === "localhost")
{
socket = io(BASE_URL, {
  withCredentials:true,
 autoConnect: true
});
}else{
socket = io("/", {path : "/api/socket.io"},{
 withCredentials:true,
 autoConnect: true
})
}

export default socket;
