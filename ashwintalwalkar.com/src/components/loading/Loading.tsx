import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import styles from './Loading.module.css'

interface LoadingProps {
  children: ReactNode
  variant?: 'blur' | 'fade'
}

export default function Loading({ children, variant = 'fade' }: LoadingProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const variantClass = variant === 'fade' ? styles.fade : styles.blur

  return (
    <div className={`${styles.wrapper} ${variantClass} ${isLoaded ? styles.loaded : ''}`}>
      {children}
    </div>
  )
}
