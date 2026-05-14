const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const nodemailer = require('nodemailer')

dotenv.config()

const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-demo-key'
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@luminaweddings.com'
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'

const upload = multer({ storage: multer.memoryStorage() })

const makeId = () => new mongoose.Types.ObjectId().toString()
const makeDate = (offsetDays = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date
}

const createSeedState = () => ({
  users: [
    {
      _id: makeId(),
      name: 'Aarav Kapoor',
      email: DEFAULT_ADMIN_EMAIL,
      password: bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10),
      role: 'admin',
    },
  ],
  leads: [
    {
      _id: makeId(),
      clientName: 'Meera & Rohan',
      phone: '+91 98765 43210',
      email: 'meera.rohan@example.com',
      eventType: 'Destination Wedding',
      weddingDate: makeDate(45),
      budget: 420000,
      advancePaid: 100000,
      remainingAmount: 320000,
      totalPackageAmount: 420000,
      status: 'Confirmed',
      location: 'Udaipur',
      message: 'Looking for a 3-day storytelling package with drone coverage.',
      notes: 'Warm lead from Instagram ad campaign.',
      source: 'website',
      createdAt: makeDate(-6),
    },
    {
      _id: makeId(),
      clientName: 'Ishita & Kunal',
      phone: '+91 91234 56789',
      email: 'ishita.kunal@example.com',
      eventType: 'Engagement',
      weddingDate: makeDate(15),
      budget: 95000,
      advancePaid: 25000,
      remainingAmount: 70000,
      totalPackageAmount: 95000,
      status: 'Contacted',
      location: 'Delhi',
      message: 'Need intimate engagement coverage and teaser reel.',
      notes: 'Requested quick turnaround.',
      source: 'website',
      createdAt: makeDate(-2),
    },
    {
      _id: makeId(),
      clientName: 'Sanya Malhotra',
      phone: '+91 99880 44556',
      email: 'sanya@example.com',
      eventType: 'Wedding Photography',
      weddingDate: makeDate(70),
      budget: 280000,
      advancePaid: 0,
      remainingAmount: 280000,
      totalPackageAmount: 280000,
      status: 'New',
      location: 'Jaipur',
      message: 'Interested in premium wedding day coverage.',
      notes: 'Needs album design add-on.',
      source: 'website',
      createdAt: makeDate(-1),
    },
  ],
  clients: [
    {
      _id: makeId(),
      clientName: 'Ananya & Vihaan',
      phone: '+91 98111 22111',
      email: 'ananya.vihaan@example.com',
      eventType: 'Wedding',
      weddingDate: makeDate(30),
      budget: 350000,
      advancePaid: 180000,
      remainingAmount: 170000,
      totalPackageAmount: 350000,
      status: 'Confirmed',
      location: 'Goa',
      notes: 'Need same-day edit film.',
      createdAt: makeDate(-18),
    },
    {
      _id: makeId(),
      clientName: 'Navya & Arjun',
      phone: '+91 97777 12345',
      email: 'navya.arjun@example.com',
      eventType: 'Pre-Wedding',
      weddingDate: makeDate(10),
      budget: 120000,
      advancePaid: 60000,
      remainingAmount: 60000,
      totalPackageAmount: 120000,
      status: 'Contacted',
      location: 'Rishikesh',
      notes: 'Offline referral client.',
      createdAt: makeDate(-10),
    },
  ],
  bookings: [
    {
      _id: makeId(),
      title: 'Ananya & Vihaan Wedding',
      eventType: 'Wedding',
      date: makeDate(30),
      location: 'Goa',
      status: 'Upcoming',
      assignedTeam: ['Lead Photographer', 'Drone Artist', 'Cinematographer'],
      timeline: ['Haldi shoot', 'Beach couple session', 'Reception film'],
      createdAt: makeDate(-15),
    },
    {
      _id: makeId(),
      title: 'Ishita & Kunal Engagement',
      eventType: 'Engagement',
      date: makeDate(15),
      location: 'Delhi',
      status: 'Upcoming',
      assignedTeam: ['Candid Photographer', 'Editor'],
      timeline: ['Sunset portraits', 'Family documentary'],
      createdAt: makeDate(-3),
    },
  ],
  revenue: [
    {
      _id: makeId(),
      clientName: 'Ananya & Vihaan',
      amount: 180000,
      type: 'Advance',
      paymentDate: makeDate(-15),
      status: 'Paid',
      note: 'Stage 1 advance cleared',
    },
    {
      _id: makeId(),
      clientName: 'Meera & Rohan',
      amount: 100000,
      type: 'Advance',
      paymentDate: makeDate(-6),
      status: 'Paid',
      note: 'Destination booking advance',
    },
    {
      _id: makeId(),
      clientName: 'Navya & Arjun',
      amount: 60000,
      type: 'Advance',
      paymentDate: makeDate(-8),
      status: 'Paid',
      note: 'Referral booking payment',
    },
  ],
  portfolio: [
    {
      _id: makeId(),
      title: 'Lake Palace Vows',
      category: 'Wedding',
      location: 'Udaipur',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      description: 'A royal destination wedding with candlelit celebrations.',
      createdAt: makeDate(-20),
    },
    {
      _id: makeId(),
      title: 'Golden Hour Mehendi',
      category: 'Mehendi',
      location: 'Jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      description: 'Vibrant floral decor and intimate storytelling details.',
      createdAt: makeDate(-14),
    },
    {
      _id: makeId(),
      title: 'Seaside Engagement',
      category: 'Engagement',
      location: 'Goa',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
      description: 'Editorial portraits framed by a serene coast.',
      createdAt: makeDate(-11),
    },
    {
      _id: makeId(),
      title: 'Cinematic Reception',
      category: 'Reception',
      location: 'Mumbai',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      description: 'Luxury ballroom reception with immersive stage lighting.',
      createdAt: makeDate(-5),
    },
  ],
  testimonials: [
    {
      _id: makeId(),
      coupleName: 'Meera & Rohan',
      quote: 'Every frame feels like a film still. The team turned our wedding story into timeless art.',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      role: 'Destination Wedding',
      createdAt: makeDate(-4),
    },
    {
      _id: makeId(),
      coupleName: 'Ananya & Vihaan',
      quote: 'From planning to delivery, the experience was polished, warm, and incredibly premium.',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
      role: 'Luxury Beach Wedding',
      createdAt: makeDate(-9),
    },
  ],
  settings: {
    studioName: 'Lumina Weddings',
    whatsappNumber: '+919876543210',
    email: 'hello@luminaweddings.com',
    instagram: 'https://instagram.com/luminaweddings',
    city: 'New Delhi',
  },
})

