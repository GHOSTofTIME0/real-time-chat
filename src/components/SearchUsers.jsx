import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, searchUsers } from '../store/slicers/usersSlice';
import { OrbitProgress } from 'react-loading-indicators';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import User from './User';
import styles from '../Styles/searchUsers.module.css'

const SearchUsers = () => {
    const [value, setValue] = useState('');
    const { users, loading, error, userPerPage, filteredUsers } = useSelector(state => state.users);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(value);
        dispatch(searchUsers(value));
    }

    const handleClearSearch = () => {
        setValue('');
        dispatch(searchUsers(''));
    }

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch]);

    if (loading) return (
        <div className={styles.loadingContainer}>
            <OrbitProgress variant="disc" color="#32cd32" size="medium" />
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.searchSection}>
                <h1 className={styles.title}>Find Users</h1>
                <form className={styles.searchForm} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter user name to search..."
                        className={styles.searchInput}
                    />
                    <button type='submit' className={styles.searchButton}>
                        Search
                    </button>
                </form>
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    Error: {error}
                </div>
            )}

            <div className={styles.resultsSection}>
                <div className={styles.stats}>
                    <span className={styles.totalUsers}>
                        {filteredUsers ? `Found: ${filteredUsers.length} users` : `Total: ${users?.length || 0} users`}
                    </span>
                    {value && (
                        <button
                            className={styles.clearButton}
                            onClick={handleClearSearch}
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                {filteredUsers && filteredUsers.length > 0 ? (
                    <div>
                        <h2 className={styles.resultsTitle}>
                            {value ? `Search Results for "${value}"` : 'All Users'}
                        </h2>
                        <div className={styles.usersGrid}>
                            {filteredUsers.map(user => (
                                <Link
                                    to={`/user/${user.id}`}
                                    key={user.id}
                                    className={styles.userLink}
                                >
                                    <User user={user} />
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    !loading && (
                        <div className={styles.noResults}>
                            <p>
                                {value
                                    ? `No users found matching "${value}"`
                                    : users?.length === 0
                                        ? 'No users available'
                                        : 'Start typing to search users'
                                }
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default SearchUsers