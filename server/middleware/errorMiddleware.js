const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err.message === 'Only image files are allowed') {
        return res.status(400).json({ message: err.message });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 2MB' });
    }

    res.status(500).json({
        message: err.message || 'Server error'
    });
};

module.exports = errorMiddleware;