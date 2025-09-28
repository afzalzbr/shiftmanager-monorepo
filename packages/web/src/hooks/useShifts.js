// src/hooks/useShifts.js
import { useCallback, useEffect, useState } from "react";
import axios from "../Axios/axios";

export const useShifts = (userToken, userId) => {
  const [shifts, setShifts] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Helper function to determine shift status
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

  // Filter shifts based on status
  const filterShifts = useCallback(
    (shifts, filter) => {
      if (filter === "all") return shifts;
      return shifts.filter((shift) => getShiftStatus(shift) === filter);
    },
    [getShiftStatus]
  );

  const fetchShifts = useCallback(async () => {
    if (!userToken || !userId) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("/shifts", {
        params: { userId },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setShifts(data);
      setFilteredShifts(filterShifts(data, statusFilter));
    } catch (err) {
      console.error("Error fetching shifts:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load shifts"
      );
    } finally {
      setLoading(false);
    }
  }, [userToken, userId, filterShifts, statusFilter]);

  // Handle filter change
  const handleStatusFilterChange = useCallback(
    (newFilter) => {
      setStatusFilter(newFilter);
      setFilteredShifts(filterShifts(shifts, newFilter));
    },
    [shifts, filterShifts]
  );

  const createShift = useCallback(
    async (shiftData) => {
      try {
        const { data } = await axios.post("/shifts", shiftData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const newShifts = [...shifts, data];
        setShifts(newShifts);
        setFilteredShifts(filterShifts(newShifts, statusFilter));
        return { success: true, data };
      } catch (err) {
        console.error("Error creating shift:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to create shift";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [userToken, shifts, filterShifts, statusFilter]
  );

  const updateShift = useCallback(
    async (shiftId, shiftData) => {
      try {
        const { data } = await axios.put(`/shifts/${shiftId}`, shiftData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const newShifts = shifts.map((shift) =>
          shift._id === shiftId ? data : shift
        );
        setShifts(newShifts);
        setFilteredShifts(filterShifts(newShifts, statusFilter));
        return { success: true, data };
      } catch (err) {
        console.error("Error updating shift:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to update shift";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [userToken, shifts, filterShifts, statusFilter]
  );

  const deleteShift = useCallback(
    async (shiftId) => {
      try {
        await axios.delete(`/shifts/${shiftId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const newShifts = shifts.filter((shift) => shift._id !== shiftId);
        setShifts(newShifts);
        setFilteredShifts(filterShifts(newShifts, statusFilter));
        return { success: true };
      } catch (err) {
        console.error("Error deleting shift:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to delete shift";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [userToken, shifts, filterShifts, statusFilter]
  );

  const getShiftById = useCallback(
    async (shiftId) => {
      try {
        const { data } = await axios.get(`/shifts/${shiftId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        return { success: true, data };
      } catch (err) {
        console.error("Error fetching shift:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to load shift";
        return { success: false, error: errorMessage };
      }
    },
    [userToken]
  );

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  return {
    shifts: filteredShifts,
    allShifts: shifts,
    loading,
    error,
    statusFilter,
    fetchShifts,
    createShift,
    updateShift,
    deleteShift,
    getShiftById,
    setError,
    handleStatusFilterChange,
    getShiftStatus,
  };
};
