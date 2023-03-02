// aquí estaran algunas funciones necesarias de ayuda
module.exports = {    
    // ejemplo de una función de ayuda

    /**
     * devuelve un número aleatorio en el limite ingresado o devuelve un elemento aleatorio de un array ingresado.
     * @param {number|array} max - el limite o el array ingresado.
     * @returns {number|any} el número sacado o el elemento sacado.
     */
    random: (max = 0) => {
        if (typeof max === 'object') {
            return max[Math.floor(Math.random() * max.length)];
        } else {
            return Math.floor(Math.random() * max + 1);
        }
    }
}