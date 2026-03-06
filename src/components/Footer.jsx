import { useState, useEffect } from 'react'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'

const socials = [
    { Icon: Github, href: 'https://github.com/RagulM-69', label: 'GitHub' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/m-ragul/', label: 'LinkedIn' },
    { Icon: Mail, href: 'mailto:ragulm780@gmail.com', label: 'Email' },
]

export default function Footer() {
    const [showTop, setShowTop] = useState(false)

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <>
            <footer
                className="relative py-8 border-t"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
                <div className="max-w-8xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Name */}
                    <div className="flex items-center gap-1">
                        <span className="font-syne font-bold text-white text-sm">Ragul M</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-accent ml-1" style={{ boxShadow: '0 0 8px #FF4500' }} />
                    </div>

                    {/* Center */}
                    <p className="font-dm text-text-secondary text-xs text-center">
                        © 2025 · Built with passion
                    </p>

                    {/* Social icons */}
                    <div className="flex items-center gap-4">
                        {socials.map(({ Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                target={href.startsWith('mailto') ? undefined : '_blank'}
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary transition-all duration-200 hover:text-accent hover:scale-110"
                                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>

            {/* Back to top */}
            <button
                onClick={scrollTop}
                aria-label="Back to top"
                className={`back-to-top ${showTop ? 'visible' : ''}`}
            >
                <ArrowUp size={20} color="white" />
            </button>
        </>
    )
}
