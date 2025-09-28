import { ArrowLeft, Briefcase, Clock, MapPin, Save, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import { useLocations, useShiftForm, useShifts } from "../../hooks";
import { cn } from "../../lib/utils";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function EditShift() {
  const { userToken, user } = useContext(TokenContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom hooks
  const {
    formData,
    submitting,
    setSubmitting,
    errors,
    setErrors,
    handleInputChange,
    validateForm,
    calculateDuration,
    setFormData,
  } = useShiftForm();

  const { locations, loading: locationsLoading } = useLocations();
  const { updateShift, getShiftById } = useShifts(userToken, user?._id);

  useEffect(() => {
    const fetchShift = async () => {
      setLoading(true);
      setError(null);

      if (!userToken) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const result = await getShiftById(id);
      if (result.success) {
        setShift(result.data);
        // Pre-fill form with shift data
        setFormData({
          title: result.data.title || "",
          role: result.data.role || "",
          typeOfShift: result.data.typeOfShift || [],
          startTime: result.data.startTime || "",
          finishTime: result.data.finishTime || "",
          numOfShiftsPerDay: result.data.numOfShiftsPerDay || 1,
          location: result.data.location?._id || "",
          date: result.data.date || "",
        });
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    if (userToken && id) {
      fetchShift();
    }
  }, [userToken, id, getShiftById, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    const result = await updateShift(id, formData);

    if (result.success) {
      navigate(`/shifts/${id}`);
    } else {
      setErrors({ submit: result.error });
    }

    setSubmitting(false);
  };

  const handleCancel = () => {
    navigate(`/shifts/${id}`);
  };

  if (loading || locationsLoading) {
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

  console.log(shift);
  console.log(formData);

  return (
    <div className="min-h-screen">
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

      <div className="container max-w-4xl border bg-white border-gray-200 rounded-lg p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Edit Shift Details</h1>
          <p className="text-muted-foreground mt-2">
            Update the shift information below.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <Alert variant="destructive">
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Briefcase className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the basic details for this shift.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Shift Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? "border-destructive" : ""}
                  required
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <MapPin className="h-5 w-5" />
                Location Details
              </CardTitle>
              <CardDescription>
                Specify where this shift will take place.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location Name *
                </Label>
                <Select
                  name="location"
                  value={formData.location}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "location", value } })
                  }
                >
                  <SelectTrigger
                    className={errors.location ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location._id} value={location._id}>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{location.name}</div>
                          {location.postCode && (
                            <div className="text-sm text-muted-foreground">
                              {location.postCode}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Address *</Label>
                <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                  <span className="text-sm text-muted-foreground">
                    {locations.find((loc) => loc._id === formData.location)
                      ?.name || "Select a location to see address"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Latitude *</Label>
                  <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                    <span className="text-sm text-muted-foreground">
                      {locations.find((loc) => loc._id === formData.location)
                        ?.cordinates.latitude || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Longitude *</Label>
                  <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                    <span className="text-sm text-muted-foreground">
                      {locations.find((loc) => loc._id === formData.location)
                        ?.cordinates.longitude || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Clock className="h-5 w-5" />
                Schedule Details
              </CardTitle>
              <CardDescription>
                Set the date and time for this shift.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date *
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={new Date(formData.date).toISOString().split("T")[0]}
                  onChange={handleInputChange}
                  className={cn(
                    errors.date ? "border-destructive" : "",
                    "w-full"
                  )}
                  required
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium">
                    Start Time *
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={errors.startTime ? "border-destructive" : ""}
                    required
                  />
                  {errors.startTime && (
                    <p className="text-sm text-destructive">
                      {errors.startTime}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finishTime" className="text-sm font-medium">
                    Finish Time *
                  </Label>
                  <Input
                    id="finishTime"
                    name="finishTime"
                    type="time"
                    value={formData.finishTime}
                    onChange={handleInputChange}
                    className={errors.finishTime ? "border-destructive" : ""}
                    required
                  />
                  {errors.finishTime && (
                    <p className="text-sm text-destructive">
                      {errors.finishTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Duration</Label>
                <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                  <span className="text-sm">{calculateDuration()} hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {submitting ? "Saving..." : "Update Shift"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
