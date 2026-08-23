const express = require('express');
const https = require('https');
const { authenticate } = require('../middleware/auth');

const DEFAULT_MODEL = 'gemini-2.5-flash';
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

function getApiKeys() {
  return [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_FALLBACK]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function requestGemini(apiKey, payload) {
  const configuredModel = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const model = /^[a-zA-Z0-9._-]+$/.test(configuredModel) ? configuredModel : DEFAULT_MODEL;
  const url = new URL(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  );

  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const request = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-goog-api-key': apiKey
      },
      timeout: 30000
    }, (response) => {
      let responseBody = '';

      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        responseBody += chunk;
        if (Buffer.byteLength(responseBody) > MAX_RESPONSE_BYTES) {
          response.destroy(new Error('AI response was too large'));
        }
      });
      response.on('end', () => {
        let data;
        try {
          data = JSON.parse(responseBody);
        } catch {
          return reject(Object.assign(new Error('AI service returned an invalid response'), {
            status: response.statusCode
          }));
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(Object.assign(
            new Error(data.error?.message || 'AI request failed'),
            { status: response.statusCode }
          ));
        }

        resolve(data);
      });
    });

    request.on('timeout', () => request.destroy(new Error('AI request timed out')));
    request.on('error', reject);
    request.end(body);
  });
}

async function generateContent(payload) {
  const apiKeys = getApiKeys();
  if (!apiKeys.length) {
    throw Object.assign(new Error('AI service is not configured'), { status: 503 });
  }

  let lastError;
  for (const apiKey of apiKeys) {
    try {
      return await requestGemini(apiKey, payload);
    } catch (error) {
      lastError = error;
      if (![400, 403, 429].includes(error.status)) break;
    }
  }
  throw lastError;
}

function extractText(data) {
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('\n')
    .trim();
  if (!text) throw Object.assign(new Error('AI service returned no text'), { status: 502 });
  return text;
}

function parsePharmacies(text) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');

  const attempts = [cleaned];
  const objectStart = cleaned.indexOf('{');
  const objectEnd = cleaned.lastIndexOf('}');
  if (objectStart >= 0 && objectEnd > objectStart) {
    attempts.push(cleaned.slice(objectStart, objectEnd + 1));
  }

  const arrayStart = cleaned.indexOf('[');
  const arrayEnd = cleaned.lastIndexOf(']');
  if (arrayStart >= 0 && arrayEnd > arrayStart) {
    attempts.push(cleaned.slice(arrayStart, arrayEnd + 1));
  }

  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate);
      const pharmacies = Array.isArray(parsed) ? parsed : parsed.pharmacies;
      if (Array.isArray(pharmacies)) return pharmacies.slice(0, 8);
    } catch {
      // Try the next possible JSON fragment.
    }
  }

  throw Object.assign(new Error('AI service returned invalid pharmacy data'), { status: 502 });
}

function sendAiError(res, error) {
  console.error('AI route error:', error.message);
  const status = error.status === 400 ? 400
    : error.status === 503 ? 503
      : 502;
  res.status(status).json({ error: error.message || 'AI service unavailable' });
}

module.exports = () => {
  const router = express.Router();
  router.use(authenticate);

  router.post('/symptoms', async (req, res) => {
    const symptoms = typeof req.body.symptoms === 'string' ? req.body.symptoms.trim() : '';
    if (!symptoms) return res.status(400).json({ error: 'Symptoms are required' });
    if (symptoms.length > 4000) return res.status(400).json({ error: 'Symptoms are too long' });

    const prompt = `You are a medical symptom analyzer for a rural telemedicine system. Based on the following symptoms, provide a brief analysis in simple language that rural patients can understand.

SYMPTOMS: ${symptoms}

Please provide your response in this format:
1. POSSIBLE CONDITIONS: List 2-3 likely possibilities in simple terms.
2. RISK LEVEL: Low, Medium, or High, with a brief reason.
3. IMMEDIATE ACTIONS: Give 3-4 simple, safe steps.
4. WHEN TO SEE A DOCTOR: Give clear urgency guidance.
5. HOME CARE: Give 2-3 safe suggestions when applicable.

Use non-technical language. This is informational only, not a diagnosis. Be conservative and recommend professional care when uncertain. Consider limited rural access to healthcare.`;

    try {
      const data = await generateContent({
        contents: [{ parts: [{ text: prompt }] }]
      });
      res.json({ analysis: extractText(data) });
    } catch (error) {
      sendAiError(res, error);
    }
  });

  router.post('/pharmacies', async (req, res) => {
    const location = typeof req.body.location === 'string' ? req.body.location.trim() : '';
    if (!location) return res.status(400).json({ error: 'Location is required' });
    if (location.length > 300) return res.status(400).json({ error: 'Location is too long' });

    const prompt = `Find up to 8 pharmacies near "${location}" using Google Maps. Return only a JSON object with a "pharmacies" array. Each item must contain name, address, distance, phone, hours, and rating when available. Use "Not available" when a phone number is unavailable and "Hours not specified" when hours are unavailable.`;

    try {
      const data = await generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ googleMaps: {} }]
      });
      res.json({ pharmacies: parsePharmacies(extractText(data)) });
    } catch (error) {
      sendAiError(res, error);
    }
  });

  return router;
};
