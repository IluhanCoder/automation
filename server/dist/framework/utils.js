export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const handleError = (res, error) => {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
};
