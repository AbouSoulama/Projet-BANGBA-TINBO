"use server";

import nodemailer from "nodemailer";
import { z } from "zod";
import { insertLead, mysqlConfigured } from "./db";
import { CONTACT, REQUEST_TYPES } from "./site";

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
  companyWebsite: z.string().optional(),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  intent?: "message" | "meeting";
  error?: "unconfigured" | "send" | "invalid";
  fieldErrors?: Partial<Record<"lastName" | "firstName" | "organization" | "role" | "email" | "country" | "requestType" | "message", "required" | "email" | "short">>;
};

function fieldCode(field: string, code: string): "required" | "email" | "short" {
  if (field === "email" && code !== "too_small") return "email";
  if (field === "message" && code === "too_small") return "short";
  return "required";
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
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
    companyWebsite: formData.get("companyWebsite"),
  });

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field !== "string" || fieldErrors[field as keyof typeof fieldErrors]) continue;
      if (
        field === "lastName" ||
        field === "firstName" ||
        field === "organization" ||
        field === "role" ||
        field === "email" ||
        field === "country" ||
        field === "requestType" ||
        field === "message"
      ) {
        fieldErrors[field] = fieldCode(field, issue.code);
      }
    }
    return { status: "error", error: "invalid", fieldErrors, intent };
  }

  if (parsed.data.companyWebsite) {
    return { status: "success", intent: parsed.data.intent };
  }

  const data = parsed.data;
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
        message: data.message,
      });
    } catch (error) {
      console.error("MySQL lead insert failed", error);
    }
  }

  if (canMail) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const subject =
      data.intent === "meeting"
        ? `Rendez-vous — ${data.requestType} — ${data.organization}`
        : `Demande — ${data.requestType} — ${data.organization}`;
    const text = [
      `Intent: ${data.intent === "meeting" ? "Rendez-vous" : "Message"}`,
      `Locale: ${data.locale}`,
      `Nom: ${data.lastName}`,
      `Prénom: ${data.firstName}`,
      `Organisation: ${data.organization}`,
      `Fonction: ${data.role}`,
      `Email: ${data.email}`,
      `Pays: ${data.country}`,
      `Type de demande: ${data.requestType}`,
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
