/**
 * APTRYK — Consult intake → magic-link email
 * Place at:  functions/api/consult.js  in your Pages repo (auto-deploys).
 *
 * Env vars (Cloudflare Pages → Settings → Variables and Secrets):
 *   RESEND_API_KEY  — from resend.com (free: 3,000/mo)
 *   LEAD_TO         — your email, e.g. you@aptryk.com
 *   FROM_ADDR       — e.g. leads@aptryk.com (domain verified in Resend)
 *                     or onboarding@resend.dev while testing
 *   CRM_URL         — where crm.html lives, e.g. https://aptryk.com/crm.html
 */

const FIELD_MAX = 500;
const MESSAGE_MAX = 2000;

export async function onRequestPost({ request, env }) {
  const form = await request.formData();

  // Honeypot: bots fill the hidden "website" field; humans never see it.
  if (form.get('website')) return thanksRedirect(request);

  const field = (key, max = FIELD_MAX) =>
    (form.get(key) || '').toString().trim().slice(0, max);

  const name = field('name');
  const email = field('email');
  const phone = field('phone');
  const company = field('company');
  const service = field('service');
  const message = field('message', MESSAGE_MAX);

  if (!name || !email) {
    return new Response('Name and email are required.', { status: 400 });
  }

  const magicLink =
    env.CRM_URL + '#intake?' +
    new URLSearchParams({ name, email, phone, company, service, msg: message });

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const row = (label, value) => value
    ? `<tr><td style="padding:6px 14px 6px 0;color:#888;font-size:13px;white-space:nowrap">${label}</td>
       <td style="padding:6px 0;color:#111;font-size:14px">${esc(value)}</td></tr>`
    : '';

  const emailHtml = `
  <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
    <p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#4a7cf5;font-weight:700;margin:0 0 4px">APTRYK · New consult request</p>
    <h2 style="margin:0 0 16px;font-size:20px;color:#111">${esc(name)}${company ? ' — ' + esc(company) : ''}</h2>
    <table style="border-collapse:collapse">
      ${row('Email', email)}${row('Phone', phone)}${row('Service', service)}
    </table>
    ${message ? `<p style="background:#f4f5f9;border-radius:10px;padding:14px;color:#333;font-size:14px;line-height:1.55">${esc(message)}</p>` : ''}
    <a href="${magicLink}"
       style="display:inline-block;margin-top:18px;background:#4a7cf5;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px">
       ＋ Add to CRM</a>
    <p style="color:#aaa;font-size:11px;margin-top:22px">Tap the button on the device where your APTRYK CRM lives. The lead is created as a Client + Inbound engagement.</p>
  </div>`;

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `APTRYK Leads <${env.FROM_ADDR}>`,
      to: [env.LEAD_TO],
      reply_to: email,
      subject: `New consult: ${name}${service ? ' · ' + service : ''}`,
      html: emailHtml,
    }),
  });

  if (!send.ok) {
    // Fail visibly (never silently drop a lead).
    const detail = await send.text();
    console.error('Resend error:', detail);
    return new Response('Could not deliver your request — please email us directly.', { status: 502 });
  }

  return thanksRedirect(request);
}

function thanksRedirect(request) {
  return Response.redirect(new URL('/thanks.html', request.url), 303);
}
