import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupChannel } from '../store/slicers/messagesSlice';
import styles from '../Styles/ChatsList.module.css';
import defaultAvatar from '../assets/defaultAvatar.jpg'

const CreateChannelModal = ({ onClose, availableUsers }) => {
    const [channelName, setChannelName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.chat);

    const filteredUsers = availableUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreateChannel = (e) => {
        e.preventDefault();

        if (channelName.trim() && selectedUsers.length > 0) {
            dispatch(createGroupChannel({
                name: channelName.trim(),
                userIds: [...selectedUsers, currentUser.id]
            }));
            onClose();
        }
    };

    const isFormValid = channelName.trim() && selectedUsers.length > 0;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>Create New Channel</h2>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleCreateChannel} className={styles.channelForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="channelName">Channel Name</label>
                        <input
                            id="channelName"
                            type="text"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            placeholder="Enter channel name..."
                            className={styles.formInput}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Add Members</label>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className={styles.selectedUsers}>
                            <h4>Selected Members ({selectedUsers.length})</h4>
                            <div className={styles.selectedUsersList}>
                                {availableUsers
                                    .filter(user => selectedUsers.includes(user.id))
                                    .map(user => (
                                        <div key={user.id} className={styles.selectedUser}>
                                            <img
                                                width='70px'
                                                height='50px'
                                                src={defaultAvatar}
                                                alt={user.name}
                                                className={styles.avatarSmall}
                                            />
                                            <span>{user.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => toggleUserSelection(user.id)}
                                                className={styles.removeUserButton}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}

                    <div className={styles.usersList}>
                        {filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className={`${styles.userItem} ${selectedUsers.includes(user.id) ? styles.userItemSelected : ''
                                    }`}
                                onClick={() => toggleUserSelection(user.id)}
                            >
                                <div className={styles.userCheckbox}>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => { }}
                                        className={styles.checkbox}
                                    />
                                </div>
                                <img
                                    width='70px'
                                    height='50px'
                                    src={defaultAvatar}
                                    alt={user.name}
                                    className={styles.avatar}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/50x50/cccccc/969696?text=U';
                                    }}
                                />
                                <div className={styles.userInfo}>
                                    <h4>{user.name}</h4>
                                    <p>@{user.username}</p>
                                    <p className={styles.company}>{user.company?.name}</p>
                                </div>
                            </div>
                        ))}

                        {filteredUsers.length === 0 && searchTerm && (
                            <div className={styles.noResults}>
                                No users found matching "{searchTerm}"
                            </div>
                        )}

                        {filteredUsers.length === 0 && !searchTerm && (
                            <div className={styles.noResults}>
                                No available users found
                            </div>
                        )}
                    </div>

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={styles.createButton}
                        >
                            Create Channel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateChannelModal;