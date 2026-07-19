exports.getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StudyMate AI Backend Running'
  });
};
