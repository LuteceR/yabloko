// import Konva from "konva";

const modal = document.getElementById('settingsModal');
const directionSelect = document.getElementById('coordinateDirection');
const methodSelect = document.getElementById('calculationMethod');
const continueButton = document.getElementById('continueButton');
const container = document.getElementById('container');

const width = container.clientWidth;
const height = container.clientHeight;

// модальное окно
function updateButtonState() {
    const bothSelected =
        directionSelect.value !== '' &&
        methodSelect.value !== '';

    continueButton.disabled = !bothSelected;
}

directionSelect.addEventListener('change', updateButtonState);
methodSelect.addEventListener('change', updateButtonState);

continueButton.addEventListener('click', () => {
    if (!directionSelect.value || !methodSelect.value) {
        return;
    }

    const directionName = directionSelect.options[directionSelect.selectedIndex].text;
    const methodName = methodSelect.options[methodSelect.selectedIndex].text;

    modal.classList.add('hidden');
    drawGrafics(directionName, methodName);
});


document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('hidden') && event.key === 'Escape') {
        event.preventDefault();
    }
});


// Графика
const origin = {
    x: 50,
    y: height - 50
};

const stage = new Konva.Stage({
    container: 'container',
    width,
    height
});

const axisLayer = new Konva.Layer();
const objectLayer = new Konva.Layer();

stage.add(axisLayer);
stage.add(objectLayer);

// оси (стрелки)
function createArrow(config) {
    return new Konva.Arrow({
        ...config,
        pointerLength: 12,
        pointerWidth: 12,
        fill: config.stroke,
        strokeWidth: 3,
        lineCap: 'round',
        lineJoin: 'round'
    });
}

const xAxis = createArrow({
    points: [
        origin.x,
        origin.y,
        origin.x + 200,
        origin.y
    ],
    stroke: '#dc2626'
});

const yAxis = createArrow({
    points: [
        origin.x,
        origin.y,
        origin.x,
        origin.y - 200
    ],
    stroke: '#2563eb'
});

axisLayer.add(xAxis);
axisLayer.add(yAxis);

const xLabel = new Konva.Text({
    x: origin.x + 200,
    y: origin.y - 28,
    text: 'X',
    fontSize: 24,
    fontStyle: 'bold',
    fill: '#dc2626'
});

const yLabel = new Konva.Text({
    x: origin.x + 12,
    y: origin.y - 200,
    text: 'Y',
    fontSize: 24,
    fontStyle: 'bold',
    fill: '#2563eb'
});

axisLayer.add(xLabel);
axisLayer.add(yLabel);

// Круговая стрелка
const rotationArrow = new Konva.Arc({
    x: origin.x + 14,
    y: origin.y,
    innerRadius: 72,
    outerRadius: 75,
    angle: 78,
    rotation: 270,
    fill: '#16a34a',
    stroke: '#16a34a',
    strokeWidth: 3
});

axisLayer.add(rotationArrow);

const arrowHead = new Konva.RegularPolygon({
    x: origin.x + 20,
    y: origin.y - 73,
    sides: 3,
    radius: 13,
    fill: '#16a34a',
    rotation: 30
});

axisLayer.add(arrowHead);


// Подпись направления вращения.
const rotationLabel = new Konva.Text({
    x: origin.x + 84,
    y: origin.y - 88,
    text: 'по часовой стрелке',
    fontSize: 15,
    fill: '#15803d'
});

axisLayer.add(rotationLabel);

// Квадрат
const square = new Konva.Rect({
    x: origin.x + 125,
    y: origin.y + 125,
    width: 100,
    height: 100,
    fill: '#f59e0b',
    stroke: '#b45309',
    strokeWidth: 3,
    cornerRadius: 4,
    draggable: false
});

objectLayer.add(square);


function moveSquare(dx, dy) {
    square.x(square.x() + dx);
    square.y(square.y() + dy);

    squareLabel.position({
        x: square.x(),
        y: square.y() + 38
    });

    objectLayer.batchDraw();
}

function rotateSquare(angle) {
    square.offsetX(square.width() / 2);
    square.offsetY(square.height() / 2);

    square.x(square.x() + square.width() / 2);
    square.y(square.y() + square.height() / 2);

    square.rotation(square.rotation() + angle);

    squareLabel.visible(false);

    objectLayer.batchDraw();
}

function scaleSquare(scale) {
    square.scale({
        x: scale,
        y: scale
    });

    objectLayer.batchDraw();
}

/*
    * moveSquare(30, -20);
    * rotateSquare(45);
    * scaleSquare(1.3);
*/
function drawGrafics(directionName, methodName) {
    const group = new Konva.Group();

    const origin = {
        x: 50,
        y: directionName === "Правая"? height - 50: 50
    };

    yAxis.points[3] = directionName === "Правая"? origin.y - 200: origin.y + 200
    yLabel.y = directionName === "Правая"? origin.y - 200: origin.y + 200


    axisLayer.draw();
    objectLayer.draw();

}