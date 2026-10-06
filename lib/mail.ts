import nodemailer from "nodemailer";
import { CONTACT, siteUrl } from "./site";

export type MailLocale = "fr" | "en";
export type MailKind = "message" | "meeting" | "partner" | "investor";

export type MailRow = { label: string; value: string };

export type FormMail = {
  locale: MailLocale;
  kind: MailKind;
  visitorName: string;
  visitorEmail: string;
  organization: string;
  rows: MailRow[];
  message: string;
};

const COPY = {
  fr: {
    brand: "Bangba Tinbo Intelligence et Stratégies",
    message: {
      eyebrow: "Accusé de réception",
      title: "Votre message est bien arrivé.",
      intro: "BTIS a reçu votre demande et la traitera de manière confidentielle. Une réponse vous sera adressée à cette adresse e-mail.",
      adminEyebrow: "Nouveau message",
      adminTitle: "Un message vient d’être envoyé depuis le site.",
    },
    meeting: {
      eyebrow: "Demande de rendez-vous",
      title: "Votre demande de rendez-vous est enregistrée.",
      intro: "Aucun créneau n’est réservé automatiquement. BTIS lira votre demande et vous proposera un horaire par e-mail.",
      adminEyebrow: "Nouveau rendez-vous",
      adminTitle: "Une demande de rendez-vous vient d’être envoyée.",
    },
    partner: {
      eyebrow: "Proposition de partenariat",
      title: "Votre proposition a bien été reçue.",
      intro: "BTIS étudiera cette collaboration de manière confidentielle et vous répondra à cette adresse e-mail.",
      adminEyebrow: "Nouveau partenariat",
      adminTitle: "Une proposition de partenariat vient d’être envoyée.",
    },
    investor: {
      eyebrow: "Intérêt d’investissement",
      title: "Votre intérêt a bien été reçu.",
      intro: "Ce message confirme la réception. Il ne constitue ni une levée de fonds en ligne, ni une promesse de rendement. BTIS vous répondra pour qualifier la suite.",
      adminEyebrow: "Nouvel investisseur",
      adminTitle: "Un intérêt d’investissement vient d’être envoyé.",
    },
    recap: "Récapitulatif",
    messageLabel: "Message",
    reply: "Répondre",
    site: "Voir le site",
    confidential: "Chaque demande est traitée de manière confidentielle.",
    disclaimer: "Cet e-mail confirme la réception de votre envoi. Il ne vaut pas accord, mandat ni engagement.",
    location: "Burkina Faso · Afrique de l’Ouest",
  },
  en: {
    brand: "Bangba Tinbo Intelligence et Stratégies",
    message: {
      eyebrow: "Acknowledgement",
      title: "Your message has arrived.",
      intro: "BTIS has received your request and will treat it confidentially. A reply will be sent to this email address.",
      adminEyebrow: "New message",
      adminTitle: "A message was just sent from the website.",
    },
    meeting: {
      eyebrow: "Meeting request",
      title: "Your meeting request is recorded.",
      intro: "No slot is booked automatically. BTIS will read your request and propose a time by email.",
      adminEyebrow: "New meeting",
      adminTitle: "A meeting request was just sent.",
    },
    partner: {
      eyebrow: "Partnership proposal",
      title: "Your proposal has been received.",
      intro: "BTIS will review this collaboration confidentially and reply to this email address.",
      adminEyebrow: "New partnership",
      adminTitle: "A partnership proposal was just sent.",
    },
    investor: {
      eyebrow: "Investment interest",
      title: "Your interest has been received.",
      intro: "This message only confirms receipt. It is not an online fundraising offer and it promises no return. BTIS will reply to qualify the next step.",
      adminEyebrow: "New investor",
      adminTitle: "An investment interest was just sent.",
    },
    recap: "Summary",
    messageLabel: "Message",
    reply: "Reply",
    site: "Visit the site",
    confidential: "Every request is handled confidentially.",
    disclaimer: "This email confirms that your submission was received. It is not an agreement, a mandate, or a commitment.",
    location: "Burkina Faso · West Africa",
  },
} as const;

const SUBJECT = {
  fr: {
    message: "BTIS a reçu votre message",
    meeting: "BTIS a reçu votre demande de rendez-vous",
    partner: "BTIS a reçu votre proposition de partenariat",
    investor: "BTIS a reçu votre intérêt d’investissement",
  },
  en: {
    message: "BTIS has received your message",
    meeting: "BTIS has received your meeting request",
    partner: "BTIS has received your partnership proposal",
    investor: "BTIS has received your investment interest",
  },
} as const;

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textBlock(value: string) {
  return esc(value).replace(/\n/g, "<br>");
}

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function fromAddress() {
  const raw = process.env.SMTP_FROM || process.env.SMTP_USER || CONTACT.email;
  if (raw.includes("<")) return raw;
  return `BTIS <${raw}>`;
}

function inbox() {
  return process.env.CONTACT_TO || CONTACT.email;
}