const memoryStore = createSeedState()
let dbConnected = false
let mailTransport = null

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const entitySchema = {
  user: new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
  }, { timestamps: true }),
  lead: new mongoose.Schema({
    clientName: String,
    phone: String,
    email: String,
    eventType: String,
    weddingDate: Date,
    budget: Number,
    advancePaid: Number,
    remainingAmount: Number,
    totalPackageAmount: Number,
    status: String,
    location: String,
    message: String,
    notes: String,
    source: String,
  }, { timestamps: true }),
  client: new mongoose.Schema({
    clientName: String,
    phone: String,
    email: String,
    eventType: String,
    weddingDate: Date,
    budget: Number,
    advancePaid: Number,
    remainingAmount: Number,
    totalPackageAmount: Number,
    status: String,
    location: String,
    notes: String,
  }, { timestamps: true }),
  booking: new mongoose.Schema({
    title: String,
    eventType: String,
    date: Date,
    location: String,
    status: String,
    assignedTeam: [String],
    timeline: [String],
  }, { timestamps: true }),
  revenue: new mongoose.Schema({
    clientName: String,
    amount: Number,
    type: String,
    paymentDate: Date,
    status: String,
    note: String,
  }, { timestamps: true }),
  portfolio: new mongoose.Schema({
    title: String,
    category: String,
    location: String,
    imageUrl: String,
    description: String,
  }, { timestamps: true }),
  testimonial: new mongoose.Schema({
    coupleName: String,
    quote: String,
    imageUrl: String,
    role: String,
  }, { timestamps: true }),
  setting: new mongoose.Schema({
    studioName: String,
    whatsappNumber: String,
    email: String,
    instagram: String,
    city: String,
  }, { timestamps: true }),
}

const User = mongoose.models.User || mongoose.model('User', entitySchema.user)
const Lead = mongoose.models.Lead || mongoose.model('Lead', entitySchema.lead)
const Client = mongoose.models.Client || mongoose.model('Client', entitySchema.client)
const Booking = mongoose.models.Booking || mongoose.model('Booking', entitySchema.booking)
const Revenue = mongoose.models.Revenue || mongoose.model('Revenue', entitySchema.revenue)
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', entitySchema.portfolio)
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', entitySchema.testimonial)
const Setting = mongoose.models.Setting || mongoose.model('Setting', entitySchema.setting)

