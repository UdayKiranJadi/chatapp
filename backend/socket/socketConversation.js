import Friendship from "../models/Friendship.js";

export const notifyConversationOnlineStatus = async (io, socket, online) => {
    try {
        const userId = socket.userId;
        const user = socket.user;

        const friendships = await Friendship.find({
            $or:[
                {requester: userId},
                {recipient: userId}
            ],
            
        })

        friendships.forEach((friendship) => {
            const isRequestor = friendship.requester._id.toString() === userId.toString();
            const friendId = isRequestor ? friendship.recipient._id : friendship.requester._id;

            console.log("emit:conversation:online-status");
            io.to(friendId.toString())
            .emit('conversation:online-status',{
                friendId:userId,
                username:user.username,
                online, 
            })
        })



    } catch (error) {
        console.error(notifyConversationOnlineStatus,error)
    }
}

