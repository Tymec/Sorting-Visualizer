import { swap } from './Utils';
import { AccessEvent, AssignEvent, ComparisonEvent, SwapEvent } from './Animation';

export const BubbleSort = (p) => {
    const { array, animations } = p;

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            animations.push(new ComparisonEvent({a: i, b: j}));
            if (array[j] > array[j + 1]) {
                animations.push(new SwapEvent({a: i, b: j}));
                swap(array, j, j + 1);
            }
        }
    }
}
/*
export const BubbleSort = async (p) => {
    const { array, delay, signal } = p;

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            p.setColor(j, '#ff0000');
            p.stats.access += 2;
            p.stats.comparison++;
            if (array[j] > array[j + 1]) {
                p.stats.swap++;
                p.stats.access += 2;
                swap(array, j, j + 1);
                p.setColor(j, '#00ff00');
                p.setColor(j + 1, '#00ff00');
            }

            await sleep(delay, signal);
            p.resetColor(j);
            p.resetColor(j + 1);
        }
    }
}
*/

export const CocktailSort = (p) => {
    const { array, animations } = p;

    let hasSwapped = true;
    let lo = 0;
    let hi = array.length;

    let i;
    while (hasSwapped) {
        hasSwapped = false;

        for (i = lo; i < hi - 1; i++) {
            animations.push(new ComparisonEvent({a: i, b: i + 1}));
            if ( array[i] > array[i + 1] ) {
                animations.push(new SwapEvent({a: i, b: i + 1}));
                swap(array, i, i + 1);
                hasSwapped = true;
            }
        }

        if (!hasSwapped) break;
        hasSwapped = false;
        hi--;

        for (i = hi - 1; i >= lo; i--) {
            animations.push(new ComparisonEvent({a: i, b: i + 1}));
            if (array[i] > array[i + 1]) {
                animations.push(new SwapEvent({a: i, b: i + 1}));
                swap(array, i, i + 1);
                hasSwapped = true;
            }
        }

        lo++;
    }
}

/*
export const CocktailSort = async (p) => {
    const { array, delay, signal } = p;

    let hasSwapped = true;
    let lo = 0;
    let hi = array.length;

    let i;
    while (hasSwapped) {
        hasSwapped = false;

        for (i = lo; i < hi - 1; i++) {
            p.stats.comparison++;
            p.stats.access += 2;

            p.setColor(i, '#ff0000');
            if ( array[i] > array[i + 1] ) {
                p.setColor(i, '#00ff00');
                p.setColor(i + 1, '#00ff00');
                swap(array, i, i + 1);
                hasSwapped = true;
            }

            await sleep(delay, signal);
            p.resetColor(i);
            p.resetColor(i + 1);
        }

        if (!hasSwapped) break;
        hasSwapped = false;
        hi--;

        for (i = hi - 1; i >= lo; i--) {
            p.stats.comparison++;
            p.stats.access += 2;

            p.setColor(i, '#ff0000');
            if (array[i] > array[i + 1]) {
                p.setColor(i, '#00ff00');
                p.setColor(i + 1, '#00ff00');
                swap(array, i, i + 1);
                hasSwapped = true;
            }

            await sleep(delay, signal);
            p.resetColor(i);
            p.resetColor(i + 1);
        }

        lo++;
    }
}
*/

export const SelectionSort = (p) => {
    const {array, animations} = p;

    for (let i = 0; i < array.length; i++) {
        let min = i;
        for (let j = i + 1; j < array.length; j++) {
            animations.push(new ComparisonEvent({a: j, b: min}));
            if ( array[j] < array[min] ) {
                min = j;
            }
        }
        animations.push(new SwapEvent({a: i, b: min}));
        swap(array, i, min);
    }
}

/*
export const SelectionSort = async (p) => {
    const {array, delay, signal} = p;

    for (let i = 0; i < array.length; i++) {
        let min = array[i];
        let min_index = i;
        
        for (let j = i + 1; j < array.length; j++) {
            p.setColor(j, '#ff0000');

            p.stats.access++;
            p.stats.comparison++;
            if ( array[j] < min ) {
                p.resetColor(min_index)
                p.stats.access++;
                min = array[j];
                min_index = j;
                p.setColor(j, '#1aa7ec');
            }

            await sleep(delay, signal);
            
            if ( j !== min_index )
                p.resetColor(j);
        }

        if (min_index !== i) {
            p.stats.swap++;
            p.stats.access += 2;
            p.setColor(i, '#1aa7ec');
            p.setColor(min_index, '#1aa7ec');
            await sleep(delay, signal);
            swap(array, i, min_index);
        }

        p.resetColor(i - 1);
        p.setColor(i, '#00ff00');
    }
    p.resetColor(array.length - 1);
}
*/

