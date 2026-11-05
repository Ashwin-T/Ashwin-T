import { useEffect, useEffectEvent } from 'react'

export type Pointer = {
  /** Viewport pixels. */
  x: number
  y: number
  /** Normalised to -0.5..0.5, 0 at the centre of the viewport. */
  nx: number
  ny: number
  /** False once the pointer has left the page. */
  active: boolean
}

type Listener = (pointer: Pointer) => void

const listeners = new Set<Listener>()
let pointer: Pointer = { x: 0, y: 0, nx: 0, ny: 0, active: false }

function emit() {
  for (const listener of listeners) listener(pointer)
}

function onMove(e: PointerEvent) {
  pointer = {
    x: e.clientX,
    y: e.clientY,
    nx: e.clientX / window.innerWidth - 0.5,
    ny: e.clientY / window.innerHeight - 0.5,
    active: true,
  }
  emit()
}

function onLeave() {
  pointer = { ...pointer, active: false }
  emit()
}

// One pair of DOM listeners no matter how many components subscribe.
function subscribe(listener: Listener) {
  if (listeners.size === 0) {
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }
}

/**
 * Shared pointer position. The callback runs on every move, outside React's
 * render cycle, so write to refs / element styles in it rather than state.
 */
export function usePointer(onChange: Listener, enabled = true) {
  const handle = useEffectEvent(onChange)

  useEffect(() => {
    if (!enabled) return
    return subscribe((p) => handle(p))
  }, [enabled])
}
