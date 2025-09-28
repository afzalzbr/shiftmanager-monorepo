import express from "express";
import Location from "../models/locationModel.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Retrieve available locations
 */

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Retrieve all available locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: A list of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 6876ec09d260b087559e5fff
 *                   name:
 *                     type: string
 *                     example: Clippers House, Clippers Quay
 *                   postCode:
 *                     type: string
 *                     example: M50 3XP
 *                   distance:
 *                     type: number
 *                     example: 0
 *                   constituency:
 *                     type: string
 *                     example: Salford and Eccles
 *                   adminDistrict:
 *                     type: string
 *                     example: Salford
 *                   cordinates:
 *                     type: object
 *                     properties:
 *                       longitude:
 *                         type: number
 *                         example: -2.286226
 *                       latitude:
 *                         type: number
 *                         example: 53.466921
 *                       useRotaCloud:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
