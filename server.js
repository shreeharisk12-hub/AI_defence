const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowed = /jpeg|jpg|png|gif|bmp|webp/;
        const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
        const mimeOk = allowed.test(file.mimetype);
        if (extOk && mimeOk) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Serve static files from project root
app.use(express.static(__dirname));

// Serve uploads directory
app.use('/uploads', express.static(uploadsDir));

// GET / — serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET /ai-results — serve ai-results.html
app.get('/ai-results', (req, res) => {
    res.sendFile(path.join(__dirname, 'ai-results.html'));
});

// GET /api/ai — returns dummy JSON
app.get('/api/ai', (req, res) => {
    res.json({
        "object": "Tank",
        "confidence": "92%",
        "location": "Sector 7G",
        "threat": "High"
    });
});

// POST /upload — handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided.' });
    }
    res.json({
        success: true,
        path: '/uploads/' + req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
    });
});

// Error handling
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`[SYSTEM] Military Command Dashboard server active on port ${PORT}`);
    console.log(`[SYSTEM] Access dashboard: http://localhost:${PORT}`);
});
