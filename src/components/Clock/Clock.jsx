//File name: Clock.jsx
//Author: Kyle McColgan
//Date: 5 May 2026
//Description: This file contains the Clock component for the digital clock React project.

import { useEffect, useState } from "react";
import "./Clock.css";

function pad(n)
{
  return String(n).padStart(2, "0");
}

function formatTime(date)
{
  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0)
  {
    hours = 12;
  }
  return {
    time: `${pad(hours)}:${minutes}`,
    period
  };
}

function formatSeconds(date)
{
  return pad(date.getSeconds());
}

function formatDate(date)
{
  return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
  });
}

function lerp(a, b, t)
{
  return a + (b - a) * t;
}

function hexToRgb(hex)
{
  const n = parseInt(hex.slice(1), 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function rgbToHex({ r, g, b })
{
  return `#${[r, g, b]
    .map(v => Math.round(v).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mix(c1, c2, t)
{
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);

  return rgbToHex({
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  });
}

function getBackgroundGradient(date)
{
  const hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  //Normalize day to 0 -> 1...
  const t = hours / 24;

  //Anchor palettes (top -> bottom).
  const palettes = [
    ["#050507", "#0e0e10"], //Night.
    ["#1a2a3a", "#3a5f7d"], //Morning.
    ["#0e0e10", "#1c1f26"], //Day.
    ["#2a1a1a", "#5a3a2a"], //Evening.
    ["#050507", "#0e0e10"], //Night (loop).
  ];

  //Segment position (4 segments).
  const segment = t * (palettes.length - 1);
  const i = Math.floor(segment);
  const localT = segment - i;

  const [topA, bottomA] = palettes[i];
  const [topB, bottomB] = palettes[i + 1];

  const top = mix(topA, topB, localT);
  const bottom = mix(bottomA, bottomB, localT);

  return `linear-gradient(180deg, ${top}, ${bottom})`;
}

export default function Clock()
{
  const [now, setNow] = useState(new Date());
  const { time, period } = formatTime(now);

  useEffect(() => {
    let timeout;
    const tick = () => {
      const next = new Date();
      setNow(next);

      //Align updates exactly to the next second boundary.
      const delay = 1000 - next.getMilliseconds();
      timeout = setTimeout(tick, delay);
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="clock" style={{ background: getBackgroundGradient(now) }}>
      <div className="time">
        <span className="hours-minutes">{time}</span>
        <span className="seconds">{formatSeconds(now)}</span>
        <span className="period">{period}</span>
      </div>

      <div className="date">{formatDate(now)}</div>
    </div>
  );
}
