// src/hooks/useLocations.js
import { useCallback, useEffect, useState } from "react";
import axios from "../Axios/axios";

export const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("/locations");
      setLocations(data);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load locations"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    loading,
    error,
    fetchLocations,
  };
};
