export function omit(object, arr) {
    return Object.keys(object)
        .filter(k => !arr.includes(k))
        .reduce((acc, key) => ((acc[key]) = object[key], acc), {})
}