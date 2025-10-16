import { cn } from '@/lib/utils'

// Pelican Logo - Full logo with text
export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <img src="/logo.png" alt="Pelican AI" className="h-10 w-10" loading="lazy" />
            <span className="text-xl font-bold text-foreground font-heading">
                Pelican AI
            </span>
        </div>
    )
}

// Pelican Icon - Just the pelican icon
export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <img 
            src="/logo.png" 
            alt="Pelican AI Icon" 
            className={cn('h-8 w-8', className)}
            loading="lazy"
        />
    )
}
