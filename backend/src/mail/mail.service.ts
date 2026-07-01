import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';

export interface DonationEmailData {
  donorName:  string;
  donorEmail: string;
  amount:     number;
  currency:   string;
  donationId: number;
  message?:   string;
}

export interface ContactEmailData {
  name:    string;
  email:   string;
  message: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly brevo: BrevoClient;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private config: ConfigService) {
    this.brevo = new BrevoClient({
      apiKey: this.config.get<string>('BREVO_API_KEY') ?? '',
    });
    this.fromEmail = this.config.get<string>('MAIL_FROM')      ?? 'noreply@komezaju.org';
    this.fromName  = this.config.get<string>('MAIL_FROM_NAME') ?? 'KOMEZAJU Organization';
  }

  async sendDonationThankYou(data: DonationEmailData): Promise<void> {
    const { donorName, donorEmail, amount, currency, donationId, message } = data;

    const formattedAmount =
      currency === 'RWF'
        ? `${Number(amount).toLocaleString('en-US')} RWF`
        : `${currency === 'USD' ? '$' : currency === 'EUR' ? '€' : ''}${Number(amount).toLocaleString('en-US')}`;

    try {
      await this.brevo.transactionalEmails.sendTransacEmail({
        sender:      { email: this.fromEmail, name: this.fromName },
        to:          [{ email: donorEmail, name: donorName }],
        replyTo:     { email: 'komezaju@gmail.com', name: this.fromName },
        subject:     `Thank you for supporting KOMEZAJU, ${donorName.split(' ')[0]}!`,
        htmlContent: this.buildEmailHtml({ donorName, formattedAmount, donationId, message }),
      });
      this.logger.log(`Thank-you email sent → ${donorEmail} (donation #${donationId})`);
    } catch (err: any) {
      // Never throw — email failure must not roll back the donation record
      this.logger.error(
        `Failed to send thank-you email to ${donorEmail}: ${err?.message ?? JSON.stringify(err)}`,
      );
    }
  }

  async sendContactEmail(data: ContactEmailData): Promise<void> {
    const { name, email, message } = data;
    const dateStr = new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    try {
      await this.brevo.transactionalEmails.sendTransacEmail({
        sender:  { email: this.fromEmail, name: this.fromName },
        to:      [{ email: 'komezaju@gmail.com', name: 'KOMEZAJU Organization' }],
        replyTo: { email: email, name: name },
        subject: `New contact message from ${name}`,
        htmlContent: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#FDF8F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FDF8F3;padding:40px 16px;">
  <tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

    <!-- Header -->
    <tr><td style="background:linear-gradient(135deg,#F97316 0%,#FBBF24 100%);border-radius:16px 16px 0 0;padding:28px 36px;text-align:center;">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.85);">KOMEZAJU ORGANIZATION</p>
      <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#fff;">New Contact Message</h1>
    </td></tr>

    <!-- Card -->
    <tr><td style="background:#fff;border-radius:0 0 16px 16px;padding:32px 36px;box-shadow:0 8px 32px rgba(0,0,0,.08);">
      <p style="margin:0 0 24px;font-size:13px;color:#6B7280;">Received on ${dateStr}</p>

      <!-- Sender info -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB;margin-bottom:24px;">
      <tr><td style="padding:16px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-size:12px;color:#6B7280;padding-bottom:8px;">Name</td>
            <td align="right" style="font-size:14px;font-weight:700;color:#111827;padding-bottom:8px;">${name}</td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#6B7280;">Email</td>
            <td align="right">
              <a href="mailto:${email}" style="font-size:14px;font-weight:600;color:#F97316;text-decoration:none;">${email}</a>
            </td>
          </tr>
        </table>
      </td></tr>
      </table>

      <!-- Message -->
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;">Message</p>
      <div style="background:#FFF8F0;border-left:4px solid #F97316;border-radius:0 12px 12px 0;padding:16px 20px;">
        <p style="margin:0;font-size:15px;color:#1F2937;line-height:1.75;white-space:pre-wrap;">${message}</p>
      </div>

      <!-- Reply CTA -->
      <div style="margin-top:28px;text-align:center;">
        <a href="mailto:${email}?subject=Re: Your message to KOMEZAJU"
          style="display:inline-block;background:linear-gradient(135deg,#F97316,#FBBF24);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:100px;">
          Reply to ${name} →
        </a>
      </div>
    </td></tr>

    <!-- Footer -->
    <tr><td align="center" style="padding:20px 16px 0;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;">KOMEZAJU Organization · Bugesera, Rwanda</p>
    </td></tr>

  </table>
  </td></tr>
  </table>
</body>
</html>`,
      });
      this.logger.log(`Contact email forwarded from ${email}`);
    } catch (err: any) {
      this.logger.error(`Failed to forward contact email from ${email}: ${err?.message ?? err}`);
      throw err; // re-throw so the controller can return a 500 to the client
    }
  }

  private buildEmailHtml(p: {
    donorName:       string;
    formattedAmount: string;
    donationId:      number;
    message?:        string;
  }): string {
    const { donorName, formattedAmount, donationId, message } = p;
    const firstName = donorName.split(' ')[0];
    const dateStr   = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const refId     = `#${donationId.toString().padStart(6, '0')}`;

    const messageBlock = message
      ? `<tr><td style="padding:0 40px 28px;">
           <div style="background:#FFF8F0;border-left:4px solid #F97316;border-radius:0 12px 12px 0;padding:16px 20px;">
             <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#9A6B3A;">Your message</p>
             <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;font-style:italic;">&ldquo;${message}&rdquo;</p>
           </div>
         </td></tr>`
      : '';

    const impactRows = [
      ['🎓', 'Youth vocational training &amp; leadership skills'],
      ['🤝', 'Women cooperative development programs'],
      ['🌱', 'Environmental protection &amp; tree planting'],
      ['⚖️',  'Human rights education &amp; legal support'],
    ].map(([icon, text]) => `
      <tr><td style="padding:0 0 12px 0;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="width:36px;height:36px;background:#FFF7ED;border-radius:10px;text-align:center;vertical-align:middle;font-size:18px;">${icon}</td>
          <td style="padding-left:12px;font-size:14px;color:#374151;line-height:1.5;vertical-align:middle;">${text}</td>
        </tr></table>
      </td></tr>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Thank you — KOMEZAJU</title>
</head>
<body style="margin:0;padding:0;background:#FDF8F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!--[preheader]-->
  <div style="display:none;max-height:0;overflow:hidden;">
    Thank you, ${firstName}! Your support helps KOMEZAJU empower communities in Bugesera, Rwanda.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FDF8F3;padding:40px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

    <!-- ── Header ──────────────────────────────────────── -->
    <tr><td style="background:linear-gradient(135deg,#F97316 0%,#FBBF24 100%);border-radius:20px 20px 0 0;padding:36px 40px 32px;text-align:center;">
      <p style="margin:0 0 16px;">
        <span style="display:inline-block;background:rgba(255,255,255,.25);border-radius:50%;padding:14px;">
          <span style="display:block;background:#fff;border-radius:50%;width:44px;height:44px;line-height:44px;text-align:center;font-size:22px;">🌿</span>
        </span>
      </p>
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.85);">KOMEZAJU ORGANIZATION</p>
      <h1 style="margin:8px 0 0;font-size:28px;font-weight:700;color:#fff;line-height:1.2;">Thank you, ${firstName}!</h1>
      <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,.9);line-height:1.5;">Your generosity makes a real difference.</p>
    </td></tr>

    <!-- ── White card ──────────────────────────────────── -->
    <tr><td style="background:#fff;border-radius:0 0 20px 20px;box-shadow:0 8px 40px rgba(0,0,0,.08);">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">

      <!-- Amount badge -->
      <tr><td align="center" style="padding:36px 40px 28px;">
        <div style="display:inline-block;background:#FFF7ED;border:2px solid #FED7AA;border-radius:100px;padding:14px 32px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#9A6B3A;">Donation recorded</p>
          <p style="margin:6px 0 0;font-size:32px;font-weight:800;color:#F97316;letter-spacing:-.02em;">${formattedAmount}</p>
        </div>
      </td></tr>

      <!-- Body text -->
      <tr><td style="padding:0 40px 28px;">
        <p style="margin:0;font-size:16px;color:#1F2937;line-height:1.7;">Dear <strong>${donorName}</strong>,</p>
        <p style="margin:14px 0 0;font-size:15px;color:#374151;line-height:1.75;">
          On behalf of everyone at KOMEZAJU Organization, we are truly grateful for your support.
          Your donation will directly fund programs that uplift youth, empower women cooperatives,
          protect the environment, and strengthen human rights in the communities of Bugesera, Rwanda.
        </p>
      </td></tr>

      ${messageBlock}

      <!-- Impact list -->
      <tr><td style="padding:0 40px 32px;">
        <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6B7280;">Your gift helps fund</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">${impactRows}</table>
      </td></tr>

      <!-- Divider -->
      <tr><td style="padding:0 40px 28px;">
        <div style="height:1px;background:linear-gradient(to right,transparent,#E5E7EB,transparent);"></div>
      </td></tr>

      <!-- Reference card -->
      <tr><td style="padding:0 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB;">
        <tr><td style="padding:16px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size:12px;color:#6B7280;">Donation reference</td>
              <td align="right" style="font-size:13px;font-weight:700;color:#111827;">${refId}</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#6B7280;padding-top:6px;">Date</td>
              <td align="right" style="font-size:13px;font-weight:600;color:#111827;padding-top:6px;">${dateStr}</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#6B7280;padding-top:6px;">Status</td>
              <td align="right" style="padding-top:6px;">
                <span style="background:#FEF3C7;color:#92400E;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;">PENDING</span>
              </td>
            </tr>
          </table>
        </td></tr>
        </table>
        <p style="margin:12px 0 0;font-size:13px;color:#6B7280;line-height:1.6;">
          Our team will reach out to you shortly with secure payment instructions to complete your donation.
        </p>
      </td></tr>

      <!-- CTA -->
      <tr><td align="center" style="padding:0 40px 36px;">
        <a href="https://komezaju.org" style="display:inline-block;background:linear-gradient(135deg,#F97316,#FBBF24);color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:100px;">
          Learn More About Our Work →
        </a>
      </td></tr>

    </table>
    </td></tr>

    <!-- ── Footer ──────────────────────────────────────── -->
    <tr><td align="center" style="padding:28px 16px 0;">
      <p style="margin:0;font-size:13px;color:#9CA3AF;line-height:1.6;">
        KOMEZAJU Organization · Bugesera District, Eastern Province, Rwanda
      </p>
      <p style="margin:6px 0 0;font-size:12px;">
        <a href="mailto:komezajuorganization1@gmail.com" style="color:#F97316;text-decoration:none;">komezaju@gmail.com</a>
      </p>
      <p style="margin:14px 0 0;font-size:11px;color:#D1D5DB;">
        You received this email because you submitted a donation on our website.
      </p>
    </td></tr>

  </table>
  </td></tr>
  </table>
</body>
</html>`;
  }
}
