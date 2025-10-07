import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 180 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-8 w-auto', className)}>
            {/* Pelican Silhouette */}
            <path
                d="M8 12C8 8 12 4 18 4C24 4 28 8 28 12C28 16 24 20 18 20C12 20 8 16 8 12ZM6 16C6 14 7 13 9 13C11 13 12 14 12 16C12 18 11 19 9 19C7 19 6 18 6 16ZM24 16C24 14 25 13 27 13C29 13 30 14 30 16C30 18 29 19 27 19C25 19 24 18 24 16ZM4 20C4 18 5 17 7 17C9 17 10 18 10 20C10 22 9 23 7 23C5 23 4 22 4 20ZM26 20C26 18 27 17 29 17C31 17 32 18 32 20C32 22 31 23 29 23C27 23 26 22 26 20ZM2 24C2 22 3 21 5 21C7 21 8 22 8 24C8 26 7 27 5 27C3 27 2 26 2 24ZM28 24C28 22 29 21 31 21C33 21 34 22 34 24C34 26 33 27 31 27C29 27 28 26 28 24ZM0 28C0 26 1 25 3 25C5 25 6 26 6 28C6 30 5 31 3 31C1 31 0 30 0 28ZM30 28C30 26 31 25 33 25C35 25 36 26 36 28C36 30 35 31 33 31C31 31 30 30 30 28Z"
                fill={uniColor ? 'currentColor' : '#0ea5e9'}
            />
            {/* Pelican Body */}
            <path
                d="M18 4C18 4 25 8 25 16C25 24 18 28 18 28C18 28 11 24 11 16C11 8 18 4 18 4Z"
                fill={uniColor ? 'currentColor' : '#0ea5e9'}
            />
            {/* Pelican Beak */}
            <path
                d="M18 2C18 2 15 5 15 8C15 11 18 14 18 14C18 14 21 11 21 8C21 5 18 2 18 2Z"
                fill={uniColor ? 'currentColor' : '#f59e0b'}
            />
            {/* Text */}
            <text
                x="40"
                y="25"
                fontSize="18"
                fontWeight="bold"
                fill={uniColor ? 'currentColor' : '#1e40af'}
                fontFamily="Inter, sans-serif"
            >
                Pelican AI
            </text>
            <text
                x="40"
                y="35"
                fontSize="10"
                fill={uniColor ? 'currentColor' : '#6b7280'}
                fontFamily="Inter, sans-serif"
            >
                Your AI Guidance Partner
            </text>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-8', className)}>
            {/* Pelican Silhouette */}
            <path
                d="M16 4C16 4 20 6 20 12C20 18 16 20 16 20C16 20 12 18 12 12C12 6 16 4 16 4Z"
                fill={uniColor ? 'currentColor' : '#0ea5e9'}
            />
            {/* Pelican Beak */}
            <path
                d="M16 2C16 2 14 4 14 6C14 8 16 10 16 10C16 10 18 8 18 6C18 4 16 2 16 2Z"
                fill={uniColor ? 'currentColor' : '#f59e0b'}
            />
            {/* Pelican Eye */}
            <circle
                cx="14"
                cy="8"
                r="1"
                fill={uniColor ? 'currentColor' : '#1e40af'}
            />
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}