export const InsertionSort = (p) => {
    const {array, animations} = p;

    for (let i = 0; i < p.array.length; i++) {
        animations.push(new AccessEvent({index: i}));
        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key) {
            animations.push(new ComparisonEvent({a: j, b: key, bIsValue: true}));
            animations.push(new AssignEvent({from: j, to: j + 1}));
            array[j + 1] = array[j];
            j--;
        }
        if ( j >= 0 ) animations.push(new ComparisonEvent({a: j, b: key, bIsValue: true}));
        animations.push(new AssignEvent({from: key, to: j + 1, fromIsValue: true}));
        array[j + 1] = key;
    }
}

/*
export const InsertionSort = async (p) => {
    const {array, delay, signal} = p;

    for (let i = 0; i < p.array.length; i++) {
        p.stats.access++;
        let key = array[i];
        let j = i - 1;

        p.stats.comparison++;
        p.stats.access++;
        while (j >= 0 && array[j] > key) {
            p.stats.comparison++;
            p.stats.access += 2;

            p.setColor(j, '#ff0000');
            p.setColor(j + 1, '#ff0000');
            await sleep(delay, signal);
            array[j + 1] = array[j];
            j--;

            p.resetColor(j + 1);
            p.resetColor(j + 2);
        }
        p.stats.access++;
        array[j + 1] = key;
    }
}
*/

export const MergeSort = (p, lo=undefined, hi=undefined) => {
    if ( lo === undefined && hi === undefined ) {
        lo = 0;
        hi = p.array.length - 1;
    }

    if ( lo < hi ) {
        const {array, animations} = p;
        
        let mid = Math.floor(lo + (hi - lo) / 2);

        MergeSort(p, lo, mid);
        MergeSort(p, mid + 1, hi);

        let n1 = mid - lo + 1;
        let n2 = hi - mid;
        
        for (let i = 0; i < n1; i++) animations.push(new AccessEvent({index: lo + i}));
        const L = Array.from({length: n1}, (_, i) => array[lo + i]);
        for (let i = 0; i < n2; i++) animations.push(new AccessEvent({index: mid + 1 + i}));
        const R = Array.from({length: n2}, (_, i) => array[mid + 1 + i]);
  
        let i = 0, j = 0;
        let k = lo;

        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                animations.push(new AssignEvent({from: L[i], to: k, fromIsValue: true}));
                array[k] = L[i];
                i++;
            } else {
                animations.push(new AssignEvent({from: R[j], to: k, fromIsValue: true}));
                array[k] = R[j];
                j++;
            }
            k++;
        }
  
        while (i < n1) {
            animations.push(new AssignEvent({from: L[i], to: k, fromIsValue: true}));
            array[k] = L[i];
            i++;
            k++;
        }
  
        while (j < n2) {
            animations.push(new AssignEvent({from: R[j], to: k, fromIsValue: true}));
            array[k] = R[j];
            j++;
            k++;
        }
    }
}

/*
export const MergeSort = async (p, lo=undefined, hi=undefined) => {
    if ( lo === undefined && hi === undefined ) {
        lo = 0;
        hi = p.array.length - 1;
    }

    if ( lo < hi ) {
        const {array, delay, signal} = p;
        
        let mid = Math.floor(lo + (hi - lo) / 2);

        await MergeSort(p, lo, mid);
        await MergeSort(p, mid + 1, hi);

        let n1 = mid - lo + 1;
        let n2 = hi - mid;
        
        p.stats.access += n1;
        const L = Array.from({length: n1}, (_, i) => array[lo + i]);
        p.stats.access += n2;
        const R = Array.from({length: n2}, (_, i) => array[mid + 1 + i]);
  
        let i = 0, j = 0;
        let k = lo;

        for (let v = 0; v < n1 && v < n2; v++) {
            p.playNote(lo + v);
            p.setColor(lo + v, '#ff0000');
            p.setColor(mid + 1 + v, '#ff0000');
            await sleep(delay, signal);
            p.resetColor(lo + v);
            p.resetColor(mid + 1 + v);
        }

        while (i < n1 && j < n2) {
            p.stats.access += 2;
            p.stats.comparison++;

            if (L[i] <= R[j]) {
                p.stats.access++;
                array[k] = L[i];
                i++;
            } else {
                p.stats.access++;
                array[k] = R[j];
                j++;
            }

            p.setColor(k, '#00ff00');
            await sleep(delay, signal);
            p.resetColors();
            k++;
        }
  
        while (i < n1) {
            p.stats.access++;
            array[k] = L[i];
            i++;
            k++;
        }
  
        while (j < n2) {
            p.stats.access++;
            array[k] = R[j];
            j++;
            k++;
        }
    }
}
*/

