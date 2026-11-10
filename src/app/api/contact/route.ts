import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

interface ContactFormData {
  fullName?: string;
  role?: string;
  organisation?: string;
  organisationType?: string;
  clinicalSystem?: string;
  listSize?: string;
  email?: string;
  phone?: string;
  interests?: string[] | string;
  notes?: string;
  sourcePage?: string;
}

function formatSubmissionEmail(data: ContactFormData) {
  const sourceLabels: Record<string, string> = {
    demo: 'Demo Walkthrough Request',
    trust: 'Trust & Governance Assurance Request',
    chat_widget: 'Website Chat / Help Panel Message',
    chat_widget_reply: 'Chat Widget Follow-up Reply',
  };

  const sourceName = (data.sourcePage && sourceLabels[data.sourcePage]) || data.sourcePage || 'Website Form';
  const interestsStr = Array.isArray(data.interests)
    ? data.interests.join(', ')
    : data.interests || '';

  const rows = [
    { label: 'Full Name', value: data.fullName, raw: data.fullName },
    { label: 'Work Email', value: data.email ? `<a href="mailto:${data.email}" style="color: #2F6BE0; text-decoration: underline;">${data.email}</a>` : null, raw: data.email },
    { label: 'Phone', value: data.phone ? `<a href="tel:${data.phone}" style="color: #2F6BE0; text-decoration: underline;">${data.phone}</a>` : null, raw: data.phone },
    { label: 'Organisation', value: data.organisation, raw: data.organisation },
    { label: 'Role / Job Title', value: data.role, raw: data.role },
    { label: 'Organisation Type', value: data.organisationType, raw: data.organisationType },
    { label: 'Clinical System', value: data.clinicalSystem, raw: data.clinicalSystem },
    { label: 'Practice / List Size', value: data.listSize, raw: data.listSize },
    { label: 'Areas of Interest', value: interestsStr, raw: interestsStr },
    { label: 'Message / Notes', value: data.notes ? data.notes.replace(/\n/g, '<br/>') : null, raw: data.notes },
    { label: 'Form Source', value: sourceName, raw: sourceName },
    { label: 'Submitted At', value: new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', dateStyle: 'full', timeStyle: 'short' }), raw: new Date().toISOString() },
  ].filter(r => r.raw && (typeof r.raw !== 'string' || r.raw.trim().length > 0));

  const subject = `New Website Enquiry: ${data.fullName || 'Lead'} (${sourceName})`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #E2E8F0;">
    
    <!-- Header -->
    <div style="background-color: #061430; padding: 32px; text-align: left;">
      <div style="display: inline-block; padding: 4px 12px; background: rgba(85, 203, 232, 0.15); color: #55CBE8; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px;">
        New Website Enquiry
      </div>
      <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700; line-height: 1.3;">
        ${data.fullName ? `${data.fullName} filled out a form` : 'A new enquiry was submitted'}
      </h1>
      <p style="margin: 8px 0 0 0; color: #B4C1D1; font-size: 14px;">
        Source: <strong style="color: #FFFFFF;">${sourceName}</strong>
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #334155;">
        A new query has been submitted on the OvoTech website. Please review the details below and proceed or follow up with the lead:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
        <tbody>
          ${rows.map(r => `
            <tr>
              <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748B; background-color: #F8FAFC; border-bottom: 1px solid #EDF2F7; width: 35%; vertical-align: top;">
                ${r.label}
              </td>
              <td style="padding: 12px 16px; font-size: 14px; color: #0F172A; border-bottom: 1px solid #EDF2F7; vertical-align: top;">
                ${r.value}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${data.email ? `
        <div style="margin-top: 28px; padding-top: 24px; border-top: 1px solid #E2E8F0;">
          <a href="mailto:${data.email}" style="display: inline-block; background-color: #2F6BE0; color: #FFFFFF !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
            Reply to ${data.fullName || data.email}
          </a>
        </div>
      ` : ''}
    </div>

    <!-- Footer -->
    <div style="padding: 20px 32px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
      OvoTech Primary Care AI Platform &bull; Automated notification
    </div>
  </div>
</body>
</html>
  `;

  const text = `OvoTech Website Form Submission
---------------------------------------
Source: ${sourceName}
Submitted At: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}

Details:
${rows.map(r => `${r.label}: ${r.raw}`).join('\n')}

Reply to: ${data.email || 'N/A'}
`;

  return { subject, html, text };
}

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    // 1. Connect and Save to Neon DB if database URL is configured
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (dbUrl) {
      try {
        const sql = neon(dbUrl);

        // Ensure table exists
        await sql`
          CREATE TABLE IF NOT EXISTS contact_submissions (
            id SERIAL PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            role VARCHAR(255),
            organisation VARCHAR(255),
            organisation_type VARCHAR(255),
            clinical_system VARCHAR(255),
            list_size VARCHAR(255),
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(255),
            interests TEXT,
            notes TEXT,
            source_page VARCHAR(50) DEFAULT 'demo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;

        const interestsText = Array.isArray(data.interests)
          ? data.interests.join(', ')
          : (data.interests || null);

        // Insert data
        await sql`
          INSERT INTO contact_submissions (
            full_name, role, organisation, organisation_type, 
            clinical_system, list_size, email, phone, interests, notes, source_page
          ) VALUES (
            ${data.fullName || null}, 
            ${data.role || null}, 
            ${data.organisation || null}, 
            ${data.organisationType || null}, 
            ${data.clinicalSystem || null}, 
            ${data.listSize || null}, 
            ${data.email || null}, 
            ${data.phone || null}, 
            ${interestsText}, 
            ${data.notes || null},
            ${data.sourcePage || 'demo'}
          )
        `;
      } catch (dbError) {
        console.error('Error saving contact submission to database:', dbError);
      }
    } else {
      console.warn('DATABASE_URL / POSTGRES_URL is not set. Skipped database insertion.');
    }

    // 2. Send Email Reminder Notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);

        // Target recipient: checks RECIEVING_EMAIL (user's spelling), RECEIVING_EMAIL, or defaults to marketing.ovotech@ovotech.co.uk
        const recipientEmail =
          process.env.RECIEVING_EMAIL ||
          process.env.RECEIVING_EMAIL ||
          'marketing.ovotech@ovotech.co.uk';

        // Sender address: configurable via RESEND_FROM_EMAIL, defaults to onboarding@resend.dev or verified domain
        const fromEmail =
          process.env.RESEND_FROM_EMAIL ||
          'OvoTech Notifications <onboarding@resend.dev>';

        const { subject, html, text } = formatSubmissionEmail(data);

        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          replyTo: data.email || undefined,
          subject,
          html,
          text,
        });

        if (emailResult.error) {
          console.error('Resend email error:', emailResult.error);
        } else {
          console.log(`Reminder email sent successfully to ${recipientEmail} (ID: ${emailResult.data?.id})`);
        }
      } catch (emailError) {
        console.error('Failed to send Resend email notification:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY is not configured. Skipped sending email notification.');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}
