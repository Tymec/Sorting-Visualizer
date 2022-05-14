export const sleep = async (ms, abortSignal) => {
    return new Promise((resolve, reject) => {
        //setTimeout(resolve, ms);
        const error = new DOMException('Calculation aborted by the user', 'AbortError');
        if ( abortSignal.aborted ) { // 2
            return reject(error);
        }

        if ( ms < 4 ) {
            return resolve(1);
        }

        const timeout = setTimeout( ()=> {
            resolve(1);
        }, ms);

        abortSignal.addEventListener('abort', () => {
            
            clearTimeout(timeout);
            reject(error);
        });
    });
}

export const range = (value, min1, max1, min2, max2) => {
    return (value - min1) * (max2 - min2) / (max1 - min1) + min2;
}

export const swap = (array, i, j) => {
    if ( i === j ) return;
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}