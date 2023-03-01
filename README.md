# Instalación he inicio del bot
Primero tienes que clonar el repositorio, para ello vas a la carpeta donde quieres que esté la carpeta clonada y abres la terminal allí, una vez hecho esto ejecutas el comando `git clone https://github.com/Shiroe2324/Kreythm.git`, esto clonará la carpeta con todos los archivos necesarios, una vez clonada la carpeta la abres y allí creas un archivo llamado `.env` y colocas lo que aparece en el archivo `.env.example` cambiando las variables a su gusto. 

para poder iniciar el bot tienes que abrir la terminal e ir a la carpeta donde tengas instalado el repositorio, una vez allí tienes que ejecutar el comando `npm install --save` para instalar las dependencias necesarias como discord.js, superagent, dotenv, etc... Una vez que se instalen las dependencias, para iniciar el bot es necesario ejecutar el comando `npm start` el cual hará todo y se mostrará en consola el texto `bot ready` indicando que el bot está listo.

## Ejemplo:

```sh
$cd C:\Users\User\Desktop

$git clone https://github.com/Shiroe2324/Kreythm.git

$cd Kreythm

# creas el archivo .env y sus variables

$npm install --save

$npm start
```