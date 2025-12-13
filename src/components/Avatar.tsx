import React from 'react';

interface AvatarProps {
    photoUrl?: string;
    initials: string;
}

const Avatar: React.FC<AvatarProps> = ({ photoUrl, initials }) => {
    return (
        <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold ring-2 ring-purple-500 bg-gray-200 text-gray-700 overflow-hidden">
            {photoUrl
                ?
                <img
                    src={photoUrl}
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                />
                :
                initials}
        </div>
    );
};


export default Avatar;