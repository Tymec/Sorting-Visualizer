import { sleep, swap } from './Utils';

export const BubbleSort = async (p) => {
    const { array, delay, signal } = p;

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            p.stats.access += 2;
            p.stats.comparison++;

            p.setColor(j, '#ff0000');
            p.stats.comparison++;
            if (array[j] > array[j + 1]) {
                p.stats.swap++;
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

            array[j + 1] = array[j];
            j = j - 1;

            await sleep(delay, signal);
            p.resetColor(j);
            p.resetColor(j + 1);
        }
        p.stats.access++;
        array[j + 1] = key;
    }
}

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
