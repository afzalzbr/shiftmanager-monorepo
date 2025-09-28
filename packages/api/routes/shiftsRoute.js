import express from "express";
import mongoose from "mongoose";
import requireAuth from "../middleware/requireAuth.js";
import Shift from "../models/shiftsModel.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shifts
 *   description: Retrieve and manage user shifts
 */

/**
 * @swagger
 * /api/shifts:
 *   get:
 *     summary: Retrieve all shifts for a given user
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ObjectId of the user whose shifts to fetch
 *     responses:
 *       200:
 *         description: A list of shifts, populated with user and location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60f7a3e5b4dcb826d8fe1234
 *                   title:
 *                     type: string
 *                     example: Short Day
 *                   role:
 *                     type: string
 *                     example: Support Worker
 *                   typeOfShift:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: [ "Weekdays" ]
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6876ecb642df0376491dd254
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: john@example.com
 *                   location:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6876ec09d260b087559e5fff
 *                       name:
 *                         type: string
 *                         example: Clippers House, Clippers Quay
 *                       postCode:
 *                         type: string
 *                         example: M50 3XP
 *                       distance:
 *                         type: number
 *                         example: 0
 *                       constituency:
 *                         type: string
 *                         example: Salford and Eccles
 *                       adminDistrict:
 *                         type: string
 *                         example: Salford
 *                       cordinates:
 *                         type: object
 *                         properties:
 *                           longitude:
 *                             type: number
 *                             example: -2.286226
 *                           latitude:
 *                             type: number
 *                             example: 53.466921
 *                           useRotaCloud:
 *                             type: boolean
 *                             example: true
 *                   startTime:
 *                     type: string
 *                     example: "13:00"
 *                   finishTime:
 *                     type: string
 *                     example: "18:00"
 *                   numOfShiftsPerDay:
 *                     type: number
 *                     example: 1
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-06-17"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Bad request – userId missing or invalid
 *       403:
 *         description: Forbidden – userId does not match authenticated user
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new shift
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - role
 *               - startTime
 *               - finishTime
 *               - location
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Morning Shift"
 *               role:
 *                 type: string
 *                 example: "Support Worker"
 *               typeOfShift:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Weekdays"]
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               finishTime:
 *                 type: string
 *                 example: "17:00"
 *               numOfShiftsPerDay:
 *                 type: number
 *                 example: 1
 *               location:
 *                 type: string
 *                 example: "6876ec09d260b087559e5fff"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-17"
 *     responses:
 *       201:
 *         description: Shift created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Shift created successfully"
 *                 shift:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     role:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                     finishTime:
 *                       type: string
 *                     date:
 *                       type: string
 *                     user:
 *                       type: string
 *                     location:
 *                       type: string
 *       400:
 *         description: Bad request – validation error
 *       500:
 *         description: Internal server error
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = req.query;
    const tokenUserId = req.user.id || req.user._id;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId query parameter is required" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (userId !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "Forbidden: cannot fetch other users' shifts" });
    }

    const shifts = await Shift.find({ user: userId })
      .populate("user", "name email")
      .populate("location")
      .sort({ date: 1 });

    res.json(shifts);
  } catch (err) {
    console.error("Error fetching shifts:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/shifts:
 *   post:
 *     summary: Create a new shift
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - role
 *               - startTime
 *               - finishTime
 *               - location
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Morning Shift"
 *               role:
 *                 type: string
 *                 example: "Support Worker"
 *               typeOfShift:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Weekdays"]
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               finishTime:
 *                 type: string
 *                 example: "17:00"
 *               numOfShiftsPerDay:
 *                 type: number
 *                 example: 1
 *               location:
 *                 type: string
 *                 example: "6876ec09d260b087559e5fff"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-17"
 *     responses:
 *       201:
 *         description: Shift created successfully
 *       400:
 *         description: Bad request – validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const tokenUserId = req.user.id || req.user._id;
    const {
      title,
      role,
      typeOfShift,
      startTime,
      finishTime,
      numOfShiftsPerDay,
      location,
      date,
    } = req.body;

    // Validation
    if (!title || !role || !startTime || !finishTime || !location || !date) {
      return res.status(400).json({
        message:
          "Missing required fields: title, role, startTime, finishTime, location, date",
      });
    }

    if (!mongoose.isValidObjectId(location)) {
      return res.status(400).json({ message: "Invalid location ID" });
    }

    const shift = new Shift({
      title,
      role,
      typeOfShift: typeOfShift || [],
      startTime,
      finishTime,
      numOfShiftsPerDay: numOfShiftsPerDay || 1,
      location,
      date: new Date(date),
      user: tokenUserId,
    });

    const savedShift = await shift.save();
    const populatedShift = await Shift.findById(savedShift._id)
      .populate("user", "name email")
      .populate("location");

    res.status(201).json({
      message: "Shift created successfully",
      shift: populatedShift,
    });
  } catch (err) {
    console.error("Error creating shift:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/shifts/{id}:
 *   get:
 *     summary: Get a specific shift by ID
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift ID
 *     responses:
 *       200:
 *         description: Shift details
 *       404:
 *         description: Shift not found
 *       403:
 *         description: Forbidden – not your shift
 *       500:
 *         description: Internal server error
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const tokenUserId = req.user.id || req.user._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid shift ID" });
    }

    const shift = await Shift.findOne({ _id: id, user: tokenUserId })
      .populate("user", "name email")
      .populate("location");

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.json(shift);
  } catch (err) {
    console.error("Error fetching shift:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/shifts/{id}:
 *   put:
 *     summary: Update a shift by ID
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               role:
 *                 type: string
 *               typeOfShift:
 *                 type: array
 *                 items:
 *                   type: string
 *               startTime:
 *                 type: string
 *               finishTime:
 *                 type: string
 *               numOfShiftsPerDay:
 *                 type: number
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Shift updated successfully
 *       404:
 *         description: Shift not found
 *       403:
 *         description: Forbidden – not your shift
 *       500:
 *         description: Internal server error
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const tokenUserId = req.user.id || req.user._id;
    const updateData = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid shift ID" });
    }

    // Check if shift exists and belongs to user
    const existingShift = await Shift.findOne({ _id: id, user: tokenUserId });
    if (!existingShift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    // Validate location if provided
    if (updateData.location && !mongoose.isValidObjectId(updateData.location)) {
      return res.status(400).json({ message: "Invalid location ID" });
    }

    // Convert date string to Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const updatedShift = await Shift.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email")
      .populate("location");

    res.json({
      message: "Shift updated successfully",
      shift: updatedShift,
    });
  } catch (err) {
    console.error("Error updating shift:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/shifts/{id}:
 *   delete:
 *     summary: Delete a shift by ID
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift ID
 *     responses:
 *       200:
 *         description: Shift deleted successfully
 *       404:
 *         description: Shift not found
 *       403:
 *         description: Forbidden – not your shift
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const tokenUserId = req.user.id || req.user._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid shift ID" });
    }

    const shift = await Shift.findOneAndDelete({ _id: id, user: tokenUserId });

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.json({ message: "Shift deleted successfully" });
  } catch (err) {
    console.error("Error deleting shift:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/shifts/batch:
 *   put:
 *     summary: Bulk update shifts for drag-and-drop or copy-paste operations
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shifts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Shift ID to update
 *                     startTime:
 *                       type: string
 *                       example: "09:00"
 *                     finishTime:
 *                       type: string
 *                       example: "17:00"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-06-17"
 *                     title:
 *                       type: string
 *                       example: "Updated Shift Title"
 *                     role:
 *                       type: string
 *                       example: "Support Worker"
 *                     location:
 *                       type: string
 *                       example: "6876ec09d260b087559e5fff"
 *                     numOfShiftsPerDay:
 *                       type: number
 *                       example: 1
 *                     typeOfShift:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Weekdays"]
 *     responses:
 *       200:
 *         description: Bulk update completed with results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bulk update completed"
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       success:
 *                         type: boolean
 *                       shift:
 *                         type: object
 *                         description: Updated shift data (if successful)
 *                       error:
 *                         type: string
 *                         description: Error message (if failed)
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     successful:
 *                       type: number
 *                     failed:
 *                       type: number
 *       400:
 *         description: Bad request – invalid input data
 *       500:
 *         description: Internal server error
 */
