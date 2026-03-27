import styles from './Logo.module.css'

interface LogoProps {
  size?: number
}

export default function Logo({ size = 48 }: LogoProps) {
  return (
    <div className={styles.logo} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
      >
        {/* A */}
        <path
          d="M8 36L16 12H20L28 36H24L22 30H14L12 36H8ZM15 26H21L18 16L15 26Z"
          fill="currentColor"
          className={styles.letterA}
        />
        {/* T */}
        <path
          d="M28 12H44V16H38V36H34V16H28V12Z"
          fill="currentColor"
          className={styles.letterT}
        />
      </svg>
    </div>
  )
}
