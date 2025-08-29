import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { styles } from '../styles/styles';

const CountdownTimer = ({ expiresAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const difference = expiry - now;

            if (difference > 0) {
                setTimeLeft(Math.floor(difference / 1000));
            } else {
                setTimeLeft(0);
                if (onExpire) onExpire();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isUrgent = timeLeft < 300; 

    return (
        <div style={{
            ...styles.timerContainer,
            ...(isUrgent ? styles.timerUrgent : styles.timerNormal),
            ...(isUrgent ? styles.timerWarning : {})
        }}>
            <Clock style={{ width: '20px', height: '20px' }} />
            <span>Time left: {formatTime(timeLeft)}</span>
            {isUrgent && <span>⚠️</span>}
        </div>
    );
};

export default CountdownTimer;