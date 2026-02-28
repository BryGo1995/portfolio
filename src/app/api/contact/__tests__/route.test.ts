/**
 * @jest-environment node
 */
import { POST } from '../route'
import { NextRequest } from 'next/server'

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'test-id', error: null }),
    },
  })),
}))

describe('POST /api/contact', () => {
  it('returns 400 for missing fields', async () => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: '', email: '', message: '' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 for valid submission', async () => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello!',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })
})
