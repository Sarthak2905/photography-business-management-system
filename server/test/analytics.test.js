const test = require('node:test')
const assert = require('node:assert/strict')
const { createSeedState, computeDashboardStats } = require('../src/index')

test('computeDashboardStats summarizes seed business data', () => {
  const state = createSeedState()
  const stats = computeDashboardStats(state)

  assert.ok(stats.cards.totalRevenue > 0)
  assert.ok(stats.cards.totalBookings >= 1)
  assert.ok(Array.isArray(stats.monthlyRevenue))
  assert.equal(stats.bookingStatistics.length, 4)
})
