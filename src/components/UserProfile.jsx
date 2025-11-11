import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import avatar from '../assets/defaultAvatar.jpg';
import styles from '../Styles/userProfile.module.css'
const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate;
    const { users } = useSelector(state => state.users);
    const user = users.find(user => user.id === parseInt(userId));
    console.log(user);

    if (!user) return <h2>User not found</h2>
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src={avatar}
                    alt={`${user.name}'s avatar`}
                    className={styles.avatar}
                />
                <div className={styles.userInfo}>
                    <h1 className={styles.userName}>{user.name}</h1>
                    <p className={styles.email}>{user.email}</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Contact Information</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Phone:</span>
                            <span className={styles.infoValue}>{user.phone}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Company:</span>
                            <span className={styles.infoValue}>{user.company.name}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Address</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Country:</span>
                            <span className={styles.infoValue}>{user.address.country}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>State:</span>
                            <span className={styles.infoValue}>{user.address.state}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>City:</span>
                            <span className={styles.infoValue}>{user.address.city}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Street:</span>
                            <span className={styles.infoValue}>{user.address.streetA}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Zipcode:</span>
                            <span className={styles.infoValue}>{user.address.zipcode}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.postsSection}>
                <h2 className={styles.postsTitle}>User Posts</h2>
                <div className={styles.postsList}>
                    {user.posts && user.posts.map((post, index) => (
                        <div key={index} className={styles.postCard}>
                            <p className={styles.postParagraph}>{post.paragraph}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserProfile