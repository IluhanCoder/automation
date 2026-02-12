import type express from "express";

export const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const handleError = (res: express.Response, error: unknown) => {
  console.error(error);
  return res.status(500).json({ message: "Server error." });
};
