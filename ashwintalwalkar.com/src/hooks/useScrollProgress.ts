import { useEffect, useEffectEvent, type RefObject } from 'react'

/**
 * Progress 0..1 of an element entering the viewport: 0 while its top edge is
 * still below the fold, 1 once that edge has travelled 90% of the way up.
 *
 * The callback runs on scroll and resize, and when focus moves into or out of
 * the element, so it can react to someone starting to type inside it. It runs
 * outside React's render cycle, so write to the element's style in it rather
 * than state.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onProgress: (progress: number, el: T) => void,
) {
  const handle = useEffectEvent(onProgress)

  useEffect(() => {
    const el = ref.current

    const update = () => {
      const el = ref.current
      if (!el) return
      const { top } = el.getBoundingClientRect()
      const vh = window.innerHeight
      handle(Math.min(1, Math.max(0, (vh - top) / (vh * 0.9))), el)
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    el?.addEventListener('focusin', update)
    el?.addEventListener('focusout', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      el?.removeEventListener('focusin', update)
      el?.removeEventListener('focusout', update)
    }
  }, [ref])
}
