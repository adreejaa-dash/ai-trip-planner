"use client";

import { useState } from "react";
import { TripPlannerFormData, TripPlannerFormErrors, TravelStyle, BudgetLevel, AccommodationType } from "@/types";

const DEFAULT_FORM: TripPlannerFormData = {
  destination: "",
  origin: "",
  startDate: "",
  endDate: "",
  numTravelers: 1,
  preferences: {
    styles: [],
    budget: "moderate",
    currency: "USD",
    accommodation: [],
    transport: [],
  },
  additionalNotes: "",
};

function validate(data: TripPlannerFormData): TripPlannerFormErrors {
  const errors: TripPlannerFormErrors = {};

  if (!data.destination.trim()) {
    errors.destination = "Destination is required.";
  }
  if (!data.startDate) {
    errors.startDate = "Start date is required.";
  }
  if (!data.endDate) {
    errors.endDate = "End date is required.";
  } else if (data.startDate && data.endDate <= data.startDate) {
    errors.endDate = "End date must be after start date.";
  }
  if (data.numTravelers < 1 || data.numTravelers > 20) {
    errors.numTravelers = "Number of travelers must be between 1 and 20.";
  }

  return errors;
}

export function useTripPlannerForm() {
  const [form, setForm] = useState<TripPlannerFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<TripPlannerFormErrors>({});
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;

  const setField = <K extends keyof TripPlannerFormData>(
    key: K,
    value: TripPlannerFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const toggleStyle = (style: TravelStyle) => {
    setForm((prev) => {
      const styles = prev.preferences.styles.includes(style)
        ? prev.preferences.styles.filter((s) => s !== style)
        : [...prev.preferences.styles, style];
      return { ...prev, preferences: { ...prev.preferences, styles } };
    });
  };

  const setBudget = (budget: BudgetLevel) => {
    setForm((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, budget },
    }));
  };

  const toggleAccommodation = (type: AccommodationType) => {
    setForm((prev) => {
      const accommodation = prev.preferences.accommodation.includes(type)
        ? prev.preferences.accommodation.filter((a) => a !== type)
        : [...prev.preferences.accommodation, type];
      return { ...prev, preferences: { ...prev.preferences, accommodation } };
    });
  };

  const nextStep = () => {
    if (step === 1) {
      const errs = validate(form);
      const step1Fields: (keyof TripPlannerFormErrors)[] = [
        "destination", "startDate", "endDate", "numTravelers",
      ];
      const step1Errors = Object.fromEntries(
        step1Fields.filter((f) => errs[f]).map((f) => [f, errs[f]])
      );
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        return;
      }
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (): boolean => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const reset = () => {
    setForm(DEFAULT_FORM);
    setErrors({});
    setStep(1);
  };

  return {
    form,
    errors,
    step,
    totalSteps: TOTAL_STEPS,
    setField,
    toggleStyle,
    setBudget,
    toggleAccommodation,
    nextStep,
    prevStep,
    handleSubmit,
    reset,
  };
}
