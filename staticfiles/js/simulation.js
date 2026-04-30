const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const GRID = 32;
const CELL = canvas.width / GRID;
let grid = createGrid();
let running = true;
let timeStep = 0;

const dosageEl = document.getElementById('dosage');
const diffusionEl = document.getElementById('diffusion');
const flowEl = document.getElementById('flow');
const eliminationEl = document.getElementById('elimination');
const statusBadge = document.getElementById('statusBadge');

function createGrid(){
    return Array.from({length: GRID}, () => Array(GRID).fill(0));
}

function reset(){
    grid = createGrid();
    timeStep = 0;
    const dose = Number(dosageEl.value);
    grid[22][Math.floor(GRID/2)] = dose;
}

function color(value){
    value = Math.min(value, 100);
    if(value <= 0.01) return 'rgb(10,18,38)';
    const r = Math.min(255, value * 3);
    const g = Math.min(220, value * 1.5);
    const b = Math.max(45, 255 - value * 2.2);
    return `rgb(${r},${g},${b})`;
}

function diffuse(){
    const diffusion = Number(diffusionEl.value);
    const flow = Number(flowEl.value);
    const elimination = Number(eliminationEl.value);
    const next = createGrid();

    for(let i=1;i<GRID-1;i++){
        for(let j=1;j<GRID-1;j++){
            const val = grid[i][j];
            if(val <= 0) continue;

            let stay = val * (1 - diffusion);
            let spread = val * diffusion;

            const upWeight = 0.25 + flow;
            const downWeight = 0.25;
            const leftWeight = 0.25;
            const rightWeight = 0.25;
            const totalWeight = upWeight + downWeight + leftWeight + rightWeight;

            stay *= (1 - elimination);
            spread *= (1 - elimination);

            next[i][j] += stay;
            next[i-1][j] += spread * (upWeight / totalWeight);
            next[i+1][j] += spread * (downWeight / totalWeight);
            next[i][j-1] += spread * (leftWeight / totalWeight);
            next[i][j+1] += spread * (rightWeight / totalWeight);
        }
    }
    grid = next;
    timeStep++;
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<GRID;i++){
        for(let j=0;j<GRID;j++){
            ctx.fillStyle = color(grid[i][j]);
            ctx.fillRect(j*CELL, i*CELL, CELL-1, CELL-1);
        }
    }

    ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.lineWidth = 2;
    [7,15,24].forEach(row => {
        ctx.beginPath();
        ctx.moveTo(0,row*CELL);
        ctx.lineTo(canvas.width,row*CELL);
        ctx.stroke();
    });

    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('BRAIN', 15, 28);
    ctx.fillText('BLOOD', 15, 170);
    ctx.fillText('STOMACH START', 15, 335);
    ctx.fillText('LIVER / METABOLISM', 15, 515);
}

function regionSum(start,end){
    let sum = 0;
    for(let i=start;i<end;i++){
        for(let j=0;j<GRID;j++) sum += grid[i][j];
    }
    return sum;
}

function updateMetrics(){
    const brain = regionSum(0,7);
    const blood = regionSum(7,15);
    const stomach = regionSum(15,24);
    const liver = regionSum(24,32);
    const total = brain + blood + stomach + liver;
    const maxVal = Math.max(brain,blood,stomach,liver,1);

    const values = {brain, blood, stomach, liver};
    Object.keys(values).forEach(key => {
        document.getElementById(`${key}Val`).innerText = values[key].toFixed(2);
        document.getElementById(`${key}Bar`).style.width = `${Math.min(100,(values[key]/maxVal)*100)}%`;
    });
    document.getElementById('timeStep').innerText = timeStep;
    document.getElementById('totalValue').innerText = total.toFixed(2);
}

function syncLabels(){
    document.getElementById('doseValue').innerText = dosageEl.value;
    document.getElementById('diffValue').innerText = Number(diffusionEl.value).toFixed(2);
    document.getElementById('flowValue').innerText = Number(flowEl.value).toFixed(2);
    document.getElementById('elimValue').innerText = Number(eliminationEl.value).toFixed(3);
}

function loop(){
    if(running) diffuse();
    draw();
    updateMetrics();
    syncLabels();
    requestAnimationFrame(loop);
}

[dosageEl,diffusionEl,flowEl,eliminationEl].forEach(el => el.addEventListener('input', () => {syncLabels(); if(el === dosageEl) reset();}));

document.getElementById('resetBtn').onclick = reset;
document.getElementById('pauseBtn').onclick = () => {
    running = !running;
    document.getElementById('pauseBtn').innerText = running ? 'Pause' : 'Resume';
    statusBadge.innerText = running ? 'Running' : 'Paused';
};
document.getElementById('slowBtn').onclick = () => {diffusionEl.value=.08; flowEl.value=.10; eliminationEl.value=.002; reset();};
document.getElementById('normalBtn').onclick = () => {diffusionEl.value=.20; flowEl.value=.30; eliminationEl.value=.003; reset();};
document.getElementById('fastBtn').onclick = () => {diffusionEl.value=.45; flowEl.value=.55; eliminationEl.value=.006; reset();};

reset();
loop();
