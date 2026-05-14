import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export const fetchPublicPortfolio = async () => {
  const { data } = await api.get('/portfolio')
  return data
}

export const fetchPublicTestimonials = async () => {
  const { data } = await api.get('/testimonials')
  return data
}

export const submitInquiry = async (payload) => {
  const { data } = await api.post('/inquiries', payload)
  return data
}

export const fetchDashboardOverview = async () => {
  const { data } = await api.get('/dashboard/overview')
  return data
}

export const fetchEntity = async (entity) => {
  const { data } = await api.get(`/${entity}`)
  return data
}

export const saveEntity = async (entity, payload) => {
  if (payload._id) {
    const { data } = await api.put(`/${entity}/${payload._id}`, payload)
    return data
  }

  const { data } = await api.post(`/${entity}`, payload)
  return data
}

export const deleteEntity = async (entity, id) => {
  await api.delete(`/${entity}/${id}`)
}

export const uploadAsset = async (file) => {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/uploads', form)
  return data
}
