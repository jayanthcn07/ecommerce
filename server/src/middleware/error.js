export function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err?.name === "ZodError") {
    return res.status(400).json({ message: err.errors[0]?.message || "Validation error" });
  }
  res.status(err.status || 500).json({ message: err.message || "Server error" });
}