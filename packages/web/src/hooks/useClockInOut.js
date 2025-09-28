// src/hooks/useClockInOut.js
import { useCallback, useState } from "react";
import axios from "../Axios/axios";

export const useClockInOut = (userToken) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clockIn = useCallback(
    async (shiftId) => {
      if (!userToken) {
        setError("Not authenticated");
        return { success: false, error: "Not authenticated" };
      }

      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.post(
          `/shifts/${shiftId}/clock-in`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        return { success: true, data };
      } catch (err) {
        console.error("Error clocking in:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to clock in";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [userToken]
  );

  const clockOut = useCallback(
    async (shiftId) => {
      if (!userToken) {
        setError("Not authenticated");
        return { success: false, error: "Not authenticated" };
      }

      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.post(
          `/shifts/${shiftId}/clock-out`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        return { success: true, data };
      } catch (err) {
        console.error("Error clocking out:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to clock out";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [userToken]
  );

  const formatTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const canClockIn = (shift) => {
    if (!shift) return false;

    // Check if already clocked in
    if (shift.isClockedIn) return false;

    // Check if shift is completed (past end time)
    const now = new Date();
    const shiftDate = new Date(shift.date);
    const endTime = new Date(shiftDate);
    const [endHour, endMinute] = shift.finishTime.split(":").map(Number);
    endTime.setHours(endHour, endMinute, 0, 0);

    // If shift is completed, cannot clock in
    if (now > endTime) return false;

    // Check if it's the correct day
    const today = new Date();
    const isSameDay = today.toDateString() === shiftDate.toDateString();
    if (!isSameDay) return false;

    // Check if it's within 5 minutes before shift start time
    const startTime = new Date(shiftDate);
    const [startHour, startMinute] = shift.startTime.split(":").map(Number);
    startTime.setHours(startHour, startMinute, 0, 0);

    // Calculate 5 minutes before start time
    const fiveMinutesBeforeStart = new Date(
      startTime.getTime() - 5 * 60 * 1000
    );

    // Can clock in if current time is within 5 minutes before start time or after start time
    return now >= fiveMinutesBeforeStart;
  };

  const canClockOut = (shift) => {
    if (!shift) return false;

    // Must be currently clocked in
    if (!shift.isClockedIn) return false;

    // Check if it's within 5 minutes before shift end time
    const now = new Date();
    const shiftDate = new Date(shift.date);
    const endTime = new Date(shiftDate);
    const [endHour, endMinute] = shift.finishTime.split(":").map(Number);
    endTime.setHours(endHour, endMinute, 0, 0);

    // Calculate 5 minutes before end time
    const fiveMinutesBeforeEnd = new Date(endTime.getTime() - 5 * 60 * 1000);

    // Can clock out if current time is within 5 minutes before end time or after end time
    return now >= fiveMinutesBeforeEnd;
  };

  return {
    clockIn,
    clockOut,
    loading,
    error,
    setError,
    formatTime,
    formatDuration,
    canClockIn,
    canClockOut,
  };
};
