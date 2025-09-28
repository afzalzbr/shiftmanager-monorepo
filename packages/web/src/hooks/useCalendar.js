// src/hooks/useCalendar.js
import { useCallback, useMemo, useState } from "react";

export const useCalendar = (shifts = []) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const dayNames = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    []
  );

  const getCalendarData = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Create calendar grid
    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendarDays.push({
        date,
        day,
        isToday: date.toDateString() === new Date().toDateString(),
        shifts: shifts.filter((shift) => {
          const shiftDate = new Date(shift.date);
          return shiftDate.toDateString() === date.toDateString();
        }),
      });
    }

    return calendarDays;
  }, [currentDate, shifts]);

  const calendarDays = useMemo(() => getCalendarData(), [getCalendarData]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToMonth = useCallback((year, month) => {
    setCurrentDate(new Date(year, month, 1));
  }, []);

  const getCurrentMonthName = useCallback(() => {
    return monthNames[currentDate.getMonth()];
  }, [currentDate, monthNames]);

  const getCurrentYear = useCallback(() => {
    return currentDate.getFullYear();
  }, [currentDate]);

  return {
    currentDate,
    calendarDays,
    monthNames,
    dayNames,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    goToMonth,
    getCurrentMonthName,
    getCurrentYear,
  };
};
