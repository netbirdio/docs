import Link from 'next/link'
import clsx from 'clsx'

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
      />
    </svg>
  )
}

const variantStyles = {
  primary:
    'rounded-[5px] bg-netbird text-white border-0 border-transparent duration-300 relative overflow-hidden group',
  secondary:
    'rounded-full bg-zinc-100 py-1 px-3 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:ring-1 dark:ring-inset dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-300',
  filled:
    'rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-netbird dark:text-white dark:hover:bg-netbird-dark',
  outline:
    'rounded-full py-1 px-3 text-zinc-700 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white',
  'outline-arrow':
    'rounded-[5px] text-zinc-700 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white duration-300 relative overflow-hidden group',
  text: 'text-netbird hover:text-netbird-dark dark:text-netbird dark:hover:text-netbird-light',
}

export function Button({
  variant = 'primary',
  className,
  children,
  arrow,
  ...props
}) {
  let Component = props.href ? Link : 'button'

  className = clsx(
    'inline-flex gap-0.5 justify-center text-[12px] md:text-xs px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-2.5 font-medium transition whitespace-nowrap items-center',
    variantStyles[variant],
    className
  )

  let arrowIcon = (
    <ArrowIcon
      className={clsx(
        'mt-0.5 h-5 w-5',
        variant === 'text' && 'relative top-px',
        arrow === 'left' && '-ml-1 rotate-180',
        arrow === 'right' && '-mr-1'
      )}
    />
  )

  if (variant === 'primary' || variant === 'outline-arrow') {
    return (
      <div className="relative inline-flex group transition-all" onClick={props.href ? undefined : props.onClick}>
        {variant === 'primary' && (
          <span className="absolute h-full w-full left-0 top-0 blur-sm bg-netbird z-0 transition-all duration-200 transform-gpu opacity-0 group-hover:opacity-100 pointer-events-none"></span>
        )}
        <Component className={className} {...props}>
          {variant === 'primary' && (
            <span className="absolute h-full w-full left-0 top-0 z-10 bg-gradient-to-br from-netbird to-netbird-dark transition-all duration-200 transform-gpu opacity-0 group-hover:opacity-100 pointer-events-none"></span>
          )}
          <span className="z-20 relative flex gap-2 items-center transition-all">
            {arrow === 'left' && arrowIcon}
            {children}
            {arrow === 'right' && arrowIcon}
          </span>
        </Component>
      </div>
    )
  }

  return (
    <Component className={className} {...props}>
      {arrow === 'left' && arrowIcon}
      {children}
      {arrow === 'right' && arrowIcon}
    </Component>
  )
}
