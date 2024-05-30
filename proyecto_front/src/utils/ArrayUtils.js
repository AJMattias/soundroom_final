
export const ArrayUtils = {
    delete: (array, predicate) => {
        const idx =  array.findIndex(predicate)
        array.splice(idx, 1)
    },

    update: (array, predicate, replacement) => {
        const idx = array.findIndex(predicate)
        array.splice(idx, 1 )
        array.push(replacement)
    }
}