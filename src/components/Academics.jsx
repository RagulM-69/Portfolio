import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { academics } from '../data/academics'
import { MapPin, Calendar, Award } from 'lucide-react'

export default function Academics() {
    const headingRef = useRef(null)
    const headingInView = useInView(headingRef, { once: true, margin: '-80px' })

    return (
        <section id="academics" className="relative py-28 lg:py-36 overflow-hidden">
            <div
                className="morph-blob absolute w-[500px] h-[500px] top-1/2 right-[-150px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,140,0,0.07) 0%, transparent 70%)' }}
            />

            <div className="max-w-8xl mx-auto px-6 lg:px-12">
                {/* Heading */}
                <motion.div
                    ref={headingRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={headingInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-20 text-center"
                >
                    <span className="text-accent font-dm font-semibold text-sm uppercase tracking-widest mb-3 block">Education</span>
                    <h2
                        className={`font-syne font-extrabold text-white inline-block section-heading ${headingInView ? 'line-animate' : ''}`}
                        style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
                    >
                        My Academic Journey
                    </h2>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px timeline-line" />

                    <div className="flex flex-col gap-16">
                        {academics.map((item, i) => {
                            const isLeft = i % 2 === 0
                            const cardRef = useRef(null)
                            const inView = useInView(cardRef, { once: true, margin: '-80px' })

                            return (
                                <div
                                    key={item.id}
                                    ref={cardRef}
                                    className={`relative flex flex-col md:flex-row items-stretch gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Card */}
                                    <div className={`w-full md:w-[calc(50%-48px)] ${isLeft ? '' : ''}`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: isLeft ? -70 : 70, y: 20 }}
                                            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                                            whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                                            className="p-7 rounded-2xl h-full"
                                            style={{
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                            }}
                                        >
                                            {/* Year badge */}
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dm font-bold text-accent bg-accent/10 border border-accent/25 mb-4"
                                            >
                                                <Calendar size={11} />
                                                {item.year}
                                            </motion.span>

                                            <h3 className="font-syne font-bold text-white text-xl mb-1 leading-tight">{item.institution}</h3>
                                            <p className="font-dm font-semibold mb-1" style={{ color: '#FF8C00', fontSize: '14px' }}>{item.degree}</p>
                                            <p className="font-dm text-text-secondary text-xs mb-5 flex items-center gap-1">
                                                <MapPin size={11} />
                                                {item.location}
                                            </p>

                                            <ul className="space-y-2">
                                                {item.highlights.map((h, j) => (
                                                    <motion.li
                                                        key={j}
                                                        initial={{ opacity: 0, x: -15 }}
                                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                                        transition={{ delay: 0.4 + j * 0.08 + i * 0.05 }}
                                                        className="font-dm text-text-secondary text-sm flex items-start gap-2"
                                                    >
                                                        <Award size={12} className="mt-0.5 shrink-0" style={{ color: '#FF4500' }} />
                                                        {h}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    </div>

                                    {/* Center connector */}
                                    <div className="hidden md:flex flex-col items-center justify-center w-24 flex-shrink-0 relative">
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={inView ? { scale: 1, opacity: 1 } : {}}
                                            transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                                            className="w-6 h-6 rounded-full bg-accent timeline-dot flex items-center justify-center z-10"
                                        >
                                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                        </motion.div>
                                    </div>

                                    {/* Spacer */}
                                    <div className="hidden md:block w-[calc(50%-48px)]" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
