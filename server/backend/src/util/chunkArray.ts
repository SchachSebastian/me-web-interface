function chunkArray<T>(array: T[], maxSize: number): T[][] {
    const result: T[][] = [];

    for (let i = 0; i < array.length; i += maxSize) {
        result.push(array.slice(i, i + maxSize));
    }

    return result;
}
export default chunkArray;
