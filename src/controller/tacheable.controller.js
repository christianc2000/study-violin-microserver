global.fetch = require('node-fetch');
const tf = require('@tensorflow/tfjs');
const tmPose = require('@teachablemachine/pose');
const { createCanvas, loadImage } = require('canvas');
const multer = require('multer');

let model;

async function loadModel() {
    model = await tmPose.load('https://teachablemachine.withgoogle.com/models/73BIrLdUQ/model.json', 'https://teachablemachine.withgoogle.com/models/73BIrLdUQ/metadata.json');
}

async function analyzeImage(req, res, next) {
    console.log("ingresa al analizar");
    if (!model) {
        console.log("tmPose.load exitosamente");
        await loadModel();
    }
    console.log("pasa siguiente");
    const upload = multer({ storage: multer.memoryStorage() });
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return next(err);
        }
        const image = await loadImage(req.file.buffer);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const { pose, posenetOutput } = await model.estimatePose(canvas);
        const prediction = await model.predict(posenetOutput);
        const predictions = prediction.map(p => ({
            className: p.className,
            probability: p.probability.toFixed(2)
        }));
        res.json({ pose: pose, predictions: predictions });
    });
}


module.exports = { analyzeImage };
