import { ArrowLeft, Briefcase, Clock, MapPin, Save, X } from "lucide-react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function CreateShift() {
  const { userToken, user } = useContext(TokenContext);
  const navigate = useNavigate();

  // Custom hooks
  const {
    formData,
    submitting,
    setSubmitting,
    errors,
    setErrors,
    handleInputChange,
    validateForm,
    resetForm,
    calculateDuration,
  } = useShiftForm();

  const { locations, loading: locationsLoading } = useLocations();
  const { createShift } = useShifts(userToken, user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    const result = await createShift(formData);

    if (result.success) {
      resetForm();
      navigate("/");
    } else {
      setErrors({ submit: result.error });
    }

    setSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    navigate("/");
  };

  if (locationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <h1 className="text-xl font-bold">Create New Shift</h1>
      </div>

      <div className="container max-w-4xl border bg-white border-gray-200 rounded-lg p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Create Shift Details</h1>
          <p className="text-muted-foreground mt-2">
            Enter the shift information below.
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

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role *
                </Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={errors.role ? "border-destructive" : ""}
                  required
                />
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Type of Shift</h3>
                <p className="text-sm text-muted-foreground">
                  Select the type(s) of shift (optional)
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Full Time", "Part Time", "Contract", "Temporary"].map(
                    (type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          name="typeOfShift"
                          value={type}
                          checked={formData.typeOfShift.includes(type)}
                          onCheckedChange={(checked) => {
                            const event = {
                              target: {
                                name: "typeOfShift",
                                value: type,
                                type: "checkbox",
                                checked: checked,
                              },
                            };
                            handleInputChange(event);
                          }}
                        />
                        <Label
                          htmlFor={type}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </Label>
                      </div>
                    )
                  )}
                </div>
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
                        ?.cordinates?.latitude || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Longitude *</Label>
                  <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                    <span className="text-sm text-muted-foreground">
                      {locations.find((loc) => loc._id === formData.location)
                        ?.cordinates?.longitude || "N/A"}
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
                  value={formData.date}
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
              {submitting ? "Creating..." : "Create Shift"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
