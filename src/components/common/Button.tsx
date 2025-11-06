import { Link } from 'react-router-dom'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-body font-semibold tracking-wider uppercase rounded-sm transition-all duration-standard disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantStyles = {
    primary: 'bg-accent-gold text-background-primary hover:bg-accent-gold-light hover:shadow-glow-gold-intense hover:scale-105 hover:-translate-y-0.5',
    secondary: 'bg-transparent text-accent-gold border-2 border-accent-gold hover:bg-accent-gold hover:text-background-primary hover:shadow-glow-gold'
  }
  
  const sizeStyles = {
    sm: 'px-md py-2 text-sm',
    md: 'px-lg py-3 text-sm md:text-button',
    lg: 'px-xl py-4 text-button'
  }

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={combinedStyles}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={combinedStyles} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={combinedStyles} disabled={disabled}>
      {children}
    </button>
  )
}
