export function omit(object: any, arr: any) {
    return Object.keys(object)
        .filter(k => !arr.includes(k))
        .reduce((acc: any, key) => ((acc[key]) = object[key], acc), {})
}