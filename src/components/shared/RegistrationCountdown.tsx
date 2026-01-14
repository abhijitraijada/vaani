import { useState, useEffect } from 'react';

interface RegistrationCountdownProps {
    startTime: Date;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}

export function RegistrationCountdown({ startTime }: RegistrationCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(startTime));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(startTime));
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short',
        });
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-2 border-indigo-400 dark:border-indigo-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 dark:bg-indigo-800 px-6 py-4 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <span>⏰</span>
                    Registration Opens Soon
                    <span>⏰</span>
                </h2>
            </div>

            <div className="p-6 sm:p-8">
                {/* Countdown Timer */}
                <div className="flex justify-center gap-3 sm:gap-4 mb-6">
                    <TimeBox value={timeLeft.days} label="Days" />
                    <TimeBox value={timeLeft.hours} label="Hours" />
                    <TimeBox value={timeLeft.minutes} label="Minutes" />
                    <TimeBox value={timeLeft.seconds} label="Seconds" />
                </div>

                {/* Message */}
                <div className="text-center">
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                        Registration opens on
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">
                        {formatDate(startTime)} at {formatTime(startTime)}
                    </p>
                </div>
            </div>
        </div>
    );
}

interface TimeBoxProps {
    value: number;
    label: string;
}

function TimeBox({ value, label }: TimeBoxProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 min-w-[60px] sm:min-w-[80px]">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center">
                {value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
                {label}
            </div>
        </div>
    );
}
