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
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('h-8 w-8', className)}>
            {/* Blue circle background */}
            <circle
                cx="16"
                cy="16"
                r="16"
                fill={uniColor ? 'currentColor' : '#0ea5e9'}
            />
            {/* White pelican silhouette */}
            <path
                d="M8 12C8 10.5 9 9 10.5 9C12 9 13 10.5 13 12C13 13.5 12 15 10.5 15C9 15 8 13.5 8 12Z"
                fill="white"
            />
            <path
                d="M13 12C13 10.5 14 9 15.5 9C17 9 18 10.5 18 12C18 13.5 17 15 15.5 15C14 15 13 13.5 13 12Z"
                fill="white"
            />
            <path
                d="M18 12C18 10.5 19 9 20.5 9C22 9 23 10.5 23 12C23 13.5 22 15 20.5 15C19 15 18 13.5 18 12Z"
                fill="white"
            />
            {/* Pelican body */}
            <ellipse
                cx="16"
                cy="20"
                rx="6"
                ry="4"
                fill="white"
            />
            {/* Pelican head */}
            <ellipse
                cx="16"
                cy="14"
                rx="4"
                ry="3"
                fill="white"
            />
            {/* Pelican beak */}
            <path
                d="M20 14L24 12L20 10L20 14Z"
                fill="white"
            />
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <PelicanIcon className={cn('h-5 w-5', className)} uniColor={uniColor} />
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
