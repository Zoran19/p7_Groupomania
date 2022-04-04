// Routes

module.exports = {
  upload: (req, res) => {
    res.status(201).json({ filename: req.file.filename });
  },
};
