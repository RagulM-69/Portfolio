import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Academics from './components/Academics'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import ScrollProgressBar from './components/ScrollProgressBar'

function App() {
    useEffect(() => {
        // Lenis smooth scroll (dynamic import to avoid SSR issues)
        let lenis
        const initLenis = async () => {
            try {
                const { default: Lenis } = await import('lenis')
                lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smooth: true,
                })
                const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf) }
                requestAnimationFrame(raf)
            } catch (e) {
                // Lenis optional; fallback to CSS smooth scroll
            }
        }
        initLenis()
        return () => { if (lenis) lenis.destroy() }
    }, [])

    return (
        <div className="min-h-screen bg-bg text-text-primary overflow-x-hidden">
            <CustomCursor />
            <ScrollProgressBar />
            <Navbar />
            <main>
                <Hero />
                <About />
                <Academics />
                <Skills />
                <Projects />
                <Contact />
            </main>
            <Footer />
        </div>
    )
}

export default App
