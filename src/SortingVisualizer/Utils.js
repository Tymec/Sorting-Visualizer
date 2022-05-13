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

export const swap = (array, i, j) => {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}