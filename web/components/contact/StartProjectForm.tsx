"use client";

import React, { useRef, useState } from "react";
import { CheckCircle2, AlertCircle, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FormErrors {
  name?: string;
  email?: string;
  companyName?: string;
  website?: string;
  referralSource?: string;
  serviceNeeded?: string;
  projectSize?: string;
  targetTimeline?: string;
  budgetRange?: string;
  contentReadiness?: string;
  fileError?: string;
  general?: string;
}

export default function StartProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [projectSize, setProjectSize] = useState("");
  const [targetTimeline, setTargetTimeline] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [contentReadiness, setContentReadiness] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [honeypot, setHoneypot] = useState(""); // anti-spam

  // File upload state
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Interaction states
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // File handling
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 5;

  const handleFilesAdded = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    const newFiles = Array.from(incomingFiles);
    let errorMsg = "";

    if (files.length + newFiles.length > MAX_FILES) {
      setErrors((prev) => ({
        ...prev,
        fileError: `Maximum ${MAX_FILES} files allowed.`,
      }));
      return;
    }

    const validated: File[] = [];
    for (const f of newFiles) {
      if (f.size > MAX_FILE_SIZE) {
        errorMsg = `File "${f.name}" exceeds 10MB limit.`;
        break;
      }
      validated.push(f);
    }

    if (errorMsg) {
      setErrors((prev) => ({ ...prev, fileError: errorMsg }));
    } else {
      setErrors((prev) => ({ ...prev, fileError: undefined }));
      setFiles((prev) => [...prev, ...validated]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = "Please enter your name.";
    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!companyName.trim()) {
      newErrors.companyName = "Please enter your company name.";
    }

    if (website.trim()) {
      let urlToCheck = website.trim();
      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = `https://${urlToCheck}`;
      }
      try {
        new URL(urlToCheck);
      } catch {
        newErrors.website = "Please enter a valid website URL.";
      }
    }

    if (!referralSource) {
      newErrors.referralSource = "Please select how you heard about us.";
    }
    if (!serviceNeeded) {
      newErrors.serviceNeeded = "Please select what you need help with.";
    }
    if (!projectSize) {
      newErrors.projectSize = "Please select the size of your project.";
    }
    if (!targetTimeline) {
      newErrors.targetTimeline = "Please select your target timeline.";
    }
    if (!budgetRange) {
      newErrors.budgetRange = "Please select your budget range.";
    }
    if (!contentReadiness) {
      newErrors.contentReadiness = "Please select where your content stands.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      const element = document.getElementById(firstKey);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }

    return true;
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      let normalizedWebsite = website.trim();
      if (normalizedWebsite && !/^https?:\/\//i.test(normalizedWebsite)) {
        normalizedWebsite = `https://${normalizedWebsite}`;
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("companyName", companyName.trim());
      formData.append("website", normalizedWebsite);
      formData.append("referralSource", referralSource);
      formData.append("serviceNeeded", serviceNeeded);
      formData.append("projectSize", projectSize);
      formData.append("targetTimeline", targetTimeline);
      formData.append("budgetRange", budgetRange);
      formData.append("contentReadiness", contentReadiness);
      formData.append("additionalNotes", additionalNotes.trim());

      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/start-project", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to submit request.");
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 320, behavior: "smooth" });
    } catch {
      setErrors({
        general:
          "Something went wrong submitting your project. Please try again or email us directly at support@adspolisher.com.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="start-project-form"
      className="relative mx-auto w-full max-w-[760px] rounded-[28px] border border-[#141413]/15 bg-white px-5 py-9 shadow-[0_16px_40px_rgba(20,20,19,0.03)] sm:px-10 sm:py-11"
    >
      {/* Tab Label "START A PROJECT" centered on top border */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FCFCFC] px-5 py-0.5">
        <span className="relative inline-block pb-1 font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
          START A PROJECT
          <span
            className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#43B97F]"
            aria-hidden="true"
          />
        </span>
      </div>

      <div className="mx-auto w-full pt-2">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            /* SUCCESS CONFIRMATION STATE */
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="py-10 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#43B97F]/15 text-[#43B97F]">
                <CheckCircle2 size={40} strokeWidth={2.2} />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#141413] sm:text-3xl">
                Thank you, {name}!
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[#4A4945]">
                We&apos;ve received your request for{" "}
                <strong className="text-[#141413]">{companyName}</strong>. Our
                creative team will review your brief and respond within{" "}
                <span className="font-semibold text-[#43B97F]">24 hours</span>.
              </p>

              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setName("");
                    setEmail("");
                    setCompanyName("");
                    setWebsite("");
                    setReferralSource("");
                    setServiceNeeded("");
                    setProjectSize("");
                    setTargetTimeline("");
                    setBudgetRange("");
                    setContentReadiness("");
                    setAdditionalNotes("");
                    setFiles([]);
                  }}
                  className="rounded-full bg-[#141413] px-7 py-3 text-xs font-bold text-white transition hover:bg-[#2B2A27]"
                >
                  Submit another project
                </button>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE FORM */
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              {/* General submission error alert */}
              {errors.general && (
                <div
                  role="alert"
                  className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-[#D92D20]"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Honeypot field for spam prevention */}
              <input
                type="text"
                name="website_confirm"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Field 1 & 2: Name & Email (2-col grid) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {/* 1. Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="mb-1.5 text-[15px] font-medium text-[#141413]"
                  >
                    Name
                    <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                      (required)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Enter full name"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`h-[48px] w-full rounded-full bg-[#F3F3F3] px-5 text-sm sm:text-[15px] text-[#141413] placeholder-[#8A8A8A] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      errors.name ? "border border-[#D92D20] ring-2 ring-[#D92D20]" : ""
                    }`}
                  />
                  {errors.name && (
                    <span
                      id="name-error"
                      role="alert"
                      className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                    >
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* 2. Email */}
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="mb-1.5 text-[15px] font-medium text-[#141413]"
                  >
                    Email
                    <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                      (required)
                    </span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="Enter Email"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`h-[48px] w-full rounded-full bg-[#F3F3F3] px-5 text-sm sm:text-[15px] text-[#141413] placeholder-[#8A8A8A] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      errors.email ? "border border-[#D92D20] ring-2 ring-[#D92D20]" : ""
                    }`}
                  />
                  {errors.email && (
                    <span
                      id="email-error"
                      role="alert"
                      className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                    >
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* 3. Company name */}
              <div className="flex flex-col">
                <label
                  htmlFor="companyName"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  Company name
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (errors.companyName)
                      setErrors((prev) => ({
                        ...prev,
                        companyName: undefined,
                      }));
                  }}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.companyName}
                  aria-describedby={
                    errors.companyName ? "companyName-error" : undefined
                  }
                  className={`h-[48px] w-full rounded-full bg-[#F3F3F3] px-5 text-sm sm:text-[15px] text-[#141413] placeholder-[#8A8A8A] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                    errors.companyName
                      ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                      : ""
                  }`}
                />
                {errors.companyName && (
                  <span
                    id="companyName-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.companyName}
                  </span>
                )}
              </div>

              {/* 4. Current Website */}
              <div className="flex flex-col">
                <label
                  htmlFor="website"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  Current Website
                </label>
                <input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    if (errors.website)
                      setErrors((prev) => ({ ...prev, website: undefined }));
                  }}
                  onBlur={() => {
                    if (website.trim() && !/^https?:\/\//i.test(website.trim())) {
                      setWebsite(`https://${website.trim()}`);
                    }
                  }}
                  placeholder="https://example.com"
                  aria-invalid={!!errors.website}
                  aria-describedby={
                    errors.website ? "website-error" : undefined
                  }
                  className={`h-[48px] w-full rounded-full bg-[#F3F3F3] px-5 text-sm sm:text-[15px] text-[#141413] placeholder-[#8A8A8A] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                    errors.website
                      ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                      : ""
                  }`}
                />
                {errors.website && (
                  <span
                    id="website-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.website}
                  </span>
                )}
              </div>

              {/* 5. How did you hear about us? */}
              <div className="flex flex-col">
                <label
                  htmlFor="referralSource"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  How did you hear about us?
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="referralSource"
                    value={referralSource}
                    onChange={(e) => {
                      setReferralSource(e.target.value);
                      if (errors.referralSource)
                        setErrors((prev) => ({
                          ...prev,
                          referralSource: undefined,
                        }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.referralSource}
                    aria-describedby={
                      errors.referralSource
                        ? "referralSource-error"
                        : undefined
                    }
                    className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      !referralSource ? "text-[#8A8A8A]" : "text-[#141413]"
                    } ${
                      errors.referralSource
                        ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Google Search">Google Search</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X / Twitter">X / Twitter</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#141413]">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                {errors.referralSource && (
                  <span
                    id="referralSource-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.referralSource}
                  </span>
                )}
              </div>

              {/* 6. What do you need help with? */}
              <div className="flex flex-col">
                <label
                  htmlFor="serviceNeeded"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  What do you need help with?
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="serviceNeeded"
                    value={serviceNeeded}
                    onChange={(e) => {
                      setServiceNeeded(e.target.value);
                      if (errors.serviceNeeded)
                        setErrors((prev) => ({
                          ...prev,
                          serviceNeeded: undefined,
                        }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.serviceNeeded}
                    aria-describedby={
                      errors.serviceNeeded ? "serviceNeeded-error" : undefined
                    }
                    className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      !serviceNeeded ? "text-[#8A8A8A]" : "text-[#141413]"
                    } ${
                      errors.serviceNeeded
                        ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Ad Creative & Design">
                      Ad Creative &amp; Design
                    </option>
                    <option value="Ad Copywriting">Ad Copywriting</option>
                    <option value="Ad Audit & Optimization">
                      Ad Audit &amp; Optimization
                    </option>
                    <option value="Campaign Strategy">
                      Campaign Strategy
                    </option>
                    <option value="Custom / Multiple services">
                      Custom / Multiple services
                    </option>
                  </select>
                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#141413]">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                {errors.serviceNeeded && (
                  <span
                    id="serviceNeeded-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.serviceNeeded}
                  </span>
                )}
              </div>

              {/* 7. What best describes the size of the project? */}
              <div className="flex flex-col">
                <label
                  htmlFor="projectSize"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  What best describes the size of the project?
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="projectSize"
                    value={projectSize}
                    onChange={(e) => {
                      setProjectSize(e.target.value);
                      if (errors.projectSize)
                        setErrors((prev) => ({
                          ...prev,
                          projectSize: undefined,
                        }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.projectSize}
                    aria-describedby={
                      errors.projectSize ? "projectSize-error" : undefined
                    }
                    className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      !projectSize ? "text-[#8A8A8A]" : "text-[#141413]"
                    } ${
                      errors.projectSize
                        ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="One-off asset (single ad or audit)">
                      One-off asset (single ad or audit)
                    </option>
                    <option value="Small (up to 5 assets)">
                      Small (up to 5 assets)
                    </option>
                    <option value="Medium (6 to 15 assets)">
                      Medium (6 to 15 assets)
                    </option>
                    <option value="Large / ongoing campaign">
                      Large / ongoing campaign
                    </option>
                  </select>
                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#141413]">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                {errors.projectSize && (
                  <span
                    id="projectSize-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.projectSize}
                  </span>
                )}
              </div>

              {/* 8. Do you have a target timeline? */}
              <div className="flex flex-col">
                <label
                  htmlFor="targetTimeline"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  Do you have a target timeline?
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="targetTimeline"
                    value={targetTimeline}
                    onChange={(e) => {
                      setTargetTimeline(e.target.value);
                      if (errors.targetTimeline)
                        setErrors((prev) => ({
                          ...prev,
                          targetTimeline: undefined,
                        }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.targetTimeline}
                    aria-describedby={
                      errors.targetTimeline
                        ? "targetTimeline-error"
                        : undefined
                    }
                    className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      !targetTimeline ? "text-[#8A8A8A]" : "text-[#141413]"
                    } ${
                      errors.targetTimeline
                        ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="ASAP (within a week)">
                      ASAP (within a week)
                    </option>
                    <option value="2 to 4 weeks">2 to 4 weeks</option>
                    <option value="1 to 2 months">1 to 2 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#141413]">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                {errors.targetTimeline && (
                  <span
                    id="targetTimeline-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.targetTimeline}
                  </span>
                )}
              </div>

              {/* 9. Which range best aligns with your budget? */}
              <div className="flex flex-col">
                <label
                  htmlFor="budgetRange"
                  className="text-[15px] font-medium text-[#141413]"
                >
                  Which range best aligns with your budget?
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <p className="mb-2 mt-0.5 text-xs text-[#6B6B6B]">
                  We&apos;ll recommend the right scope based on this
                </p>
                <div className="relative">
                  <select
                    id="budgetRange"
                    value={budgetRange}
                    onChange={(e) => {
                      setBudgetRange(e.target.value);
                      if (errors.budgetRange)
                        setErrors((prev) => ({
                          ...prev,
                          budgetRange: undefined,
                        }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.budgetRange}
                    aria-describedby={
                      errors.budgetRange ? "budgetRange-error" : undefined
                    }
                    className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      !budgetRange ? "text-[#8A8A8A]" : "text-[#141413]"
                    } ${
                      errors.budgetRange
                        ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500 – $1,500">$500 – $1,500</option>
                    <option value="$1,500 – $5,000">$1,500 – $5,000</option>
                    <option value="$5,000+">$5,000+</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#141413]">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                {errors.budgetRange && (
                  <span
                    id="budgetRange-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.budgetRange}
                  </span>
                )}
              </div>

              {/* 10. Where does your content stand today? */}
              <div className="flex flex-col">
                <label
                  htmlFor="contentReadiness"
                  className="text-[15px] font-medium text-[#141413]"
                >
                  Where does your content stand today?
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <p className="mb-2 mt-0.5 text-xs leading-relaxed text-[#6B6B6B]">
                  This helps us understand how much support you may need.
                  Content can always evolve, but having a starting point keeps
                  projects moving. Content includes branding materials, images,
                  and written copy.
                </p>
                <div className="relative">
                  <select
                    id="contentReadiness"
                    value={contentReadiness}
                    onChange={(e) => {
                      setContentReadiness(e.target.value);
                      if (errors.contentReadiness)
                        setErrors((prev) => ({
                          ...prev,
                          contentReadiness: undefined,
                        }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.contentReadiness}
                    aria-describedby={
                      errors.contentReadiness
                        ? "contentReadiness-error"
                        : undefined
                    }
                    className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      !contentReadiness ? "text-[#8A8A8A]" : "text-[#141413]"
                    } ${
                      errors.contentReadiness
                        ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="I have brand assets, images, and copy ready">
                      I have brand assets, images, and copy ready
                    </option>
                    <option value="I have some of it">
                      I have some of it
                    </option>
                    <option value="I'm starting from scratch">
                      I&apos;m starting from scratch
                    </option>
                  </select>
                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#141413]">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                {errors.contentReadiness && (
                  <span
                    id="contentReadiness-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.contentReadiness}
                  </span>
                )}
              </div>

              {/* 11. Anything else we should know before reviewing your request? */}
              <div className="flex flex-col">
                <label
                  htmlFor="additionalNotes"
                  className="text-[15px] font-medium text-[#141413]"
                >
                  Anything else we should know before reviewing your request?
                </label>
                <p className="mb-2 mt-0.5 text-xs text-[#6B6B6B]">
                  Optional. A few sentences is perfect. We&apos;ll dig into
                  details later if it&apos;s a good fit.
                </p>
                <textarea
                  id="additionalNotes"
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="min-h-[100px] w-full resize-y rounded-2xl bg-[#F3F3F3] p-4 text-sm sm:text-[15px] text-[#141413] placeholder-[#8A8A8A] outline-none transition-all focus:ring-2 focus:ring-[#43B97F]"
                />
              </div>

              {/* 12. Upload any relevant materials (optional) */}
              <div className="flex flex-col">
                <label className="text-[15px] font-medium text-[#141413]">
                  Upload any relevant materials (optional)
                </label>
                <p className="mb-2 mt-0.5 text-xs text-[#6B6B6B]">
                  Briefs, RFPs, sitemaps, or reference links. High level only.
                </p>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    handleFilesAdded(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 transition-all ${
                    isDragOver
                      ? "border-[#43B97F] bg-[#43B97F]/10"
                      : "border-[#141413]/25 bg-[#F3F3F3]/60 hover:border-[#43B97F]"
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label="Upload files: Click or drag and drop files here"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.zip"
                    onChange={(e) => handleFilesAdded(e.target.files)}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-xs">
                    <Plus size={16} strokeWidth={2.5} />
                  </div>
                  <span className="mt-1.5 text-xs font-semibold text-[#141413]">
                    Add a File
                  </span>
                  <span className="mt-0.5 text-[11px] text-[#6B6B6B]">
                    PDF, DOC, PPT, PNG, JPG, or ZIP (max 5 files, 10MB each)
                  </span>
                </div>

                {errors.fileError && (
                  <span
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.fileError}
                  </span>
                )}

                {/* File chips */}
                {files.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#141413]/10 bg-[#F3F3F3] px-3 py-1 text-xs font-medium text-[#141413]"
                      >
                        <span className="max-w-[170px] truncate">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-[#6B6B6B]">
                          ({formatFileSize(file.size)})
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="rounded-full p-0.5 hover:bg-black/10"
                          aria-label={`Remove file ${file.name}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="flex h-[56px] w-full items-center justify-center rounded-full bg-[#43B97F] text-base font-semibold text-white shadow-sm transition-all hover:bg-[#38A56F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending…" : "Submit"}
                </button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
