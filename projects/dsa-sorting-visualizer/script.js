let array = [];
let sorting = false;
let comparisons = 0;
let swapCount = 0;

const complexities = {
    bubble: 'O(n²)',
    selection: 'O(n²)',
    insertion: 'O(n²)',
    merge: 'O(n log n)',
    quick: 'O(n log n)'
};

const sizeSlider = document.getElementById('sizeSlider');
const sizeLabel = document.getElementById('sizeLabel');

sizeSlider.addEventListener('input', () => {
    sizeLabel.textContent = sizeSlider.value;
    if (!sorting) generateArray();
});

function getDelay() {
    return Math.max(1, 101 - document.getElementById('speedSlider').value);
}

function generateArray() {
    if (sorting) return;
    const size = parseInt(sizeSlider.value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 280) + 20);
    comparisons = 0;
    swapCount = 0;
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('timeComplexity').textContent = '-';
    renderBars();
}

function renderBars(highlights = {}) {
    const viz = document.getElementById('visualizer');
    const barWidth = Math.max(4, Math.floor((viz.clientWidth - 40) / array.length) - 3);
    viz.innerHTML = array.map((val, i) => {
        let cls = 'bar';
        if (highlights.sorted && highlights.sorted.includes(i)) cls += ' sorted';
        else if (highlights.comparing && highlights.comparing.includes(i)) cls += ' comparing';
        else if (highlights.pivot === i) cls += ' pivot';
        return `<div class="${cls}" style="height:${val}px;width:${barWidth}px"></div>`;
    }).join('');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStats() {
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swapCount;
}

async function startSort() {
    if (sorting) return;
    sorting = true;
    comparisons = 0;
    swapCount = 0;
    const algo = document.getElementById('algorithm').value;
    document.getElementById('timeComplexity').textContent = complexities[algo];
    document.getElementById('startBtn').disabled = true;

    switch (algo) {
        case 'bubble': await bubbleSort(); break;
        case 'selection': await selectionSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'merge': await mergeSortWrapper(); break;
        case 'quick': await quickSortWrapper(); break;
    }

    // Final sweep animation
    for (let i = 0; i < array.length; i++) {
        renderBars({ sorted: Array.from({ length: i + 1 }, (_, k) => k) });
        await sleep(10);
    }

    sorting = false;
    document.getElementById('startBtn').disabled = false;
}

// ===== Sorting Algorithms =====

async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            renderBars({
                comparing: [j, j + 1],
                sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
            });
            updateStats();
            await sleep(getDelay());
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapCount++;
                updateStats();
            }
        }
    }
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            renderBars({
                comparing: [minIdx, j],
                sorted: Array.from({ length: i }, (_, k) => k)
            });
            updateStats();
            await sleep(getDelay());
            if (array[j] < array[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            swapCount++;
            updateStats();
        }
    }
}

async function insertionSort() {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            comparisons++;
            renderBars({ comparing: [j, j + 1] });
            updateStats();
            await sleep(getDelay());
            array[j + 1] = array[j];
            swapCount++;
            j--;
        }
        comparisons++;
        array[j + 1] = key;
        updateStats();
    }
}

async function mergeSortWrapper() {
    await mergeSort(0, array.length - 1);
}

async function mergeSort(l, r) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    await mergeSort(l, mid);
    await mergeSort(mid + 1, r);
    await merge(l, mid, r);
}

async function merge(l, mid, r) {
    let left = array.slice(l, mid + 1);
    let right = array.slice(mid + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
        comparisons++;
        renderBars({ comparing: [l + i, mid + 1 + j] });
        updateStats();
        await sleep(getDelay());
        if (left[i] <= right[j]) {
            array[k++] = left[i++];
        } else {
            array[k++] = right[j++];
            swapCount++;
        }
    }

    while (i < left.length) {
        array[k++] = left[i++];
        await sleep(getDelay());
        renderBars({});
    }

    while (j < right.length) {
        array[k++] = right[j++];
        await sleep(getDelay());
        renderBars({});
    }
}

async function quickSortWrapper() {
    await quickSort(0, array.length - 1);
}

async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        comparisons++;
        renderBars({ comparing: [j], pivot: high });
        updateStats();
        await sleep(getDelay());
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            swapCount++;
            updateStats();
        }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swapCount++;
    updateStats();
    return i + 1;
}

// Initialize
generateArray();