function layout(options: {
  locale: MailLocale;
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  rows: MailRow[];
  recap: string;
  messageLabel: string;
  message: string;
  ctaLabel: string;
  ctaHref: string;
  note: string;
  disclaimer: string;
  location: string;
}) {
  const origin = siteUrl().replace(/\/$/, "");
  const logo = `${origin}/brand/logo-light.png`;
  const rows = options.rows
    .map(
      (row) => `
        <tr>
          <td style="padding:14px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#8d6e32;">${esc(row.label)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0 0;font-family:'Segoe UI',Arial,sans-serif;font-size:16px;line-height:24px;color:#121c2e;">${esc(row.value)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="${options.locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(options.title)}</title>
</head>
<body style="margin:0;padding:0;background:#ece5d6;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(options.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ece5d6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;">
          <tr>
            <td style="background:#06142b;padding:28px 36px 24px;">
              <img src="${esc(logo)}" width="168" alt="BTIS" style="display:block;width:168px;height:auto;border:0;">
              <div style="height:1px;background:#c4a15a;margin:22px 0 18px;font-size:0;line-height:0;">&nbsp;</div>
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#e3cb92;">${esc(options.eyebrow)}</p>
              <h1 style="margin:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:38px;font-weight:normal;color:#f6f3ec;">${esc(options.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 36px 8px;font-family:'Segoe UI',Arial,sans-serif;font-size:16px;line-height:26px;color:#121c2e;">
              ${esc(options.intro)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 36px 0;">
              <p style="margin:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#0b2347;">${esc(options.recap)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 36px 0;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#0b2347;">${esc(options.messageLabel)}</p>
              <div style="margin-top:10px;background:#f6f3ec;border-left:3px solid #c4a15a;padding:16px 18px;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;line-height:24px;color:#121c2e;">${textBlock(options.message)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px 8px;">
              <a href="${esc(options.ctaHref)}" style="display:inline-block;background:#c4a15a;color:#06142b;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;padding:14px 22px;">${esc(options.ctaLabel)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 36px 32px;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;line-height:20px;color:#5b6474;">
              ${esc(options.note)}
            </td>
          </tr>
          <tr>
            <td style="background:#0b2347;padding:24px 36px;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;line-height:20px;color:#f6f3ec;">
              <p style="margin:0;color:#e3cb92;">BTIS</p>
              <p style="margin:6px 0 0;">${esc(options.location)}</p>
              <p style="margin:6px 0 0;"><a href="mailto:${esc(inbox())}" style="color:#f6f3ec;text-decoration:none;">${esc(inbox())}</a> · <a href="tel:+33755821684" style="color:#f6f3ec;text-decoration:none;">${esc(CONTACT.phone)}</a></p>
              <p style="margin:14px 0 0;color:#e3cb92;">${esc(options.disclaimer)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function plain(options: { title: string; intro: string; rows: MailRow[]; message: string }) {
  return [options.title, "", options.intro, "", ...options.rows.map((row) => `${row.label}: ${row.value}`), "", options.message].join("\n");
}

export async function deliverFormEmails(mail: FormMail) {
  if (!smtpConfigured()) return "unconfigured" as const;

  const copy = COPY[mail.locale][mail.kind];
  const shared = COPY[mail.locale];
  const adminCopy = COPY.fr[mail.kind];
  const adminShared = COPY.fr;
  const origin = siteUrl().replace(/\/$/, "");
  const port = Number(process.env.SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 20_000,
  });

  const adminHtml = layout({
    locale: "fr",
    preheader: adminCopy.adminTitle,
    eyebrow: adminCopy.adminEyebrow,
    title: adminCopy.adminTitle,
    intro: `${mail.visitorName} · ${mail.visitorEmail}`,
    rows: mail.rows,
    recap: adminShared.recap,
    messageLabel: adminShared.messageLabel,
    message: mail.message,
    ctaLabel: adminShared.reply,
    ctaHref: `mailto:${mail.visitorEmail}`,
    note: adminShared.confidential,
    disclaimer: adminShared.disclaimer,
    location: adminShared.location,
  });

  const visitorHtml = layout({
    locale: mail.locale,
    preheader: copy.title,
    eyebrow: copy.eyebrow,
    title: copy.title,
    intro: copy.intro,
    rows: mail.rows,
    recap: shared.recap,
    messageLabel: shared.messageLabel,
    message: mail.message,
    ctaLabel: shared.site,
    ctaHref: `${origin}/${mail.locale}`,
    note: shared.confidential,
    disclaimer: shared.disclaimer,
    location: shared.location,
  });

  const adminSubject =
    mail.kind === "partner"
      ? `Partenariat — ${mail.organization}`
      : mail.kind === "investor"
        ? `Investisseur — ${mail.organization}`
        : mail.kind === "meeting"
          ? `Rendez-vous — ${mail.organization}`
          : `Demande — ${mail.organization}`;

  try {
    await transporter.sendMail({
      from: fromAddress(),
      to: inbox(),
      replyTo: mail.visitorEmail,
      subject: adminSubject,
      text: plain({ title: adminCopy.adminTitle, intro: `${mail.visitorName} <${mail.visitorEmail}>`, rows: mail.rows, message: mail.message }),
      html: adminHtml,
    });
    await transporter.sendMail({
      from: fromAddress(),
      to: mail.visitorEmail,
      replyTo: inbox(),
      subject: SUBJECT[mail.locale][mail.kind],
      text: plain({ title: copy.title, intro: copy.intro, rows: mail.rows, message: mail.message }),
      html: visitorHtml,
    });
    return "ok" as const;
  } catch (error) {
    console.error("Form email delivery failed", error);
    return "failed" as const;
  }
}
