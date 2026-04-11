import dotenv from "dotenv";
dotenv.config();

import mongoose, { mongo }  from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Friendship from "../models/Friendship.js";
import Conversations from "../models/Conversation.js";
import Message from "../models/Message.js";

import {connectDB} from "./db.js";
import Conversation from "../models/Conversation.js";

async function resetDatabase() {
    try {
        await connectDB();
        await Message.deleteMany({});
        await Conversations.deleteMany({});
        await Friendship.deleteMany({});
        await User.deleteMany({}); 
        await mongoose.disconnect();

    } catch (error) {
        console.log("Error Reseting the Database:", error);
        await mongoose.disconnect();
    }
}

async function seed() {
    try {
        await resetDatabase();
        await connectDB();

        const usersData = [
            {
                fullName:'John',
                username: 'john',
                email:"test@test.com",
                connectCode:"11111"
            },
            {
                fullName:'Bob',
                username: 'bob',
                email:"test2@test.com",
                connectCode:"22222"
            }
        ];

        const users = [];
        const hashPassword = await bcrypt.hash("password",10);
        for(const data of usersData){
            data.password = hashPassword;
            const user = await User.create(data);
            console.log(`User created ${user.fullName} (${user.id})`);
            users.push(user);
        }

        const [user1, user2] = users;

        const friendship = await Friendship.create({
            requester: user1._id,
            recipient : user2._id,

        })

        const conversation = await Conversation.create({
            participants : [user1._id, user2._id],
            lastMessagePreview:null,
            unreadCounts : {
                [user1._id] : 0,
                [user2._id] : 0
            }
        })

        console.log(`Conversation created ${conversation.id}`);
        
        const message = await Message.create({
            sender:user1._id,
            content: "Hey Bob, Welcome to the chat",
            conversation: conversation._id,

        });

        conversation.unreadCounts.set(user2._id.toString(),1);
        conversation.unreadCounts.set(user1._id.toString(),0);

        await conversation.save();

        console.log(`Message created ${message.id}`);
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");

    } catch (error) {
        console.error("Error seeding databse:", error);
        await mongoose.disconnect();
    }


    
}
    
seed();



