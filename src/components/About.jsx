import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, GitBranch, Users } from 'lucide-react'

const highlights = [
    { icon: Zap, label: 'Fast Learner', desc: 'I pick up new technologies quickly, shipping production-ready code within days.', color: '#FF4500' },
    { icon: GitBranch, label: 'Open Source', desc: 'Contributing to communities, sharing knowledge and improving shared tools.', color: '#FF8C00' },
    { icon: Users, label: 'Team Player', desc: 'Experienced in collaborative environments, hackathons, and agile workflows.', color: '#FF4500' },
]

const stats = [
    { value: 6, suffix: '+', label: 'Projects Built' },
    { value: 15, suffix: '+', label: 'Technologies Explored' },
    { value: 3, suffix: '+', label: 'Years Learning Programming' },
    { value: 7, suffix: '+', label: 'Global Certifications' },
]

/* Animated counter */
function Counter({ value, suffix, duration = 1500 }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    useEffect(() => {
        if (!inView || value === null) return
        let start = 0
        const step = () => {
            start += 1
            setCount(Math.min(start, value))
            if (start < value) setTimeout(step, duration / value)
        }
        step()
    }, [inView, value, duration])

    if (value === null) return <span ref={ref} style={{ fontSize: 'clamp(16px, 1.8vw, 22px)', lineHeight: 1.3 }}>{suffix}</span>
    return <span ref={ref}>{count}{suffix}</span>
}

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}
const slideLeft = { hidden: { opacity: 0, x: -70 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }
const slideRight = { hidden: { opacity: 0, x: 70 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }

export default function About() {
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const leftRef = useRef(null)
    const rightRef = useRef(null)
    const statsRef = useRef(null)
    const cardsRef = useRef(null)

    const headingInView = useInView(headingRef, { once: true, margin: '-80px' })
    const leftInView = useInView(leftRef, { once: true, margin: '-80px' })
    const rightInView = useInView(rightRef, { once: true, margin: '-80px' })
    const statsInView = useInView(statsRef, { once: true, margin: '-80px' })
    const cardsInView = useInView(cardsRef, { once: true, margin: '-80px' })

    return (
        <section id="about" className="relative py-28 lg:py-36 overflow-hidden" ref={sectionRef}>
            {/* Morphing blob */}
            <div
                className="morph-blob morph-blob-2 absolute w-[600px] h-[600px] top-0 left-[-200px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,69,0,0.07) 0%, transparent 70%)' }}
            />

            <div className="max-w-8xl mx-auto px-6 lg:px-12">

                {/* Heading */}
                <motion.div
                    ref={headingRef}
                    initial="hidden" animate={headingInView ? 'visible' : 'hidden'}
                    variants={containerVariants}
                    className="mb-16"
                >
                    <motion.span variants={itemVariants} className="text-accent font-dm font-semibold text-sm uppercase tracking-widest mb-3 block">
                        About Me
                    </motion.span>
                    <motion.h2
                        variants={itemVariants}
                        className="font-syne font-extrabold text-white section-heading"
                        style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
                    >
                        Who I Am
                    </motion.h2>
                    <motion.div
                        variants={itemVariants}
                        className="mt-5 line-draw"
                        style={{ width: headingInView ? '80px' : '0' }}
                    />
                </motion.div>

                {/* Two-column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
                    <motion.div
                        ref={leftRef}
                        initial="hidden" animate={leftInView ? 'visible' : 'hidden'}
                        variants={slideLeft}
                    >
                        <p className="font-syne font-bold text-white leading-tight mb-6" style={{ fontSize: 'clamp(24px, 3.2vw, 40px)' }}>
                            I build{' '}
                            <span className="gradient-text">intelligent tools</span>{' '}
                            and digital solutions that solve real-world problems.
                        </p>
                        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-accent to-accent-light" />
                    </motion.div>

                    <motion.div
                        ref={rightRef}
                        initial="hidden" animate={rightInView ? 'visible' : 'hidden'}
                        variants={slideRight}
                        className="space-y-4"
                    >
                        {[
                            <>I'm <span className="text-white font-semibold">Ragul M</span>, an Electronics and Communication Engineering student at SNS College of Technology, passionate about building AI-powered applications, web tools, and data-driven systems.</>,
                            "I enjoy transforming ideas into practical products — from AI tools like ResuSloth and SlothSummarizer to platforms like Cuddle Cart, a community-driven eCommerce app for parents. I also explore areas like AI agents, automation systems, and decision-support tools.",
                            "My approach to learning is simple: build, experiment, and improve continuously. Whether it's working with APIs, developing web applications, or experimenting with intelligent systems, I enjoy diving deep into problems and creating meaningful solutions.",
                            "Currently seeking internship opportunities, collaborations, and challenging projects where I can grow as a developer and contribute to impactful technology.",
                        ].map((text, i) => (
                            <p key={i} className="font-dm text-text-secondary leading-relaxed" style={{ fontSize: 'clamp(14px, 1.4vw, 16px)' }}>
                                {text}
                            </p>
                        ))}
                    </motion.div>
                </div>

                {/* Stat counters */}
                <motion.div
                    ref={statsRef}
                    initial="hidden" animate={statsInView ? 'visible' : 'hidden'}
                    variants={containerVariants}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
                >
                    {stats.map((s) => (
                        <motion.div
                            key={s.label}
                            variants={itemVariants}
                            className="stat-card p-7 rounded-2xl text-center"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <div
                                className="font-syne font-extrabold mb-2 gradient-text"
                                style={{ fontSize: 'clamp(36px, 4vw, 54px)' }}
                            >
                                <Counter value={s.value} suffix={s.suffix} />
                            </div>
                            <p className="font-dm text-text-secondary text-sm">{s.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Highlight cards */}
                <motion.div
                    ref={cardsRef}
                    initial="hidden" animate={cardsInView ? 'visible' : 'hidden'}
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                >
                    {highlights.map((h) => {
                        const Icon = h.icon
                        return (
                            <motion.div
                                key={h.label}
                                variants={itemVariants}
                                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                                className="highlight-card p-7 rounded-2xl"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                            >
                                <div className="card-glow" />
                                {/* Top accent bar */}
                                <div className="w-full h-[2px] rounded-full mb-6 opacity-60"
                                    style={{ background: `linear-gradient(90deg, ${h.color}, transparent)` }}
                                />
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${h.color}18` }}>
                                    <Icon size={22} style={{ color: h.color }} />
                                </div>
                                <h3 className="font-syne font-bold text-white text-lg mb-2">{h.label}</h3>
                                <p className="font-dm text-text-secondary text-sm leading-relaxed">{h.desc}</p>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Currently Working On */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12 p-8 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,69,0,0.15)' }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" style={{ boxShadow: '0 0 8px rgba(255,69,0,0.8)' }} />
                        <span className="font-syne font-bold text-white text-lg">Currently Working On</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            "Building a personalised website for an organization — featuring donations, merchandise, their deeds, and contact sections",
                            "Building AI-powered productivity tools and web applications",
                            "Learning Data Analytics and real-world business problem solving",
                            "Experimenting with AI agents and automation frameworks",
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#FF4500' }} />
                                <p className="font-dm text-text-secondary text-sm leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
