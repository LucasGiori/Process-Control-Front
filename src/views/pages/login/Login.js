import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CInvalidFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import toast, { Toaster } from 'react-hot-toast';
import api from '../../../services/http-request';
import { Redirect } from 'react-router-dom'

const Login = () => {
  const [validated, setValidated] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  
  const TOKEN = 'token-processcontrol';
  let redirecting =  redirect === true ? (<Redirect push to={'/dashboard'}/>) : '';

  const handleSubmit = (event) => {
    let form = document.getElementById("loginform");

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
      object[key] = value;
    });

    login(object);
    return;
  }

  const login = async (payload) => {
    try{
      const result = await api.post('/login',payload);
      let form = document.getElementById("loginform");

      if(result.status === 200){
        
        setValidated(false);
        form.reset();
        toast.success("Login realizado com sucesso!", {duration: 6000, icon: '👏'});

        const token = result.data.data.accesstoken;
        const infoLogin = JSON.stringify(result.data.data);

        window.localStorage.setItem(TOKEN, token);
        window.localStorage.setItem('data', infoLogin);
        setRedirect(true);
        
        return;
      }
    } catch(error) {
      console.log(error);
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar realizar o login!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm  wasValidated={validated} id="loginform">
                    <h1>Login</h1>
                    <p className="text-muted">Faça login na sua conta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" name="login" placeholder="Login" required/>
                      <CInvalidFeedback>Login não pode ser vazio</CInvalidFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" name="password" placeholder="Password" required/>
                      <CInvalidFeedback>Password não pode ser vazio</CInvalidFeedback>
                    </CInputGroup>
                    </CForm>
                    <CRow>
                      <CCol xs="6">
                        <CButton  onClick={handleSubmit} type="button" color="primary" className="px-4">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Esqueceu a senha?</CButton>
                      </CCol>
                    </CRow>
                  {redirecting}
                  <Toaster  position="top-right"/>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
