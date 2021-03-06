var express = require('express');
var router = express.Router();
var models = require('../models');
var bcrypt = require('bcrypt');
var autorizarAdministrador = require('../controllers/autenticacion/autorizarAdministrador');


/* */
router.post('/registro_usuario', autorizarAdministrador, function(req, res, next) {
  bcrypt.hash(req.body.password, 10, function(err, hash){
    models.usuarios.findOne({
      where: {usuario: req.body.usuario}
    })
    .then(x => {
      if(!x){
        models.usuarios.create({
          nombre: req.body.nombre, 
          apellido: req.body.apellido,
          cedula: req.body.cedula,
          fecha_ingreso: new Date(),
          fecha_nacimiento: new Date(),
          area_id: req.body.area_id,
          cargo: req.body.cargo,
          rol: req.body.rol,
          habilitado: req.body.habilitado,
          correo: req.body.correo,
          usuario: req.body.usuario,
          password: hash,
        })
        .then(usuario => {
          res.status(201).json('ok');
        })
        .catch(error => {
          console.log(error);
          res.status(500).json(error);    
        })
      }
      else {
        res.status(409).json('usuario ya existe');
      }
    })  
    
  })
});

router.post('/actualizar_usuario', autorizarAdministrador, function(req, res, next){
  if(req.body.actualizar_password){
    bcrypt.hash(req.body.password, 10, function(err, hash){
      models.usuarios.update({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        cedula: req.body.cedula,
        fecha_ingreso: req.body.fecha_ingreso,
        fecha_nacimiento: req.body.fecha_nacimiento,
        area_id: req.body.area_id,
        cargo: req.body.cargo,
        rol: req.body.rol,
        correo: req.body.correo,
        password: hash
      },
      {where: {id: req.body.id}}
      )
        .then((resultado) => {
          if(resultado[0]){
            res.status(200).json('ok');
          }
          else{
            res.status(404).json('usuario no encontrado')
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json('err');
        });
    });
  }
  else{
    models.usuarios.update({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      cedula: req.body.cedula,
      fecha_ingreso: req.body.fecha_ingreso,
      fecha_nacimiento: req.body.fecha_nacimiento,
      area_id: req.body.area_id,
      cargo: req.body.cargo,
      rol: req.body.rol,
      correo: req.body.correo
    },
    {where: {id: req.body.id}}
    )
      .then((resultado) => {
        if(resultado[0]){
          res.status(200).json('ok');
        }
        else{
          res.status(404).json('usuario no encontrado')
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json('err');
      });
  }
});

router.post('/habilitar_usuario', autorizarAdministrador, function(req, res){
  models.usuarios.update({
    habilitado: true
  },
  {where: {id: req.body.id}}
  )
    .then((resultado) => {
      if(resultado[0]){
        res.status(200).json('ok');
      }
      else{
        res.status(404).json('usuario no encontrado')
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json('err');
    });
});

router.post('/deshabilitar_usuario', autorizarAdministrador, function(req, res){
  models.usuarios.update({
    habilitado: false
  },
  {where: {id: req.body.id}}
  )
    .then((resultado) => {
      if(resultado[0]){
        res.status(200).json('ok');
      }
      else{
        res.status(404).json('usuario no encontrado')
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json('err');
    });
});

router.post('/actualizar_password', autorizarAdministrador, function(req, res){
  bcrypt.hash(req.body.password, 10, function(err, hash){
    models.usuarios.update(
      {password: hash},
      {where: {id: req.body.id}}
    )
    .then(resultado => {
      if(resultado[0]){
        res.status(200).json('ok');
      }
      else{
        res.status(404).json('usuario no encontrado');
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json('err');
    })
  });
});

router.get('/obtener_usuarios', autorizarAdministrador,  function(req, res){
  models.usuarios.findAll({
    attributes: {exclude: ['password']}
  })
    .then(resultado => {
      res.status(200).json(resultado);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json('err');
    });
});

router.post('/login', function(req, res) {
  models.usuarios.findOne(
    {where: {usuario: req.body.usuario, habilitado: true}},
  )
  .then(usuario => {
    // Si encuentra un usuario validado que tenga dicho correo, procede a validar el inicio de sesión
    if(usuario){
      bcrypt.compare(req.body.password, usuario.dataValues.password, (err, clave_valida) => {
        if(clave_valida){
          req.session.id_usuario = usuario.id;

          req.session.autenticado = true;
          req.session.area_id = usuario.area_id;
          req.session.rol = usuario.rol;
          req.session.nombre_completo = `${usuario.nombre} ${usuario.apellido}`;
          req.session.save();
          res.send(req.session);
        }
        else{
          res.status(401).json('password invalida');
        }
      });
    }
    //De lo contrario el usuario o no existe, o no se encuentra validado
    else{
      res.status(404).json('err');
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

/**
 * Cierra la sesión del usuario
 */
router.get('/logout', function(req,res){
  req.session.destroy();
  res.status(200).json('ok');
});

/**
 * Obtiene la sesión del usuario
 */
router.get('/session', function(req, res){
  if(req.session.autenticado){
    res.send(req.session);
  }
  else{
    res.status(401).json('err');
  }
});

router.post('/eliminar_usuario', autorizarAdministrador, function(req, res){
  models.usuarios.destroy({where: {id: req.body.id}})
  .then(resultado => {
    if(resultado){
      res.status(200).json('ok');
    }
    else{
      res.status(404).json('err');
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json('err');
  });
});

module.exports = router;
