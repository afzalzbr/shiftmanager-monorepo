// src/hooks/useClipboard.js
import { useCallback } from "react";

export const useClipboard = (onShiftCreate) => {
  const copyToClipboard = useCallback(async (data) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      return { success: false, error: error.message };
    }
  }, []);

  const pasteFromClipboard = useCallback(
    async (targetDate) => {
      try {
        const text = await navigator.clipboard.readText();
        const shift = JSON.parse(text);
        const newShift = {
          ...shift,
          _id: undefined, // Remove ID to create new shift
          date: targetDate.toISOString().split("T")[0],
        };
        await onShiftCreate(newShift);
        return { success: true };
      } catch (error) {
        console.error("Error pasting from clipboard:", error);
        return { success: false, error: error.message };
      }
    },
    [onShiftCreate]
  );

  const handleKeyDown = useCallback(
    (e, shift) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        copyToClipboard(shift);
      }
    },
    [copyToClipboard]
  );

  const handleKeyUp = useCallback(
    (e, day) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault();
        pasteFromClipboard(day.date);
      }
    },
    [pasteFromClipboard]
  );

  return {
    copyToClipboard,
    pasteFromClipboard,
    handleKeyDown,
    handleKeyUp,
  };
};
