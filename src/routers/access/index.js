import express from "express";

const router = express.Router();

router.post("/login", (req, res, next) => {
  return res.status(200).json({
    message: "Login functionally",
  });
});

export default router;
