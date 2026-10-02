"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitContact, type ContactState } from "@/lib/contact";
import { REQUEST_TYPES, type RequestType } from "@/lib/site";

const initialState: ContactState = { status: "idle" };

export function ContactForm({
  locale,
  defaultType,
}: {
  locale: string;
  defaultType?: RequestType;
}) {
  const t = useTranslations("contact");
  const [state, action, pending] = useActionState(submitContact, initialState);
  const [values, setValues] = useState({
    lastName: "",
    firstName: "",
    organization: "",
    role: "",
    email: "",
    country: "",
    requestType: defaultType ?? "",
    message: "",
  });

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  const errorText = (code?: "required" | "email" | "short") => {
    if (code === "email") return t("errorEmail");
    if (code === "short") return t("errorShort");
    if (code === "required") return t("errorRequired");
    return null;
  };

  return (
    <form action={action} className="space-y-8" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Website</label>
        <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "success" ? (
        <p role="status" className="border border-gold bg-white px-4 py-3 text-navy">
          {state.intent === "meeting" ? t("successMeeting") : t("success")}
        </p>
      ) : null}
      {state.status === "error" && state.error === "unconfigured" ? (
        <p role="alert" className="border border-navy/20 bg-white px-4 py-3 text-navy">
          {t("errorUnconfigured")}
        </p>
      ) : null}
      {state.status === "error" && state.error === "send" ? (
        <p role="alert" className="border border-navy/20 bg-white px-4 py-3 text-navy">
          {t("errorSend")}
        </p>
      ) : null}
      {state.status === "error" && state.error === "invalid" ? (
        <p role="alert" className="border border-navy/20 bg-white px-4 py-3 text-navy">
          {t("errorInvalid")}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="lastName"
          name="lastName"
          label={t("lastName")}
          autoComplete="family-name"
          value={values.lastName}
          onChange={(value) => update("lastName", value)}
          error={errorText(state.fieldErrors?.lastName)}
        />
        <Field
          id="firstName"
          name="firstName"
          label={t("firstName")}
          autoComplete="given-name"
          value={values.firstName}
          onChange={(value) => update("firstName", value)}
          error={errorText(state.fieldErrors?.firstName)}
        />
        <Field
          id="organization"
          name="organization"
          label={t("organization")}
          autoComplete="organization"
          value={values.organization}
          onChange={(value) => update("organization", value)}
          error={errorText(state.fieldErrors?.organization)}
        />
        <Field
          id="role"
          name="role"
          label={t("role")}
          autoComplete="organization-title"
          value={values.role}
          onChange={(value) => update("role", value)}
          error={errorText(state.fieldErrors?.role)}
        />
        <Field
          id="email"
          name="email"
          type="email"
          label={t("email")}
          autoComplete="email"
          value={values.email}
          onChange={(value) => update("email", value)}
          error={errorText(state.fieldErrors?.email)}
        />
        <Field
          id="country"
          name="country"
          label={t("country")}
          autoComplete="country-name"
          value={values.country}
          onChange={(value) => update("country", value)}
          error={errorText(state.fieldErrors?.country)}
        />
      </div>

      <div>
        <label htmlFor="requestType" className="mb-2 block text-sm font-semibold text-navy">
          {t("requestType")}
        </label>
        <select
          id="requestType"
          name="requestType"
          value={values.requestType}
          onChange={(event) => update("requestType", event.target.value)}
          required
          aria-invalid={state.fieldErrors?.requestType ? true : undefined}
          className="w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink outline-none transition-colors focus:border-gold"
        >
          <option value="" disabled>
            {t("requestPlaceholder")}
          </option>
          {REQUEST_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {state.fieldErrors?.requestType ? (
          <p className="mt-2 text-sm text-navy">{t("errorRequired")}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-semibold text-navy">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder={t("messagePlaceholder")}
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          className="w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink outline-none transition-colors focus:border-gold"
        />
        {state.fieldErrors?.message ? (
          <p className="mt-2 text-sm text-navy">{errorText(state.fieldErrors.message)}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          name="intent"
          value="message"
          disabled={pending}
          className="bg-navy px-7 py-4 text-sm font-semibold tracking-[0.12em] text-white uppercase transition-colors duration-500 hover:bg-navy-deep disabled:opacity-60"
        >
          {pending ? t("sending") : t("submit")}
        </button>
      </div>

      <div id="rendez-vous" className="scroll-mt-28 border-t border-line pt-8">
        <h2 className="font-display text-3xl text-navy">{t("meetingTitle")}</h2>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">{t("meetingText")}</p>
        <button
          type="submit"
          name="intent"
          value="meeting"
          disabled={pending}
          className="mt-6 border border-navy px-7 py-4 text-sm font-semibold tracking-[0.12em] text-navy uppercase transition-colors duration-500 hover:bg-navy hover:text-white disabled:opacity-60"
        >
          {t("meetingCta")}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  error,
  type = "text",
  autoComplete,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  error?: string | null;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className="w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink outline-none transition-colors focus:border-gold"
      />
      {error ? <p className="mt-2 text-sm text-navy">{error}</p> : null}
    </div>
  );
}