router.put("/batch", requireAuth, async (req, res) => {
  try {
    const tokenUserId = req.user.id || req.user._id;
    const { shifts } = req.body;

    if (!Array.isArray(shifts) || shifts.length === 0) {
      return res.status(400).json({
        message: "Shifts array is required and must not be empty",
      });
    }

    const results = [];
    let successful = 0;
    let failed = 0;

    // Process each shift update
    for (const shiftUpdate of shifts) {
      const { id, ...updateData } = shiftUpdate;

      try {
        // Validate shift ID
        if (!id || !mongoose.isValidObjectId(id)) {
          results.push({
            id: id || "unknown",
            success: false,
            error: "Invalid shift ID",
          });
          failed++;
          continue;
        }

        // Check if shift exists and belongs to user
        const existingShift = await Shift.findOne({
          _id: id,
          user: tokenUserId,
        });

        if (!existingShift) {
          results.push({
            id,
            success: false,
            error: "Shift not found or access denied",
          });
          failed++;
          continue;
        }

        // Validate location if provided
        if (
          updateData.location &&
          !mongoose.isValidObjectId(updateData.location)
        ) {
          results.push({
            id,
            success: false,
            error: "Invalid location ID",
          });
          failed++;
          continue;
        }

        // Convert date string to Date object if provided
        if (updateData.date) {
          updateData.date = new Date(updateData.date);
        }

        // Update the shift
        const updatedShift = await Shift.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        })
          .populate("user", "name email")
          .populate("location");

        results.push({
          id,
          success: true,
          shift: updatedShift,
        });
        successful++;
      } catch (error) {
        results.push({
          id,
          success: false,
          error: error.message || "Update failed",
        });
        failed++;
      }
    }

    res.json({
      message: "Bulk update completed",
      results,
      summary: {
        total: shifts.length,
        successful,
        failed,
      },
    });
  } catch (err) {
    console.error("Error in bulk update:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/shifts/batch:
 *   post:
 *     summary: Bulk create shifts
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shifts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - role
 *                     - startTime
 *                     - finishTime
 *                     - location
 *                     - date
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Morning Shift"
 *                     role:
 *                       type: string
 *                       example: "Support Worker"
 *                     startTime:
 *                       type: string
 *                       example: "09:00"
 *                     finishTime:
 *                       type: string
 *                       example: "17:00"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-06-17"
 *                     location:
 *                       type: string
 *                       example: "6876ec09d260b087559e5fff"
 *                     numOfShiftsPerDay:
 *                       type: number
 *                       example: 1
 *                     typeOfShift:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Weekdays"]
 *     responses:
 *       200:
 *         description: Bulk create completed with results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bulk create completed"
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       index:
 *                         type: number
 *                       success:
 *                         type: boolean
 *                       shift:
 *                         type: object
 *                         description: Created shift data (if successful)
 *                       error:
 *                         type: string
 *                         description: Error message (if failed)
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     successful:
 *                       type: number
 *                     failed:
 *                       type: number
 *       400:
 *         description: Bad request – invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/batch", requireAuth, async (req, res) => {
  try {
    const tokenUserId = req.user.id || req.user._id;
    const { shifts } = req.body;

    if (!Array.isArray(shifts) || shifts.length === 0) {
      return res.status(400).json({
        message: "Shifts array is required and must not be empty",
      });
    }

    const results = [];
    let successful = 0;
    let failed = 0;

    // Process each shift creation
    for (let i = 0; i < shifts.length; i++) {
      const shiftData = shifts[i];

      try {
        // Validate required fields
        const { title, role, startTime, finishTime, location, date } =
          shiftData;

        if (
          !title ||
          !role ||
          !startTime ||
          !finishTime ||
          !location ||
          !date
        ) {
          results.push({
            index: i,
            success: false,
            error:
              "Missing required fields: title, role, startTime, finishTime, location, date",
          });
          failed++;
          continue;
        }

        // Validate location ID
        if (!mongoose.isValidObjectId(location)) {
          results.push({
            index: i,
            success: false,
            error: "Invalid location ID",
          });
          failed++;
          continue;
        }

        // Create the shift
        const shift = new Shift({
          title,
          role,
          typeOfShift: shiftData.typeOfShift || [],
          startTime,
          finishTime,
          numOfShiftsPerDay: shiftData.numOfShiftsPerDay || 1,
          location,
          date: new Date(date),
          user: tokenUserId,
        });

        const savedShift = await shift.save();
        const populatedShift = await Shift.findById(savedShift._id)
          .populate("user", "name email")
          .populate("location");

        results.push({
          index: i,
          success: true,
          shift: populatedShift,
        });
        successful++;
      } catch (error) {
        results.push({
          index: i,
          success: false,
          error: error.message || "Creation failed",
        });
        failed++;
      }
    }

    res.json({
      message: "Bulk create completed",
      results,
      summary: {
        total: shifts.length,
        successful,
        failed,
      },
    });
  } catch (err) {
    console.error("Error in bulk create:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/shifts/{id}/clock-in:
 *   post:
 *     summary: Clock in for a shift
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift ID
 *     responses:
 *       200:
 *         description: Successfully clocked in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 shift:
 *                   $ref: '#/components/schemas/Shift'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Shift not found
 *       409:
 *         description: Already clocked in
 */
router.post("/:id/clock-in", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const tokenUserId = req.user.id || req.user._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid shift ID" });
    }

    const shift = await Shift.findOne({ _id: id, user: tokenUserId });
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    if (shift.isClockedIn) {
      return res.status(409).json({ message: "Already clocked in" });
    }

    // Check if it's the correct day for the shift
    const today = new Date();
    const shiftDate = new Date(shift.date);
    const isSameDay = today.toDateString() === shiftDate.toDateString();

    if (!isSameDay) {
      return res
        .status(400)
        .json({ message: "Cannot clock in on a different day than the shift" });
    }

    // Check if it's within 5 minutes before shift start time
    const startTime = new Date(shiftDate);
    const [startHour, startMinute] = shift.startTime.split(":").map(Number);
    startTime.setHours(startHour, startMinute, 0, 0);

    // Calculate 5 minutes before start time
    const fiveMinutesBeforeStart = new Date(
      startTime.getTime() - 5 * 60 * 1000
    );

    // Check if current time is within the allowed window
    if (today < fiveMinutesBeforeStart) {
      return res.status(400).json({
        message: "Cannot clock in more than 5 minutes before shift start time",
        earliestClockIn: fiveMinutesBeforeStart.toISOString(),
      });
    }

    shift.clockInTime = new Date();
    shift.isClockedIn = true;
    await shift.save();

    res.json({
      message: "Successfully clocked in",
      shift: await Shift.findById(id).populate("user location"),
    });
  } catch (err) {
    console.error("Error clocking in:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/shifts/{id}/clock-out:
 *   post:
 *     summary: Clock out for a shift
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift ID
 *     responses:
 *       200:
 *         description: Successfully clocked out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 shift:
 *                   $ref: '#/components/schemas/Shift'
 *                 totalHoursWorked:
 *                   type: number
 *       400:
 *         description: Bad request
 *       404:
 *         description: Shift not found
 *       409:
 *         description: Not clocked in
 */
router.post("/:id/clock-out", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const tokenUserId = req.user.id || req.user._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid shift ID" });
    }

    const shift = await Shift.findOne({ _id: id, user: tokenUserId });
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    if (!shift.isClockedIn) {
      return res.status(409).json({ message: "Not clocked in" });
    }

    // Check if it's within 5 minutes before shift end time
    const today = new Date();
    const shiftDate = new Date(shift.date);
    const endTime = new Date(shiftDate);
    const [endHour, endMinute] = shift.finishTime.split(":").map(Number);
    endTime.setHours(endHour, endMinute, 0, 0);

    // Calculate 5 minutes before end time
    const fiveMinutesBeforeEnd = new Date(endTime.getTime() - 5 * 60 * 1000);

    // Check if current time is within the allowed window
    if (today < fiveMinutesBeforeEnd) {
      return res.status(400).json({
        message: "Cannot clock out more than 5 minutes before shift end time",
        earliestClockOut: fiveMinutesBeforeEnd.toISOString(),
      });
    }

    shift.clockOutTime = new Date();
    shift.isClockedIn = false;

    // Calculate total hours worked
    const timeDiff = shift.clockOutTime - shift.clockInTime;
    shift.totalHoursWorked = Math.round(timeDiff / (1000 * 60)); // Convert to minutes

    await shift.save();

    res.json({
      message: "Successfully clocked out",
      shift: await Shift.findById(id).populate("user location"),
      totalHoursWorked: shift.totalHoursWorked,
    });
  } catch (err) {
    console.error("Error clocking out:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
