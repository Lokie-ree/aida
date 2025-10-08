import { cn } from '@/lib/utils'

// Pelican Logo - Full logo with text
export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <PelicanIcon className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground font-heading">
                Pelican AI
            </span>
        </div>
    )
}

// Pelican Icon - Just the pelican in circle
export const PelicanIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
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
        <div className={cn('flex items-center gap-3', className)}>
            <PelicanIcon className="h-7 w-7" />
            <span className="text-lg font-semibold text-foreground font-heading">
                Pelican AI
            </span>
        </div>
    )
}