export const MergeSortInPlace = (p, lo=undefined, hi=undefined) => {
    if ( lo === undefined && hi === undefined ) {
        lo = 0;
        hi = p.array.length - 1;
    }

    if ( lo < hi ) {
        const {array, animations} = p;
        
        let mid = Math.floor(lo + (hi - lo) / 2);

        MergeSortInPlace(p, lo, mid);
        MergeSortInPlace(p, mid + 1, hi);

        let lo2 = mid + 1;

        animations.push(new ComparisonEvent({a: mid, b: lo2}));
        if (array[mid] <= array[lo2]) {
            return;
        }
 
        while (lo <= mid && lo2 <= hi) {
            animations.push(new ComparisonEvent({a: lo, b: lo2}));
            if (array[lo] <= array[lo2]) {
                lo++;
            } else {
                animations.push(new AccessEvent({index: lo2}));
                let val = array[lo2];
                let idx = lo2;
 
                while (idx !== lo) {
                    animations.push(new AssignEvent({from: idx - 1, to: idx}));
                    array[idx] = array[idx - 1];
                    idx--;
                }
                animations.push(new AssignEvent({from: val, to: lo, fromIsValue: true}));
                array[lo] = val;
 
                lo++;
                mid++;
                lo2++;
            }
        }
    }
}

/*
export const MergeSortInPlace = async (p, lo=undefined, hi=undefined) => {
    if ( lo === undefined && hi === undefined ) {
        lo = 0;
        hi = p.array.length - 1;
    }

    if ( lo < hi ) {
        const {array, delay, signal} = p;
        
        let mid = Math.floor(lo + (hi - lo) / 2);

        await MergeSortInPlace(p, lo, mid);
        await MergeSortInPlace(p, mid + 1, hi);

        let lo2 = mid + 1;

        p.stats.comparison++;
        if (array[mid] <= array[lo2]) {
            return;
        }
        p.update();
 
        while (lo <= mid && lo2 <= hi) {
            p.stats.comparison++;
            if (array[lo] <= array[lo2]) {
                lo++;
            } else {
                let val = array[lo2];
                let idx = lo2;
 
                while (idx !== lo) {
                    p.stats.access += 2;
                    array[idx] = array[idx - 1];
                    idx--;

                    p.setColor(idx, '#ff0000');
                    p.update();
                    p.resetColor(idx);
                }
                p.stats.access++;
                array[lo] = val;
 
                lo++;
                mid++;
                lo2++;
                
                p.setColor(lo, '#ff0000');
                await sleep(delay, signal);
                p.resetColors();
            }
            p.update();
        }
    }
}
*/

export const QuickSortHoare = (p, lo=undefined, hi=undefined) => {
    if ( lo === undefined && hi === undefined ) {
        lo = 0;
        hi = p.array.length - 1;
    }

    if ( lo < hi ) {
        const {array, animations} = p;
        
        animations.push(new AccessEvent({index: lo}));
        let pivot = array[lo];

        let i = lo - 1;
        let j = hi + 1;
        while (i < j) {
            do {
                i++;
                animations.push(new ComparisonEvent({a: i, b: pivot, bIsValue: true}));
            } while ( array[i] < pivot );

            do {
                j--;
                animations.push(new ComparisonEvent({a: j, b: pivot, bIsValue: true}));
            } while ( array[j] > pivot );

            if ( i >= j ) break;

            animations.push(new SwapEvent({a: i, b: j}));
            swap(array, i, j);
        }

        QuickSortHoare(p, lo, j);
        QuickSortHoare(p, j + 1, hi);
    }
}

