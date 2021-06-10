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
import toast, { Toaster } from 'react-hot-toast';
import { Link,useParams } from 'react-router-dom'
import api from '../../../services/http-request';

const ActionSave = () => {
  const [validated, setValidated] = React.useState(false);
  const [actionsTypes, setActionsTypes] = React.useState([]);
  const [haveSearchPermission, sethaveSearchPermission] = React.useState(true);

  const form = document.getElementById('actionsave');

  const isEmpty = (obj) => Object.keys(obj).length  === 0;
  const existKey = (array,key) => !isEmpty(array.filter((obj) => { return obj === key}));

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
      value = existKey(['actionType'],key) ?  {"id":value} : value;
      if(key !== 'situation') object[key] = value;
    });
    object['situation'] = document.getElementById('situation').checked ? {"id":1} : {"id":2}
    object['id'] = document.getElementById('id').value;
    
    if(isEmpty(object.id)) {
      postAction(object);
      return;
    }
    putAction(object); 
  }

  const getAction = async (id) => {
    const result = await api.get(`/actions?id=${id}`);
    const data = result.data.data.data[0];

    if(data) {
      Object.keys(data).forEach(function(key) {
        try{
          if(['actionType'].includes(key)) {
            document.getElementsByName(key)[0].value = data[key].id
            return;
          }

          if(['situation'].includes(key)) {
            const situation = data[key].id === 1 ? true : false;
            document.getElementsByName(key)[0].checked = situation;
            return;
          }

          if(['description'].includes(key)) {
              document.getElementById("description").value = data[key];
          }

          document.getElementsByName(key)[0].value = data[key]
          return;
        } catch(error) {
          console.log(key);
        }
      });
    }
  }

  const putAction = async (payload) => {
    try{
      const result = await api.put(`/actions/${payload.id.replace(/\D/g, '')}`,payload);

      if(result.status === 200){
        setValidated(false);
        form.reset();
        toast.success("Ação atualizada com sucesso!", {duration: 6000, icon: '👏'});
        sethaveSearchPermission(false);
        return;
      }
    } catch(error) {
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar atualizar ação!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const postAction = async (payload) => {
    try{
      const result = await api.post('/actions',payload);

      if(result.status === 201){
        setValidated(false);
        form.reset();
        const message = result.data.data.message ?? "Ação cadastrada com sucesso!"
        toast.success(message, {duration: 6000, icon: '👏'});
        sethaveSearchPermission(false);
        return;
      }
    } catch(error) {
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar cadastrar Ação!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const findActionsTypes = async () => {
    try{
      const result = await api.get('/actions/types',{
        limit: 200,
        order: 'description',
        sort: 'ASC'
      });
      setActionsTypes(result.data.data.data ?? []);
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar tipos de ação!", {duration: 4000 ,icon: '🔥'});
    } 
  }

  React.useEffect(()=> {
    findActionsTypes();
  },[]);
  
  let { id } = useParams();

  if(id !== undefined && haveSearchPermission) {
    getAction(id.replace(/\D/g, ''));
    sethaveSearchPermission(false);
  }

  return (
    <>
        <CRow>
          <CCol xs="12" sm="12">
            <CCard>
            <CCardHeader>
              Ação   
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to="/administrativo/action/list">
                  <CButton size="sm" color="info"> Listar Ações!</CButton>
                </Link>
              </div>
            </CCardHeader>
              <CCardBody>
                <CForm  wasValidated={validated} id="actionsave">
                  <CRow>
                    <CCol xs="2">
                      <CFormGroup>
                        <CLabel htmlFor="id">ID Ação</CLabel>
                        <CInput id="id" name="id" placeholder="" disabled/>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel htmlFor="description">Nome</CLabel>
                        <CInput id="description" name="description" placeholder="Informe uma descrição" required />
                        <CInvalidFeedback>Descrição não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="actionType">Tipo Ação</CLabel>
                        <CSelect custom id="actionType" name="actionType" required>
                          <option></option>
                          { actionsTypes.map((type) => (
                              <option key={type.id} value={type.id}>{type.description}</option>
                            ))
                          }
                        </CSelect>
                        <CInvalidFeedback >Selecione um tipo de ação</CInvalidFeedback>
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
                                id="situation"
                                className="mr-1"
                                color="primary"
                                defaultChecked
                                shape="square"
                                variant="opposite"
                                name="situation"
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

export default ActionSave;
