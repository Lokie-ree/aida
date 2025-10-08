import { cn } from '@/lib/utils'

// Pelican Logo - Full logo with text
export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <img src="/primary-logo.png" alt="Pelican AI" className="h-6 w-6" loading="lazy" />
            </div>
            <span className="text-xl font-bold text-foreground font-heading">
                Pelican AI
            </span>
        </div>
    )
}

// Pelican Icon - Just the pelican in circle
export const PelicanIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn('h-8 w-8 rounded-full bg-primary flex items-center justify-center', className)}>
            <img 
                src="/primary-logo.png" 
                alt="Pelican AI Icon" 
                className="h-5 w-5"
                loading="lazy"
            />
        </div>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn('h-8 w-8 rounded-full bg-primary flex items-center justify-center', className)}>
            <img 
                src="/primary-logo.png" 
                alt="Pelican AI Icon" 
                className="h-5 w-5"
                loading="lazy"
            />
        </div>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                <img src="/primary-logo.png" alt="Pelican AI" className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-foreground font-heading">
                Pelican AI
            </span>
        </div>
    )
}
