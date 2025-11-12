import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, markMessagesAsRead, removeChannelMember } from '../store/slicers/messagesSlice';
import styles from '../Styles/ChatWindow.module.css';

const ChatWindow = () => {
    const [messageText, setMessageText] = useState('');
    const [showMembers, setShowMembers] = useState(false);
    const messagesEndRef = useRef(null);

    const { activeChat, messages, currentUser, allUsers } = useSelector(state => state.chat);
    const dispatch = useDispatch();

    // Автоскролл к новым сообщениям
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChat]);

    // Отмечаем сообщения как прочитанные при открытии чата
    useEffect(() => {
        if (activeChat) {
            dispatch(markMessagesAsRead({ chatId: activeChat.id }));
        }
    }, [activeChat, dispatch]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (messageText.trim() && activeChat) {
            dispatch(sendMessage({
                chatId: activeChat.id,
                text: messageText.trim()
            }));
            setMessageText('');
        }
    };

    const handleRemoveMember = (userId) => {
        if (activeChat?.type === 'group' && activeChat.creatorId === currentUser.id) {
            if (window.confirm('Are you sure you want to remove this member?')) {
                console.log('Removing member:', userId);
                console.log('Current channel:', activeChat);
                console.log('Current members before removal:', activeChat.members);

                dispatch(removeChannelMember({
                    channelId: activeChat.id,
                    userId: userId
                }));

                // После диспатча выводим обновленные данные
                setTimeout(() => {
                    const updatedChat = groupChannels.find(c => c.id === activeChat.id);
                    console.log('Members after removal:', updatedChat?.members);
                }, 100);
            }
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Получаем участников группового чата
    const getChannelMembers = () => {
        if (activeChat?.type === 'group') {
            return allUsers.filter(user =>
                activeChat.members.includes(user.id)
            );
        }
        return [];
    };

    const isGroupCreator = activeChat?.type === 'group' && activeChat.creatorId === currentUser.id;

    if (!activeChat) {
        return (
            <div className={styles.noChatSelected}>
                <h2>Select a chat to start messaging</h2>
                <p>Choose a conversation from the list or start a new one</p>
            </div>
        );
    }

    const chatMessages = messages[activeChat.id] || [];
    const channelMembers = getChannelMembers();

    return (
        <div className={styles.chatWindow}>
            {/* Заголовок чата */}
            <div className={styles.chatHeader}>
                <div className={styles.chatInfo}>
                    {activeChat.type === 'direct' ? (
                        <>
                            <img
                                src={activeChat.userAvatar}
                                alt={activeChat.userName}
                                className={styles.avatar}
                            />
                            <div>
                                <h3>{activeChat.userName}</h3>
                                <span className={styles.status}>Online</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.channelAvatar}>
                                #{activeChat.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3>{activeChat.name}</h3>
                                <span className={styles.memberCount}>
                                    {channelMembers.length} members
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Действия для группового чата */}
                {activeChat.type === 'group' && (
                    <div className={styles.chatActions}>
                        <button
                            className={styles.membersButton}
                            onClick={() => setShowMembers(!showMembers)}
                        >
                            👥 Members
                        </button>
                        {isGroupCreator && (
                            <button className={styles.manageButton}>
                                ⚙️ Manage
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Основной контент */}
            <div className={styles.chatContent}>
                {/* Список сообщений */}
                <div className={`${styles.messagesContainer} ${showMembers ? styles.withMembers : ''}`}>
                    <div className={styles.messagesList}>
                        {chatMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`${styles.message} ${message.senderId === currentUser.id
                                    ? styles.ownMessage
                                    : styles.otherMessage
                                    }`}
                            >
                                {message.senderId !== currentUser.id && (
                                    <div className={styles.senderInfo}>
                                        <img
                                            src={allUsers.find(u => u.id === message.senderId)?.avatar}
                                            alt={message.senderName}
                                            className={styles.senderAvatar}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/30x30/cccccc/969696?text=U';
                                            }}
                                        />
                                        <span className={styles.senderName}>
                                            {message.senderName}
                                        </span>
                                    </div>
                                )}

                                <div className={styles.messageContent}>
                                    <div className={styles.messageText}>
                                        {message.text}
                                    </div>
                                    <div className={styles.messageTime}>
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Список участников (только для групповых чатов) */}
                {activeChat.type === 'group' && showMembers && (
                    <div className={styles.membersSidebar}>
                        <div className={styles.membersHeader}>
                            <h3>Channel Members</h3>
                            <button
                                onClick={() => setShowMembers(false)}
                                className={styles.closeMembers}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.membersList}>
                            {channelMembers.map(member => (
                                <div key={member.id} className={styles.memberItem}>
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className={styles.memberAvatar}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/40x40/cccccc/969696?text=U';
                                        }}
                                    />
                                    <div className={styles.memberInfo}>
                                        <h4>{member.name}</h4>
                                        <p>@{member.username}</p>
                                        {member.id === activeChat.creatorId && (
                                            <span className={styles.creatorBadge}>Creator</span>
                                        )}
                                    </div>
                                    {isGroupCreator && member.id !== currentUser.id && (
                                        <button
                                            onClick={() => handleRemoveMember(member.id)}
                                            className={styles.removeMemberButton}
                                            title="Remove member"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Поле ввода сообщения */}
            <form onSubmit={handleSendMessage} className={styles.messageInputForm}>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={
                            activeChat.type === 'direct'
                                ? `Message ${activeChat.userName}...`
                                : `Message #${activeChat.name}...`
                        }
                        className={styles.messageInput}
                    />
                    <button
                        type="submit"
                        className={styles.sendButton}
                        disabled={!messageText.trim()}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;