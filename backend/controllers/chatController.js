const https = require('https');
const http = require('http');

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 2_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function postJson(url, headers, body, opts = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const client = u.protocol === 'http:' ? http : https;
    const timeoutMs = Number(opts.timeoutMs || 20000);

    const req = client.request(
      {
        method: 'POST',
        hostname: u.hostname,
        port: u.port || (u.protocol === 'http:' ? 80 : 443),
        path: u.pathname + u.search,
        headers,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let json;
          try {
            json = raw ? JSON.parse(raw) : {};
          } catch {
            return reject(new Error('Invalid JSON response'));
          }
          resolve({ status: res.statusCode || 0, json });
        });
      }
    );

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error('Upstream request timed out'));
    });

    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

function normalizeMessages(input) {
  if (!Array.isArray(input)) return [];
  const allowedRoles = new Set(['user', 'assistant']);
  const trimmed = input
    .filter((m) => m && typeof m === 'object')
    .map((m) => ({
      role: allowedRoles.has(m.role) ? m.role : 'user',
      content: typeof m.content === 'string' ? m.content : '',
    }))
    .map((m) => ({ ...m, content: m.content.trim() }))
    .filter((m) => m.content.length > 0);

  // Keep last 12 turns max
  return trimmed.slice(-12);
}

exports.chat = async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Server missing OPENAI_API_KEY' });
    }

    // If express.json parsed it, use req.body; otherwise read JSON (defensive).
    const body = req.body && typeof req.body === 'object' ? req.body : await readJson(req);
    const messages = normalizeMessages(body.messages);

    if (messages.length === 0) {
      return res.status(400).json({ message: 'messages is required' });
    }

    const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
    const url = `${baseUrl}/chat/completions`;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const system = {
      role: 'system',
      content:
        'You are IAAC (International Airline & Aviation College) website assistant. ' +
        'Answer concisely and helpfully about IAAC programs, admissions, campuses/academies, contact, and events. ' +
        'If you are unsure, say you are not sure and suggest contacting IAAC. ' +
        'Do not ask for sensitive information. Refuse requests involving harm or wrongdoing.',
    };

    const payload = {
      model,
      temperature: 0.2,
      messages: [system, ...messages],
    };

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const { status, json } = await postJson(url, headers, payload, { timeoutMs: 20000 });

    if (status < 200 || status >= 300) {
      const detail =
        (json && json.error && (json.error.message || json.error.type)) ||
        (typeof json === 'string' ? json : null) ||
        'Chat request failed';
      return res.status(502).json({ message: detail });
    }

    const reply = json?.choices?.[0]?.message?.content;
    if (!reply || typeof reply !== 'string') {
      return res.status(502).json({ message: 'No reply returned' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    const msg = err && typeof err.message === 'string' ? err.message : 'Chat failed';
    return res.status(500).json({ message: msg });
  }
};
