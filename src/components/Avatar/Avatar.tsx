import React from 'react';
import ImageLoader from '../ImageLoader/ImageLoarder';

interface AvatarProps {
    photoUrl?: string;
    initials: string;
}

const Avatar: React.FC<AvatarProps> = ({ photoUrl, initials }) => {
    return (
        <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold ring-2 ring-purple-500 bg-gray-200 text-gray-700 overflow-hidden">
            {photoUrl
                ?
                <ImageLoader
                    src={photoUrl}
                    alt={initials}
                    className="h-full w-full object-cover"
                />
                :
                initials}
        </div>
    );
};


export default Avatar;