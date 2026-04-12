import { leaveAllRooms } from "./socket/helpers.js";
import { notifyConversationOnlineStatus } from "./socket/socketConversation.js";


export const initializeSocket = async (io) => {
    io.on("connection",async (socket) => {
        try {
            const user = socket.user;
            console.log("User Connecting", user.id);
            socket.join(user._id.toString());

            await notifyConversationOnlineStatus(io, socket, true);



            socket.on('disconnect', async() => {
                leaveAllRooms(socket);
                 await notifyConversationOnlineStatus(io, socket, false);

            })
            
        } catch (error) {
            console.error("Socket connection error", error);
            socket.emit("internal_error",{error: "Internal server Error"});

        }
    })
}