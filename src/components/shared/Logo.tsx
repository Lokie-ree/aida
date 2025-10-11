import { cn } from '@/lib/utils'

// Pelican Logo - Full logo with text
export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <img src="/icon.png" alt="Pelican AI" className="h-10 w-10" loading="lazy" />
            <span className="text-xl font-bold text-foreground font-heading">
                Pelican AI
            </span>
        </div>
    )
}

// Pelican Icon - Just the pelican in circle
export const PelicanIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <img 
            src="/icon.png" 
            alt="Pelican AI Icon" 
            className={cn('h-8 w-8', className)}
            loading="lazy"
        />
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <img 
            src="/icon.png" 
            alt="Pelican AI Icon" 
            className={cn('h-8 w-8', className)}
            loading="lazy"
        />
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <img src="/icon.png" alt="Pelican AI" className="h-9 w-9" />
            <span className="text-lg font-semibold text-foreground font-heading">
                Pelican AI
            </span>
        </div>
    )
}
