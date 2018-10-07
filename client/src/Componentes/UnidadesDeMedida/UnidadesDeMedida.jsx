import React, { Component } from 'react';
import './UnidadesDeMedida.css';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Container, Table, Form, Label } from 'reactstrap';
import compass from '../../assets/img/compass.png';
import { request } from 'http';

// https://www.flaticon.com/free-icon/compass_1156951


export default class UnidadesDeMedida extends Component {
  constructor(props){
    super(props);
    this.state = {
      unidades_de_medida: [],
      modal_crear_unidad_abierto: false,
      modal_editar_unidad_abierto: false,
      nombre: undefined,
      id: undefined,
      habilitado: false,
      modal_operacion_exitosa: false,
      modal_operacion_fallida: false,
    };
    this.obtenerUnidadesDeMedida = this.obtenerUnidadesDeMedida.bind(this);
    this.verificarSesion = this.verificarSesion.bind(this);
    this.crearUnidadDeMedida = this.crearUnidadDeMedida.bind(this);
    this.cargarModalEditarUnidad = this.cargarModalEditarUnidad.bind(this);
    this.deshabilitarUnidad = this.deshabilitarUnidad.bind(this);
    this.habilitarUnidad = this.habilitarUnidad.bind(this);
    this.editarUnidad = this.editarUnidad.bind(this);
    this.validarModalCreacion = this.validarModalCreacion.bind(this);
    this.validarModalEdicion = this.validarModalEdicion.bind(this);
  }

  async editarUnidad(){
    if(this.validarModalEdicion()){
      const request_options = {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          id: this.state.id,
          nombre: this.state.nombre,
          habilitado: this.state.habilitado
        })
      };

      const editar_unidad_request = await fetch(`/api/unidades_de_medida/actualizar_unidad_de_medida`, request_options);
      const editar_unidad_response = await editar_unidad_request.json();

