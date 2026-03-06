import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { projects } from '../data/projects'
import { ArrowUpRight, Github } from 'lucide-react'

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}
const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

function ProjectCard({ project }) {
    const cardRef = useRef(null)
    const targetRef = useRef({ rotX: 0, rotY: 0, glowX: 50, glowY: 50 })
    const rafRef = useRef(null)

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const cx = rect.width / 2
        const cy = rect.height / 2
        targetRef.current.rotX = ((y - cy) / cy) * -10
        targetRef.current.rotY = ((x - cx) / cx) * 10
        targetRef.current.glowX = (x / rect.width) * 100
        targetRef.current.glowY = (y / rect.height) * 100

        if (!rafRef.current) {
            const animate = () => {
                if (card) {
                    card.style.transform = `perspective(900px) rotateX(${targetRef.current.rotX}deg) rotateY(${targetRef.current.rotY}deg) translateZ(12px)`
                    card.querySelector('.card-radial-glow').style.background =
                        `radial-gradient(circle at ${targetRef.current.glowX}% ${targetRef.current.glowY}%, rgba(255,69,0,0.12) 0%, transparent 60%)`
                }
                rafRef.current = null
            }
            rafRef.current = requestAnimationFrame(animate)
        }
    }

    const handleMouseLeave = () => {
        const card = cardRef.current
        if (card) {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
            card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)'
            card.querySelector('.card-radial-glow').style.background = 'none'
            setTimeout(() => { if (card) card.style.transition = '' }, 500)
        }
    }

    return (
        <motion.div variants={cardVariants}>
            <div
                ref={cardRef}
                className="project-card relative rounded-2xl overflow-hidden h-full"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'box-shadow 0.3s ease',
                    minHeight: '290px',
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Shimmer top border */}
                <div className="card-top-glow" />

                {/* Radial glow follows mouse */}
                <div className="card-radial-glow absolute inset-0 pointer-events-none z-0 transition-[background] duration-200" />

                {/* Card content */}
                <div className="relative z-10 p-7 flex flex-col h-full min-h-[290px]">
                    {/* Featured badge */}
                    {project.featured && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-dm font-bold mb-4 self-start"
                            style={{ background: 'rgba(255,140,0,0.15)', border: '1px solid rgba(255,140,0,0.4)', color: '#FF8C00' }}
                        >
                            <span>⭐</span> Featured Project
                        </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                        <h3
                            className="font-syne font-bold text-white text-xl leading-tight group-hover:text-accent transition-colors max-w-[80%]"
                        >
                            {project.title}
                        </h3>
                        <motion.div
                            whileHover={{ rotate: 45 }}
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(255,69,0,0.1)', border: '1px solid rgba(255,69,0,0.2)' }}
                        >
                            <ArrowUpRight size={16} style={{ color: '#FF4500' }} />
                        </motion.div>
                    </div>

                    <p className="font-dm text-text-secondary text-sm leading-relaxed mb-6 flex-1">
                        {project.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="px-2.5 py-1 text-xs font-dm font-medium rounded-md"
                                style={{ background: 'rgba(255,69,0,0.08)', color: '#FF8C00', border: '1px solid rgba(255,69,0,0.15)' }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Hover overlay */}
                <div
                    className="overlay absolute inset-0 flex flex-col justify-end p-7 z-20 rounded-2xl"
                    style={{
                        background: 'linear-gradient(to top, rgba(10,13,26,0.98) 0%, rgba(10,13,26,0.82) 55%, rgba(10,13,26,0.1) 100%)',
                    }}
                >
                    <p className="font-dm text-white/75 text-sm leading-relaxed mb-5 line-clamp-5">
                        {project.fullDescription}
                    </p>
                    {project.link && (
                        <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-dm font-semibold text-sm text-white self-start"
                            style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B00)', boxShadow: '0 0 24px rgba(255,69,0,0.6)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            View Project
                            <ArrowUpRight size={15} />
                        </motion.a>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default function Projects() {
    const headingRef = useRef(null)
    const gridRef = useRef(null)
    const headingInView = useInView(headingRef, { once: true, margin: '-80px' })
    const gridInView = useInView(gridRef, { once: true, margin: '-80px' })

    return (
        <section id="projects" className="relative py-28 lg:py-36 overflow-hidden">
            <div
                className="morph-blob morph-blob-3 absolute w-[600px] h-[600px] top-1/3 right-[-200px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,69,0,0.08) 0%, transparent 70%)' }}
            />

            <div className="max-w-8xl mx-auto px-6 lg:px-12">
                {/* Heading */}
                <motion.div
                    ref={headingRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={headingInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16"
                >
                    <span className="text-accent font-dm font-semibold text-sm uppercase tracking-widest mb-3 block">Portfolio</span>
                    <h2
                        className={`font-syne font-extrabold text-white section-heading ${headingInView ? 'line-animate' : ''}`}
                        style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
                    >
                        Things I've Built
                    </h2>
                </motion.div>

                {/* Grid */}
                <motion.div
                    ref={gridRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={gridInView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {projects.map(p => <ProjectCard key={p.id} project={p} />)}
                </motion.div>
            </div>
        </section>
    )
}
