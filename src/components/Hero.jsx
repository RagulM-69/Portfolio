import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const words = ['Developer', 'Designer', 'Problem Solver', 'Creator', 'Student']
const chips = ['#01 AI Builder', '#02 Web Developer', '#03 ECE Student', '#04 Problem Solver']

/* ──────── Magnetic Button ──────── */
function MagneticButton({ children, className, onClick, href, as: Tag = 'button', ...props }) {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 200, damping: 20 })
    const sy = useSpring(y, { stiffness: 200, damping: 20 })

    const onMove = (e) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const dx = e.clientX - (rect.left + rect.width / 2)
        const dy = e.clientY - (rect.top + rect.height / 2)
        x.set(dx * 0.35)
        y.set(dy * 0.35)
    }
    const onLeave = () => { x.set(0); y.set(0) }

    const Component = href ? 'a' : Tag

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ display: 'inline-block' }}
        >
            <motion.div style={{ x: sx, y: sy }}>
                <Component
                    className={className}
                    onClick={onClick}
                    href={href}
                    {...props}
                >
                    {children}
                </Component>
            </motion.div>
        </motion.div>
    )
}

export default function Hero() {
    const [currentWord, setCurrentWord] = useState('')
    const [wordIndex, setWordIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [deleting, setDeleting] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [showResumeModal, setShowResumeModal] = useState(false)

    const canvasRef = useRef(null)
    const particlesRef = useRef([])
    const animRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const shapesRef = useRef({ x: 0, y: 0 })

    // Framer Motion values for parallax shapes
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const shapeX1 = useSpring(useTransform(mouseX, [-1, 1], [-30, 30]), { stiffness: 40, damping: 20 })
    const shapeY1 = useSpring(useTransform(mouseY, [-1, 1], [-20, 20]), { stiffness: 40, damping: 20 })
    const shapeX2 = useSpring(useTransform(mouseX, [-1, 1], [20, -20]), { stiffness: 25, damping: 15 })
    const shapeY2 = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), { stiffness: 25, damping: 15 })
    const shapeX3 = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), { stiffness: 60, damping: 25 })
    const shapeY3 = useSpring(useTransform(mouseY, [-1, 1], [-25, 25]), { stiffness: 60, damping: 25 })

    useEffect(() => { setMounted(true) }, [])

    // Mouse parallax tracking
    useEffect(() => {
        const handleMouse = (e) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1
            const ny = (e.clientY / window.innerHeight) * 2 - 1
            mouseX.set(nx)
            mouseY.set(ny)
        }
        window.addEventListener('mousemove', handleMouse)
        return () => window.removeEventListener('mousemove', handleMouse)
    }, [mouseX, mouseY])

    // Typewriter
    useEffect(() => {
        const target = words[wordIndex]
        let timeout
        if (!deleting && charIndex < target.length) {
            timeout = setTimeout(() => { setCurrentWord(target.slice(0, charIndex + 1)); setCharIndex(c => c + 1) }, 85)
        } else if (!deleting && charIndex === target.length) {
            timeout = setTimeout(() => setDeleting(true), 2000)
        } else if (deleting && charIndex > 0) {
            timeout = setTimeout(() => { setCurrentWord(target.slice(0, charIndex - 1)); setCharIndex(c => c - 1) }, 45)
        } else { setDeleting(false); setWordIndex(i => (i + 1) % words.length) }
        return () => clearTimeout(timeout)
    }, [charIndex, deleting, wordIndex])

    // Particle canvas
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
        resize()
        window.addEventListener('resize', resize)

        const N = window.innerWidth < 768 ? 45 : 90
        particlesRef.current = Array.from({ length: N }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            r: Math.random() * 1.8 + 0.3,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
            opacity: Math.random() * 0.45 + 0.1,
        }))

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const p = particlesRef.current
            p.forEach(dot => {
                dot.x += dot.vx; dot.y += dot.vy
                if (dot.x < 0) dot.x = canvas.width
                if (dot.x > canvas.width) dot.x = 0
                if (dot.y < 0) dot.y = canvas.height
                if (dot.y > canvas.height) dot.y = 0
                ctx.beginPath()
                ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,69,0,${dot.opacity})`
                ctx.fill()
            })
            for (let i = 0; i < p.length; i++) {
                for (let j = i + 1; j < p.length; j++) {
                    const dx = p[i].x - p[j].x, dy = p[i].y - p[j].y
                    const d = Math.sqrt(dx * dx + dy * dy)
                    if (d < 130) {
                        ctx.beginPath(); ctx.moveTo(p[i].x, p[i].y); ctx.lineTo(p[j].x, p[j].y)
                        ctx.strokeStyle = `rgba(255,69,0,${0.14 * (1 - d / 130)})`
                        ctx.lineWidth = 0.7; ctx.stroke()
                    }
                }
            }
            animRef.current = requestAnimationFrame(draw)
        }
        animRef.current = requestAnimationFrame(draw)
        return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
    }, [])

    const variants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] } }),
    }

    return (
        <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
            <canvas ref={canvasRef} className="hero-canvas w-full h-full absolute inset-0" />

            {/* Morphing background blobs */}
            <div
                className="morph-blob absolute w-[700px] h-[700px] -top-60 -left-60 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,69,0,0.10) 0%, transparent 70%)' }}
            />
            <div
                className="morph-blob morph-blob-2 absolute w-[500px] h-[500px] bottom-[-100px] right-[-100px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 70%)' }}
            />
            <div
                className="morph-blob morph-blob-3 absolute w-[350px] h-[350px] top-[40%] right-[20%] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,69,0,0.06) 0%, transparent 70%)' }}
            />

            {/* Noise */}
            <div className="noise-overlay" />

            {/* ── Parallax Geometric Shapes ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
                {/* Large rotating ring */}
                <motion.div
                    style={{ x: shapeX2, y: shapeY2 }}
                    className="absolute top-[10%] right-[6%]"
                >
                    <div
                        className="hero-spin w-[160px] h-[160px] md:w-[220px] md:h-[220px] rounded-full"
                        style={{ border: '1px solid rgba(255,69,0,0.15)' }}
                    />
                    {/* Orbiting dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="orbit-dot w-3 h-3 rounded-full"
                            style={{ background: '#FF4500', boxShadow: '0 0 10px rgba(255,69,0,0.8)' }}
                        />
                    </div>
                </motion.div>

                {/* Rotating square */}
                <motion.div
                    style={{ x: shapeX1, y: shapeY1 }}
                    className="absolute top-[20%] right-[10%] hero-shape-a"
                >
                    <div
                        className="w-20 h-20 md:w-28 md:h-28 rounded-lg"
                        style={{ border: '1px solid rgba(255,69,0,0.2)', transform: 'rotate(25deg)' }}
                    />
                </motion.div>

                {/* Floating triangle-ish shape */}
                <motion.div
                    style={{ x: shapeX3, y: shapeY3 }}
                    className="absolute bottom-[28%] right-[12%] hero-shape-b"
                >
                    <div
                        className="w-14 h-14 md:w-20 md:h-20 rounded-full"
                        style={{ border: '1px solid rgba(255,140,0,0.15)' }}
                    />
                </motion.div>

                {/* Left diamond */}
                <motion.div
                    style={{ x: shapeX2, y: shapeY3 }}
                    className="absolute top-[45%] left-[4%] hero-shape-d"
                >
                    <div
                        className="w-10 h-10 md:w-16 md:h-16"
                        style={{ border: '1px solid rgba(255,69,0,0.18)', transform: 'rotate(45deg)' }}
                    />
                </motion.div>

                {/* Pulsing dots */}
                <motion.div style={{ x: shapeX1, y: shapeY2 }} className="absolute top-[32%] left-[14%] hero-dot-pulse">
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,69,0,0.5)', boxShadow: '0 0 16px rgba(255,69,0,0.6)' }} />
                </motion.div>
                <motion.div style={{ x: shapeX3, y: shapeY1, animationDelay: '-1.5s' }} className="absolute bottom-[35%] right-[4%]">
                    <div className="hero-dot-pulse w-2 h-2 rounded-full" style={{ background: 'rgba(255,140,0,0.6)', boxShadow: '0 0 10px rgba(255,140,0,0.5)' }} />
                </motion.div>

                {/* Corner accent lines */}
                <div className="absolute top-[15%] left-[8%] opacity-20">
                    <div className="w-8 h-px bg-accent mb-1.5" />
                    <div className="w-12 h-px bg-accent" />
                </div>
                <div className="absolute bottom-[20%] right-[20%] opacity-15 rotate-45">
                    <div className="w-6 h-px bg-accent-light mb-2" />
                    <div className="w-10 h-px bg-accent-light" />
                </div>
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 max-w-8xl mx-auto px-6 lg:px-12 pt-28 pb-20">
                <div className="max-w-4xl">

                    {/* Label */}
                    <motion.div
                        custom={0} initial="hidden" animate={mounted ? 'visible' : 'hidden'} variants={variants}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-dm font-semibold mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        Hey, I'm
                    </motion.div>

                    {/* Name */}
                    <motion.div
                        custom={1} initial="hidden" animate={mounted ? 'visible' : 'hidden'} variants={variants}
                        className="mb-2"
                    >
                        <span
                            className="font-syne font-extrabold tracking-tight"
                            style={{
                                fontSize: 'clamp(48px, 9vw, 108px)',
                                background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 40%, #FF8C00 80%, #FF4500 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                lineHeight: 1,
                                letterSpacing: '-0.02em',
                                textShadow: 'none',
                            }}
                        >
                            RAGUL M
                        </span>
                    </motion.div>

                    {/* Typewriter role */}
                    <motion.h1
                        custom={2} initial="hidden" animate={mounted ? 'visible' : 'hidden'} variants={variants}
                        className="font-syne font-extrabold text-white mb-4 leading-none"
                        style={{ fontSize: 'clamp(28px, 5.5vw, 64px)' }}
                    >
                        <span className="gradient-text">{currentWord}</span>
                        <span className="typewriter-cursor" />
                    </motion.h1>

                    {/* One-liner identity tagline */}
                    <motion.p
                        custom={3} initial="hidden" animate={mounted ? 'visible' : 'hidden'} variants={variants}
                        className="font-dm text-text-secondary max-w-xl mb-10"
                        style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', lineHeight: 1.7 }}
                    >
                        ECE Student &amp; Builder of{' '}
                        <span className="text-white font-medium">AI-powered tools</span>,{' '}
                        web apps &amp; data-driven solutions —{' '}
                        turning ideas into working products.
                    </motion.p>

                    {/* CTAs — Magnetic buttons */}
                    <motion.div
                        custom={4} initial="hidden" animate={mounted ? 'visible' : 'hidden'} variants={variants}
                        className="flex flex-wrap gap-4 mb-16"
                    >
                        <MagneticButton
                            className="btn-primary"
                            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <span>View My Work</span>
                            <ChevronDown size={16} />
                        </MagneticButton>
                        <MagneticButton
                            className="btn-outline"
                            onClick={() => setShowResumeModal(true)}
                        >
                            <Download size={16} />
                            Download Resume
                        </MagneticButton>
                    </motion.div>

                    {/* Chips */}
                    <motion.div
                        custom={5} initial="hidden" animate={mounted ? 'visible' : 'hidden'} variants={variants}
                        className="flex flex-wrap gap-3"
                    >
                        {chips.map((chip, i) => (
                            <motion.span
                                key={chip}
                                whileHover={{ scale: 1.06, y: -2 }}
                                className="px-4 py-2 rounded-full text-xs font-dm font-bold tracking-wider uppercase"
                                style={{
                                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                    color: i % 2 === 0 ? '#FF4500' : '#FF8C00',
                                }}
                            >
                                {chip}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-dm text-text-secondary tracking-[0.2em] uppercase">Scroll</span>
                <motion.div
                    animate={{ scaleY: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
                />
            </motion.div>

            {/* Resume Not Ready Modal */}
            {showResumeModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowResumeModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                        className="relative max-w-md w-full rounded-2xl p-8 text-center"
                        style={{ background: 'rgba(15,18,30,0.98)', border: '1px solid rgba(255,69,0,0.25)', boxShadow: '0 0 60px rgba(255,69,0,0.15)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-5xl mb-4">😅</div>
                        <h3 className="font-syne font-extrabold text-white text-2xl mb-3">
                            Oops! Resume not ready yet.
                        </h3>
                        <p className="font-dm text-text-secondary text-sm leading-relaxed mb-2">
                            I'm currently crafting the perfect resume — one that's as impressive as this portfolio.
                        </p>
                        <p className="font-dm text-sm leading-relaxed mb-6" style={{ color: '#FF8C00' }}>
                            🏗️ ETA: Soon™ (I promise, it's in progress!)
                        </p>
                        <p className="font-dm text-text-secondary text-sm mb-6">
                            Meanwhile, everything you need is right here on this site —{' '}
                            <span className="text-white font-medium">my projects, skills, academics, and contact info</span>{' '}
                            are all a scroll away. This <em>is</em> my resume. 😄
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => { setShowResumeModal(false); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
                                className="btn-primary text-sm px-5 py-2.5"
                            >
                                Explore My Work 🚀
                            </button>
                            <button
                                onClick={() => setShowResumeModal(false)}
                                className="btn-outline text-sm px-5 py-2.5"
                            >
                                Got it!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </section>
    )
}
