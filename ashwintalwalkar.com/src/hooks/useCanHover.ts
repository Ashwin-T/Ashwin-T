import { useSyncExternalStore } from 'react'

// True when the main way of pointing can hover: a mouse or trackpad.
// Phones and tablets report false. A touchscreen laptop reports true.
const QUERY = '(hover: hover)'

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

/** Whether hover effects make sense on this device. Touch-only devices get tap behaviour instead. */
export function useCanHover(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  )
}
