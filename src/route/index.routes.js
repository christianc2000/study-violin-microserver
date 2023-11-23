const { Router } = require('express');
const {analyzeImage, upload} = require('../controller/tacheable.controller');
const router = Router();

router.post('/analyzeImage', analyzeImage);

module.exports = router;