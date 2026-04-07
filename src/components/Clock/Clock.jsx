//Filename: Clock.jsx

import { useEffect, useState } from "react";
import "./Clock.css";

function formatTime(date)
{
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatSeconds(date)
{
    return String(date.getSeconds()).padStart(2, "0");
}

function formatDate(date)
{
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}

export default function Clock()
{
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const tick = () => setNow(new Date());

        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="clock">
          <div className="time">
            <span className="hours-minutes">{formatTime(now)}</span>
            <span className="seconds">{formatSeconds(now)}</span>
          </div>

          <div className="date">{formatDate(now)}</div>
        </div>
    );
}
