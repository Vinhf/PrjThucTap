import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    videoLink: string;
    onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoLink, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '70%',
            transform: 'translate(-50%, -50%)',
            paddingRight: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            width: 'calc(100% - 20px)',
            maxWidth: '700px',
            boxSizing: 'border-box',
            height: '60vh',
            overflow: 'hidden',
            backgroundColor: '#fff',

        }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>Close</button>
            <ReactPlayer 
                url={videoLink} 
                controls 
                width="100%" 
                height="100%" 
                style={{ position: 'absolute', top: '0', left: '0' }} 
            />
        </div>
    );
};

export default VideoPlayer;
