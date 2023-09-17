
/**
 * Filters an object based on the keys provided in an array.
 * only retyrning an object whose keys also exist in the provided array
 *
 * @param {Record<string, any>} obj - The object to filter.
 * @param {any[]} arr - The array of keys to filter the object by.
 * @return {Record<string, any>} - The filtered object.
 */
export function filterObjectWithArray(obj: Record<string, any>, arr: any[]): Record<string, any> {
    const filteredObj: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (arr.includes(key)) {
            filteredObj[key] = value;
        }
    });

    return filteredObj;
}