const modelMap = {
  users: User,
  leads: Lead,
  clients: Client,
  bookings: Booking,
  revenue: Revenue,
  portfolio: Portfolio,
  testimonials: Testimonial,
}

const clone = (value) => JSON.parse(JSON.stringify(value))

const normalizeMoney = (value) => Number(value || 0)

const computeDashboardStats = (state) => {
  const clients = state.clients || []
  const leads = state.leads || []
  const bookings = state.bookings || []
  const revenueEntries = state.revenue || []
  const totalRevenue = revenueEntries.reduce((sum, item) => sum + normalizeMoney(item.amount), 0)
  const pendingPayments = clients.reduce((sum, item) => sum + normalizeMoney(item.remainingAmount), 0) + leads.reduce((sum, item) => sum + normalizeMoney(item.remainingAmount), 0)
  const monthlyRevenueMap = new Map()

  revenueEntries.forEach((item) => {
    const date = new Date(item.paymentDate)
    const label = date.toLocaleString('en-US', { month: 'short' })
    monthlyRevenueMap.set(label, (monthlyRevenueMap.get(label) || 0) + normalizeMoney(item.amount))
  })

  const monthlyRevenue = Array.from(monthlyRevenueMap.entries()).map(([month, amount]) => ({ month, amount }))
  const upcomingWeddings = [...bookings].filter((booking) => new Date(booking.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)

  return {
    cards: {
      totalRevenue,
      totalBookings: bookings.length,
      totalClients: clients.length,
      pendingPayments,
      upcomingWeddings: upcomingWeddings.length,
      websiteLeads: leads.filter((lead) => lead.source === 'website').length,
      monthlyRevenue: monthlyRevenue[monthlyRevenue.length - 1]?.amount || 0,
    },
    monthlyRevenue,
    bookingStatistics: [
      { name: 'New Leads', value: leads.filter((item) => item.status === 'New').length },
      { name: 'Contacted', value: leads.filter((item) => item.status === 'Contacted').length },
      { name: 'Confirmed', value: [...leads, ...clients].filter((item) => item.status === 'Confirmed').length },
      { name: 'Completed', value: [...leads, ...clients].filter((item) => item.status === 'Completed').length },
    ],
    growth: monthlyRevenue.map((item, index) => ({
      month: item.month,
      growth: index === 0 ? item.amount : item.amount - monthlyRevenue[index - 1].amount,
    })),
    upcomingWeddings,
  }
}

const getState = async () => {
  if (!dbConnected) {
    return clone(memoryStore)
  }

  const [users, leads, clients, bookings, revenue, portfolio, testimonials, settings] = await Promise.all([
    User.find().lean(),
    Lead.find().sort({ createdAt: -1 }).lean(),
    Client.find().sort({ createdAt: -1 }).lean(),
    Booking.find().sort({ date: 1 }).lean(),
    Revenue.find().sort({ paymentDate: 1 }).lean(),
    Portfolio.find().sort({ createdAt: -1 }).lean(),
    Testimonial.find().sort({ createdAt: -1 }).lean(),
    Setting.findOne().lean(),
  ])

  return { users, leads, clients, bookings, revenue, portfolio, testimonials, settings: settings || clone(memoryStore.settings) }
}

const listItems = async (name) => {
  if (!dbConnected) {
    return clone(memoryStore[name])
  }

  return modelMap[name].find().sort({ createdAt: -1 }).lean()
}

const createItem = async (name, payload) => {
  if (!dbConnected) {
    const item = { _id: makeId(), createdAt: new Date(), ...payload }
    if (name === 'settings') {
      memoryStore.settings = { ...memoryStore.settings, ...payload }
      return clone(memoryStore.settings)
    }
    memoryStore[name].unshift(item)
    return clone(item)
  }

  if (name === 'settings') {
    return Setting.findOneAndUpdate({}, payload, { upsert: true, new: true, lean: true })
  }

  const model = modelMap[name]
  const doc = await model.create(payload)
  return doc.toObject()
}

const updateItem = async (name, id, payload) => {
  if (!dbConnected) {
    if (name === 'settings') {
      memoryStore.settings = { ...memoryStore.settings, ...payload }
      return clone(memoryStore.settings)
    }

    const index = memoryStore[name].findIndex((item) => item._id === id)
    if (index === -1) {
      return null
    }
    memoryStore[name][index] = { ...memoryStore[name][index], ...payload, updatedAt: new Date() }
    return clone(memoryStore[name][index])
  }

  const model = modelMap[name]
  return model.findByIdAndUpdate(id, payload, { new: true, lean: true })
}

const deleteItem = async (name, id) => {
  if (!dbConnected) {
    memoryStore[name] = memoryStore[name].filter((item) => item._id !== id)
    return true
  }

  const model = modelMap[name]
  await model.findByIdAndDelete(id)
  return true
}

const ensureAdmin = async () => {
  if (!dbConnected) {
    return
  }

  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL })
  if (!existingAdmin) {
    await User.create({
      name: 'Aarav Kapoor',
      email: DEFAULT_ADMIN_EMAIL,
      password: await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10),
      role: 'admin',
    })
  }

  const settings = await Setting.findOne()
  if (!settings) {
    await Setting.create(clone(memoryStore.settings))
  }
}

