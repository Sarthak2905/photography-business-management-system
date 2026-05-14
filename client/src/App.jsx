import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Download,
  GalleryHorizontal,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Pencil,
  Phone,
  Search,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import dayjs from 'dayjs'
import clsx from 'clsx'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import {
  addDemoInquiry,
  demoCredentials,
  getDemoOverview,
  readDemoState,
  removeDemoEntity,
  upsertDemoEntity,
  writeDemoState,
} from './data/mockData'
import {
  deleteEntity,
  fetchDashboardOverview,
  fetchEntity,
  fetchPublicPortfolio,
  fetchPublicTestimonials,
  saveEntity,
  submitInquiry,
  uploadAsset,
} from './lib/api'

const portfolioCategories = ['All', 'Wedding', 'Pre-Wedding', 'Engagement', 'Haldi', 'Mehendi', 'Reception', 'Destination Wedding']
const services = [
  { title: 'Wedding Photography', text: 'Editorial frames, candid moments, and story-led coverage for the complete celebration.' },
  { title: 'Cinematic Videography', text: 'Luxury wedding films with cinematic direction, licensed music, and emotional pacing.' },
  { title: 'Drone Coverage', text: 'Elegant aerial perspectives that elevate destination and large-format wedding experiences.' },
  { title: 'Album Design', text: 'Fine-art printed albums with premium layouts, typography, and archival finishes.' },
  { title: 'Destination Weddings', text: 'Travel-ready production planning for multi-day weddings across India and abroad.' },
]
const statusOptions = ['New', 'Contacted', 'Confirmed', 'Completed']
const bookingStatuses = ['Upcoming', 'Completed', 'Planning']
const pieColors = ['#d4af37', '#f6d365', '#fda085', '#d76d77']

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5 },
}

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(value || 0))

const downloadCsv = (rows, filename) => {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map((row) => headers.map((key) => JSON.stringify(row[key] ?? '')).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const SectionHeading = ({ eyebrow, title, text }) => (
  <div className="mx-auto max-w-3xl text-center">
    <p className="text-sm font-semibold uppercase tracking-[0.45em] text-brand/70">{eyebrow}</p>
    <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">{title}</h2>
    <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">{text}</p>
  </div>
)

const Card = ({ className, children }) => (
  <div className={clsx('rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.32)]', className)}>{children}</div>
)

const Input = ({ label, className, ...props }) => (
  <label className="space-y-2 text-sm text-slate-200">
    <span className="font-medium text-white/80">{label}</span>
    <input
      className={clsx('w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-brand', className)}
      {...props}
    />
  </label>
)

const Textarea = ({ label, ...props }) => (
  <label className="space-y-2 text-sm text-slate-200">
    <span className="font-medium text-white/80">{label}</span>
    <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-brand" {...props} />
  </label>
)

const Select = ({ label, children, ...props }) => (
  <label className="space-y-2 text-sm text-slate-200">
    <span className="font-medium text-white/80">{label}</span>
    <select className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-brand" {...props}>
      {children}
    </select>
  </label>
)

const Toast = ({ toast, onClose }) => (
  <AnimatePresence>
    {toast ? (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-5 right-5 z-[100] max-w-sm rounded-2xl border border-white/10 bg-slate-950/95 px-5 py-4 text-sm text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold">{toast.title}</p>
            <p className="mt-1 text-white/70">{toast.message}</p>
          </div>
          <button type="button" onClick={onClose} className="text-white/50 transition hover:text-white">
            <X size={16} />
          </button>
        </div>
      </motion.div>
    ) : null}
  </AnimatePresence>
)

const HeroSection = () => (
  <section className="relative isolate overflow-hidden pt-28">
    <div className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-30" />
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.3),_transparent_35%),linear-gradient(135deg,#050816_0%,#0b1120_52%,#18181b_100%)]" />
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
      <motion.div {...fadeIn}>
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm text-brand-light">
          <Sparkles size={16} /> Cinematic luxury wedding storytelling
        </div>
        <h1 className="mt-8 max-w-3xl font-display text-5xl leading-tight text-white sm:text-6xl lg:text-7xl">
          Crafted for couples who want their wedding to feel timeless, intimate, and iconic.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
          Lumina Weddings blends editorial portraits, emotional documentary moments, and premium client care to turn celebrations into heirloom stories.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#portfolio" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-light">
            View Portfolio <ArrowRight size={16} />
          </a>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
            Book a Session
          </a>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ['250+', 'Wedding stories delivered'],
            ['4.9/5', 'Average client satisfaction'],
            ['12', 'Destination locations covered'],
          ].map(([value, label]) => (
            <Card key={label} className="p-5">
              <p className="font-display text-3xl text-white">{value}</p>
              <p className="mt-2 text-sm text-white/60">{label}</p>
            </Card>
          ))}
        </div>
      </motion.div>
      <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.1 }} className="relative">
        <Card className="overflow-hidden p-0">
          <img
            src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury wedding celebration"
            className="h-[620px] w-full object-cover"
          />
        </Card>
        <Card className="absolute bottom-6 left-6 max-w-xs">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-light/80">Featured Experience</p>
          <p className="mt-3 text-2xl font-display text-white">Destination wedding production with films, drone coverage, and handcrafted albums.</p>
        </Card>
      </motion.div>
    </div>
  </section>
)

