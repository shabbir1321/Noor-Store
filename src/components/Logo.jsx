import React from 'react';

export default function Logo({ size = 32, color = 'var(--color-primary)' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
        >
            <rect width="40" height="40" rx="8" fill={color} fillOpacity="0.1" />
            <path
                d="M12 28V12L28 28V12"
                stroke={color}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="30" cy="10" r="3" fill="var(--color-accent)" />
        </svg>
    );
}
