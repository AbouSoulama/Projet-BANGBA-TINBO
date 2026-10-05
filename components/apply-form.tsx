"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitContact, type ContactState } from "@/lib/contact";
import {
  INVESTOR_INTERESTS,
  INVESTOR_PROFILES,
  PARTNER_KINDS,
  type RequestType,
} from "@/lib/site";

const EXTRA_OPTIONS = {
  partnerKind: PARTNER_KINDS,
  investorProfile: INVESTOR_PROFILES,
  interest: INVESTOR_INTERESTS,
} as const;

type ExtraName = keyof typeof EXTRA_OPTIONS;

const initialState: ContactState = { status: "idle" };

export function ApplyForm({
  locale,
  namespace,
  requestType,
  extras,
  honeypotId,
}: {
  locale: string;
  namespace: "partners" | "joinInvestor";
  requestType: RequestType;
  extras: ExtraName[];
  honeypotId: string;
}) {
  const t = useTranslations(namespace);
  const [state, action, pending] = useActionState(submitContact, initialState);
  const [values, setValues] = useState({
    lastName: "",
    firstName: "",
    organization: "",
    role: "",
    email: "",
    country: "",
    message: "",
    partnerKind: "",
    investorProfile: "",
    interest: "",
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
      <input type="hidden" name="intent" value="message" />
      <input type="hidden" name="requestType" value={requestType} />
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={honeypotId}>Website</label>
        <input id={honeypotId} name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "success" ? (
        <p role="status" className="border border-gold bg-white px-4 py-3 text-navy">
          {t("success")}
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

      {extras.map((extra) => (
        <div key={extra}>
          <label htmlFor={extra} className="mb-2 block text-sm font-semibold text-navy">
            {t(extra)}
          </label>
          <select
            id={extra}
            name={extra}
            value={values[extra]}
            onChange={(event) => update(extra, event.target.value)}
            required
            aria-invalid={state.fieldErrors?.[extra] ? true : undefined}
            className="w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink outline-none transition-colors focus:border-gold"
          >
            <option value="" disabled>
              {t("selectPlaceholder")}
            </option>
            {EXTRA_OPTIONS[extra].map((option) => (
              <option key={option} value={option}>
                {t(`${extra}s.${option}`)}
              </option>
            ))}
          </select>
          {state.fieldErrors?.[extra] ? <p className="mt-2 text-sm text-navy">{t("errorRequired")}</p> : null}
        </div>
      ))}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${honeypotId}-lastName`}
          name="lastName"
          label={t("lastName")}
          autoComplete="family-name"
          value={values.lastName}
          onChange={(value) => update("lastName", value)}
          error={errorText(state.fieldErrors?.lastName)}
        />
        <Field
          id={`${honeypotId}-firstName`}
          name="firstName"
          label={t("firstName")}
          autoComplete="given-name"
          value={values.firstName}
          onChange={(value) => update("firstName", value)}
          error={errorText(state.fieldErrors?.firstName)}
        />
        <Field
          id={`${honeypotId}-organization`}
          name="organization"
          label={t("organization")}
          autoComplete="organization"
          value={values.organization}
          onChange={(value) => update("organization", value)}
          error={errorText(state.fieldErrors?.organization)}
        />
        <Field
          id={`${honeypotId}-role`}
          name="role"
          label={t("role")}
          autoComplete="organization-title"
          value={values.role}
          onChange={(value) => update("role", value)}
          error={errorText(state.fieldErrors?.role)}
        />
        <Field
          id={`${honeypotId}-email`}
          name="email"
          type="email"
          label={t("email")}
          autoComplete="email"
          value={values.email}
          onChange={(value) => update("email", value)}
          error={errorText(state.fieldErrors?.email)}
        />
        <Field
          id={`${honeypotId}-country`}
          name="country"
          label={t("country")}
          autoComplete="country-name"
          value={values.country}
          onChange={(value) => update("country", value)}
          error={errorText(state.fieldErrors?.country)}
        />
      </div>

      <div>
        <label htmlFor={`${honeypotId}-message`} className="mb-2 block text-sm font-semibold text-navy">
          {t("proposal")}
        </label>
        <textarea
          id={`${honeypotId}-message`}
          name="message"
          required
          rows={6}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder={t("proposalPlaceholder")}
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          className="w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink outline-none transition-colors focus:border-gold"
        />
        {state.fieldErrors?.message ? (
          <p className="mt-2 text-sm text-navy">{errorText(state.fieldErrors.message)}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-gold px-7 py-4 text-sm font-semibold tracking-[0.12em] text-navy-deep uppercase transition-colors duration-500 hover:bg-gold-light disabled:opacity-60"
      >
        {pending ? t("sending") : t("submit")}
      </button>
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