      if(editar_unidad_response !== 'err'){
        this.setState({modal_editar_unidad_abierto: false, modal_operacion_exitosa: true, mensaje: "Unidad de medida editada correctamente"}, async () => {
          this.obtenerUnidadesDeMedida();
        });
      }
      else{
        this.setState({modal_operacion_fallida: true, modal_editar_unidad_abierto: false, mensaje: "Error editando la unidad de medida"});
      }
    }
  }

  async deshabilitarUnidad(){
    const request_options = {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        id: this.state.id
      })
    };

    const deshabilitar_unidad_request = await fetch(`/api/unidades_de_medida/deshabilitar_unidad_de_medida`, request_options);
    const deshabilitar_unidad_response = await deshabilitar_unidad_request.json();

    if(deshabilitar_unidad_response !== 'err'){
      this.setState({modal_editar_unidad_abierto: false, modal_operacion_exitosa: true, mensaje: "Unidad de medida deshabilitada correctamente"}, async () => {
        this.obtenerUnidadesDeMedida();
      });
    }
    else{
      this.setState({modal_operacion_fallida: true, modal_editar_unidad_abierto: false, mensaje: "Error deshabilitando la unidad de medida"});
    }
  }


  async habilitarUnidad(){
    const request_options = {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        id: this.state.id
      })
    };

    const habilitar_unidad_request = await fetch(`/api/unidades_de_medida/habilitar_unidad_de_medida`, request_options);
    const habilitar_unidad_response = await habilitar_unidad_request.json();

    if(habilitar_unidad_response !== 'err'){
      this.setState({modal_editar_unidad_abierto: false, modal_operacion_exitosa: true, mensaje: "Unidad de medida habilitada correctamente"}, async () => {
        this.obtenerUnidadesDeMedida();
      });
    }
    else{
      this.setState({modal_operacion_fallida: true, modal_editar_unidad_abierto: false, mensaje: "Error habilitando la unidad de medida"});
    }
  }

  async crearUnidadDeMedida() {
    if(this.validarModalCreacion()){
      const request_options = {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          nombre: this.state.nombre
        })
      };

      const crear_unidad_request = await fetch(`/api/unidades_de_medida/crear_unidad_de_medida`, request_options);
      const crear_unidad_response = await crear_unidad_request.json();

      if(crear_unidad_response !== 'err'){
        this.setState({modal_crear_unidad_abierto: false, modal_operacion_exitosa: true, mensaje: "Unidad de medida creada correctamente"}, async () => {
          this.obtenerUnidadesDeMedida();
        });
      }
      else{
        this.setState({modal_operacion_fallida: true, modal_crear_unidad_abierto: false, mensaje: "Error creando la unidad de medida"});
      }
    }
  }

  async obtenerUnidadesDeMedida(){
    const unidades_de_medida_request = await fetch('/api/unidades_de_medida/obtener_unidades_de_medida', {credentials: 'include'});
    const unidades_de_medida_response = await unidades_de_medida_request.json();

    if(unidades_de_medida_response !== 'err'){
      this.setState({unidades_de_medida: unidades_de_medida_response});
    }
    else{
      this.setState({modal_operacion_fallida: true, mensaje: "Error al obtener las unidades de medida"});
    }

  }

  async verificarSesion() {
    const session_request = await fetch('/api/auth/session', {credentials: 'include'});
    const session_response = await session_request.json();

    if(!session_response.autenticado){
      this.props.history.push('/');
    }
    else{
      return true;
    }
  }

  async componentDidMount(){
    document.title = "SICMB - Unidades de Medida";

    if(this.verificarSesion()){
      this.obtenerUnidadesDeMedida();
    }
  }

  cargarModalEditarUnidad(ind) {
    const unidad = this.state.unidades_de_medida[ind];
    console.log(unidad);

    this.setState({
      nombre: unidad.nombre,
      modal_editar_unidad_abierto: true,
      id: unidad.id,
      habilitado: unidad.habilitado
    });
  }

  validarModalCreacion(){
    let formulario_valido = true;

    // Validación del nombre
    if(this.state.nombre === undefined || !this.state.nombre.match(/^[A-Za-z\s]+$/)){
      document.getElementById("nombre-modal-creacion").style.display = 'block';
      formulario_valido = false;
    }
    else{
      document.getElementById("nombre-modal-creacion").style.display = 'none';
    }
    return formulario_valido;
  }
  
  validarModalEdicion(){
    let formulario_valido = true;

    // Validación del nombre
    if(this.state.nombre === undefined || !this.state.nombre.match(/^[A-Za-z\s]+$/)){
      document.getElementById("nombre-modal-edicion").style.display = 'block';
      formulario_valido = false;
    }
    else{
      document.getElementById("nombre-modal-edicion").style.display = 'none';
    }
    return formulario_valido;
  }

  render() {

    // Modal que muestra el formulario para poder crear una nueva unidad de medida
    let modal_crear_unidad = 
      <Modal isOpen={this.state.modal_crear_unidad_abierto} toggle={() => this.setState({modal_crear_unidad_abierto: !this.state.modal_crear_unidad_abierto})} size="md">
      <ModalHeader toggle={() => this.setState({modal_crear_unidad_abierto: !this.state.modal_crear_unidad_abierto})}>
        Crear nueva unidad de medida
      </ModalHeader>
      
      <ModalBody>
        <Form> 
          <FormGroup row>
            {/* Nombre de la unidad de medida*/}
            <Col xs={12} sm={12} md={12} lg={12}>
              <Label>Nombre de la unidad</Label>
              <Input 
                onChange={(e) => this.setState({nombre: e.target.value})}
              />
              <span id="nombre-modal-creacion" className="error-unidades-de-medida">Nombre inválido</span>
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      
      <ModalFooter>
        <Col className="text-center" xs={12} sm={12} md={12} lg={12} >
          <Button onClick={this.crearUnidadDeMedida} color="success" type="submit" className="boton-crear-modal">
            Crear unidad
          </Button>
          
          <Button color="danger" onClick={() => this.setState({modal_crear_unidad_abierto: false})} className="boton-cancelar-modal">
            Cancelar
          </Button>
        </Col>
      </ModalFooter>
    </Modal>
    ;

    // Modal que muestra el formulario para poder editar una unidad de medida existente
    let modal_editar_unidad = 
      <Modal isOpen={this.state.modal_editar_unidad_abierto} toggle={() => this.setState({modal_editar_unidad_abierto: !this.state.modal_editar_unidad_abierto})} size="md">
        <ModalHeader toggle={() => this.setState({modal_editar_unidad_abierto: !this.state.modal_editar_unidad_abierto})}>
          Editar unidad de medida
        </ModalHeader>
        
        <ModalBody>
          <Form> 
            <FormGroup row>
              {/* Nombre de la unidad de medida */}
              <Col xs={12} sm={12} md={12} lg={12}>
                <Label>Nombre</Label>
                <Input 
                  defaultValue={this.state.nombre}
                  onChange={(e) => this.setState({nombre: e.target.value})}
                />
                <span id="nombre-modal-edicion" className="error-unidades-de-medida">Nombre inválido</span>
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        
        <ModalFooter>
          <Col className="text-center" xs={12} sm={12} md={12} lg={12} >
            <Button color="success" onClick={this.editarUnidad} className="boton-crear-modal">
              Editar unidad
            </Button>

            {this.state.habilitado ? 
              <Button color="success" onClick={this.deshabilitarUnidad} className="boton-crear-modal">
                Deshabilitar
              </Button>  
              : 
              <Button color="success" onClick={this.habilitarUnidad} className="boton-crear-modal">
                Habilitar
              </Button>
            }
            
            <Button color="danger" onClick={() => this.setState({modal_editar_unidad_abierto: false})} className="boton-cancelar-modal">
              Cancelar
            </Button>
          </Col>
        </ModalFooter>
      </Modal>
    ;

    // Si al realizar cualquier operación ocurre algún error, se muestra este modal
    let modal_operacion_fallida = 
      <Modal isOpen={this.state.modal_operacion_fallida} toggle={() => this.setState({modal_operacion_fallida: !this.state.modal_operacion_fallida})}>
        <ModalHeader toggle={() => this.setState({modal_operacion_fallida: !this.state.modal_operacion_fallida})}>
          Error en la operación
        </ModalHeader>

        <ModalBody>
          <p>Ha ocurrido un error al procesar la operación.</p>
          <p>Mensaje: {this.state.mensaje}</p>
          <p>Revise la consola del navegador o del servidor para obtener más información acerca del error.</p>
        </ModalBody>

        <ModalFooter>
          <Col className="text-center" xs={12} sm={12} md={12} lg={12}>
            <Button color="danger" onClick={() => this.setState({modal_operacion_fallida: false})}>
              Cerrar
            </Button>
          </Col>
        </ModalFooter>

      </Modal>
    ;

    // Si al realizar cualquier operación, esta se realiza exitosamente, se muestra este modal
    let modal_operacion_exitosa = 
      <Modal isOpen={this.state.modal_operacion_exitosa} toggle={() => this.setState({modal_operacion_exitosa: !this.state.modal_operacion_exitosa})}>
        <ModalHeader toggle={() => this.setState({modal_operacion_exitosa: !this.state.modal_operacion_exitosa})}>
          Operación exitosa
        </ModalHeader>
        <ModalBody>
          <p>La operación se ha realizado exitosamente.</p>
          <p>Mensaje: {this.state.mensaje}</p>
        </ModalBody>
        <ModalFooter>
          <Col className="text-center" xs={12} sm={12} md={12} lg={12}>
            <Button color="danger" onClick={() => this.setState({modal_operacion_exitosa: false})}>
              Cerrar
            </Button>
          </Col>
        </ModalFooter>
      </Modal>
    ;

    return (
        <Container fluid className="container-unidades-de-medida">
          {/* Modales del componente */}
          {modal_crear_unidad}
          {modal_editar_unidad}
          {modal_operacion_fallida}
          {modal_operacion_exitosa}

          <Row>
            {/* Título de la sección */}
            <Col className="text-center" xs={12} sm={12} md={12} lg={12}>
              <img src={compass} className="icono-titulo"/>    
              <h1 className="titulo-unidades-de-medida">Gestión de Unidades de Medida</h1>
            </Col>

            {/* Botón para agregar unidades-de-medida */}
            <Col className="text-center" xs={12} sm={12} md={12} lg={12}>
              <Button color="info" className="boton-agregar" onClick={() => this.setState({modal_crear_unidad_abierto: true})}>
                <i className="iconos fa fa-plus" aria-hidden="true"></i>              
                Agregar unidad de medida
              </Button>
            </Col>
          </Row>

          {/* Si existen unidades-de-medida, muestra una tabla con su información */}
          {this.state.unidades_de_medida.length > 0 && 
              <Row className="row-unidades-de-medida">
              <Table striped className="tabla-unidades-de-medida">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre de la unidad de medida</th>
                    <th>Habilitada</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                  <tbody>
                  {this.state.unidades_de_medida.map((unidad, index) => {
                      return(
                      <tr key={`${unidad.id}_${unidad.nombre}`}>
                          <th scope="row">{unidad.id}</th>
                          <td>{unidad.nombre}</td>
                          <td>{unidad.habilitado ? <span>Si</span> : <span>No</span>}</td>
                          <td>
                          <Button 
                              color="info" className="boton-gestionar"
                              onClick={() => this.cargarModalEditarUnidad(index)}
                          >
                              <i class="iconos fa fa-cogs" aria-hidden="true"></i>                          
                              Gestionar
                          </Button>
                          </td>
                      </tr>
                      )
                  })}
                  </tbody>
              </Table>
              </Row>
          }
        </Container>
    )
  }
}
