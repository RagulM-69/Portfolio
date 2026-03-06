import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { skills } from '../data/skills'
import { Brain, MessageCircle, Cpu, Lightbulb } from 'lucide-react'

const softIcons = { 'Problem Solving': Lightbulb, 'Team Collaboration': MessageCircle, 'Fast Learner': Cpu, Communication: Brain }

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
}
const pillVariants = {
    hidden: { opacity: 0, scale: 0.6, y: 25 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}
const headingVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function Skills() {
    const headingRef = useRef(null)
    const headingInView = useInView(headingRef, { once: true, margin: '-80px' })

    return (
        <section id="skills" className="relative py-28 lg:py-36 overflow-hidden">
            <div
                className="morph-blob morph-blob-2 absolute w-[500px] h-[500px] bottom-0 left-[-100px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,69,0,0.08) 0%, transparent 70%)' }}
            />

            <div className="max-w-8xl mx-auto px-6 lg:px-12">
                {/* Heading */}
                <motion.div
                    ref={headingRef}
                    initial="hidden" animate={headingInView ? 'visible' : 'hidden'}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                    className="mb-20 text-center"
                >
                    <motion.span variants={headingVariants} className="text-accent font-dm font-semibold text-sm uppercase tracking-widest mb-3 block">
                        Technical Expertise
                    </motion.span>
                    <motion.h2
                        variants={headingVariants}
                        className={`font-syne font-extrabold text-white inline-block section-heading ${headingInView ? 'line-animate' : ''}`}
                        style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
                    >
                        What I Work With
                    </motion.h2>
                </motion.div>

                {/* Categories */}
                <div className="space-y-16">
                    {skills.map((cat, ci) => {
                        const catRef = useRef(null)
                        const catInView = useInView(catRef, { once: true, margin: '-60px' })
                        return (
                            <div key={cat.category} ref={catRef}>
                                {/* Category label */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={catInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex items-center gap-4 mb-8"
                                >
                                    <h3
                                        className="font-syne font-bold text-sm uppercase tracking-widest"
                                        style={{ color: cat.color }}
                                    >
                                        {cat.category}
                                    </h3>
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={catInView ? { scaleX: 1 } : {}}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                        className="flex-1 h-px origin-left"
                                        style={{ background: `${cat.color}28` }}
                                    />
                                </motion.div>

                                {/* Pills */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate={catInView ? 'visible' : 'hidden'}
                                    className="flex flex-wrap gap-3"
                                >
                                    {cat.items.map((skill) => {
                                        const SoftIcon = softIcons[skill.name]
                                        return (
                                            <motion.div
                                                key={skill.name}
                                                variants={pillVariants}
                                                whileHover={{
                                                    scale: 1.12,
                                                    y: -4,
                                                    background: 'rgba(255,69,0,0.15)',
                                                    boxShadow: '0 0 22px rgba(255,69,0,0.35)',
                                                    transition: { type: 'spring', stiffness: 400, damping: 15 },
                                                }}
                                                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-dm font-medium text-sm text-white/80"
                                                style={{
                                                    background: 'rgba(255,255,255,0.04)',
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                }}
                                            >
                                                {skill.icon ? (
                                                    <i className={`${skill.icon} colored`} style={{ fontSize: '18px' }} />
                                                ) : SoftIcon ? (
                                                    <SoftIcon size={16} style={{ color: cat.color }} />
                                                ) : null}
                                                {skill.name}
                                            </motion.div>
                                        )
                                    })}
                                </motion.div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
