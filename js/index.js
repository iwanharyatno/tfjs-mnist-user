let model = null;
let prediction = new Array(10).fill(0);

function showPrediction() {
  predictionRankList.innerHTML = '';
  predictionRankList.innerHTML = prediction
    .sort((a,b) => a.pred < b.pred ? 1 : a.pred == b.pred ? 0 : -1)
    .map(({ pred, label }, i) => `
    <li class="prediction-rank-item" style="--order: ${i}">
      <span>${label}</span>
      <span>${(pred*100).toFixed(2)}%</span>
    </li>
    `.replace(/ /g, ' '))
    .join('');
}

function initialize() {
  tf.loadLayersModel('/models/model.json').then(m => {
    const warmupResult = m.predict(tf.zeros([1, 784]));
    warmupResult.dataSync();
    warmupResult.dispose();
    canvas.parentNode.classList.remove('loading');

    model = m;
    reset();
  });
}

function predict() {
  if (model) {
    model.predict(tf.tensor2d(grid.flat(), [1, 784]))
      .data()
      .then(result => {
        prediction = Object.values(result).map((p,i) => ({pred: p, label: i}));
        showPrediction();
      });
  }
}

function reset() {
  prediction = new Array(10).fill(0).map((p,i) => ({pred: p, label: i}));
  showPrediction();
}

canvas.addEventListener('touchstart', predict);
canvas.addEventListener('touchmove', predict);

clearCanvasButton.addEventListener('click', reset);

initialize();
