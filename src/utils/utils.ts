export const range = (start: number, end: number, step: number = 1): number[] => {
    let output = [];

    if (typeof end === 'undefined') {
        end = start;
        start = 0;
    }

    for (let i = start; i < end; i += step) {
        output.push(i);
    }

    return output
}

export const averageArray = (numberArray: number[]): number => {
    let sum = 0;
    for (let element of numberArray) {
        sum += element
    }
    return sum / numberArray.length
}
