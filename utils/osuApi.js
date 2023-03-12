const superagent = require('superagent') // libreria superagent para las peticiones a la api
let expireTime = 0 // tiempo de expiración del token v2

async function getV2Token () {
  // parametros para la autenticación del token v2
  const params = {
    grant_type: 'client_credentials',
    client_id: process.env.OSU_CLIENT_ID,
    client_secret: process.env.OSU_CLIENT_SECRET,
    scope: 'public'
  }

  // se consigue el token v2
  const { body } = await superagent.post('https://osu.ppy.sh/oauth/token').set('Content-Type', 'application/json').send(params)

  process.env.OSU_KEY_V2 = body.access_token // se guarda el token en una variable de entorno
  expireTime = Date.now() // se actualiza el tiempo de expiración
}

/**
 * Crea una petición a la osu! api v1 o v2.
 * @param {1|2} version - versión de la osu api a utilizar.
 * @param {string} endpoint - tipo petición a realizar.
 * @param {object} params - parametros de la petición.
 * @returns {array|object|null} resultados de la petición realizada.
 */
module.exports = async (version, endpoint, params = {}) => {
  try {
    let data // cuerpo de la petición

    // verifica la versión colocada
    if (Number(version) === 1) {
      // se consiguen los datos de la busqueda y se guardan
      data = await superagent.get(`https://osu.ppy.sh/api/${endpoint}`).query({ ...params, k: process.env.OSU_KEY_V1 })
    } else if (Number(version) === 2) {
      // verifica si no hay token o si el tiempo de expiración venció, en caso afirmativo, genera un nuevo token
      if (!process.env.OSU_KEY_V2 || Date.now() - new Date(expireTime).getTime() > 72000000) await getV2Token()
      // se consiguen los datos de la busqueda y se guardan
      data = await superagent.get(`https://osu.ppy.sh/api/v2/${encodeURI(endpoint)}`).query(params).set('Content-Type', 'application/json').set('Authorization', `Bearer ${process.env.OSU_KEY_V2}`)
    } else {
      return new TypeError('Invalid Version') // retorna si la versión colocada no es valida
    }

    return data.body // retorna el cuerpo de la busqueda
  } catch (error) {
    return null // retorna null si es que no encuentra nada o hubo algún error
  }
}
