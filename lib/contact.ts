"use server";

import nodemailer from "nodemailer";
import { z } from "zod";
import { insertLead, mysqlConfigured } from "./db";
import {
  CONTACT,
  INVESTOR_INTERESTS,
  INVESTOR_PROFILES,
  MEETING_FORMATS,
  MEETING_PERIODS,
  PARTNER_KINDS,
  REQUEST_TYPES,
} from "./site";

const schema = z.object({
  lastName: z.string().trim().min(1).max(80),
  firstName: z.string().trim().min(1).max(80),
  organization: z.string().trim().min(1).max(160),
  role: z.string().trim().min(1).max(160),
  email: z.string().trim().max(160).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  country: z.string().trim().min(1).max(80),
  requestType: z.enum(REQUEST_TYPES),
  message: z.string().trim().min(10).max(4000),
  intent: z.enum(["message", "meeting"]),
  locale: z.enum(["fr", "en"]),
  format: z.enum(MEETING_FORMATS).optional(),
  period: z.enum(MEETING_PERIODS).optional(),
  partnerKind: z.enum(PARTNER_KINDS).optional(),
  investorProfile: z.enum(INVESTOR_PROFILES).optional(),
  interest: z.enum(INVESTOR_INTERESTS).optional(),
  companyWebsite: z.string().optional(),
});

type FieldName =
  | "lastName"
  | "firstName"
  | "organization"
  | "role"
  | "email"
  | "country"
  | "requestType"
  | "message"
  | "format"
  | "period"
  | "partnerKind"
  | "investorProfile"
  | "interest";

export type ContactState = {
  status: "idle" | "success" | "error";
  intent?: "message" | "meeting";
  error?: "unconfigured" | "send" | "invalid";
  fieldErrors?: Partial<Record<FieldName, "required" | "email" | "short">>;
};

const FORMAT_LABEL = {
  visio: { fr: "Visioconférence", en: "Video call" },
  phone: { fr: "Téléphone", en: "Phone" },
  "in-person": { fr: "Présentiel (Ouagadougou)", en: "In person (Ouagadougou)" },
} as const;

const PERIOD_LABEL = {
  "this-week": { fr: "Cette semaine", en: "This week" },
  "two-weeks": { fr: "Dans les deux semaines", en: "Within two weeks" },
  month: { fr: "Dans le mois", en: "This month" },
  flexible: { fr: "Flexible", en: "Flexible" },
} as const;

const PARTNER_KIND_LABEL = {
  institution: { fr: "Institution", en: "Institution" },
  operator: { fr: "Opérateur", en: "Operator" },
  education: { fr: "Acteur éducatif", en: "Education actor" },
  investor: { fr: "Investisseur / co-investisseur", en: "Investor / co-investor" },
  local: { fr: "Acteur local", en: "Local actor" },
  other: { fr: "Autre", en: "Other" },
} as const;

const INVESTOR_PROFILE_LABEL = {
  individual: { fr: "Personne physique", en: "Individual" },
  "family-office": { fr: "Family office", en: "Family office" },
  fund: { fr: "Fonds", en: "Fund" },
  institution: { fr: "Institution", en: "Institution" },
  corporate: { fr: "Entreprise", en: "Corporate" },
} as const;

const INTEREST_LABEL = {
  education: { fr: "Éducation & enseignement", en: "Education" },
  mixed: { fr: "Plusieurs secteurs, dont l’éducation", en: "Several sectors, including education" },
  explore: { fr: "À préciser avec BTIS", en: "To be defined with BTIS" },
} as const;

