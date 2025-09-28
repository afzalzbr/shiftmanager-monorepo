// src/hooks/useShiftStatus.js
import { useCallback } from "react";

export const useShiftStatus = () => {
  const getShiftStatus = useCallback((shift) => {
    if (!shift) return "Scheduled";

    const now = new Date();
    const shiftDate = new Date(shift.date);
    const startTime = new Date(shiftDate);
    const [startHour, startMinute] = shift.startTime.split(":").map(Number);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(shiftDate);
    const [endHour, endMinute] = shift.finishTime.split(":").map(Number);
    endTime.setHours(endHour, endMinute, 0, 0);

    if (now >= startTime && now <= endTime) {
      return "In Progress";
    } else if (now > endTime) {
      return "Completed";
    } else {
      return "Scheduled";
    }
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "In Progress":
        return "bg-gray-100 text-gray-800";
      case "Completed":
        return "bg-black text-white";
      case "Scheduled":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  }, []);

  const calculateTimeRemaining = useCallback((shift) => {
    if (!shift) return 0;

    const now = new Date();
    const shiftDate = new Date(shift.date);
    const endTime = new Date(shiftDate);
    const [endHour, endMinute] = shift.finishTime.split(":").map(Number);
    endTime.setHours(endHour, endMinute, 0, 0);

    const diffMs = endTime - now;
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  }, []);

  return {
    getShiftStatus,
    getStatusColor,
    calculateTimeRemaining,
  };
};
