"use client";

import React, { useRef, useState } from "react";
import { CheckCircle2, AlertCircle, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FormErrors {
  name?: string;
  email?: string;
  location?: string;
  portfolioUrl?: string;
  secondaryUrl?: string;
  craftSpecialty?: string;
  primaryTools?: string;
  experienceLevel?: string;
  weeklyAvailability?: string;
  termsAgreed?: string;
  fileError?: string;
  general?: string;
}

export default function CreatorApplyForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [secondaryUrl, setSecondaryUrl] = useState("");
  const [craftSpecialty, setCraftSpecialty] = useState("");
  const [primaryTools, setPrimaryTools] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [weeklyAvailability, setWeeklyAvailability] = useState("");
  const [notes, setNotes] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  // File upload state
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Submission state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    if (!name.trim()) newErrors.name = "Please enter your full name.";
    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!location.trim()) {
      newErrors.location = "Please enter your location and timezone.";
    }

    if (!portfolioUrl.trim()) {
      newErrors.portfolioUrl = "Please provide a portfolio or website URL.";
    } else {
      let urlToCheck = portfolioUrl.trim();
      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = `https://${urlToCheck}`;
      }
      try {
        new URL(urlToCheck);
      } catch {
        newErrors.portfolioUrl = "Please enter a valid portfolio URL.";
      }
    }

    if (secondaryUrl.trim()) {
      let urlToCheck = secondaryUrl.trim();
      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = `https://${urlToCheck}`;
      }
      try {
        new URL(urlToCheck);
      } catch {
        newErrors.secondaryUrl = "Please enter a valid URL.";
      }
    }

    if (!craftSpecialty) {
      newErrors.craftSpecialty = "Please select your primary specialty.";
    }
    if (!primaryTools) {
      newErrors.primaryTools = "Please select your primary software/tools.";
    }
    if (!experienceLevel) {
      newErrors.experienceLevel = "Please select your experience level.";
    }
    if (!weeklyAvailability) {
      newErrors.weeklyAvailability = "Please select your weekly availability.";
    }
    if (!termsAgreed) {
      newErrors.termsAgreed = "Please confirm that submitted work is original.";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      let normalizedPortfolio = portfolioUrl.trim();
      if (normalizedPortfolio && !/^https?:\/\//i.test(normalizedPortfolio)) {
        normalizedPortfolio = `https://${normalizedPortfolio}`;
      }

      let normalizedSecondary = secondaryUrl.trim();
      if (normalizedSecondary && !/^https?:\/\//i.test(normalizedSecondary)) {
        normalizedSecondary = `https://${normalizedSecondary}`;
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("location", location.trim());
      formData.append("portfolioUrl", normalizedPortfolio);
      formData.append("secondaryUrl", normalizedSecondary);
      formData.append("craftSpecialty", craftSpecialty);
      formData.append("primaryTools", primaryTools);
      formData.append("experienceLevel", experienceLevel);
      formData.append("weeklyAvailability", weeklyAvailability);
      formData.append("notes", notes.trim());

      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/creator-applications", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to submit application.");
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 320, behavior: "smooth" });
    } catch {
      setErrors({
        general:
          "Something went wrong submitting your application. Please try again or reach out to talent@adspolisher.com.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="become-creator-form"
      className="relative mx-auto w-full max-w-[760px] rounded-[28px] border border-[#141413]/15 bg-white px-5 py-9 shadow-[0_16px_40px_rgba(20,20,19,0.03)] sm:px-10 sm:py-11"
    >
      {/* Tab Label "BECOME A CREATOR" centered on top border */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FCFCFC] px-5 py-0.5">
        <span className="relative inline-block pb-1 font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
          BECOME A CREATOR
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
              key="creator-success"
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
                Application Submitted!
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[#4A4945]">
                Thank you for applying,{" "}
                <strong className="text-[#141413]">{name}</strong>. Our art
                directors review creator submissions weekly. If your work
                matches our current project roster, we will reach out with your
                onboarding invitation.
              </p>

              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setName("");
                    setEmail("");
                    setLocation("");
                    setPortfolioUrl("");
                    setSecondaryUrl("");
                    setCraftSpecialty("");
                    setPrimaryTools("");
                    setExperienceLevel("");
                    setWeeklyAvailability("");
                    setNotes("");
                    setTermsAgreed(false);
                    setFiles([]);
                  }}
                  className="rounded-full bg-[#141413] px-7 py-3 text-xs font-bold text-white transition hover:bg-[#2B2A27]"
                >
                  Submit another application
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
              {/* General error alert */}
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
                name="user_confirm_token"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* 1 & 2: Name & Email */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="mb-1.5 text-[15px] font-medium text-[#141413]"
                  >
                    Full Name
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
                    placeholder="Enter your full name"
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

                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="mb-1.5 text-[15px] font-medium text-[#141413]"
                  >
                    Work Email
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
                    placeholder="you@domain.com"
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

              {/* 3. Location & Timezone */}
              <div className="flex flex-col">
                <label
                  htmlFor="location"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  Location &amp; Time Zone
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location)
                      setErrors((prev) => ({ ...prev, location: undefined }));
                  }}
                  placeholder="e.g. Bengaluru, India (IST) or London, UK (GMT)"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.location}
                  aria-describedby={
                    errors.location ? "location-error" : undefined
                  }
                  className={`h-[48px] w-full rounded-full bg-[#F3F3F3] px-5 text-sm sm:text-[15px] text-[#141413] placeholder-[#8A8A8A] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                    errors.location
                      ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                      : ""
                  }`}
                />
                {errors.location && (
                  <span
                    id="location-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.location}
                  </span>
                )}
              </div>

              {/* 4. Portfolio / Website URL */}
              <div className="flex flex-col">
                <label
                  htmlFor="portfolioUrl"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  Portfolio / Website URL
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <input
                  type="url"
                  id="portfolioUrl"
                  value={portfolioUrl}
                  onChange={(e) => {
                    setPortfolioUrl(e.target.value);
                    if (errors.portfolioUrl)
                      setErrors((prev) => ({
                        ...prev,
                        portfolioUrl: undefined,
                      }));
                  }}
                  onBlur={() => {
                    if (
                      portfolioUrl.trim() &&
                      !/^https?:\/\//i.test(portfolioUrl.trim())
                    ) {
                      setPortfolioUrl(`https://${portfolioUrl.trim()}`);
                    }
                  }}
                  placeholder="https://behance.net/you, dribbble, or portfolio website"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.portfolioUrl}
                  aria-describedby={
                    errors.portfolioUrl ? "portfolioUrl-error" : undefined
                  }
                  className={`h-[48px] w-full rounded-full bg-[#F3F3F3] px-5 text-sm sm:text-[15px] text-[#141413] placeholder-[#8A8A8A] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                    errors.portfolioUrl
                      ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                      : ""
                  }`}
                />
                {errors.portfolioUrl && (
                  <span
                    id="portfolioUrl-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.portfolioUrl}
                  </span>
                )}
              </div>

              {/* 5. Secondary Social / Proof Link */}
              <div className="flex flex-col">
                <label
                  htmlFor="secondaryUrl"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  Secondary Link (LinkedIn, X, Instagram, or Figma)
                </label>
                <input
                  type="url"
                  id="secondaryUrl"
                  value={secondaryUrl}
                  onChange={(e) => {
                    setSecondaryUrl(e.target.value);
                    if (errors.secondaryUrl)
                      setErrors((prev) => ({
                        ...prev,
                        secondaryUrl: undefined,
                      }));
                  }}
                  onBlur={() => {
                    if (
                      secondaryUrl.trim() &&
                      !/^https?:\/\//i.test(secondaryUrl.trim())
                    ) {
                      setSecondaryUrl(`https://${secondaryUrl.trim()}`);
                    }
                  }}
                  placeholder="https://linkedin.com/in/you or figma.com/@you"
                  aria-invalid={!!errors.secondaryUrl}
                  aria-describedby={
                    errors.secondaryUrl ? "secondaryUrl-error" : undefined
                  }
                  className={`h-[48px] w-full rounded-full bg-[#F3F3F3] px-5 text-sm sm:text-[15px] text-[#141413] placeholder-[#8A8A8A] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                    errors.secondaryUrl
                      ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                      : ""
                  }`}
                />
                {errors.secondaryUrl && (
                  <span
                    id="secondaryUrl-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.secondaryUrl}
                  </span>
                )}
              </div>

              {/* 6. Primary Creative Specialty */}
              <div className="flex flex-col">
                <label
                  htmlFor="craftSpecialty"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  Primary Creative Specialty
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="craftSpecialty"
                    value={craftSpecialty}
                    onChange={(e) => {
                      setCraftSpecialty(e.target.value);
                      if (errors.craftSpecialty)
                        setErrors((prev) => ({
                          ...prev,
                          craftSpecialty: undefined,
                        }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.craftSpecialty}
                    aria-describedby={
                      errors.craftSpecialty ? "craftSpecialty-error" : undefined
                    }
                    className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      !craftSpecialty ? "text-[#8A8A8A]" : "text-[#141413]"
                    } ${
                      errors.craftSpecialty
                        ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select your primary focus
                    </option>
                    <option value="Paid Social Ad Creative (Static & Carousels)">
                      Paid Social Ad Creative (Static &amp; Carousels)
                    </option>
                    <option value="Motion Graphics & 9:16 Video Hooks">
                      Motion Graphics &amp; 9:16 Video Hooks
                    </option>
                    <option value="Direct-Response Ad Copywriting">
                      Direct-Response Ad Copywriting
                    </option>
                    <option value="3D & Product CGI Visuals">
                      3D &amp; Product CGI Visuals
                    </option>
                    <option value="Landing Page & Conversion Web Design">
                      Landing Page &amp; Conversion Web Design
                    </option>
                    <option value="Full-Stack Ad Creative (Design + Copy)">
                      Full-Stack Ad Creative (Design + Copy)
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
                {errors.craftSpecialty && (
                  <span
                    id="craftSpecialty-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.craftSpecialty}
                  </span>
                )}
              </div>

              {/* 7. Primary Software & Toolset */}
              <div className="flex flex-col">
                <label
                  htmlFor="primaryTools"
                  className="mb-1.5 text-[15px] font-medium text-[#141413]"
                >
                  Primary Software / Toolset
                  <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                    (required)
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="primaryTools"
                    value={primaryTools}
                    onChange={(e) => {
                      setPrimaryTools(e.target.value);
                      if (errors.primaryTools)
                        setErrors((prev) => ({
                          ...prev,
                          primaryTools: undefined,
                        }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.primaryTools}
                    aria-describedby={
                      errors.primaryTools ? "primaryTools-error" : undefined
                    }
                    className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                      !primaryTools ? "text-[#8A8A8A]" : "text-[#141413]"
                    } ${
                      errors.primaryTools
                        ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select your primary toolset
                    </option>
                    <option value="Figma, Adobe Photoshop & Illustrator">
                      Figma, Adobe Photoshop &amp; Illustrator
                    </option>
                    <option value="After Effects, Premiere Pro & CapCut">
                      After Effects, Premiere Pro &amp; CapCut
                    </option>
                    <option value="Blender, Cinema 4D & Octane">
                      Blender, Cinema 4D &amp; Octane
                    </option>
                    <option value="Generative AI (Midjourney, Runway, ComfyUI)">
                      Generative AI (Midjourney, Runway, ComfyUI)
                    </option>
                    <option value="Direct-Response Copywriting (Notion, Google Docs, Meta Ad Library)">
                      Direct-Response Copywriting (Notion, Google Docs, Ad Library)
                    </option>
                    <option value="Full Creative Suite (Figma + Motion + AI)">
                      Full Creative Suite (Figma + Motion + AI)
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
                {errors.primaryTools && (
                  <span
                    id="primaryTools-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.primaryTools}
                  </span>
                )}
              </div>

              {/* 8 & 9: Experience Level & Weekly Availability */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="flex flex-col">
                  <label
                    htmlFor="experienceLevel"
                    className="mb-1.5 text-[15px] font-medium text-[#141413]"
                  >
                    Experience Level
                    <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                      (required)
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="experienceLevel"
                      value={experienceLevel}
                      onChange={(e) => {
                        setExperienceLevel(e.target.value);
                        if (errors.experienceLevel)
                          setErrors((prev) => ({
                            ...prev,
                            experienceLevel: undefined,
                          }));
                      }}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.experienceLevel}
                      aria-describedby={
                        errors.experienceLevel
                          ? "experienceLevel-error"
                          : undefined
                      }
                      className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                        !experienceLevel ? "text-[#8A8A8A]" : "text-[#141413]"
                      } ${
                        errors.experienceLevel
                          ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                          : ""
                      }`}
                    >
                      <option value="" disabled>
                        Select experience
                      </option>
                      <option value="1 – 2 years">1 – 2 years</option>
                      <option value="3 – 5 years (Mid-Level)">
                        3 – 5 years (Mid-Level)
                      </option>
                      <option value="5+ years (Senior Specialist)">
                        5+ years (Senior Specialist)
                      </option>
                      <option value="Art Director / Creative Lead">
                        Art Director / Creative Lead
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
                  {errors.experienceLevel && (
                    <span
                      id="experienceLevel-error"
                      role="alert"
                      className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                    >
                      {errors.experienceLevel}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="weeklyAvailability"
                    className="mb-1.5 text-[15px] font-medium text-[#141413]"
                  >
                    Weekly Availability
                    <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                      (required)
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="weeklyAvailability"
                      value={weeklyAvailability}
                      onChange={(e) => {
                        setWeeklyAvailability(e.target.value);
                        if (errors.weeklyAvailability)
                          setErrors((prev) => ({
                            ...prev,
                            weeklyAvailability: undefined,
                          }));
                      }}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.weeklyAvailability}
                      aria-describedby={
                        errors.weeklyAvailability
                          ? "weeklyAvailability-error"
                          : undefined
                      }
                      className={`h-[48px] w-full appearance-none rounded-full bg-[#F3F3F3] px-5 pr-11 text-sm sm:text-[15px] text-[#141413] outline-none transition-all focus:ring-2 focus:ring-[#43B97F] ${
                        !weeklyAvailability
                          ? "text-[#8A8A8A]"
                          : "text-[#141413]"
                      } ${
                        errors.weeklyAvailability
                          ? "border border-[#D92D20] ring-2 ring-[#D92D20]"
                          : ""
                      }`}
                    >
                      <option value="" disabled>
                        Select weekly capacity
                      </option>
                      <option value="5 – 10 hours/week (Ad-hoc projects)">
                        5 – 10 hours/week (Ad-hoc)
                      </option>
                      <option value="10 – 20 hours/week (Part-time)">
                        10 – 20 hours/week (Part-time)
                      </option>
                      <option value="20 – 40 hours/week (Full availability)">
                        20 – 40 hours/week (Full-time)
                      </option>
                      <option value="Flexible sprint / milestone basis">
                        Flexible project sprint basis
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
                  {errors.weeklyAvailability && (
                    <span
                      id="weeklyAvailability-error"
                      role="alert"
                      className="mt-1.5 text-xs font-semibold text-[#D92D20]"
                    >
                      {errors.weeklyAvailability}
                    </span>
                  )}
                </div>
              </div>

              {/* 10. Background Notes & Notable Work */}
              <div className="flex flex-col">
                <label
                  htmlFor="notes"
                  className="text-[15px] font-medium text-[#141413]"
                >
                  Notable Campaign Wins &amp; Creative Background
                </label>
                <p className="mb-2 mt-0.5 text-xs text-[#6B6B6B]">
                  Optional. Tell us about the ads you love creating and any
                  specific CTR, ROAS, or conversion results you&apos;ve helped
                  achieve.
                </p>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] w-full resize-y rounded-2xl bg-[#F3F3F3] p-4 text-sm sm:text-[15px] text-[#141413] placeholder-[#8A8A8A] outline-none transition-all focus:ring-2 focus:ring-[#43B97F]"
                />
              </div>

              {/* 11. Upload Resume / PDF Deck (Optional) */}
              <div className="flex flex-col">
                <label className="text-[15px] font-medium text-[#141413]">
                  Upload Resume or Work Samples (optional)
                </label>
                <p className="mb-2 mt-0.5 text-xs text-[#6B6B6B]">
                  PDF, PNG, JPG, or ZIP (max 5 files, 10MB each).
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
                    PDF resume, portfolio slides, or creative samples
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

              {/* 12. Terms Agreement Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="termsAgreed"
                    checked={termsAgreed}
                    onChange={(e) => {
                      setTermsAgreed(e.target.checked);
                      if (errors.termsAgreed)
                        setErrors((prev) => ({
                          ...prev,
                          termsAgreed: undefined,
                        }));
                    }}
                    className="mt-1 h-4 w-4 rounded border-[#141413]/30 text-[#43B97F] focus:ring-[#43B97F]"
                  />
                  <span className="text-xs leading-relaxed text-[#4A4945]">
                    I confirm that the portfolio samples and links provided are
                    my own original creative work and may be evaluated by the
                    AdsPolisher review team.
                  </span>
                </label>
                {errors.termsAgreed && (
                  <span
                    id="termsAgreed-error"
                    role="alert"
                    className="mt-1 block text-xs font-semibold text-[#D92D20]"
                  >
                    {errors.termsAgreed}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="flex h-[56px] w-full items-center justify-center rounded-full bg-[#43B97F] text-base font-semibold text-white shadow-sm transition-all hover:bg-[#38A56F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting Application…" : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