function fieldCode(field: string, code: string): "required" | "email" | "short" {
  if (field === "email" && code !== "too_small") return "email";
  if (field === "message" && code === "too_small") return "short";
  return "required";
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function asOptionalEnum(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.length === 0) return undefined;
  return value;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const intentValue = formData.get("intent");
  const intent = intentValue === "meeting" ? "meeting" : "message";

  const parsed = schema.safeParse({
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName"),
    organization: formData.get("organization"),
    role: formData.get("role"),
    email: formData.get("email"),
    country: formData.get("country"),
    requestType: formData.get("requestType"),
    message: formData.get("message"),
    intent,
    locale: formData.get("locale"),
    format: asOptionalEnum(formData.get("format")),
    period: asOptionalEnum(formData.get("period")),
    partnerKind: asOptionalEnum(formData.get("partnerKind")),
    investorProfile: asOptionalEnum(formData.get("investorProfile")),
    interest: asOptionalEnum(formData.get("interest")),
    companyWebsite: formData.get("companyWebsite"),
  });

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field !== "string" || fieldErrors[field as FieldName]) continue;
      if (
        field === "lastName" ||
        field === "firstName" ||
        field === "organization" ||
        field === "role" ||
        field === "email" ||
        field === "country" ||
        field === "requestType" ||
        field === "message" ||
        field === "format" ||
        field === "period" ||
        field === "partnerKind" ||
        field === "investorProfile" ||
        field === "interest"
      ) {
        fieldErrors[field] = fieldCode(field, issue.code);
      }
    }
    return { status: "error", error: "invalid", fieldErrors, intent };
  }

  const wantsPartner = formData.has("partnerKind");
  const wantsInvestor = formData.has("investorProfile");

  if (intent === "meeting" && (!parsed.data.format || !parsed.data.period)) {
    return {
      status: "error",
      error: "invalid",
      intent,
      fieldErrors: {
        ...(!parsed.data.format ? { format: "required" } : {}),
        ...(!parsed.data.period ? { period: "required" } : {}),
      },
    };
  }

  if (wantsPartner && !parsed.data.partnerKind) {
    return { status: "error", error: "invalid", intent, fieldErrors: { partnerKind: "required" } };
  }

  if (wantsInvestor && (!parsed.data.investorProfile || !parsed.data.interest)) {
    return {
      status: "error",
      error: "invalid",
      intent,
      fieldErrors: {
        ...(!parsed.data.investorProfile ? { investorProfile: "required" } : {}),
        ...(!parsed.data.interest ? { interest: "required" } : {}),
      },
    };
  }

  if (parsed.data.companyWebsite) {
    return { status: "success", intent: parsed.data.intent };
  }

  const data = parsed.data;
  const locale = data.locale;
  const extraNote = [
    ...(data.intent === "meeting" && data.format && data.period
      ? [`Format: ${FORMAT_LABEL[data.format][locale]}`, `Période souhaitée: ${PERIOD_LABEL[data.period][locale]}`]
      : []),
    ...(data.partnerKind ? [`Profil partenaire: ${PARTNER_KIND_LABEL[data.partnerKind][locale]}`] : []),
    ...(data.investorProfile ? [`Profil investisseur: ${INVESTOR_PROFILE_LABEL[data.investorProfile][locale]}`] : []),
    ...(data.interest ? [`Intérêt: ${INTEREST_LABEL[data.interest][locale]}`] : []),
  ];
  const storedMessage = extraNote.length > 0 ? `${extraNote.join("\n")}\n\n${data.message}` : data.message;

  const canStore = mysqlConfigured();
  const canMail = smtpConfigured();

  if (!canStore && !canMail) {
    return { status: "error", error: "unconfigured", intent: data.intent };
  }

  let stored = false;
  let mailed = false;

  if (canStore) {
    try {
      stored = await insertLead({
        locale: data.locale,
        intent: data.intent,
        lastName: data.lastName,
        firstName: data.firstName,
        organization: data.organization,
        role: data.role,
        email: data.email,
        country: data.country,
        requestType: data.requestType,
        message: storedMessage,
      });
    } catch (error) {
      console.error("MySQL lead insert failed", error);
    }
  }

  if (canMail) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const subject = data.partnerKind
      ? `Partenariat — ${data.organization}`
      : data.investorProfile
        ? `Investisseur — ${data.organization}`
        : data.intent === "meeting"
          ? `Rendez-vous — ${data.requestType} — ${data.organization}`
          : `Demande — ${data.requestType} — ${data.organization}`;
    const text = [
      `Intent: ${data.partnerKind ? "Partenariat" : data.investorProfile ? "Investisseur" : data.intent === "meeting" ? "Rendez-vous" : "Message"}`,
      `Locale: ${data.locale}`,
      `Nom: ${data.lastName}`,
      `Prénom: ${data.firstName}`,
      `Organisation: ${data.organization}`,
      `Fonction: ${data.role}`,
      `Email: ${data.email}`,
      `Pays: ${data.country}`,
      `Type de demande: ${data.requestType}`,
      ...(data.format ? [`Format: ${FORMAT_LABEL[data.format][locale]}`] : []),
      ...(data.period ? [`Période souhaitée: ${PERIOD_LABEL[data.period][locale]}`] : []),
      ...(data.partnerKind ? [`Profil partenaire: ${PARTNER_KIND_LABEL[data.partnerKind][locale]}`] : []),
      ...(data.investorProfile ? [`Profil investisseur: ${INVESTOR_PROFILE_LABEL[data.investorProfile][locale]}`] : []),
      ...(data.interest ? [`Intérêt: ${INTEREST_LABEL[data.interest][locale]}`] : []),
      "",
      data.message,
    ].join("\n");

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_TO || CONTACT.email,
        replyTo: data.email,
        subject,
        text,
      });
      mailed = true;
    } catch (error) {
      console.error("Contact form delivery failed", error);
    }
  }

  if (stored || mailed) {
    return { status: "success", intent: data.intent };
  }

  return { status: "error", error: "send", intent: data.intent };
}
