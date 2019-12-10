//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BD
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_DB_URL;
}

process.env.URLDB = urlDB;

//Vencimiento del TOKEN
// 60 seg * 60 min * 24h * 30d
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED - Semilla de autentificación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo-alberto';

//Google client
process.env.CLIENT_ID = process.env.CLIENT_ID || '78921526797-04mtncvan92fre88nb3uadkcmgposl1m.apps.googleusercontent.com';