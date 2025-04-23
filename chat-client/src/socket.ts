import { io } from "socket.io-client";

const socket = io("http://192.168.31.144:3000")
export default socket