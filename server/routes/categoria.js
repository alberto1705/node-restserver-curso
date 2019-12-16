const express = require('express');
let Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRole } = require('../middlewares/autentication');
let app = express();


// Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite;
    limite = Number(limite);

    Categoria.find().a('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.stat(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })
            })
        });
});

//Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.stat(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.stat(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

// Crear nueva categoria
app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// Actualiza categoria
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let descCategoria = {
        descripcion: req.body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

// Elimina categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Solo un administrador puede eliminar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });
});

module.exports = app;