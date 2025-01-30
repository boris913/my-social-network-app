import React from 'react';
import { Link } from 'react-router-dom';
import VerifiedBadge from './VerifiedBadge';

const BASE_URL = 'http://localhost:5000';

const FollowingList = ({ follows }) => {
    return (
        <div>
            {/* <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Following</h3> */}
            {follows && follows.length > 0 ? (
                follows.map((followData) => (
                    <div key={followData.id} className="flex items-center space-x-4 mb-4">
                        <img
                            src={followData.following.profile_picture ? `${BASE_URL}${followData.following.profile_picture}` : 'default-profile.png'} // Gestion de l'image de profil
                            alt="Profile"
                            className="h-10 w-10 rounded-full"
                        />
                        <div>
                            <Link to={`/profile/${followData.following.id}`} className="text-gray-900 dark:text-white font-bold">
                                {followData.following.username}{ <VerifiedBadge />}
                                <p className="text-gray-500 dark:text-gray-400 font-normal">@{followData.following.username}</p>
                            </Link>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No following yet.</p>
            )}
        </div>
    );
};

export default FollowingList;