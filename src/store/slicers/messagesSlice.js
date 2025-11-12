import { createSlice, nanoid } from "@reduxjs/toolkit";
import defaultAvatar from '../../assets/defaultAvatar.jpg'
import { fetchUsers } from "./usersSlice";
const nanoId = nanoid();

const chatSlice = createSlice({
    name: 'chats',
    initialState: {
        currentUser: {
            id: 999,
            name: 'You',
            avatar: defaultAvatar,
        },
        allUsers: [],
        directChats: [],
        groupChannels: [],
        activeChat: null,
        messages: {},
        loading: false,
        error: null,
    },
    reducers: {
        createDirectChat: (state, action) => {
            const { userId } = action.payload;
            const user = state.allUsers.find(user => user.id === userId);

            if (user && !state.directChats.find(chat => chat.userId === userId)) {
                const newChat = {
                    id: `direct_${userId}`,
                    type: 'direct',
                    userId: userId,
                    userName: user.name,
                    userAvatar: defaultAvatar,
                    lastMessage: null,
                    unreadCount: 0,
                    createdAt: new Date().toISOString(),
                };
                state.directChats.push(newChat);

                if (!state.messages[newChat.id]) {
                    state.messages[newChat.id] = [];
                }
            }
        },
        createGroupChannel: (state, action) => {
            const { name, userIds } = action.payload;
            const newChannel = {
                id: `group_${nanoId}`,
                type: 'group',
                name: name,
                creatorId: state.currentUser.id,
                members: userIds,
                memberDetails: state.allUsers.filter(user => userIds.includes(user.id)),
                lastMessage: null,
                unreadCount: 0,
                createdAt: new Date().toISOString()
            };
            state.groupChannels.push(newChannel);

            if (!state.messages[newChannel.id]) {
                state.messages[newChannel.id] = [];
            }
        },
        removeChannelMember: (state, action) => { //I couldn't fix it. I spent a lot of hours. I would like to analyze this in an interview.
            const { channelId, userId } = action.payload;

            console.log('=== REDUX: removeChannelMember PRECISE ===');
            console.log('User ID to remove:', userId, 'type:', typeof userId);

            const channel = state.groupChannels.find(c => c.id === channelId);
            if (!channel) {
                console.log(' Channel not found');
                return;
            }

            console.log('Channel members BEFORE:', channel.members);
            console.log('Member types:', channel.members.map(id => `${id} (${typeof id})`));

            if (channel.creatorId !== state.currentUser.id) {
                console.log(' User is not channel creator');
                return;
            }

            const normalizeForComparison = (id) => String(id);
            const targetId = normalizeForComparison(userId);
            console.log('Target ID for comparison:', targetId);

            const initialMembersCount = channel.members.length;
            channel.members = channel.members.filter(memberId =>
                normalizeForComparison(memberId) !== targetId
            );

            channel.memberDetails = channel.memberDetails.filter(member =>
                normalizeForComparison(member.id) !== targetId
            );

            const removedCount = initialMembersCount - channel.members.length;
            console.log(`Removed ${removedCount} member(s)`);
            console.log('Channel members AFTER:', channel.members);

            if (state.activeChat?.id === channelId) {
                state.activeChat.members = channel.members;
                state.activeChat.memberDetails = channel.memberDetails;
                console.log('Active chat updated');
            }

            console.log(' Member removed successfully');
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },

        sendMessage: (state, action) => {
            const { chatId, text } = action.payload;
            const newMessage = {
                id: `msg_ ${nanoId}`,
                chatId: chatId,
                text: text,
                senderId: state.currentUser.id,
                senderName: state.currentUser.name,
                timestamp: new Date().toISOString(),
                read: false,
            };

            if (!state.messages[chatId]) {
                state.messages[chatId] = []
            }
            state.messages[chatId].push(newMessage);

            const updateLastMessage = (chatArray) => {
                const chat = chatArray.find(chat => chat.id === chatId);
                if (chat) {
                    chat.lastMessage = {
                        text: text,
                        timestamp: newMessage.timestamp,
                        senderName: state.currentUser.name,
                    };
                }
            };

            updateLastMessage(state.directChats);
            updateLastMessage(state.groupChannels);
        },

        receiveMessage: (state, action) => {
            const { chatId, text, senderId } = action.payload;
            const sender = state.allUsers.find(u => u.id === senderId);

            if (sender) {
                const newMessage = {
                    id: `msg_${Date.now()}`,
                    chatId: chatId,
                    text: text,
                    senderId: senderId,
                    senderName: sender.name,
                    timestamp: new Date().toISOString(),
                    read: state.activeChat?.id === chatId
                };

                if (!state.messages[chatId]) {
                    state.messages[chatId] = [];
                }
                state.messages[chatId].push(newMessage);

                const updateLastMessage = (chatArray) => {
                    const chat = chatArray.find(c => c.id === chatId);
                    if (chat) {
                        chat.lastMessage = {
                            text: text,
                            timestamp: newMessage.timestamp,
                            senderName: sender.name
                        };

                        if (state.activeChat?.id !== chatId) {
                            chat.unreadCount += 1;
                        }
                    }
                };

                updateLastMessage(state.directChats);
                updateLastMessage(state.groupChannels);
            }
        },

        markMessagesAsRead: (state, action) => {
            const { chatId } = action.payload;
            const chatMessages = state.messages[chatId];

            if (chatMessages) {
                chatMessages.forEach(msg => {
                    if (msg.senderId !== state.currentUser.id) {
                        msg.read = true;
                    }
                });
            }

            const resetUnreadCount = (chatArray) => {
                const chat = chatArray.find(c => c.id === chatId);
                if (chat) {
                    chat.unreadCount = 0;
                }
            };

            resetUnreadCount(state.directChats);
            resetUnreadCount(state.groupChannels);
        },

        deleteChat: (state, action) => {
            const { chatId } = action.payload;
            state.directChats = state.directChats.filter(chat => chat.id !== chatId);
            state.groupChannels = state.groupChannels.filter(chat => chat.id !== chatId);

            if (state.activeChat?.id === chatId) {
                state.activeChat = null;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    }
})

export const {
    createDirectChat,
    createGroupChannel,
    removeChannelMember,
    setActiveChat,
    sendMessage,
    receiveMessage,
    markMessagesAsRead,
    deleteChat
} = chatSlice.actions;

export default chatSlice.reducer;