const AboutSection = () => (
  <motion.section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-10" {...fadeIn}>
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <p className="text-sm uppercase tracking-[0.35em] text-brand-light/80">About the studio</p>
        <h2 className="mt-4 font-display text-4xl text-white">A luxury wedding team built around warmth, precision, and emotional storytelling.</h2>
        <p className="mt-5 text-white/70">
          Led by photographer Aarav Kapoor, Lumina Weddings has spent a decade documenting celebrations across palaces, beaches, vineyards, and intimate city venues.
          Every wedding is produced with editorial direction, timeline planning, and a calm team that helps couples feel effortlessly present.
        </p>
      </Card>
      <div className="grid gap-6 sm:grid-cols-2">
        {[
          ['10+ years', 'Experience across premium multi-day wedding productions.'],
          ['4-person core team', 'Dedicated photographers, filmmakers, editors, and coordinators.'],
          ['72-hour previews', 'Fast teaser delivery with polished, premium presentation.'],
          ['White-glove planning', 'Pre-event consultation, shot planning, and vendor collaboration.'],
        ].map(([title, text]) => (
          <Card key={title}>
            <h3 className="font-display text-2xl text-white">{title}</h3>
            <p className="mt-3 text-white/65">{text}</p>
          </Card>
        ))}
      </div>
    </div>
  </motion.section>
)

const PortfolioSection = ({ items }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeImage, setActiveImage] = useState(null)
  const filtered = activeCategory === 'All' ? items : items.filter((item) => item.category === activeCategory)

  return (
    <motion.section id="portfolio" className="mx-auto max-w-7xl px-6 py-24 lg:px-10" {...fadeIn}>
      <SectionHeading
        eyebrow="Portfolio"
        title="A cinematic gallery designed to feel like a wedding editorial."
        text="Filter signature stories across wedding weekends, destination celebrations, engagement sessions, and festive rituals."
      />
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {portfolioCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={clsx('rounded-full border px-4 py-2 text-sm transition', activeCategory === category ? 'border-brand bg-brand text-slate-950' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10')}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filtered.map((item) => (
          <motion.button
            layout
            key={item._id}
            type="button"
            onClick={() => setActiveImage(item)}
            className="group relative mb-5 block w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 text-left"
          >
            <img src={item.imageUrl} alt={item.title} className="w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/0 to-transparent opacity-90" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-light">{item.category}</p>
              <h3 className="mt-2 font-display text-2xl text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.location}</p>
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {activeImage ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/90 p-6" onClick={() => setActiveImage(null)}>
            <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950" onClick={(event) => event.stopPropagation()}>
              <img src={activeImage.imageUrl} alt={activeImage.title} className="max-h-[75vh] w-full object-cover" />
              <div className="flex items-start justify-between gap-6 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-light">{activeImage.category}</p>
                  <h3 className="mt-2 font-display text-3xl text-white">{activeImage.title}</h3>
                  <p className="mt-3 max-w-2xl text-white/70">{activeImage.description}</p>
                </div>
                <button type="button" className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white" onClick={() => setActiveImage(null)}>
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  )
}

const ServicesSection = () => (
  <motion.section className="mx-auto max-w-7xl px-6 py-24 lg:px-10" {...fadeIn}>
    <SectionHeading eyebrow="Services" title="Built for premium storytelling and seamless client experience." text="Each collection is designed to cover the complete wedding journey, from inquiry to final heirloom delivery." />
    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      {services.map((service) => (
        <Card key={service.title} className="flex h-full flex-col justify-between">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand-light">
            <Camera size={22} />
          </div>
          <div className="mt-10">
            <h3 className="font-display text-2xl text-white">{service.title}</h3>
            <p className="mt-4 text-sm leading-7 text-white/65">{service.text}</p>
          </div>
        </Card>
      ))}
    </div>
  </motion.section>
)

const TestimonialsSection = ({ testimonials }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setIndex((current) => (current + 1) % testimonials.length), 5000)
    return () => window.clearInterval(id)
  }, [testimonials.length])

  const active = testimonials[index]

  return (
    <motion.section className="mx-auto max-w-7xl px-6 py-24 lg:px-10" {...fadeIn}>
      <SectionHeading eyebrow="Testimonials" title="Trusted by couples who wanted their story to feel premium and personal." text="Real feedback from celebrations across destination weddings, beach weddings, and intimate engagements." />
      <Card className="mx-auto mt-12 grid max-w-5xl gap-8 overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
        <img src={active.imageUrl} alt={active.coupleName} className="h-full min-h-[380px] rounded-[1.5rem] object-cover" />
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-light/80">{active.role}</p>
            <p className="mt-6 font-display text-4xl leading-tight text-white">“{active.quote}”</p>
            <p className="mt-6 text-lg font-medium text-white/70">{active.coupleName}</p>
          </div>
          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((item, dotIndex) => (
                <button key={item._id} type="button" onClick={() => setIndex(dotIndex)} className={clsx('h-2.5 w-10 rounded-full transition', dotIndex === index ? 'bg-brand' : 'bg-white/10')} />
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setIndex((current) => (current - 1 + testimonials.length) % testimonials.length)} className="rounded-full border border-white/10 p-3 text-white/70 hover:text-white"><ChevronLeft size={18} /></button>
              <button type="button" onClick={() => setIndex((current) => (current + 1) % testimonials.length)} className="rounded-full border border-white/10 p-3 text-white/70 hover:text-white"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </Card>
    </motion.section>
  )
}

const InquirySection = ({ onSuccess, studioName }) => {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', weddingDate: '', eventType: 'Wedding', budget: '', location: '', message: '' })

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      await submitInquiry(form)
    } catch {
      addDemoInquiry(form)
    } finally {
      setSubmitting(false)
      setForm({ name: '', phone: '', email: '', weddingDate: '', eventType: 'Wedding', budget: '', location: '', message: '' })
      onSuccess()
    }
  }

  return (
    <motion.section id="contact" className="mx-auto max-w-7xl px-6 py-24 lg:px-10" {...fadeIn}>
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-light/80">Book your story</p>
          <h2 className="mt-4 font-display text-4xl text-white">Turn your inquiry into a seamless, high-touch booking experience.</h2>
          <p className="mt-5 text-white/70">Submit your wedding details and the {studioName} team will reach out with curated package options, timelines, and availability.</p>
          <div className="mt-8 space-y-4 text-sm text-white/70">
            <div className="flex items-center gap-3"><Phone size={16} className="text-brand-light" /> WhatsApp priority responses</div>
            <div className="flex items-center gap-3"><Mail size={16} className="text-brand-light" /> Automatic inquiry storage and follow-up</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-brand-light" /> Elegant planning workflow for multi-day celebrations</div>
          </div>
        </Card>
        <Card>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
            <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
            <Input label="Wedding Date" type="date" name="weddingDate" value={form.weddingDate} onChange={handleChange} required />
            <Select label="Event Type" name="eventType" value={form.eventType} onChange={handleChange}>
              {portfolioCategories.filter((item) => item !== 'All').map((type) => <option key={type}>{type}</option>)}
            </Select>
            <Input label="Budget" name="budget" type="number" value={form.budget} onChange={handleChange} required />
            <Input label="Location" name="location" value={form.location} onChange={handleChange} required />
            <div className="hidden md:block" />
            <div className="md:col-span-2">
              <Textarea label="Message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your celebration, style, and must-have deliverables." required />
            </div>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-light disabled:opacity-70" disabled={submitting}>
              {submitting ? <LoaderCircle size={18} className="animate-spin" /> : null}
              Submit Inquiry
            </button>
          </form>
        </Card>
      </div>
    </motion.section>
  )
}

