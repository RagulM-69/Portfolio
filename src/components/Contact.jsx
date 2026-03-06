import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import emailjs from '@emailjs/browser'
import { Mail, Github, Linkedin, Send, AlertCircle } from 'lucide-react'

// ── EmailJS config ──────────────────────────────────────────────────────────
const EJ_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EJ_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EJ_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// ── Email validation ────────────────────────────────────────────────────────
// Requires a real TLD (2+ chars), blocks obvious fakes
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
const FAKE_DOMAINS = [
    'test.com', 'test.test', 'abc.com', 'abc.abc', '123.com',
    'example.com', 'fake.com', 'noemail.com', 'noreply.com',
    'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
    'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
    'spam4.me', 'trashmail.com', 'trashmail.me', 'dispostable.com',
    'maildrop.cc', 'getnada.com', 'discard.email',
]

function isValidEmail(email) {
    const e = email.trim().toLowerCase()
    if (!EMAIL_RE.test(e)) return false
    const domain = e.split('@')[1]
    // Reject single-word domains without real TLD (e.g. abc@abc)
    if (!domain.includes('.')) return false
    if (FAKE_DOMAINS.includes(domain)) return false
    return true
}

// ── Rate limiting (localStorage) ────────────────────────────────────────────
const RATE_KEY = 'contact_submissions'
const RATE_MAX = 5
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in ms

function getRateTimestamps() {
    try { return JSON.parse(localStorage.getItem(RATE_KEY) || '[]') } catch { return [] }
}
function recordSubmission() {
    const now = Date.now()
    const recent = getRateTimestamps().filter(t => now - t < RATE_WINDOW)
    recent.push(now)
    localStorage.setItem(RATE_KEY, JSON.stringify(recent))
}
function isRateLimited() {
    const now = Date.now()
    const recent = getRateTimestamps().filter(t => now - t < RATE_WINDOW)
    return recent.length >= RATE_MAX
}

// ── FloatingInput ───────────────────────────────────────────────────────────
function FloatingInput({ id, label, type = 'text', value, onChange, error, valid, multiline }) {
    const props = {
        id,
        placeholder: ' ',
        value,
        onChange: (e) => onChange(e.target.value),
        className: `${error ? 'error' : valid ? 'valid' : ''}`,
        ...(multiline ? { rows: 5 } : { type }),
    }
    return (
        <div className="floating-label-group">
            {multiline ? <textarea {...props} /> : <input {...props} />}
            <label htmlFor={id}>{label}</label>
            {error && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1 font-dm">
                    <AlertCircle size={11} /> {error}
                </p>
            )}
        </div>
    )
}

function addRipple(e, btn) {
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    const size = Math.max(rect.width, rect.height)
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 700)
}

