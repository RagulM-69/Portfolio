import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Academics', href: '#academics' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('home')
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 80)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const sections = navLinks.map(l => l.href.replace('#', ''))
        const observers = sections.map((id) => {
            const el = document.getElementById(id)
            if (!el) return null
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id)
                },
                { rootMargin: '-40% 0px -55% 0px' }
            )
            obs.observe(el)
            return obs
        })
        return () => observers.forEach(o => o?.disconnect())
    }, [])

    const handleNavClick = (e, href) => {
        e.preventDefault()
        const id = href.replace('#', '')
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        setMenuOpen(false)
    }

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-glass py-3' : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-8xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#home"
                        onClick={(e) => handleNavClick(e, '#home')}
                        className="flex items-center gap-1 group"
                        aria-label="Ragul M - Home"
                    >
                        <span className="font-syne font-bold text-xl text-white tracking-tight group-hover:text-white/90 transition-colors">
                            Ragul M
                        </span>
                        <span
                            className="w-2 h-2 rounded-full bg-accent ml-1 mt-[-4px] group-hover:scale-125 transition-transform"
                            style={{ boxShadow: '0 0 10px #FF4500' }}
                        />
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8 lg:gap-10">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`nav-link font-dm text-sm ${activeSection === link.href.replace('#', '') ? 'active' : ''
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA + Hamburger */}
                    <div className="flex items-center gap-4">
                        <a
                            href="#contact"
                            onClick={(e) => handleNavClick(e, '#contact')}
                            className="hidden sm:inline-flex btn-cta text-sm"
                        >
                            Get in touch
                        </a>
                        <button
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-white/80 hover:border-accent hover:text-accent transition-all"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <button
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-white/80"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>
                <div className="flex flex-col items-center gap-8">
                    {navLinks.map((link, i) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="font-syne font-bold text-3xl text-white/80 hover:text-accent transition-colors"
                            style={{ transitionDelay: `${i * 50}ms` }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        onClick={(e) => handleNavClick(e, '#contact')}
                        className="btn-cta mt-4"
                    >
                        Get in touch
                    </a>
                </div>
            </div>
        </>
    )
}
