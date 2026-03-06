import { useEffect, useRef } from 'react'

export default function CustomCursor() {
    const dotRef = useRef(null)
    const ringRef = useRef(null)
    const posRef = useRef({ x: 0, y: 0 })
    const ringPosRef = useRef({ x: 0, y: 0 })
    const rafRef = useRef(null)

    useEffect(() => {
        const dot = dotRef.current
        const ring = ringRef.current
        if (!dot || !ring) return

        const onMove = (e) => {
            posRef.current = { x: e.clientX, y: e.clientY }
        }

        const lerp = (a, b, t) => a + (b - a) * t

        const animate = () => {
            ringPosRef.current.x = lerp(ringPosRef.current.x, posRef.current.x, 0.12)
            ringPosRef.current.y = lerp(ringPosRef.current.y, posRef.current.y, 0.12)

            if (dot) {
                dot.style.left = `${posRef.current.x}px`
                dot.style.top = `${posRef.current.y}px`
            }
            if (ring) {
                ring.style.left = `${ringPosRef.current.x}px`
                ring.style.top = `${ringPosRef.current.y}px`
            }
            rafRef.current = requestAnimationFrame(animate)
        }
        rafRef.current = requestAnimationFrame(animate)

        const onEnter = () => {
            dot?.classList.add('hovering')
            ring?.classList.add('hovering')
        }
        const onLeave = () => {
            dot?.classList.remove('hovering')
            ring?.classList.remove('hovering')
        }

        const addHoverListeners = () => {
            document.querySelectorAll('a, button, [role="button"], input, textarea, select, .project-card, .skill-pill, .contact-chip').forEach((el) => {
                el.addEventListener('mouseenter', onEnter)
                el.addEventListener('mouseleave', onLeave)
            })
        }

        addHoverListeners()
        const observer = new MutationObserver(addHoverListeners)
        observer.observe(document.body, { childList: true, subtree: true })

        window.addEventListener('mousemove', onMove)

        return () => {
            window.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(rafRef.current)
            observer.disconnect()
        }
    }, [])

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    )
}
