// src/hooks/useShiftForm.js
import { useCallback, useState } from "react";

const initialFormData = {
  title: "",
  role: "",
  typeOfShift: [],
  startTime: "",
  finishTime: "",
  numOfShiftsPerDay: 1,
  location: "",
  date: "",
};

export const useShiftForm = (initialData = initialFormData) => {
  const [formData, setFormData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;

      if (type === "checkbox") {
        const currentTypes = formData.typeOfShift || [];
        if (checked) {
          setFormData((prev) => ({
            ...prev,
            typeOfShift: [...currentTypes, value],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            typeOfShift: currentTypes.filter((type) => type !== value),
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [formData.typeOfShift, errors]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.finishTime) {
      newErrors.finishTime = "Finish time is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    // Validate time logic
    if (formData.startTime && formData.finishTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.finishTime}`);

      if (start >= end) {
        newErrors.finishTime = "Finish time must be after start time";
      }
    }

    // Validate date is not in the past
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitting(false);
  }, []);

  const setFormDataFromShift = useCallback((shift) => {
    setFormData({
      title: shift.title || "",
      role: shift.role || "",
      typeOfShift: shift.typeOfShift || [],
      startTime: shift.startTime || "",
      finishTime: shift.finishTime || "",
      numOfShiftsPerDay: shift.numOfShiftsPerDay || 1,
      location: shift.location?._id || "",
      date: shift.date ? new Date(shift.date).toISOString().split("T")[0] : "",
    });
  }, []);

  const calculateDuration = useCallback(() => {
    if (formData.startTime && formData.finishTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.finishTime}`);
      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours.toFixed(1);
    }
    return "0.0";
  }, [formData.startTime, formData.finishTime]);

  return {
    formData,
    setFormData,
    submitting,
    setSubmitting,
    errors,
    setErrors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormDataFromShift,
    calculateDuration,
  };
};
