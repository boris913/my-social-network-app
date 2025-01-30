import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import VerifiedBadge from './VerifiedBadge';

const BASE_URL = 'http://localhost:5000';

const FollowersList = ({ followers }) => {
    console.log(followers); // Affiche la liste des followers dans la console

    return (
        <div>
            {/* <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Followers</h3> */}
            {followers && followers.length > 0 ? (
                followers.map((followerData) => (
                    <div key={followerData.id} className="flex items-center space-x-4 mb-4">
                        <img
                            src={followerData.follower.profile_picture ? `${BASE_URL}${followerData.follower.profile_picture}` : 'default-profile.png'} // Gestion de l'image de profil
                            alt="Profile"
                            className="h-10 w-10 rounded-full"
                        />
                        <div>
                            <Link to={`/profile/${followerData.follower.id}`} className="text-gray-900 dark:text-white font-bold">
                                {followerData.follower.username}{ <VerifiedBadge />}
                                <p className="text-gray-500 dark:text-gray-400 font-normal">@{followerData.follower.username}</p>
                            </Link>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No followers yet.</p>
            )}
        </div>
    );
};

// Ajout de vérifications de type
FollowersList.propTypes = {
    followers: PropTypes.array.isRequired,
};

export default FollowersList;