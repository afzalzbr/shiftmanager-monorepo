import { Clock } from "lucide-react";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import { getStatusVariant } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

// Setup moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

export default function CalendarView({
  shifts,
  formatDate,
  formatTime,
  getShiftStatus,
  statusFilter,
  handleStatusFilterChange,
  allShifts,
}) {
  const navigate = useNavigate();
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  // Convert shifts to events for react-big-calendar
  const events = useMemo(() => {
    return shifts.map((shift) => {
      const startDate = moment(shift.date).format("YYYY-MM-DD");
      const startTime = moment(
        `${startDate} ${shift.startTime}`,
        "YYYY-MM-DD HH:mm"
      ).toDate();
      const endTime = moment(
        `${startDate} ${shift.finishTime}`,
        "YYYY-MM-DD HH:mm"
      ).toDate();

      return {
        id: shift._id,
        title: shift.title || "Shift",
        start: startTime,
        end: endTime,
        resource: shift,
        allDay: false,
      };
    });
  }, [shifts]);

  // Event handlers
  const handleSelectEvent = (event) => {
    navigate(`/shifts/${event.resource._id}`);
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD");
    const startTime = moment(slotInfo.start).format("HH:mm");
    const endTime = moment(slotInfo.end).format("HH:mm");

    // Navigate to create shift with pre-filled data
    navigate(
      `/shifts/create?date=${selectedDate}&startTime=${startTime}&endTime=${endTime}`
    );
  };

  const handleEventDrop = useCallback(({ event, start, end }) => {
    const shift = event.resource;
    const newDate = moment(start).format("YYYY-MM-DD");
    const newStartTime = moment(start).format("HH:mm");
    const newEndTime = moment(end).format("HH:mm");

    // Update shift with new date and times
    const updatedShift = {
      ...shift,
      date: newDate,
      startTime: newStartTime,
      finishTime: newEndTime,
    };

    // Here you would typically call an update API
    console.log("Shift moved:", updatedShift);
  }, []);

  const handleEventResize = useCallback(({ event, start, end }) => {
    const shift = event.resource;
    const newStartTime = moment(start).format("HH:mm");
    const newEndTime = moment(end).format("HH:mm");

    // Update shift with new times
    const updatedShift = {
      ...shift,
      startTime: newStartTime,
      finishTime: newEndTime,
    };

    // Here you would typically call an update API
    console.log("Shift resized:", updatedShift);
  }, []);

  const handleCreateShift = () => {
    navigate("/shifts/create");
  };

  // Custom event component
  const EventComponent = ({ event }) => {
    const shift = event.resource;

    return (
      <div className="p-1 h-full flex items-center gap-1">
        <Clock className="h-3 w-3 flex-shrink-0" />
        <span className="text-xs font-medium truncate">
          {formatTime(shift.startTime)} - {formatTime(shift.finishTime)}
        </span>
        <span className="text-xs truncate ml-1">{shift.title || "Shift"}</span>
      </div>
    );
  };

  // Custom toolbar component
  const CustomToolbar = ({ label, onNavigate, onView, view }) => (
    <div className="flex flex-col gap-4 mb-4">
      {/* Top row: Title and navigation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">{label}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("TODAY")}
          >
            Today
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => onView("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => onView("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => onView("day")}
          >
            Day
          </Button>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("PREV")}
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("NEXT")}
            >
              →
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom row: Filters */}
      <div className="flex items-center justify-end">
        {/* Filter count or Create button */}
        <div className="flex items-center gap-4">
          {statusFilter !== "all" && (
            <p className="text-xs text-muted-foreground">
              Showing {shifts.length} of {allShifts.length} shifts
            </p>
          )}
          {shifts.length === 0 && (
            <Button onClick={handleCreateShift} size="sm">
              Create Shift
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar View</CardTitle>
        <CardDescription>
          Your shifts displayed in calendar format.
          {shifts.length === 0 && (
            <span className="block mt-2 text-blue-600">
              No shifts found. Click on any day to create a new shift.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[800px]">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            selectable
            resizable
            draggableAccessor={() => true}
            components={{
              event: EventComponent,
              toolbar: CustomToolbar,
            }}
            style={{ height: "100%" }}
            eventPropGetter={(event) => {
              const shift = event.resource;
              const status = getShiftStatus
                ? getStatusVariant(getShiftStatus(shift))
                : "default";

              let backgroundColor = "#000000"; // default gray
              if (status === "destructive") backgroundColor = "#ef4444"; // red
              if (status === "secondary") backgroundColor = "#3b82f6"; // blue
              if (status === "outline") backgroundColor = "#6b7280"; // gray

              return {
                style: {
                  backgroundColor,
                  borderColor: backgroundColor,
                  color: "white",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "12px",
                },
              };
            }}
            dayPropGetter={(date) => {
              const isToday = moment(date).isSame(moment(), "day");
              return {
                style: {
                  backgroundColor: isToday ? "#f0f9ff" : "transparent",
                },
              };
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
