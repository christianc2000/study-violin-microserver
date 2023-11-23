const URL = `postura_corporal`;

const canvas = document.getElementById("canvas2");
const imageUpload = document.getElementById("imageUpload");

// Añade un evento de cambio al input de archivo

imageUpload.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const canvasWidth = 500; // Ancho deseado para el canvas
                const canvasHeight = 500; // Alto deseado para el canvas

                // Establece el ancho y alto del canvas
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                // Obtiene el contexto 2D del canvas
                const ctx = canvas.getContext("2d");

                // Dibuja la imagen en el canvas con el tamaño deseado
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasWidth, canvasHeight);
            };

            // Carga la imagen seleccionada
            img.src = event.target.result;
        };

        // Lee el archivo como una URL de datos
        reader.readAsDataURL(file);
    }
});
async function iniciar() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    console.log("iniciar......")
    // load the model and metadata
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // append/get elements to the DOM
    const canvas2 = document.getElementById("canvas2");
    ctx = canvas2.getContext("2d");




    labelContainer = document.getElementById("label-container2");
    for (let i = 0; i < maxPredictions; i++) {
        // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
    predict2(); // Perform initial prediction.
}

async function predict2() {
    // Get the image data from canvas2
    const imageData = ctx.getImageData(0, 0, canvas2.width, canvas2.height).data;

    const {
        pose,
        posenetOutput
    } = await model.estimatePose(canvas2);
    // // Prediction: run input through the teachable machine classification model
    const prediction = await model.predict(posenetOutput);
    console.log(prediction);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
    console.log("predict2");
    drawPose2(pose);
}

function drawPose2(pose) {
    const ctx2 = canvas2.getContext('2d'); // Obtén el contexto 2D de canvas2

    ctx2.drawImage(canvas2, 0, 0); // Copia la imagen original a canvas2

    // Dibuja la pose en canvas2
    if (pose) {
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx2);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx2);
    }
}