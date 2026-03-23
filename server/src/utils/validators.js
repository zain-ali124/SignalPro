const { body, validationResult } = require("express-validator");

// ── Return validation errors ───────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// ── Register validation rules ──────────────────────
const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// ── Login validation rules ─────────────────────────
const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

// ── Signal creation rules ──────────────────────────
const signalRules = [
  body("pair").trim().notEmpty().withMessage("Trading pair is required"),
  body("entryPrice").isNumeric().withMessage("Entry price must be a number"),
  body("stopLoss").isNumeric().withMessage("Stop loss must be a number"),
  body("takeProfit").isNumeric().withMessage("Take profit must be a number"),
  body("signalType")
    .isIn(["BUY", "SELL"])
    .withMessage("Signal type must be BUY or SELL"),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  signalRules,
};
