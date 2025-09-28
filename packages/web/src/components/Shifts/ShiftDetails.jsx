import { ArrowLeft, Clock, MapPin } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import {
  useClockInOut,
  useDateFormatter,
  useShiftStatus,
  useShifts,
} from "../../hooks";
import { getStatusVariant } from "../../lib/utils";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ConfirmationModal } from "../ui/confirmation-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function ShiftDetails() {
  const { userToken, user } = useContext(TokenContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { formatFullDate, formatTime } = useDateFormatter();
  const { getShiftStatus } = useShiftStatus();
  const { deleteShift, getShiftById } = useShifts(userToken, user?._id);
  const {
    clockIn,
    clockOut,
    loading: clockLoading,
    error: clockError,
    setError: setClockError,
    formatTime: formatClockTime,
    formatDuration,
    canClockIn,
    canClockOut,
  } = useClockInOut(userToken);

  useEffect(() => {
    const fetchShift = async () => {
      if (!userToken || !id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await getShiftById(id);
      if (result.success) {
        setShift(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchShift();
  }, [userToken, id, getShiftById]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setError(null);

    const result = await deleteShift(id);
    if (result.success) {
      setShowDeleteModal(false);
      navigate("/"); // Redirect to dashboard after deletion
    } else {
      setError(result.error);
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    navigate(`/shifts/${id}/edit`);
  };

  // Check if shift can be edited or deleted
  const canEditOrDelete = () => {
    if (!shift) return false;
    const status = getShiftStatus(shift);
    return status === "Scheduled";
  };

  const getDisabledReason = () => {
    if (!shift) return "Shift not found";
    const status = getShiftStatus(shift);
    if (status === "In Progress") {
      return "Cannot edit or delete a shift that is currently in progress";
    }
    if (status === "Completed") {
      return "Cannot edit or delete a completed shift";
    }
    return "";
  };

  const handleClockIn = async () => {
    if (!shift) return;

    setClockError(null);
    const result = await clockIn(shift._id);

    if (result.success) {
      // Update the shift data with the new clock in information
      setShift(result.data.shift);
    }
  };

  const handleClockOut = async () => {
    if (!shift) return;

    setClockError(null);
    const result = await clockOut(shift._id);

    if (result.success) {
      // Update the shift data with the new clock out information
      setShift(result.data.shift);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="container max-w-4xl py-8">
        <Alert>
          <AlertDescription>Shift not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const status = getShiftStatus(shift);

  // Helper function to get clock-in availability message
  const getClockInMessage = (shift) => {
    if (shift?.isClockedIn) {
      return "Already clocked in";
    }

    if (status === "Completed") {
      return "Shift completed - cannot clock in";
    }

    if (canClockIn(shift)) {
      return "Ready to clock in";
    }

    // Calculate when clock-in will be available
    const now = new Date();
    const shiftDate = new Date(shift.date);
    const startTime = new Date(shiftDate);
    const [startHour, startMinute] = shift.startTime.split(":").map(Number);
    startTime.setHours(startHour, startMinute, 0, 0);

    const fiveMinutesBeforeStart = new Date(
      startTime.getTime() - 5 * 60 * 1000
    );
    const timeUntilClockIn = fiveMinutesBeforeStart - now;

    if (timeUntilClockIn > 0) {
      const hours = Math.floor(timeUntilClockIn / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timeUntilClockIn % (1000 * 60 * 60)) / (1000 * 60)
      );

      if (hours > 0) {
        return `Clock in available in ${hours}h ${minutes}m`;
      } else {
        return `Clock in available in ${minutes}m`;
      }
    }

    return "Cannot clock in yet";
  };

  // Helper function to get clock-out availability message
  const getClockOutMessage = (shift) => {
    if (!shift?.isClockedIn) {
      return "Must clock in first";
    }

    if (canClockOut(shift)) {
      return "Ready to clock out";
    }

    // Calculate when clock-out will be available
    const now = new Date();
    const shiftDate = new Date(shift.date);
    const endTime = new Date(shiftDate);
    const [endHour, endMinute] = shift.finishTime.split(":").map(Number);
    endTime.setHours(endHour, endMinute, 0, 0);

    const fiveMinutesBeforeEnd = new Date(endTime.getTime() - 5 * 60 * 1000);
    const timeUntilClockOut = fiveMinutesBeforeEnd - now;

    if (timeUntilClockOut > 0) {
      const hours = Math.floor(timeUntilClockOut / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timeUntilClockOut % (1000 * 60 * 60)) / (1000 * 60)
      );

      if (hours > 0) {
        return `Clock out available in ${hours}h ${minutes}m`;
      } else {
        return `Clock out available in ${minutes}m`;
      }
    }

    return "Cannot clock out yet";
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 mb-8 bg-white w-full border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Shift Details</h1>
        </div>

        {/* Three Card Layout */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-2/3">
            {/* Morning Shift Card */}
            <Card className="h-fit">
              <CardHeader className="relative">
                <CardTitle className="text-xl font-semibold">
                  {shift.title || "Morning Shift"}
                  {shift.date && (
                    <p className="font-medium text-xs text-muted-foreground">
                      {formatFullDate(shift.date)}
                    </p>
                  )}
                </CardTitle>
                <div className="absolute top-4 right-4">
                  <Badge variant={getStatusVariant(status)} className="text-xs">
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatTime(shift.startTime)} -{" "}
                    {formatTime(shift.finishTime)}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{shift.location?.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {shift.location?.address}, {shift.location?.postCode}
                  </p>
                  <p className="text-sm text-muted-foreground ml-6">
                    Distance: 4533m away
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Clock In/Out Card */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Clock In/Out
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Manage your shift attendance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {clockError && (
                  <Alert variant="destructive">
                    <AlertDescription>{clockError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1">
                  <label className="text-xs text-black font-bold">
                    Clock In
                  </label>
                  <div className="relative">
                    <div
                      className={`rounded-md text-xs p-2 ${
                        shift?.isClockedIn
                          ? "bg-green-100 text-green-800 text-xs border border-green-200"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {shift?.isClockedIn ? "Clocked In" : "Not Clocked In"}
                    </div>
                    {shift?.clockInTime && (
                      <Badge className="absolute top-2 right-2 text-xs font-normal text-muted-foreground">
                        {formatClockTime(shift.clockInTime)}
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      shift?.isClockedIn
                        ? "text-green-600"
                        : canClockIn(shift)
                        ? "text-blue-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {getClockInMessage(shift)}
                  </p>
                  {canClockIn(shift) && (
                    <Button
                      onClick={handleClockIn}
                      disabled={clockLoading}
                      className="w-full"
                      size="sm"
                    >
                      {clockLoading ? "Clocking In..." : "Clock In"}
                    </Button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-black font-bold">
                    Clock Out
                  </label>
                  <div
                    className={`rounded-md text-xs p-2 ${
                      shift?.isClockedIn
                        ? "bg-orange-100 text-orange-800 border border-orange-200"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {shift?.isClockedIn ? "Clock Out" : "Not Available"}
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      shift?.isClockedIn
                        ? canClockOut(shift)
                          ? "text-orange-600"
                          : "text-muted-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {getClockOutMessage(shift)}
                  </p>
                  {canClockOut(shift) && (
                    <Button
                      onClick={handleClockOut}
                      disabled={clockLoading}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      {clockLoading ? "Clocking Out..." : "Clock Out"}
                    </Button>
                  )}
                </div>

                {shift?.totalHoursWorked > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-medium">
                      Total Hours Worked
                    </label>
                    <div className="bg-blue-100 text-blue-800 rounded-md p-3 border border-blue-200">
                      {formatDuration(shift.totalHoursWorked)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shift Management Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Shift Management
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Administrative actions for this shift
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-4">
                  {canEditOrDelete() ? (
                    <Button
                      variant="outline"
                      onClick={handleEdit}
                      size="sm"
                      className="flex items-center gap-2 font-semibold text-xs"
                    >
                      Edit Shift
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex hover:cursor-not-allowed items-center gap-2 font-semibold text-xs opacity-50"
                        >
                          Edit Shift
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{getDisabledReason()}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {canEditOrDelete() ? (
                    <Button
                      variant="destructive"
                      onClick={handleDeleteClick}
                      disabled={deleting}
                      size="sm"
                      className="flex items-center gap-2 font-semibold text-xs"
                    >
                      Delete Shift
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex opacity-50 cursor-not-allowed items-center gap-2 font-semibold text-xs"
                        >
                          Delete Shift
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{getDisabledReason()}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Shift"
          description={`Are you sure you want to delete "${
            shift?.title || "this shift"
          }"? This action cannot be undone.`}
          confirmText="Delete Shift"
          cancelText="Cancel"
          variant="destructive"
          loading={deleting}
        />
      </div>
    </TooltipProvider>
  );
}
