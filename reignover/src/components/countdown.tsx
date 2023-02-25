import { useEffect, useState } from "react"

interface ICountdown {
    targetTime: number
    refresh: () => void
}

export const Countdown: React.FC<ICountdown> = ({targetTime, refresh}) => {
    const [timeRemaining, setTimeRemaining] = useState({
        "h": 0,
        "m": 0,
        "s": 0
    })

    function getTimeDiff(target: number) {
        const secs = Math.max((target - Date.now())/1000, 0)
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let timer = {
            "h": hours,
            "m": minutes,
            "s": seconds
        }
        return timer
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const time = getTimeDiff(targetTime)
            if (time.h === 0 && time.m === 0 && time.s === 0 ) {
                // TODO why is this refresh not causing rerender to remove timer and show complete button?
                refresh()
                clearInterval(interval)
                console.log('timer completed!')
            }
            setTimeRemaining(time)
        }, 1000);
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {timeRemaining['h']}:{timeRemaining['m']}:{timeRemaining['s']}
        </>
    )
}