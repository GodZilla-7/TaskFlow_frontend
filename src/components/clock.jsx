import React, { useState, useEffect, useRef } from "react";

const Clock = ({ textColor, setTextColor }) => {
    const [time, setTime] = useState(new Date());
    const [is24HourFormat, setIs24HourFormat] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [username, setUsername] = useState("User"); // Default username
    const colorInputRef = useRef(null);

    useEffect(() => {
        // ✅ Retrieve username from sessionStorage
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit", 
            hour12: !is24HourFormat 
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString(undefined, { 
            weekday: "long", 
            day: "numeric", 
            month: "long", 
        });
    };

    const getGreeting = (hour) => {
        if (hour < 5) return `It's quite late, ${username}. You should rest!`;
        if (hour < 8) return `Good Early Morning, ${username}. A fresh start awaits!`;
        if (hour < 11) return `Good Morning, ${username}. Hope you had a nice breakfast!`;
        if (hour < 14) return `Good Noon, ${username}. Time to refuel with a good lunch!`;
        if (hour < 18) return `Good Afternoon, ${username}. Keep going strong! Maybe a light snack?`;
        if (hour < 21) return `Good Evening, ${username}. A relaxing time of the day!`;
        return `Good Night, ${username}. Sleep well and recharge for tomorrow!`;
    };

    const handleClockClick = () => {
        if (colorInputRef.current) {
            colorInputRef.current.click();
        }
    };

    return (
        <div 
            className="flex flex-col items-center text-center cursor-pointer mb-8 fixed top-10 left-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ color: textColor }}
        >
            <div className="text-2xl w-80 font-thin">{getGreeting(time.getHours())}</div>

            <div onClick={handleClockClick} className="text-5xl font-bold mt-2">
                It's {formatTime(time)}
            </div>
            <div className="text-sm mt-4">{formatDate(time)}</div>

            {isHovered && (
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm">12-hour</span>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={is24HourFormat} 
                        onChange={() => setIs24HourFormat(!is24HourFormat)} 
                    />
                    <span className="text-sm">24-hour</span>
                </div>
            )}

            {/* Hidden Color Picker */}
            <input 
                type="color" 
                ref={colorInputRef} 
                value={textColor} 
                onChange={(e) => setTextColor(e.target.value)} 
                className="hidden"
            />
        </div>
    );
};

export default Clock;