/*
export const QuickSortHoare = async (p, lo=undefined, hi=undefined) => {
    if ( lo === undefined && hi === undefined ) {
        lo = 0;
        hi = p.array.length - 1;
    }

    if ( lo < hi ) {
        const {array, delay, signal} = p;
        
        p.stats.access++;
        let pivot = array[lo];

        let i = lo - 1;
        let j = hi + 1;
        while (i < j) {
            do {
                i++;
                p.setColor(i, '#ff0000');
                p.stats.access++;
                p.stats.comparison++;
            } while ( array[i] < pivot );

            do {
                j--;
                p.setColor(j, '#ff0000');
                p.stats.access++;
                p.stats.comparison++;
            } while ( array[j] > pivot );

            if ( i >= j ) {
                break;
            }
            
            p.stats.access += 2;
            p.stats.swap++;
            swap(array, i, j);
            p.setColor(i, '#00ff00');
            p.setColor(j, '#00ff00');

            await sleep(delay, signal);
            p.resetColors();
        }
        p.resetColors();

        await QuickSortHoare(p, lo, j);
        await QuickSortHoare(p, j + 1, hi);
    }
}
*/

export const QuickSortIterative = (p) => {
    const {array, animations} = p;

    // !!! workaround, since display array can't have negative values
    const pivots = Array.from({length: array.length}, (_, i) => 0);

    let lo = 0, hi = array.length - 1;
    let i = 0, j = hi;
    while (true) {
        i--;
        while (lo < j) {
            let tempLo = lo, tempHi = j;
            
            let pivotIndex = Math.floor(tempLo + (tempHi - tempLo) / 2);
            animations.push(new AccessEvent({index: pivotIndex}));
            let pivot = array[pivotIndex];
            
            while (tempLo <= tempHi) {
                while (array[tempHi] > pivot) {
                    animations.push(new ComparisonEvent({a: tempHi, b: pivot, bIsValue: true}));
                    tempHi--;
                }
                animations.push(new ComparisonEvent({a: tempHi, b: pivot, bIsValue: true}));
                
                while (array[tempLo] < pivot) {
                    animations.push(new ComparisonEvent({a: tempLo, b: pivot, bIsValue: true}));
                    tempLo++;
                }
                animations.push(new ComparisonEvent({a: tempLo, b: pivot, bIsValue: true}));

                if (tempLo <= tempHi) {
                    animations.push(new SwapEvent({a: tempLo, b: tempHi}));
                    swap(array, tempLo, tempHi);
                    tempLo++;
                    tempHi--;
                }
            }

            animations.push(new AccessEvent({index: j}));
            pivots[j] = array[j] * -1;
            j = tempLo - 1;
            ++i;
        }

        if (i < 0)
            break;
        lo++;

        let hasBroken = false;
        let v;
        for (v = lo; v < array.length; ++v) {
            if (pivots[v] < 0) {
                hasBroken = true;
                break;
            }
        }
        if (!hasBroken) {
            v = array.length - 1;
        }
        j = v;

        animations.push(new AccessEvent({index: j}));
        pivots[j] = array[j] * -1;
    }
}

/*
export const QuickSortIterative = async (p) => {
    const {array, delay, signal} = p;

    // !!! workaround, since display array can't have negative values
    const pivots = Array.from({length: array.length}, (_, i) => 0);

    let lo = 0, hi = array.length - 1;
    let i = 0, j = hi;
    while (true) {
        i--;
        while (lo < j) {
            let tempLo = lo, tempHi = j;
            p.stats.access++;
            let pivot = array[Math.floor(tempLo + (tempHi - tempLo) / 2)];
            
            while (tempLo <= tempHi) {
                p.stats.access++;
                while (array[tempHi] > pivot) {
                    p.stats.access++;
                    p.stats.comparison++;
                    p.setColor(tempHi, '#ff0000');
                    tempHi--;
                }
                p.stats.access++;
                while (array[tempLo] < pivot) {
                    p.stats.access++;
                    p.stats.comparison++;
                    p.setColor(tempLo, '#ff0000');
                    tempLo++;
                }

                if (tempLo <= tempHi) {
                    p.stats.access += 2;
                    p.stats.swap++;
                    p.setColor(tempLo, '#00ff00');
                    p.setColor(tempHi, '#00ff00');
                    await sleep(delay, signal);
                    
                    swap(array, tempLo, tempHi);
  
                    tempLo++;
                    tempHi--;
                }

                p.resetColors();
            }

            p.stats.access++;
            pivots[j] = array[j] * -1;
            j = tempLo - 1;
            ++i;

            p.update();
        }

        if (i < 0)
            break;
        lo++;

        let hasBroken = false;
        let v;
        for (v = lo; v < array.length; ++v) {
            if (pivots[v] < 0) {
                hasBroken = true;
                break;
            }
        }
        if (!hasBroken) {
            v = array.length - 1;
        }
        j = v;

        p.stats.access++;
        pivots[j] = array[j] * -1;

        p.update();
    }
}
*/

