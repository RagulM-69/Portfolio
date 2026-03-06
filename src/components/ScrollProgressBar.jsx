import { useEffect, useRef } from 'react'

export default function ScrollProgressBar() {
    const barRef = useRef(null)

    useEffect(() => {
        const bar = barRef.current
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
            if (bar) bar.style.width = `${pct}%`
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div
            ref={barRef}
            className="scroll-progress"
            style={{ width: '0%' }}
            aria-hidden="true"
        />
    )
}