const WhatsAppFloat = ({ number }) => (
  <a href={`https://wa.me/${number.replace(/\D/g, '')}?text=Hi%20Lumina%20Weddings%2C%20I%20would%20love%20to%20book%20a%20session.`} target="_blank" rel="noreferrer" className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-slate-950 shadow-xl transition hover:scale-105">
    <MessageCircle size={18} /> WhatsApp
  </a>
)

const PublicSite = ({ portfolio, testimonials, settings, onInquirySuccess }) => (
  <div>
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#home" className="font-display text-2xl text-white">{settings.studioName}</a>
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {['about', 'portfolio', 'contact'].map((item) => <a key={item} href={`#${item}`} className="transition hover:text-white">{item.charAt(0).toUpperCase() + item.slice(1)}</a>)}
          <NavLink to="/admin/login" className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:bg-white/10">Admin Login</NavLink>
        </nav>
      </div>
    </header>
    <main id="home">
      <HeroSection />
      <AboutSection />
      <PortfolioSection items={portfolio} />
      <ServicesSection />
      <TestimonialsSection testimonials={testimonials} />
      <InquirySection studioName={settings.studioName} onSuccess={onInquirySuccess} />
    </main>
    <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/50">
      {settings.studioName} • {settings.city} • {settings.email}
    </footer>
    <WhatsAppFloat number={settings.whatsappNumber} />
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ email: demoCredentials.email, password: demoCredentials.password })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const result = await login(form)
    setLoading(false)

    if (result.success) {
      navigate('/admin', { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-6 py-16">
      <Card className="w-full max-w-md">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-light/80">Secure admin access</p>
        <h1 className="mt-4 font-display text-4xl text-white">Welcome back</h1>
        <p className="mt-3 text-white/70">Log in to manage leads, bookings, payments, and portfolio content.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <Input label="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          {error ? <p className="text-sm text-rose-300">{error}</p> : <p className="text-sm text-white/50">Demo credentials are prefilled for local review.</p>}
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-light disabled:opacity-70" disabled={loading}>
            {loading ? <LoaderCircle size={18} className="animate-spin" /> : null}
            Login
          </button>
        </form>
      </Card>
    </div>
  )
}

const useDashboardData = () => {
  const { auth } = useAuth()
  const [state, setState] = useState(() => readDemoState())
  const [overview, setOverview] = useState(() => getDemoOverview(readDemoState()))
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(auth.demoMode)

  const refresh = async () => {
    setLoading(true)
    try {
      const [nextOverview, leads, clients, bookings, revenue, portfolio, testimonials, settings] = await Promise.all([
        fetchDashboardOverview(),
        fetchEntity('leads'),
        fetchEntity('clients'),
        fetchEntity('bookings'),
        fetchEntity('revenue'),
        fetchEntity('portfolio'),
        fetchEntity('testimonials'),
        fetchEntity('settings'),
      ])
      const nextState = { leads, clients, bookings, revenue, portfolio, testimonials, settings }
      setState(nextState)
      setOverview(nextOverview)
      setDemoMode(false)
    } catch {
      const localState = readDemoState()
      setState(localState)
      setOverview(getDemoOverview(localState))
      setDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const persistLocal = (entity, payload, shouldDelete = false) => {
    let nextState = readDemoState()

    if (entity === 'settings') {
      upsertDemoEntity('settings', payload)
      nextState = readDemoState()
    } else if (shouldDelete) {
      removeDemoEntity(entity, payload)
      nextState = readDemoState()
    } else {
      upsertDemoEntity(entity, payload)
      nextState = readDemoState()
    }

    writeDemoState(nextState)
    setState(nextState)
    setOverview(getDemoOverview(nextState))
    setDemoMode(true)
  }

  const save = async (entity, payload) => {
    try {
      const saved = await saveEntity(entity, payload)
      if (entity === 'settings') {
        setState((current) => ({ ...current, settings: saved }))
      } else {
        setState((current) => {
          const items = [...current[entity]]
          const index = items.findIndex((item) => item._id === saved._id)
          if (index >= 0) items[index] = saved
          else items.unshift(saved)
          const nextState = { ...current, [entity]: items }
          setOverview(getDemoOverview(nextState))
          return nextState
        })
      }
      return { success: true }
    } catch {
      persistLocal(entity, payload)
      return { success: true, demoMode: true }
    }
  }

  const remove = async (entity, id) => {
    try {
      await deleteEntity(entity, id)
      setState((current) => {
        const nextState = { ...current, [entity]: current[entity].filter((item) => item._id !== id) }
        setOverview(getDemoOverview(nextState))
        return nextState
      })
    } catch {
      persistLocal(entity, id, true)
    }
  }

  const upload = async (file) => {
    try {
      const result = await uploadAsset(file)
      return result.url
    } catch {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    }
  }

  return { state, overview, loading, demoMode, refresh, save, remove, upload }
}

const MetricCard = ({ icon: Icon, label, value, helper }) => (
  <Card>
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-white/60">{label}</p>
        <p className="mt-3 font-display text-3xl text-white">{value}</p>
      </div>
      <div className="rounded-2xl bg-brand/10 p-3 text-brand-light"><Icon size={24} /></div>
    </div>
    <p className="mt-4 text-sm text-white/45">{helper}</p>
  </Card>
)

const AdminShell = () => {
  const location = useLocation()
  const { auth, logout } = useAuth()
  const dashboard = useDashboardData()
  const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const navItems = [
    ['Dashboard', '/admin', LayoutDashboard],
    ['Leads', '/admin/leads', Users],
    ['Clients', '/admin/clients', BriefcaseBusiness],
    ['Bookings', '/admin/bookings', CalendarDays],
    ['Revenue', '/admin/revenue', CircleDollarSign],
    ['Portfolio', '/admin/portfolio', GalleryHorizontal],
    ['Testimonials', '/admin/testimonials', MessageCircle],
    ['Settings', '/admin/settings', Settings],
  ]

  useEffect(() => {
    document.documentElement.classList.toggle('light', !darkMode)
  }, [darkMode])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <div className={clsx('min-h-screen', darkMode ? 'bg-slate-950 text-white' : 'bg-zinc-100 text-slate-950')}>
      <div className="mx-auto flex max-w-[1700px] gap-6 px-4 py-4 lg:px-6">
        <aside className={clsx('fixed inset-y-4 left-4 z-50 w-72 rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 backdrop-blur-2xl transition lg:static lg:block', open ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-2xl">Lumina Admin</p>
              <p className="text-sm text-white/45">Premium studio operations</p>
            </div>
            <button type="button" className="lg:hidden" onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <nav className="mt-10 space-y-2">
            {navItems.map(([label, href, Icon]) => (
              <NavLink key={href} to={href} end={href === '/admin'} className={({ isActive }) => clsx('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition', isActive ? 'bg-brand text-slate-950' : 'text-white/70 hover:bg-white/10 hover:text-white')}>
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            <p className="font-semibold text-white">Signed in as</p>
            <p className="mt-1">{auth.user?.name}</p>
            <p className="text-white/40">{auth.user?.email}</p>
            {dashboard.demoMode ? <p className="mt-3 text-brand-light">Demo mode active</p> : null}
          </div>
        </aside>
        <div className="flex-1">
          <header className="sticky top-4 z-30 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-full border border-white/10 p-3 lg:hidden" onClick={() => setOpen(true)}><Menu size={18} /></button>
              <div>
                <p className="text-sm text-white/45">Operational dashboard</p>
                <h1 className="font-display text-3xl text-white">{navItems.find((item) => item[1] === location.pathname)?.[0] || 'Dashboard'}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-full border border-white/10 p-3 text-white/70 transition hover:text-white" onClick={() => setDarkMode((current) => !current)}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:text-white" onClick={logout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </header>
          <div className="py-6">
            <Outlet context={dashboard} />
          </div>
        </div>
      </div>
    </div>
  )
}

const useDashboardContext = () => useOutletContext()

const DashboardPage = () => {
  const { overview, state, loading } = useDashboardContext()
  const cards = overview.cards

  if (loading) {
    return <div className="flex items-center gap-3 text-white/60"><LoaderCircle className="animate-spin" size={18} /> Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={CircleDollarSign} label="Total Revenue" value={formatCurrency(cards.totalRevenue)} helper="Collected across recorded payments." />
        <MetricCard icon={BriefcaseBusiness} label="Total Bookings" value={cards.totalBookings} helper="Active and completed projects." />
        <MetricCard icon={Users} label="Total Clients" value={cards.totalClients} helper="Confirmed and manual clients in pipeline." />
        <MetricCard icon={CalendarDays} label="Pending Payments" value={formatCurrency(cards.pendingPayments)} helper="Remaining balance awaiting collection." />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Monthly revenue</p>
              <h2 className="mt-2 font-display text-3xl text-white">Growth overview</h2>
            </div>
            <div className="text-right text-sm text-white/45">
              <p>Website leads: {cards.websiteLeads}</p>
              <p>Upcoming weddings: {cards.upcomingWeddings}</p>
            </div>
          </div>
          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overview.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" />
                <YAxis stroke="rgba(255,255,255,0.45)" />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px' }} />
                <Line type="monotone" dataKey="amount" stroke="#d4af37" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-white/50">Booking statistics</p>
          <h2 className="mt-2 font-display text-3xl text-white">Pipeline health</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overview.bookingStatistics} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {overview.bookingStatistics.map((entry, index) => <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-3">
            {overview.bookingStatistics.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/70">
                <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} /> {item.name}</div>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <p className="text-sm text-white/50">Upcoming events</p>
          <h2 className="mt-2 font-display text-3xl text-white">Wedding timeline</h2>
          <div className="mt-6 space-y-4">
            {overview.upcomingWeddings.map((booking) => (
              <div key={booking._id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{booking.title}</p>
                    <p className="mt-1 text-sm text-white/50">{booking.location} • {dayjs(booking.date).format('DD MMM YYYY')}</p>
                  </div>
                  <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">{booking.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55">
                  {booking.timeline.map((step) => <span key={step} className="rounded-full bg-white/5 px-3 py-1">{step}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-white/50">Recent portfolio stories</p>
          <h2 className="mt-2 font-display text-3xl text-white">Fresh showcase assets</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {state.portfolio.slice(0, 4).map((item) => (
              <div key={item._id} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
                <img src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-light">{item.category}</p>
                  <h3 className="mt-2 font-display text-2xl text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/50">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

const useTableState = (items) => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 5
  const filtered = useMemo(() => items.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase())), [items, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [search])

  return { search, setSearch, page, setPage, totalPages, visible, filtered }
}

const CRMPage = ({ entity, title }) => {
  const { state, save, remove } = useDashboardContext()
  const items = state[entity]
  const table = useTableState(items)
  const [form, setForm] = useState({ clientName: '', phone: '', email: '', eventType: 'Wedding', weddingDate: '', budget: '', advancePaid: '', remainingAmount: '', totalPackageAmount: '', status: 'New', location: '', notes: '' })
  const [editingId, setEditingId] = useState('')

  const reset = () => {
    setForm({ clientName: '', phone: '', email: '', eventType: 'Wedding', weddingDate: '', budget: '', advancePaid: '', remainingAmount: '', totalPackageAmount: '', status: 'New', location: '', notes: '' })
    setEditingId('')
  }

  const submit = async (event) => {
    event.preventDefault()
    await save(entity, {
      ...form,
      _id: editingId || undefined,
      budget: Number(form.budget || 0),
      advancePaid: Number(form.advancePaid || 0),
      remainingAmount: Number(form.remainingAmount || 0),
      totalPackageAmount: Number(form.totalPackageAmount || form.budget || 0),
      source: entity === 'leads' ? 'manual' : undefined,
    })
    reset()
  }

  const startEdit = (item) => {
    setEditingId(item._id)
    setForm({
      clientName: item.clientName || '',
      phone: item.phone || '',
      email: item.email || '',
      eventType: item.eventType || 'Wedding',
      weddingDate: dayjs(item.weddingDate).format('YYYY-MM-DD'),
      budget: item.budget || '',
      advancePaid: item.advancePaid || '',
      remainingAmount: item.remainingAmount || '',
      totalPackageAmount: item.totalPackageAmount || '',
      status: item.status || 'New',
      location: item.location || '',
      notes: item.notes || item.message || '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/50">{title}</p>
              <h2 className="mt-2 font-display text-3xl text-white">Add or update records</h2>
            </div>
            {editingId ? <button type="button" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70" onClick={reset}>Cancel edit</button> : null}
          </div>
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <Input label="Client Name" value={form.clientName} onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))} required />
            <Input label="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} required />
            <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
            <Input label="Wedding Date" type="date" value={form.weddingDate} onChange={(event) => setForm((current) => ({ ...current, weddingDate: event.target.value }))} required />
            <Input label="Event Type" value={form.eventType} onChange={(event) => setForm((current) => ({ ...current, eventType: event.target.value }))} />
            <Select label="Status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</Select>
            <Input label="Budget" type="number" value={form.budget} onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))} />
            <Input label="Advance Paid" type="number" value={form.advancePaid} onChange={(event) => setForm((current) => ({ ...current, advancePaid: event.target.value }))} />
            <Input label="Remaining Amount" type="number" value={form.remainingAmount} onChange={(event) => setForm((current) => ({ ...current, remainingAmount: event.target.value }))} />
            <Input label="Total Package" type="number" value={form.totalPackageAmount} onChange={(event) => setForm((current) => ({ ...current, totalPackageAmount: event.target.value }))} />
            <div className="md:col-span-2">
              <Input label="Location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Textarea label="Notes" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
            </div>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-light">{editingId ? 'Update record' : entity === 'clients' ? 'Add manual client' : 'Save lead'}</button>
          </form>
        </Card>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/50">Search and filters</p>
              <h2 className="mt-2 font-display text-3xl text-white">Pipeline table</h2>
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70" onClick={() => downloadCsv(table.filtered, `${entity}.csv`)}><Download size={16} /> Export CSV</button>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/60">
            <Search size={16} />
            <input value={table.search} onChange={(event) => table.setSearch(event.target.value)} placeholder="Search by name, status, location, or event type" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" />
          </div>
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/40">
                <tr>
                  <th className="px-4 py-4">Client</th>
                  <th className="px-4 py-4">Event</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Finance</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {table.visible.map((item) => (
                  <tr key={item._id} className="border-t border-white/10 align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium text-white">{item.clientName}</p>
                      <p className="mt-1 text-white/45">{item.email}</p>
                      <p className="text-white/35">{item.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p>{item.eventType}</p>
                      <p className="mt-1 text-white/45">{dayjs(item.weddingDate).format('DD MMM YYYY')}</p>
                      <p className="text-white/35">{item.location}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">{item.status}</span>
                    </td>
                    <td className="px-4 py-4 text-white/55">
                      <p>Total: {formatCurrency(item.totalPackageAmount || item.budget)}</p>
                      <p>Advance: {formatCurrency(item.advancePaid)}</p>
                      <p>Due: {formatCurrency(item.remainingAmount)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => startEdit(item)} className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white"><Pencil size={16} /></button>
                        <button type="button" onClick={() => remove(entity, item._id)} className="rounded-full border border-white/10 p-2 text-rose-300 hover:text-rose-200"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-white/50">
            <p>Page {table.page} of {table.totalPages}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => table.setPage((current) => Math.max(1, current - 1))} className="rounded-full border border-white/10 px-4 py-2">Prev</button>
              <button type="button" onClick={() => table.setPage((current) => Math.min(table.totalPages, current + 1))} className="rounded-full border border-white/10 px-4 py-2">Next</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

const BookingsPage = () => {
  const { state, save, remove } = useDashboardContext()
  const [form, setForm] = useState({ title: '', eventType: 'Wedding', date: '', location: '', status: 'Upcoming', assignedTeam: '', timeline: '' })

  const submit = async (event) => {
    event.preventDefault()
    await save('bookings', {
      ...form,
      assignedTeam: form.assignedTeam.split(',').map((item) => item.trim()).filter(Boolean),
      timeline: form.timeline.split(',').map((item) => item.trim()).filter(Boolean),
    })
    setForm({ title: '', eventType: 'Wedding', date: '', location: '', status: 'Upcoming', assignedTeam: '', timeline: '' })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <p className="text-sm text-white/50">Booking management</p>
        <h2 className="mt-2 font-display text-3xl text-white">Plan upcoming weddings</h2>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <Input label="Project title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Event type" value={form.eventType} onChange={(event) => setForm((current) => ({ ...current, eventType: event.target.value }))} />
            <Input label="Date" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} required />
            <Input label="Location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} required />
            <Select label="Status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>{bookingStatuses.map((status) => <option key={status}>{status}</option>)}</Select>
          </div>
          <Input label="Assigned team (comma separated)" value={form.assignedTeam} onChange={(event) => setForm((current) => ({ ...current, assignedTeam: event.target.value }))} />
          <Textarea label="Timeline milestones (comma separated)" value={form.timeline} onChange={(event) => setForm((current) => ({ ...current, timeline: event.target.value }))} />
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-light">Save booking</button>
        </form>
      </Card>
      <Card>
        <p className="text-sm text-white/50">Project calendar</p>
        <h2 className="mt-2 font-display text-3xl text-white">Upcoming and completed events</h2>
        <div className="mt-6 space-y-4">
          {state.bookings.map((booking) => (
            <div key={booking._id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display text-2xl text-white">{booking.title}</p>
                  <p className="mt-1 text-sm text-white/50">{booking.location} • {dayjs(booking.date).format('DD MMM YYYY')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">{booking.status}</span>
                  <button type="button" onClick={() => remove('bookings', booking._id)} className="rounded-full border border-white/10 p-2 text-rose-300 hover:text-rose-200"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/50">
                {booking.assignedTeam?.map((member) => <span key={member} className="rounded-full bg-white/5 px-3 py-1">{member}</span>)}
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/60">
                {booking.timeline?.map((step) => <p key={step}>• {step}</p>)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

const RevenuePage = () => {
  const { state, save } = useDashboardContext()
  const [form, setForm] = useState({ clientName: '', amount: '', type: 'Advance', paymentDate: '', status: 'Paid', note: '' })
  const monthly = useMemo(() => getDemoOverview(state).monthlyRevenue, [state])

  const submit = async (event) => {
    event.preventDefault()
    await save('revenue', { ...form, amount: Number(form.amount || 0) })
    setForm({ clientName: '', amount: '', type: 'Advance', paymentDate: '', status: 'Paid', note: '' })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-sm text-white/50">Revenue analytics</p>
          <h2 className="mt-2 font-display text-3xl text-white">Payments collected over time</h2>
          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" />
                <YAxis stroke="rgba(255,255,255,0.45)" />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px' }} />
                <Bar dataKey="amount" fill="#d4af37" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-white/50">Add payment entry</p>
          <h2 className="mt-2 font-display text-3xl text-white">Track advances and balances</h2>
          <form className="mt-6 grid gap-4" onSubmit={submit}>
            <Input label="Client name" value={form.clientName} onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))} required />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Amount" type="number" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} required />
              <Input label="Payment date" type="date" value={form.paymentDate} onChange={(event) => setForm((current) => ({ ...current, paymentDate: event.target.value }))} required />
              <Input label="Type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} />
              <Input label="Status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} />
            </div>
            <Textarea label="Payment note" value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} />
            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-light">Save payment</button>
          </form>
        </Card>
      </div>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Payment history</p>
            <h2 className="mt-2 font-display text-3xl text-white">Recorded transactions</h2>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70" onClick={() => downloadCsv(state.revenue, 'revenue.csv')}><Download size={16} /> Export</button>
        </div>
        <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/40">
              <tr>
                <th className="px-4 py-4">Client</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Note</th>
              </tr>
            </thead>
            <tbody>
              {state.revenue.map((item) => (
                <tr key={item._id} className="border-t border-white/10">
                  <td className="px-4 py-4 font-medium text-white">{item.clientName}</td>
                  <td className="px-4 py-4">{item.type}</td>
                  <td className="px-4 py-4">{formatCurrency(item.amount)}</td>
                  <td className="px-4 py-4">{dayjs(item.paymentDate).format('DD MMM YYYY')}</td>
                  <td className="px-4 py-4 text-white/45">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

const PortfolioManagerPage = () => {
  const { state, save, remove, upload } = useDashboardContext()
  const [form, setForm] = useState({ title: '', category: 'Wedding', location: '', imageUrl: '', description: '' })
  const [fileName, setFileName] = useState('')

  const handleFile = async (file) => {
    if (!file) return
    setFileName(file.name)
    const url = await upload(file)
    setForm((current) => ({ ...current, imageUrl: url }))
  }

  const submit = async (event) => {
    event.preventDefault()
    await save('portfolio', form)
    setForm({ title: '', category: 'Wedding', location: '', imageUrl: '', description: '' })
    setFileName('')
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <p className="text-sm text-white/50">Portfolio management</p>
        <h2 className="mt-2 font-display text-3xl text-white">Upload albums and wedding stories</h2>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <Input label="Story title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Category" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>{portfolioCategories.filter((item) => item !== 'All').map((category) => <option key={category}>{category}</option>)}</Select>
            <Input label="Location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} required />
          </div>
          <label className="rounded-[1.75rem] border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-white/60">
            <input type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
            <span className="block font-medium text-white">Drag-and-drop upload zone</span>
            <span className="mt-2 block">Click to upload a cover image. Uses Cloudinary when backend credentials are configured.</span>
            {fileName ? <span className="mt-3 inline-flex rounded-full bg-brand/10 px-3 py-1 text-brand-light">{fileName}</span> : null}
          </label>
          <Input label="Image URL" value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} required />
          <Textarea label="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-light">Save portfolio item</button>
        </form>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {state.portfolio.map((item) => (
          <Card key={item._id} className="overflow-hidden p-0">
            <img src={item.imageUrl} alt={item.title} className="h-56 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-light">{item.category}</p>
              <h3 className="mt-2 font-display text-2xl text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-white/45">{item.location}</p>
              <p className="mt-3 text-sm text-white/65">{item.description}</p>
              <div className="mt-4 flex justify-end">
                <button type="button" className="rounded-full border border-white/10 p-2 text-rose-300 hover:text-rose-200" onClick={() => remove('portfolio', item._id)}><Trash2 size={16} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const TestimonialsManagerPage = () => {
  const { state, save, remove } = useDashboardContext()
  const [form, setForm] = useState({ coupleName: '', role: '', imageUrl: '', quote: '' })

  const submit = async (event) => {
    event.preventDefault()
    await save('testimonials', form)
    setForm({ coupleName: '', role: '', imageUrl: '', quote: '' })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <p className="text-sm text-white/50">Testimonial management</p>
        <h2 className="mt-2 font-display text-3xl text-white">Add premium social proof</h2>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <Input label="Couple name" value={form.coupleName} onChange={(event) => setForm((current) => ({ ...current, coupleName: event.target.value }))} required />
          <Input label="Role / event" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} required />
          <Input label="Image URL" value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} required />
          <Textarea label="Quote" value={form.quote} onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))} required />
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-light">Save testimonial</button>
        </form>
      </Card>
      <div className="space-y-4">
        {state.testimonials.map((item) => (
          <Card key={item._id} className="grid gap-4 md:grid-cols-[180px_1fr]">
            <img src={item.imageUrl} alt={item.coupleName} className="h-44 w-full rounded-[1.5rem] object-cover" />
            <div className="flex flex-col justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-light">{item.role}</p>
                <h3 className="mt-2 font-display text-2xl text-white">{item.coupleName}</h3>
                <p className="mt-3 text-white/65">“{item.quote}”</p>
              </div>
              <div className="flex justify-end">
                <button type="button" className="rounded-full border border-white/10 p-2 text-rose-300 hover:text-rose-200" onClick={() => remove('testimonials', item._id)}><Trash2 size={16} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const SettingsPage = () => {
  const { state, save, demoMode } = useDashboardContext()
  const [form, setForm] = useState(state.settings)

  useEffect(() => {
    setForm(state.settings)
  }, [state.settings])

  const submit = async (event) => {
    event.preventDefault()
    await save('settings', form)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <p className="text-sm text-white/50">Studio settings</p>
        <h2 className="mt-2 font-display text-3xl text-white">Update business profile</h2>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <Input label="Studio name" value={form.studioName || ''} onChange={(event) => setForm((current) => ({ ...current, studioName: event.target.value }))} />
          <Input label="WhatsApp number" value={form.whatsappNumber || ''} onChange={(event) => setForm((current) => ({ ...current, whatsappNumber: event.target.value }))} />
          <Input label="Contact email" value={form.email || ''} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <Input label="Instagram URL" value={form.instagram || ''} onChange={(event) => setForm((current) => ({ ...current, instagram: event.target.value }))} />
          <Input label="City" value={form.city || ''} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 font-semibold text-slate-950 transition hover:bg-brand-light">Save settings</button>
        </form>
      </Card>
      <Card>
        <p className="text-sm text-white/50">Operational notes</p>
        <h2 className="mt-2 font-display text-3xl text-white">Platform overview</h2>
        <div className="mt-6 space-y-4 text-white/65">
          <p>• Public inquiries are stored through the backend when MongoDB is configured and gracefully fall back to local demo storage for frontend review.</p>
          <p>• Admin authentication supports JWT APIs and a built-in demo login for fast local validation.</p>
          <p>• Portfolio uploads route through Cloudinary when credentials are present, while the UI still supports direct image URLs.</p>
          <p>• CSV export is available in lead, client, and revenue workflows to support offline reporting.</p>
          {demoMode ? <p className="rounded-[1.5rem] border border-brand/20 bg-brand/10 p-4 text-brand-light">You are currently previewing demo mode because the API or database is unavailable in this environment.</p> : null}
        </div>
      </Card>
    </div>
  )
}

function App() {
  const [portfolio, setPortfolio] = useState(() => readDemoState().portfolio)
  const [testimonials, setTestimonials] = useState(() => readDemoState().testimonials)
  const [settings, setSettings] = useState(() => readDemoState().settings)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [portfolioItems, testimonialItems] = await Promise.all([fetchPublicPortfolio(), fetchPublicTestimonials()])
        setPortfolio(portfolioItems)
        setTestimonials(testimonialItems)
      } catch {
        const fallback = readDemoState()
        setPortfolio(fallback.portfolio)
        setTestimonials(fallback.testimonials)
        setSettings(fallback.settings)
      }
    }

    load()
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(id)
  }, [toast])

  const handleInquirySuccess = () => {
    setToast({ title: 'Inquiry captured', message: 'The booking request was saved and is ready for admin follow-up.' })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Routes>
        <Route path="/" element={<PublicSite portfolio={portfolio} testimonials={testimonials} settings={settings} onInquirySuccess={handleInquirySuccess} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminShell /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="leads" element={<CRMPage entity="leads" title="Lead management" />} />
          <Route path="clients" element={<CRMPage entity="clients" title="Client management" />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="portfolio" element={<PortfolioManagerPage />} />
          <Route path="testimonials" element={<TestimonialsManagerPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

export default App