export const CountingSort = (p) => {
    const {array, animations} = p;

    const max = Math.max(...array);
    const output = Array.from({length: array.length}, (_, i) => 0);
    const count = Array.from({length: max + 1}, (_, i) => 0);

    for (let i = 0; i < array.length; i++) {
        animations.push(new AccessEvent({index: i}));
        count[array[i]]++;
    }

    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    for (let i = array.length - 1; i >= 0; i--) {
        animations.push(new AccessEvent({index: i}));
        let countIndex = array[i];
        let outputIndex = count[countIndex] - 1;

        output[outputIndex] = countIndex;
        count[countIndex]--;
    }

    for (let i = 0; i < array.length; i++) {
        animations.push(new AssignEvent({from: output[i], to: i, fromIsValue: true}));
        array[i] = output[i];
    }
}

/*
export const CountSort = async (p) => {
    const {array, delay, signal} = p;

    const max = Math.max(...array);

    const output = Array.from({length: array.length}, (_, i) => 0);
    const count = Array.from({length: max + 1}, (_, i) => 0);

    for (let i = 0; i < array.length; i++) {
        p.resetColor(i - 1);
        p.stats.access++;
        count[array[i]]++;
        p.setColor(i, '#ff0000');
        await sleep(delay, signal);
    }
    p.resetColor(array.length - 1);

    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    for (let i = array.length - 1; i >= 0; i--) {
        p.stats.access++;
        let countIndex = array[i];
        let outputIndex = count[countIndex] - 1;

        output[outputIndex] = countIndex;
        count[countIndex]--;
        p.update();
    }

    for (let i = 0; i < array.length; i++) {
        p.stats.access++;
        array[i] = output[i];
        await sleep(delay, signal);
        p.update();
    }
}
*/

export const RadixSortLSD = (p) => {
    const {array, animations, base} = p;

    let max = Math.max(...p.array);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= base) {
        const output = Array.from({length: array.length}, (_, i) => 0);
        const count = Array.from({length: base}, (_, i) => 0);

        let i;
        for (i = 0; i < array.length; i++) {
            animations.push(new AccessEvent({index: i}));
            count[Math.floor(array[i] / exp) % base]++;
        }

        for (i = 1; i < count.length; i++) {
            count[i] += count[i - 1];
        }

        for (i = array.length - 1; i >= 0; i--) {
            animations.push(new AccessEvent({index: i}));
            let val = array[i];
            let countIndex = Math.floor(val / exp) % base;
            let outputIndex = count[countIndex] - 1;

            output[outputIndex] = val;
            count[countIndex]--;
        }

        for (i = 0; i < array.length; i++) {
            animations.push(new AssignEvent({from: output[i], to: i, fromIsValue: true}));
            array[i] = output[i];
        }
    }
}

/*
export const RadixSortLSD = async (p, base=10) => {
    const {array, delay, signal} = p;

    let max = Math.max(...p.array);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= base) {
        const output = Array.from({length: array.length}, (_, i) => 0);
        const count = Array.from({length: base}, (_, i) => 0);

        let i;
        for (i = 0; i < array.length; i++) {
            p.resetColor(i - 1);
            p.stats.access++;
            count[Math.floor(array[i] / exp) % base]++;
            p.setColor(i, '#ff0000');
            await sleep(delay, signal);
        }
        p.resetColor(array.length - 1);

        for (i = 1; i < count.length; i++) {
            count[i] += count[i - 1];
        }

        for (i = array.length - 1; i >= 0; i--) {
            p.stats.access++;
            let countIndex = Math.floor(array[i] / exp) % base;
            let outputIndex = count[countIndex] - 1;

            p.stats.access++;
            output[outputIndex] = array[i];
            count[countIndex]--;
            p.update();
        }

        for (i = 0; i < array.length; i++) {
            p.stats.access++;
            array[i] = output[i];
            await sleep(delay, signal);
            p.update();
        }
    }
}
*/