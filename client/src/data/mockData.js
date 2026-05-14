const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const demoState = {
  leads: [
    {
      _id: createId(),
      clientName: 'Meera & Rohan',
      phone: '+91 98765 43210',
      email: 'meera.rohan@example.com',
      eventType: 'Destination Wedding',
      weddingDate: '2026-09-18',
      budget: 420000,
      advancePaid: 100000,
      remainingAmount: 320000,
      totalPackageAmount: 420000,
      status: 'Confirmed',
      location: 'Udaipur',
      message: 'Looking for a 3-day storytelling package with drone coverage.',
      notes: 'Website inquiry from Instagram campaign.',
      source: 'website',
      createdAt: '2026-05-04T09:20:00.000Z',
    },
    {
      _id: createId(),
      clientName: 'Ishita & Kunal',
      phone: '+91 91234 56789',
      email: 'ishita.kunal@example.com',
      eventType: 'Engagement',
      weddingDate: '2026-06-21',
      budget: 95000,
      advancePaid: 25000,
      remainingAmount: 70000,
      totalPackageAmount: 95000,
      status: 'Contacted',
      location: 'Delhi',
      message: 'Need intimate engagement coverage and teaser reel.',
      notes: 'Requested quick turnaround.',
      source: 'website',
      createdAt: '2026-05-11T11:10:00.000Z',
    },
    {
      _id: createId(),
      clientName: 'Sanya Malhotra',
      phone: '+91 99880 44556',
      email: 'sanya@example.com',
      eventType: 'Wedding Photography',
      weddingDate: '2026-10-04',
      budget: 280000,
      advancePaid: 0,
      remainingAmount: 280000,
      totalPackageAmount: 280000,
      status: 'New',
      location: 'Jaipur',
      message: 'Interested in premium wedding day coverage.',
      notes: 'Wants album design add-on.',
      source: 'website',
      createdAt: '2026-05-13T08:45:00.000Z',
    },
  ],
  clients: [
    {
      _id: createId(),
      clientName: 'Ananya & Vihaan',
      phone: '+91 98111 22111',
      email: 'ananya.vihaan@example.com',
      eventType: 'Wedding',
      weddingDate: '2026-06-30',
      budget: 350000,
      advancePaid: 180000,
      remainingAmount: 170000,
      totalPackageAmount: 350000,
      status: 'Confirmed',
      location: 'Goa',
      notes: 'Need same-day edit film.',
      createdAt: '2026-04-27T10:30:00.000Z',
    },
    {
      _id: createId(),
      clientName: 'Navya & Arjun',
      phone: '+91 97777 12345',
      email: 'navya.arjun@example.com',
      eventType: 'Pre-Wedding',
      weddingDate: '2026-05-25',
      budget: 120000,
      advancePaid: 60000,
      remainingAmount: 60000,
      totalPackageAmount: 120000,
      status: 'Contacted',
      location: 'Rishikesh',
      notes: 'Offline referral client.',
      createdAt: '2026-05-02T14:15:00.000Z',
    },
  ],
  bookings: [
    {
      _id: createId(),
      title: 'Ananya & Vihaan Wedding',
      eventType: 'Wedding',
      date: '2026-06-30',
      location: 'Goa',
      status: 'Upcoming',
      assignedTeam: ['Lead Photographer', 'Drone Artist', 'Cinematographer'],
      timeline: ['Haldi shoot', 'Beach couple session', 'Reception film'],
      createdAt: '2026-05-01T07:20:00.000Z',
    },
    {
      _id: createId(),
      title: 'Ishita & Kunal Engagement',
      eventType: 'Engagement',
      date: '2026-06-21',
      location: 'Delhi',
      status: 'Upcoming',
      assignedTeam: ['Candid Photographer', 'Editor'],
      timeline: ['Sunset portraits', 'Family documentary'],
      createdAt: '2026-05-12T07:20:00.000Z',
    },
  ],
  revenue: [
    {
      _id: createId(),
      clientName: 'Ananya & Vihaan',
      amount: 180000,
      type: 'Advance',
      paymentDate: '2026-04-28',
      status: 'Paid',
      note: 'Stage 1 advance cleared',
    },
    {
      _id: createId(),
      clientName: 'Meera & Rohan',
      amount: 100000,
      type: 'Advance',
      paymentDate: '2026-05-04',
      status: 'Paid',
      note: 'Destination booking advance',
    },
    {
      _id: createId(),
      clientName: 'Navya & Arjun',
      amount: 60000,
      type: 'Advance',
      paymentDate: '2026-05-06',
      status: 'Paid',
      note: 'Referral booking payment',
    },
  ],
  portfolio: [
    {
      _id: createId(),
      title: 'Lake Palace Vows',
      category: 'Wedding',
      location: 'Udaipur',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      description: 'A royal destination wedding with candlelit celebrations.',
      createdAt: '2026-04-25T09:40:00.000Z',
    },
    {
      _id: createId(),
      title: 'Golden Hour Mehendi',
      category: 'Mehendi',
      location: 'Jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      description: 'Vibrant floral decor and intimate storytelling details.',
      createdAt: '2026-05-01T09:40:00.000Z',
    },
    {
      _id: createId(),
      title: 'Seaside Engagement',
      category: 'Engagement',
      location: 'Goa',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
      description: 'Editorial portraits framed by a serene coast.',
      createdAt: '2026-05-04T09:40:00.000Z',
    },
    {
      _id: createId(),
      title: 'Cinematic Reception',
      category: 'Reception',
      location: 'Mumbai',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      description: 'Luxury ballroom reception with immersive stage lighting.',
      createdAt: '2026-05-10T09:40:00.000Z',
    },
  ],
  testimonials: [
    {
      _id: createId(),
      coupleName: 'Meera & Rohan',
      quote: 'Every frame feels like a film still. The team turned our wedding story into timeless art.',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      role: 'Destination Wedding',
      createdAt: '2026-05-05T10:00:00.000Z',
    },
    {
      _id: createId(),
      coupleName: 'Ananya & Vihaan',
      quote: 'From planning to delivery, the experience was polished, warm, and incredibly premium.',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
      role: 'Luxury Beach Wedding',
      createdAt: '2026-05-09T10:00:00.000Z',
    },
  ],
  settings: {
    studioName: 'Lumina Weddings',
    whatsappNumber: '+919876543210',
    email: 'hello@luminaweddings.com',
    instagram: 'https://instagram.com/luminaweddings',
    city: 'New Delhi',
  },
}

