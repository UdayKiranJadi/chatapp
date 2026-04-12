import Conversation from "../models/Conversation.js";
import Friendship from "../models/Friendship.js";
import User from "../models/User.js";

class ConversationController {
    static async checkConnectCode(req, res) {
        try {
            const userId = req.user._id;
            const { connectCode } = req.query;

            const friend = await User.findOne({ connectCode });

            if (!friend || friend._id.toString() === userId.toString()) {
                return res.status(400).json({ message: "Connect Code is Invalid" });
            }

            const existingFriendship = await Friendship.findOne({
                $or: [
                    { requester: userId, recipient: friend._id },
                    { requester: friend._id, recipient: userId },
                ],
            });

            if (existingFriendship) {
                return res.status(400).json({ message: "Already a Friend" });
            }

            res.json({
                success: true,
                message: "Connect ID is Valid",
            });
        } catch (error) {
            console.error("Error Checking Connect Code", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getConversations(req, res) {
        try {
            const userId = req.user._id;

            const friendships = await Friendship.find({
                $or: [{ requester: userId }, { recipient: userId }],
            })
                .populate([
                    { path: "requester", select: "_id fullName username connectCode" },
                    { path: "recipient", select: "_id fullName username connectCode" },
                ])
                .lean();

            if (!friendships.length) {
                return res.json({ data: [] });
            }

            const friendIds = friendships.map((friend) =>
                friend.requester._id.toString() === userId.toString()
                    ? friend.recipient._id.toString()
                    : friend.requester._id.toString()
            );

            const conversations = await Conversation.find({
                participants: {
                    $all: [userId],
                    $in: friendIds,
                    $size: 2,
                },
            });

            const conversationsMap = new Map();

            conversations.forEach((conversation) => {
                const friendId = conversation.participants.find(
                    (p) => p.toString() !== userId.toString()
                );
                conversationsMap.set(friendId.toString(), conversation);
            });

            const conversationsData = await Promise.all(
                friendships.map(async (friendship) => {
                    const isRequester =
                        friendship.requester._id.toString() === userId.toString();

                    const friend = isRequester
                        ? friendship.recipient
                        : friendship.requester;

                    const conversation = conversationsMap.get(friend._id.toString());

                    return {
                        conversationId: conversation?._id?.toString() || null,
                        lastMessage: conversation?.lastMessagePreview || null,
                        unreadCounts: {
                            [friendship.requester._id.toString()]:
                                conversation?.unreadCounts?.get(
                                    friendship.requester._id.toString()
                                ) || 0,
                            [friendship.recipient._id.toString()]:
                                conversation?.unreadCounts?.get(
                                    friendship.recipient._id.toString()
                                ) || 0,
                        },
                        friend: {
                            id: friend._id.toString(),
                            username: friend.username,
                            connectCode: friend.connectCode,
                            online: false,
                        },
                    };
                })
            );

            res.json({ data: conversationsData });
        } catch (error) {
            console.error("Error Fetching Conversations", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default ConversationController;