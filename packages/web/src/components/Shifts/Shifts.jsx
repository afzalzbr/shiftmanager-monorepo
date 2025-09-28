import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import { useDateFormatter, useShifts } from "../../hooks";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CalendarView from "./CalendarView";
import TableView from "./TableView";

export default function ShiftsMain() {
  const { userToken, user } = useContext(TokenContext);
  const navigate = useNavigate();

  // Initialize view mode from localStorage
  const getInitialViewMode = () => {
    const savedView = localStorage.getItem("shiftsViewMode");
    if (savedView === "table" || savedView === "calendar") {
      return savedView;
    }
    return "table"; // default
  };

  const [viewMode, setViewMode] = useState(getInitialViewMode);

  // Custom hooks
  const {
    shifts,
    allShifts,
    loading,
    error,
    statusFilter,
    handleStatusFilterChange,
    getShiftStatus,
  } = useShifts(userToken, user?._id);

  const { formatDate, formatTime } = useDateFormatter();

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shiftsViewMode", viewMode);
  }, [viewMode]);

  // Event handlers
  const handleCreateShift = () => {
    navigate("/shifts/create");
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-destructive text-center">
            Error loading shifts: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 m-4 p-4 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Shifts</h1>
          <p className="text-muted-foreground text-xs">
            View and manage your scheduled shifts. Switch between calendar and
            table view. Your view preference is automatically saved.
          </p>
          {statusFilter !== "all" && (
            <p className="text-xs text-muted-foreground mt-1">
              Showing {shifts.length} of {allShifts.length} shifts
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            {/* <Filter className="h-4 w-4 text-muted-foreground" /> */}
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-40 h-9 text-xs font-semibold">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleCreateShift}
            size="sm"
            className="w-fit font-semibold text-xs"
          >
            Create Shift
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <Tabs
        value={viewMode}
        onValueChange={handleViewModeChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="table"
            className="flex items-center gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
          >
            Table View
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="flex items-center gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
          >
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <TableView
            shifts={shifts}
            formatDate={formatDate}
            formatTime={formatTime}
            getShiftStatus={getShiftStatus}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView
            shifts={shifts}
            formatDate={formatDate}
            formatTime={formatTime}
            getShiftStatus={getShiftStatus}
            statusFilter={statusFilter}
            handleStatusFilterChange={handleStatusFilterChange}
            allShifts={allShifts}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