// ── Contact ─────────────────────────────────────────────────────────────────
export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [errors, setErrors] = useState({})
    const [valid, setValid] = useState({})
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('')
    const btnRef = useRef(null)
    const sectionRef = useRef(null)

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
            { threshold: 0.1 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const validate = () => {
        const errs = {}
        const vals = {}
        if (!form.name.trim()) {
            errs.name = 'Name is required'
        } else {
            vals.name = true
        }
        if (!form.email.trim()) {
            errs.email = 'Email is required'
        } else if (!isValidEmail(form.email)) {
            errs.email = 'Please enter a valid email address.'
        } else {
            vals.email = true
        }
        if (!form.message.trim()) {
            errs.message = 'Message cannot be empty'
        } else if (form.message.trim().length < 10) {
            errs.message = 'Message too short (min 10 chars)'
        } else {
            vals.message = true
        }
        setErrors(errs)
        setValid(vals)
        return Object.keys(errs).length === 0
    }

    const handleChange = (field) => (value) => {
        setForm(f => ({ ...f, [field]: value }))
        setErrors(e => ({ ...e, [field]: undefined }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (btnRef.current) addRipple(e, btnRef.current)
        if (!validate()) return

        // Rate limit check
        if (isRateLimited()) {
            setStatus('error')
            setErrorMsg('Too many messages. Please try again in an hour.')
            return
        }

        setStatus('loading')
        try {
            // 1. Save to Supabase (existing behaviour)
            const { error: dbError } = await supabase.from('contact_submissions').insert([{
                name: form.name.trim(),
                email: form.email.trim(),
                message: form.message.trim(),
            }])
            if (dbError) throw dbError

            // 2. Send email via EmailJS (non-blocking — only runs if keys are set)
            if (EJ_SERVICE && EJ_TEMPLATE && EJ_KEY &&
                !EJ_SERVICE.includes('your_') && !EJ_TEMPLATE.includes('your_')) {
                try {
                    await emailjs.send(
                        EJ_SERVICE,
                        EJ_TEMPLATE,
                        {
                            from_name: form.name.trim(),
                            from_email: form.email.trim(),
                            reply_to: form.email.trim(),   // Reply button → visitor's inbox
                            message: form.message.trim(),
                            to_email: 'ragulm780@gmail.com',
                        },
                        EJ_KEY
                    )
                } catch (emailErr) {
                    // Email failed silently — Supabase save already succeeded
                    console.warn('EmailJS error:', emailErr)
                }
            }

            // 3. Record submission for rate limiting
            recordSubmission()

            setStatus('success')
            setForm({ name: '', email: '', message: '' })
            setValid({})
        } catch (err) {
            setStatus('error')
            setErrorMsg(err.message || 'Something went wrong. Please try again.')
        }
    }

    return (
        <section id="contact" className="relative py-28 lg:py-36 overflow-hidden">
            <div
                className="glow-blob w-[600px] h-[600px] top-0 right-[-200px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,69,0,0.07) 0%, transparent 70%)' }}
            />

            <div className="max-w-8xl mx-auto px-6 lg:px-12">
                {/* Heading */}
                <div ref={sectionRef} className="mb-16 section-reveal">
                    <span className="text-accent font-dm font-semibold text-sm uppercase tracking-widest mb-3 block">
                        Contact
                    </span>
                    <h2
                        className="font-syne font-extrabold text-white section-heading mb-5"
                        style={{ fontSize: 'clamp(32px, 5vw, 54px)' }}
                    >
                        Let's Work Together
                    </h2>
                    <p className="font-dm text-text-secondary max-w-xl" style={{ fontSize: 'clamp(15px, 1.5vw, 17px)' }}>
                        Whether you have a project in mind, a collaboration idea, or just want to say hi — my inbox is always open.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Form */}
                    <div>
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-6">
                                    <circle cx="40" cy="40" r="38" stroke="#22c55e" strokeWidth="3" opacity="0.3" />
                                    <circle cx="40" cy="40" r="38" stroke="#22c55e" strokeWidth="3" strokeDasharray="240" strokeDashoffset="240" style={{ animation: 'drawCheck 1s ease forwards' }} />
                                    <polyline points="24,42 35,53 56,30" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="60" strokeDashoffset="60" className="check-circle" />
                                </svg>
                                <h3 className="font-syne font-bold text-white text-2xl mb-2">Message Sent!</h3>
                                <p className="font-dm text-text-secondary">
                                    Message sent successfully. I'll get back to you soon.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-accent font-dm font-medium text-sm hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                <FloatingInput
                                    id="contact-name"
                                    label="Your Name"
                                    value={form.name}
                                    onChange={handleChange('name')}
                                    error={errors.name}
                                    valid={valid.name}
                                />
                                <FloatingInput
                                    id="contact-email"
                                    label="Email Address"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange('email')}
                                    error={errors.email}
                                    valid={valid.email}
                                />
                                <FloatingInput
                                    id="contact-message"
                                    label="Your Message"
                                    value={form.message}
                                    onChange={handleChange('message')}
                                    error={errors.message}
                                    valid={valid.message}
                                    multiline
                                />

                                {status === 'error' && (
                                    <p className="text-red-400 text-sm font-dm flex items-center gap-2">
                                        <AlertCircle size={14} /> {errorMsg}
                                    </p>
                                )}

                                <button
                                    ref={btnRef}
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="ripple-btn btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{ borderRadius: '10px', padding: '16px 24px' }}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send size={16} className="ml-1" />
                                        </>
                                    )}
                                </button>

                                {/* Rate limit info */}
                                <p className="text-xs text-center font-dm" style={{ color: 'rgba(255,255,255,0.2)' }}>
                                    Max 5 messages per hour
                                </p>
                            </form>
                        )}
                    </div>

                    {/* Contact info */}
                    <div className="flex flex-col justify-center gap-5">
                        <div className="mb-4">
                            <h3 className="font-syne font-bold text-white text-2xl mb-3">Get in touch directly</h3>
                            <p className="font-dm text-text-secondary text-sm leading-relaxed">
                                I'm currently open to new opportunities. If you have a role, project, or idea — let's talk.
                            </p>
                        </div>

                        <a href="mailto:ragulm780@gmail.com" className="contact-chip">
                            <Mail size={18} style={{ color: '#FF4500' }} />
                            ragulm780@gmail.com
                        </a>
                        <a
                            href="https://github.com/RagulM-69"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-chip"
                        >
                            <Github size={18} style={{ color: '#FF4500' }} />
                            github.com/RagulM-69
                        </a>
                        <a
                            href="https://www.linkedin.com/in/m-ragul/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-chip"
                        >
                            <Linkedin size={18} style={{ color: '#FF4500' }} />
                            linkedin.com/in/m-ragul
                        </a>

                        {/* Availability badge */}
                        <div
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-dm font-medium self-start"
                            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac' }}
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Available for opportunities
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
