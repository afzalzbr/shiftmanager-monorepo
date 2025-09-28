// src/hooks/useDragDrop.js
import { useCallback, useState } from "react";

export const useDragDrop = (onShiftUpdate, onShiftCreate) => {
  const [draggedShift, setDraggedShift] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [dragOverTime, setDragOverTime] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateShiftDuration = useCallback((startTime, endTime) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    return (endHour - startHour) * 60 + (endMin - startMin);
  }, []);

  const handleDragStart = useCallback((e, shift) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedShift(shift);
    setIsDragging(true);

    // Create a custom drag image
    const dragImage = document.createElement("div");
    dragImage.innerHTML = `
      <div style="
        background: #3B82F6;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      ">
        ${shift.startTime} - ${shift.finishTime} | ${shift.title || "Shift"}
      </div>
    `;
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    // Clean up drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  }, []);

  const handleDragStartWithCopy = useCallback((e, shift) => {
    if (e.ctrlKey || e.metaKey) {
      e.dataTransfer.effectAllowed = "copy";
      setDraggedShift({ ...shift, isCopy: true });
    } else {
      e.dataTransfer.effectAllowed = "move";
      setDraggedShift(shift);
    }
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedShift(null);
    setDragOverDate(null);
    setDragOverTime(null);
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e, day, timeSlot = null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDate(day);
    setDragOverTime(timeSlot);
  }, []);

  const handleDrop = useCallback(
    async (e, targetDay, targetTimeSlot = null) => {
      e.preventDefault();

      if (!draggedShift || !targetDay) return;

      const targetDate = targetDay.date;
      const originalDate = new Date(draggedShift.date);

      // Calculate new times if dropped on a time slot
      let newStartTime = draggedShift.startTime;
      let newFinishTime = draggedShift.finishTime;

      if (targetTimeSlot) {
        const [hours, minutes] = targetTimeSlot.split(":").map(Number);
        const duration = calculateShiftDuration(
          draggedShift.startTime,
          draggedShift.finishTime
        );

        newStartTime = targetTimeSlot;
        const endTime = new Date();
        endTime.setHours(hours, minutes + duration, 0, 0);
        newFinishTime = endTime.toTimeString().slice(0, 5);
      }

      // Check if it's a different date or time
      const isDateChanged =
        targetDate.toDateString() !== originalDate.toDateString();
      const isTimeChanged =
        targetTimeSlot && targetTimeSlot !== draggedShift.startTime;

      if (isDateChanged || isTimeChanged) {
        try {
          const updatedShift = {
            ...draggedShift,
            date: targetDate.toISOString().split("T")[0],
            startTime: newStartTime,
            finishTime: newFinishTime,
          };

          if (isDateChanged || draggedShift.isCopy) {
            // Create a new shift for the new date or copy
            await onShiftCreate(updatedShift);
          } else {
            // Update existing shift
            await onShiftUpdate(draggedShift._id, updatedShift);
          }
        } catch (error) {
          console.error("Error updating shift:", error);
        }
      }

      handleDragEnd();
    },
    [
      draggedShift,
      calculateShiftDuration,
      onShiftUpdate,
      onShiftCreate,
      handleDragEnd,
    ]
  );

  const generateTimeSlots = useCallback((day) => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, []);

  return {
    draggedShift,
    dragOverDate,
    dragOverTime,
    isDragging,
    handleDragStart,
    handleDragStartWithCopy,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    generateTimeSlots,
  };
};
