import React from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'section'
  variant?: 'default' | 'outline' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  children?: React.ReactNode
  className?: string
  id?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  'aria-labelledby'?: string
}

export function Card({
  as: Component = 'div',
  variant = 'default',
  padding = 'none',
  hover = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-xl overflow-hidden'
  
  const variants = {
    default: 'bg-white shadow-sm border border-secondary-100',
    outline: 'bg-transparent border border-secondary-200',
    flat: 'bg-secondary-50 border-none'
  }
  
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const hoverStyles = hover ? 'transition-all duration-200 hover:shadow-md hover:border-primary-200' : ''

  return (
    <Component
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
