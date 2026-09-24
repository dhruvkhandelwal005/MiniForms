// Only file that talks to Google Apps Script.
// Replace this URL if you redeploy as a new deployment.
const API_URL =
  'https://script.google.com/macros/s/AKfycbz2glQGtxvGApm3SIQ1K2jUdG7TTOieqWpL4J5lHw1lVYDl8-mdMuBGroeAMoRtZYJNiw/exec'

// Used by FormBuilder for question IDs.
export function generateId(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

async function handle(response) {
  const json = await response.json()
  if (!json.success) throw new Error(json.error || 'Request failed')
  return json.data
}

async function get(params) {
  const query = new URLSearchParams(params).toString()
  const response = await fetch(API_URL + '?' + query)
  return handle(response)
}

// text/plain avoids the CORS preflight that Apps Script cannot answer.
async function post(body) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  })
  return handle(response)
}

export async function createForm(form) {
  const data = await post({ action: 'createForm', form })
  return data.formId
}

export function getForm(formId) {
  return get({ action: 'getForm', formId })
}

export function getForms() {
  return get({ action: 'getForms' })
}

export async function submitResponse(formId, answers) {
  await post({ action: 'submitResponse', formId, answers })
}

export function getResponses(formId) {
  return get({ action: 'getResponses', formId })
}