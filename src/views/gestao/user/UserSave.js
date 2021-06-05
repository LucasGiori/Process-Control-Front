import React from 'react'
import {
  CButton,
  CCard,
  CCardFooter,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CSelect,
  CRow,
  CSwitch,
  CInvalidFeedback,
  CForm
} from '@coreui/react'
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import { Link,useParams } from 'react-router-dom'
import api from '../../../services/http-request';

const UserSave = () => {

  const style = {
    label: {
      fontSize: '.75rem',
      fontWeight: 'bold',
      lineHeight: 2,
    },
  };

  const [validated, setValidated] = React.useState(false);
  const [userTypes, setUserTypes] = React.useState([]);
  const [haveSearchPermission, sethaveSearchPermission] = React.useState(true);

  const form = document.getElementById('usersave');

  const isEmpty = (obj) => Object.keys(obj).length  === 0;
  const existKey = (array,key) => !isEmpty(array.filter((obj) => { return obj === key}));

  const handleMask = (event) => {
    let onlyNumber = event.target.value.replace(/\D/g, '');
    onlyNumber = onlyNumber.substr(0,11);
    event.target.value = onlyNumber.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  const handleSubmit = (event) => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
      setValidated(true);
      return
    }

    setValidated(true);

    const formdata = new FormData(form);
    var object = {}
    formdata.forEach(function(value, key){
      value = existKey(['userType'],key) ?  {"id":value} : value;
      if(key !== 'status') object[key] = value;
      if(key === 'cpf') object[key] = value.replace(/\D/g, '');
    });
    object['status'] = document.getElementById('status').checked ? true : false
    object['id'] = document.getElementById('id').value;
    
    if(isEmpty(object.id)) {
      postUser(object);
      return;
    }
    putUser(object); 
  }

  const getUser = async (id) => {
    const result = await api.get(`/users?id=${id}`);
    const data = result.data.data.data[0];

    if(data) {
      Object.keys(data).forEach(function(key) {
        try{
          if(['userType'].includes(key)) {
            document.getElementsByName(key)[0].value = data[key].id
            return;
          }

          if(['status'].includes(key)) {
            document.getElementsByName(key)[0].checked = data[key];
            return;
          }

          document.getElementsByName(key)[0].value = data[key]
          return;
        } catch(error) {
          console.log(key);
        }
      });
    }
  }

  const putUser = async (payload) => {
    try{
      const result = await api.put(`/users/${payload.id.replace(/\D/g, '')}`,payload);

      if(result.status === 200){
        setValidated(false);
        form.reset();
        toast.success("Usuário atualizado com sucesso!", {duration: 6000, icon: '👏'});
        sethaveSearchPermission(false);
        return;
      }
    } catch(error) {
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar atualizar usuário!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const postUser = async (payload) => {
    try{
      console.log(payload);
      const result = await api.post('/users',payload);

      if(result.status === 201){
        setValidated(false);
        form.reset();
        const message = result.data.data.message ?? "Cadastrado com sucesso!"
        toast.success(message, {duration: 6000, icon: '👏'});
        sethaveSearchPermission(false);
        return;
      }
    } catch(error) {
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar cadastrar Usuário!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const findUserTypes = async () => {
    try{
      const result = await api.get('/users/types',{
        limit: 100,
        order: 'id',
        sort: 'ASC'
      });
      setUserTypes(result.data.data.data ?? []);
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar tipos de usuário!", {duration: 4000 ,icon: '🔥'});
    } 
  }

  React.useEffect(()=> {
    findUserTypes();
  },[]);
  
  let { id } = useParams();

  const TYPE_USER_ORDINARY = 2;
  const infoLogin = JSON.parse(window.localStorage.getItem('data') ?? '{}');

  if(id !== undefined && haveSearchPermission) {
    id = parseInt(id.replace(/\D/g, ''));
    
    if(parseInt(infoLogin.type) === TYPE_USER_ORDINARY && parseInt(infoLogin.iduser) === id) {
      alert(id);
      getUser(id);
    }
    sethaveSearchPermission(false);
  }

  return (
    <>
        <CRow>
          <CCol xs="12" sm="12">
            <CCard>
            <CCardHeader>
              Usuário   
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to="/gestao/user/list">
                  <CButton size="sm" color="info"> Listar Usuarios!</CButton>
                </Link>
              </div>
            </CCardHeader>
              <CCardBody>
                <CForm  wasValidated={validated} id="usersave">
                  <CRow>
                    <CCol xs="2">
                      <CFormGroup>
                        <CLabel htmlFor="id">ID User</CLabel>
                        <CInput id="id" name="id" placeholder="" disabled/>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="name">Nome</CLabel>
                        <CInput id="name" name="name" placeholder="Informe o nome do usuário" required />
                        <CInvalidFeedback>Nome não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel htmlFor="cpf">CPF</CLabel>
                        <CInput id="cpf" name="cpf" placeholder="Informe o cpf" onChange={handleMask}  required />
                        <CInvalidFeedback>CPF não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel htmlFor="login">Login</CLabel>
                        <CInput id="login" name="login" placeholder="Informe o login" required />
                        <CInvalidFeedback>Login não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="email">Email</CLabel>
                        <CInput id="email" name="email"  type="email" placeholder="Informe o email" required />
                        <CInvalidFeedback>Email não não é válido</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="password">Senha</CLabel>
                        <CInput id="password" type="password" name="password" placeholder="Informe a senha"required />
                        <CInvalidFeedback>Senha não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="office">Tipo</CLabel>
                        <CSelect custom id="userType" name="userType" required>
                          <option></option>
                          { userTypes.map((type) => (
                              <option key={type.id} value={type.id}>{type.description}</option>
                            ))
                          }
                        </CSelect>
                        <CInvalidFeedback >Selecione um escritório</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                      <CCol>
                        <CFormGroup row>
                            <CCol tag="label" sm="3" className="col-form-label">
                                Está Ativo ?
                            </CCol>
                            <CCol sm="12">
                                <CSwitch
                                id="status"
                                className="mr-1"
                                color="primary"
                                defaultChecked
                                shape="square"
                                variant="opposite"
                                name="status"
                                />
                            </CCol>
                        </CFormGroup>
                    </CCol>
                </CRow>
              </CForm>
              <Toaster  position="top-right"/>
              </CCardBody>
              <CCardFooter>
                  <CButton  onClick={handleSubmit} type="button" color="primary">Salvar</CButton>
                </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
    </>
  )
}

export default UserSave;
