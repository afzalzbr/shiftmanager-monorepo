import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  MapPin,
  Plus,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStatusVariant } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function TableView({
  shifts,
  formatDate,
  formatTime,
  getShiftStatus,
}) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");

  // Event handlers
  const handleViewShift = (shift) => {
    navigate(`/shifts/${shift._id}`);
  };

  const handleCreateShift = () => {
    navigate("/shifts/create");
  };

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const sortShifts = (shifts) => {
    return [...shifts].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "title":
          aValue = (a.title || "").toLowerCase();
          bValue = (b.title || "").toLowerCase();
          break;
        case "time":
          aValue = a.startTime;
          bValue = b.startTime;
          break;
        case "location":
          aValue = (a.location?.name || "").toLowerCase();
          bValue = (b.location?.name || "").toLowerCase();
          break;
        case "status":
          aValue = getShiftStatus(a);
          bValue = getShiftStatus(b);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Shifts</CardTitle>
        <CardDescription>
          Your scheduled shifts in chronological order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {shifts.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No shifts found</h3>
            <p className="text-muted-foreground mb-4">
              Click "Create Shift" to get started.
            </p>
            <Button onClick={handleCreateShift}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Shift
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("date")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Date
                    {getSortIcon("date")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("title")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Shift
                    {getSortIcon("title")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("time")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Time
                    {getSortIcon("time")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("location")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Location
                    {getSortIcon("location")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Status
                    {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortShifts(shifts).map((shift) => {
                const status = getShiftStatus(shift);
                return (
                  <TableRow key={shift._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {formatDate(shift.date)}
                    </TableCell>
                    <TableCell>{shift.title || "Shift"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatTime(shift.startTime)} -{" "}
                          {formatTime(shift.finishTime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {shift.location?.name}
                          </div>
                          {shift.location?.postCode && (
                            <div className="text-sm text-muted-foreground">
                              {shift.location.postCode}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(status)}>{status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewShift(shift)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