const STORAGE_KEY = 'lumina-demo-state'

const deepClone = (value) => JSON.parse(JSON.stringify(value))

export const readDemoState = () => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return deepClone(demoState)
  }

  try {
    return { ...deepClone(demoState), ...JSON.parse(raw) }
  } catch {
    return deepClone(demoState)
  }
}

export const writeDemoState = (nextState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
}

export const upsertDemoEntity = (entity, payload) => {
  const state = readDemoState()
  if (entity === 'settings') {
    const nextState = { ...state, settings: { ...state.settings, ...payload } }
    writeDemoState(nextState)
    return nextState.settings
  }

  const items = [...state[entity]]
  const normalized = { ...payload, _id: payload._id || createId() }
  const index = items.findIndex((item) => item._id === normalized._id)

  if (index >= 0) {
    items[index] = { ...items[index], ...normalized }
  } else {
    items.unshift(normalized)
  }

  const nextState = { ...state, [entity]: items }
  writeDemoState(nextState)
  return normalized
}

export const removeDemoEntity = (entity, id) => {
  const state = readDemoState()
  const nextState = { ...state, [entity]: state[entity].filter((item) => item._id !== id) }
  writeDemoState(nextState)
  return nextState[entity]
}

export const addDemoInquiry = (payload) => upsertDemoEntity('leads', {
  clientName: payload.name,
  phone: payload.phone,
  email: payload.email,
  weddingDate: payload.weddingDate,
  eventType: payload.eventType,
  budget: Number(payload.budget || 0),
  advancePaid: 0,
  remainingAmount: Number(payload.budget || 0),
  totalPackageAmount: Number(payload.budget || 0),
  status: 'New',
  location: payload.location,
  message: payload.message,
  notes: 'Stored in demo mode.',
  source: 'website',
  createdAt: new Date().toISOString(),
})

const byMonth = (items, field, valueSelector = (item) => Number(item.amount || 0)) => {
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' })
  const bucket = new Map()

  items.forEach((item) => {
    const month = formatter.format(new Date(item[field]))
    bucket.set(month, (bucket.get(month) || 0) + valueSelector(item))
  })

  return Array.from(bucket.entries()).map(([month, amount]) => ({ month, amount }))
}

export const getDemoOverview = (state) => {
  const monthlyRevenue = byMonth(state.revenue, 'paymentDate')
  const totalRevenue = state.revenue.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const pendingPayments = [...state.clients, ...state.leads].reduce((sum, item) => sum + Number(item.remainingAmount || 0), 0)
  const upcomingWeddings = state.bookings.filter((item) => new Date(item.date) >= new Date())

  return {
    cards: {
      totalRevenue,
      totalBookings: state.bookings.length,
      totalClients: state.clients.length,
      pendingPayments,
      upcomingWeddings: upcomingWeddings.length,
      monthlyRevenue: monthlyRevenue[monthlyRevenue.length - 1]?.amount || 0,
      websiteLeads: state.leads.filter((item) => item.source === 'website').length,
    },
    monthlyRevenue,
    bookingStatistics: [
      { name: 'New Leads', value: state.leads.filter((item) => item.status === 'New').length },
      { name: 'Contacted', value: state.leads.filter((item) => item.status === 'Contacted').length },
      { name: 'Confirmed', value: [...state.leads, ...state.clients].filter((item) => item.status === 'Confirmed').length },
      { name: 'Completed', value: [...state.leads, ...state.clients].filter((item) => item.status === 'Completed').length },
    ],
    growth: monthlyRevenue.map((item, index) => ({
      month: item.month,
      growth: index === 0 ? item.amount : item.amount - monthlyRevenue[index - 1].amount,
    })),
    upcomingWeddings,
  }
}

export const demoCredentials = {
  email: 'admin@luminaweddings.com',
  password: 'admin123',
}
