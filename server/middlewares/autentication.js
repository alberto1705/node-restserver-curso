const jwt = require('jsonwebtoken');

//========================
// Verificar token
//========================
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        };

        req.usuario = decoded.usuario;
        next();
    })
};

//========================
// Verificar token
//========================
let verificaAdminRole = (req, res, next) => {
    let rol = req.usuario.role;

    if (rol === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        })
    }

}

module.exports = {
    verificaToken,
    verificaAdminRole
}