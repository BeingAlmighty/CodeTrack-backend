import express from "express";
import { getRecentSubmissions } from "../controllers/recentSubmissions.controller.js";
import { getSolvedProblems } from "../controllers/getProblems.controller.js";
import { getUserProfile } from "../controllers/getUserProfile.controller.js";
import { getQuestions } from "../controllers/getQuestions.controller.js";
import { getSolution } from "../controllers/getSolution.controller.js";
import { getAllUsers, getUserSlugs } from "../controllers/database.controller.js";

const router = express.Router();

router.get("/recentSubmissions/:username", getRecentSubmissions);
router.get("/solvedProblems/:username/", getSolvedProblems);
router.get("/profile/:username", getUserProfile);
router.get("/questions/:username", getQuestions);
router.get("/solution/:titleSlug", getSolution);

router.get("/db/users", getAllUsers);
router.get("/db/slugs/:username", getUserSlugs);

export default router;