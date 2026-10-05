"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitContact, type ContactState } from "@/lib/contact";
import { MEETING_FORMATS, MEETING_PERIODS, REQUEST_TYPES, type MeetingFormat, type MeetingPeriod, type RequestType } from "@/lib/site";
import { CalendarIcon, PhoneIcon, VideoIcon } from "./icons";

const initialState: ContactState = { status: "idle" };

const formatIcons = {
  visio: VideoIcon,
  phone: PhoneIcon,
  "in-person": CalendarIcon,
} as const;

export function MeetingForm({
  locale,
  defaultType,
}: {
  locale: string;
  defaultType?: RequestType;
}) {
  const t = useTranslations("meeting");
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
    format: "" as "" | MeetingFormat,
    period: "" as "" | MeetingPeriod,
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
      <input type="hidden" name="intent" value="meeting" />
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="companyWebsiteMeeting">Website</label>
        <input id="companyWebsiteMeeting" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
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

      <fieldset>
        <legend className="mb-4 text-sm font-semibold text-navy">{t("format")}</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {MEETING_FORMATS.map((format) => {
            const Icon = formatIcons[format];
            const selected = values.format === format;
            return (
              <label
                key={format}
                className={`flex cursor-pointer flex-col gap-3 border px-4 py-5 transition-colors duration-300 ${
                  selected ? "border-gold bg-gold/10" : "border-line hover:border-navy/40"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={format}
                  checked={selected}
                  onChange={() => update("format", format)}
                  className="sr-only"
                />
                <Icon className="h-5 w-5 text-gold-deep" />
                <span className="text-sm font-semibold text-navy">{t(`formats.${format}`)}</span>
              </label>
            );
          })}
        </div>
        {state.fieldErrors?.format ? <p className="mt-2 text-sm text-navy">{t("errorRequired")}</p> : null}
      </fieldset>

      <div>
        <label htmlFor="period" className="mb-2 block text-sm font-semibold text-navy">
          {t("period")}
        </label>
        <select
          id="period"
          name="period"
          value={values.period}
          onChange={(event) => update("period", event.target.value)}
          required
          aria-invalid={state.fieldErrors?.period ? true : undefined}
          className="w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink outline-none transition-colors focus:border-gold"
        >
          <option value="" disabled>
            {t("periodPlaceholder")}
          </option>
          {MEETING_PERIODS.map((period) => (
            <option key={period} value={period}>
              {t(`periods.${period}`)}
            </option>
          ))}
        </select>
        {state.fieldErrors?.period ? <p className="mt-2 text-sm text-navy">{t("errorRequired")}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="meetingLastName"
          name="lastName"
          label={t("lastName")}
          autoComplete="family-name"
          value={values.lastName}
          onChange={(value) => update("lastName", value)}
          error={errorText(state.fieldErrors?.lastName)}
        />
        <Field
          id="meetingFirstName"
          name="firstName"
          label={t("firstName")}
          autoComplete="given-name"
          value={values.firstName}
          onChange={(value) => update("firstName", value)}
          error={errorText(state.fieldErrors?.firstName)}
        />
        <Field
          id="meetingOrganization"
          name="organization"
          label={t("organization")}
          autoComplete="organization"
          value={values.organization}
          onChange={(value) => update("organization", value)}
          error={errorText(state.fieldErrors?.organization)}
        />
        <Field
          id="meetingRole"
          name="role"
          label={t("role")}
          autoComplete="organization-title"
          value={values.role}
          onChange={(value) => update("role", value)}
          error={errorText(state.fieldErrors?.role)}
        />
        <Field
          id="meetingEmail"
          name="email"
          type="email"
          label={t("email")}
          autoComplete="email"
          value={values.email}
          onChange={(value) => update("email", value)}
          error={errorText(state.fieldErrors?.email)}
        />
        <Field
          id="meetingCountry"
          name="country"
          label={t("country")}
          autoComplete="country-name"
          value={values.country}
          onChange={(value) => update("country", value)}
          error={errorText(state.fieldErrors?.country)}
        />
      </div>

      <div>
        <label htmlFor="meetingRequestType" className="mb-2 block text-sm font-semibold text-navy">
          {t("requestType")}
        </label>
        <select
          id="meetingRequestType"
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
        {state.fieldErrors?.requestType ? <p className="mt-2 text-sm text-navy">{t("errorRequired")}</p> : null}
      </div>

      <div>
        <label htmlFor="meetingMessage" className="mb-2 block text-sm font-semibold text-navy">
          {t("objective")}
        </label>
        <textarea
          id="meetingMessage"
          name="message"
          required
          rows={5}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder={t("objectivePlaceholder")}
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