const connectMongo = async () => {
  if (!process.env.MONGODB_URI) {
    return false
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
    dbConnected = true
    await ensureAdmin()
    return true
  } catch (error) {
    console.warn('MongoDB connection failed, continuing with demo data.')
    return false
  }
}

const sendInquiryNotification = async (payload) => {
  if (!mailTransport) {
    return
  }

  await mailTransport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ADMIN_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL,
    subject: `New wedding inquiry from ${payload.clientName}`,
    text: `${payload.clientName} requested ${payload.eventType} coverage for ${payload.location} on ${payload.weddingDate}.`,
  })
}

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Missing authentication token.' })
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', async (_req, res) => {
  const state = await getState()
  res.json({ status: 'ok', dbConnected, studio: state.settings?.studioName })
})

app.get('/api/portfolio', async (_req, res) => {
  const state = await getState()
  res.json(state.portfolio)
})

app.get('/api/testimonials', async (_req, res) => {
  const state = await getState()
  res.json(state.testimonials)
})

app.post('/api/inquiries', async (req, res) => {
  const payload = {
    clientName: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    weddingDate: req.body.weddingDate,
    eventType: req.body.eventType,
    budget: normalizeMoney(req.body.budget),
    location: req.body.location,
    message: req.body.message,
    advancePaid: 0,
    remainingAmount: normalizeMoney(req.body.budget),
    totalPackageAmount: normalizeMoney(req.body.budget),
    status: 'New',
    notes: 'Submitted from public website booking form.',
    source: 'website',
  }

  const lead = await createItem('leads', payload)
  await sendInquiryNotification(lead).catch(() => undefined)
  res.status(201).json({ message: 'Inquiry received successfully.', lead })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = dbConnected ? await User.findOne({ email }).lean() : memoryStore.users.find((item) => item.email === email)
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  const token = jwt.sign({ sub: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' })
  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})

app.get('/api/dashboard/overview', authenticate, async (_req, res) => {
  const state = await getState()
  res.json(computeDashboardStats(state))
})

app.get('/api/settings', authenticate, async (_req, res) => {
  const state = await getState()
  res.json(state.settings)
})

app.put('/api/settings', authenticate, async (req, res) => {
  const settings = await updateItem('settings', 'singleton', req.body)
  res.json(settings)
})

for (const entity of ['leads', 'clients', 'bookings', 'revenue', 'portfolio', 'testimonials']) {
  app.get(`/api/${entity}`, authenticate, async (_req, res) => {
    const items = await listItems(entity)
    res.json(items)
  })

  app.post(`/api/${entity}`, authenticate, async (req, res) => {
    const item = await createItem(entity, req.body)
    res.status(201).json(item)
  })

  app.put(`/api/${entity}/:id`, authenticate, async (req, res) => {
    const item = await updateItem(entity, req.params.id, req.body)
    if (!item) {
      return res.status(404).json({ message: `${entity.slice(0, -1)} not found.` })
    }
    return res.json(item)
  })

  app.delete(`/api/${entity}/:id`, authenticate, async (req, res) => {
    await deleteItem(entity, req.params.id)
    res.status(204).send()
  })
}

app.post('/api/uploads', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'A file is required.' })
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(503).json({ message: 'Cloudinary is not configured in this environment.' })
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'lumina-weddings' }, (error, output) => {
      if (error) reject(error)
      else resolve(output)
    })

    stream.end(req.file.buffer)
  })

  return res.status(201).json({ url: result.secure_url, publicId: result.public_id })
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Unexpected server error.' })
})

const startServer = async () => {
  await connectMongo()
  return app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

if (require.main === module) {
  startServer()
}

module.exports = {
  app,
  createSeedState,
  computeDashboardStats,
  startServer,
}
