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
  CForm,
  CTextarea,
} from '@coreui/react'
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import { Link,useParams } from 'react-router-dom';
import api from '../../../services/http-request';

const ProcessSave = () => {

  const style = {
    label: {
      fontSize: '.75rem',
      fontWeight: 'bold',
      lineHeight: 2,
    },
  };

  const [validated, setValidated] = React.useState(false);
  const [companies, setCompanies] = React.useState([]);
  const [offices, setOffices] = React.useState([]);
  const [attorney, setAttorney] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [haveSearchPermission, sethaveSearchPermission] = React.useState(true);
  const [actions, setActions] = React.useState([]);
  const [action, setAction] = React.useState([])

  const form = document.getElementById('processsave');

  const isEmpty = (obj) => Object.keys(obj).length  === 0;
  const existKey = (array,key) => !isEmpty(array.filter((obj) => { return obj === key}));
  const handleChange = (value) => {setAction(value)};
  const handleInputChange = (value) => {setSearch(value)}

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
      value = existKey(['city','companyType'],key) ?  {"id":value} : value;
      if(key !== 'status') object[key] = value;
      if(key === 'cnpj') object[key] = value.replace(/\D/g, '');
    });
    object['status'] = document.getElementById('situation').checked ? true : false;
    object['id'] = document.getElementById('id').value;
    
    if(isEmpty(object.id)) {
      postCompany(object);
      return;
    }
    putCompany(object); 
  }

  const getCompany = async (id) => {
    const result = await api.get(`/companies?id=${id}`);
    const data = result.data.data.data[0];
    
    if(data) {
      Object.keys(data).forEach(function(key) {
        try{
          if(['companyType'].includes(key)) {
            document.getElementsByName(key)[0].value = data[key].id
            return;
          }

          if(['action'].includes(key)) {
            setActions({label: data[key].name.concat(' - ', data[key].state.uf), value: data[key].id});
            return;
          }

          if(['situation'].includes(key)) {
            const situation = data[key].id === 1 ? true : false;
            document.getElementsByName(key)[0].checked = situation;
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

  const putCompany = async (payload) => {
    try{
      const result = await api.put(`/companies/${payload.id.replace(/\D/g, '')}`,payload);

      if(result.status === 200){
        setValidated(false);
        form.reset();
        toast.success("Empresa atualizada com sucesso!", {duration: 6000, icon: '👏'});
        sethaveSearchPermission(false);
        return;
      }
    } catch(error) {
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar atualizar Processo!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const postCompany = async (payload) => {
    try{
      const result = await api.post('/companies',payload);

      if(result.status === 201){
        setValidated(false);
        form.reset();
        const message = result.data.data.message ?? "Cadastrado com sucesso!"
        toast.success(message, {duration: 6000, icon: '👏'});
        sethaveSearchPermission(false);
        return;
      }
    } catch(error) {
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar cadastrar o processo!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const findCompanies = async () => {
    try{
      const result = await api.get('/companies',{
          companyType: 1,
          order: "nameFantasy",
          sort: "ASC",
          limit: 120
      });
      setCompanies(result.data.data.data ?? []);
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar empresas!", {duration: 4000 ,icon: '🔥'});
    } 
  }

  const findOffices = async () => {
    try{
      const result = await api.get('/companies',{
          companyType: 2,
          order: "nameFantasy",
          sort: "ASC",
          limit: 120
      });
      setOffices(result.data.data.data ?? []);
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar escritórios!", {duration: 4000 ,icon: '🔥'});
    } 
  }

  const findAttorney = async (event) => {
    try{
      const result = await api.get('/attorney',{
          office: event.target.value,
          order: "name",
          sort: "ASC",
          limit: 120
      });
      setAttorney(result.data.data.data ?? []);
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar advogados!", {duration: 4000 ,icon: '🔥'});
    } 
  }

  const findActions = async () => {
    try{
      const result =  await api.get('/actions',
        {
          order: "description",
          sort: "ASC",
          search_field:"description",
          search:search,
          limit: 120
        }
      );
      setActions(result.data.data.data ?? []);
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar ações!", {duration: 4000 ,icon: '🔥'});
    }
  }

  React.useEffect(()=> {
    findOffices();
    findCompanies();
  },[]);

  React.useEffect(() => {
    findActions();
  },[search])
  
  let { id } = useParams();

  if(id !== undefined && haveSearchPermission) {
    getCompany(id.replace(/\D/g, ''));
    sethaveSearchPermission(false);
  }

  return (
    <>
        <CRow>
          <CCol xs="12" sm="12">
            <CCard>
            <CCardHeader>
              Processo   
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to="/administrativo/process/list">
                  <CButton size="sm" color="info"> Listar Processos!</CButton>
                </Link>
              </div>
            </CCardHeader>
              <CCardBody>
                <CForm  wasValidated={validated} id="processsave">
                  <CRow>
                    <CCol xs="2">
                      <CFormGroup>
                        <CLabel htmlFor="id">ID Processo</CLabel>
                        <CInput id="id" name="id" placeholder="" disabled/>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel htmlFor="number">Número</CLabel>
                        <CInput id="number" name="number" placeholder="Informe o número do processo" required />
                        <CInvalidFeedback>O número do processo não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel htmlFor="notificationDate">Data de Notificação</CLabel>
                        <CInput id="notificationDate" type="date" name="notificationDate" placeholder="Informe a data de notificação" required />
                        <CInvalidFeedback>A data não pode ser vazia</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="company">Empresa ref. Processo</CLabel>
                        <CSelect custom id="company" name="company" required>
                          <option></option>
                          { companies.map((company) => (
                              <option key={company.id} value={company.id}>{company.nameFantasy}</option>
                            ))
                          }
                        </CSelect>
                        <CInvalidFeedback >Selecione uma empresa</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs="4">
                        <CFormGroup>
                        <CLabel htmlFor="office">Escritório Responsável</CLabel>
                        <CSelect custom id="office" name="office" onChange={findAttorney} required>
                            <option></option>
                            { offices.map((company) => (
                                <option key={company.id} value={company.id}>{company.nameFantasy}</option>
                            ))
                            }
                        </CSelect>
                        <CInvalidFeedback >Selecione uma escritório</CInvalidFeedback>
                        </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                        <CFormGroup>
                        <CLabel htmlFor="attorney">Advogado Responsável</CLabel>
                        <CSelect custom id="attorney" name="attorney" required>
                            <option></option>
                            { attorney.map((attorneyItem) => (
                                <option key={attorneyItem.id} value={attorneyItem.id}>{attorneyItem.name}</option>
                            ))
                            }
                        </CSelect>
                        <CInvalidFeedback >Selecione uma escritório</CInvalidFeedback>
                        </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="stageProcess">Estágio processo</CLabel>
                        <CInput id="stageProcess" name="stageProcess" placeholder="Estágio em que o processo se encontra" />
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                  <CCol xs="12">
                        <CFormGroup>
                        <CLabel htmlFor="action">Ação</CLabel>
                        <Select
                          isMulti={true}
                          value={action}
                          onChange={handleChange}
                          onInputChange={handleInputChange}
                          placeholder={"Selecione as ações"}
                          inputId="aria-input"
                          name="action"
                          options={actions.map((action)=>{
                            return {value: action.id, label: action.description?.concat(' - ', action?.actionType?.description) ?? '' }
                          })}
                          required
                        />
                        <CInvalidFeedback >Selecione uma ação</CInvalidFeedback>
                        </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs="4">
                          <CLabel htmlFor="links">Links Útils</CLabel>
                          <CTextarea 
                            name="links" 
                            id="links" 
                            rows="2"
                            placeholder="https://brasilia.gov.com.br, ..." 
                            />
                      </CCol>
                      <CCol xs="8">
                          <CLabel htmlFor="comment">Comentário</CLabel>
                          <CTextarea 
                            name="comment" 
                            id="observcommentation" 
                            rows="2"
                            placeholder="Comentário para movimentação inicial do processo..." 
                            />
                      </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs="5">
                          <CLabel htmlFor="description">Descrição</CLabel>
                          <CTextarea 
                            name="description" 
                            id="description" 
                            rows="4"
                            placeholder="Descrição..." 
                            />
                      </CCol>
                      <CCol xs="7">
                          <CLabel htmlFor="observation">Observação</CLabel>
                          <CTextarea 
                            name="observation" 
                            id="observation" 
                            rows="4"
                            placeholder="Observação..." 
                            />
                      </CCol>
                  </CRow>
                  <CRow>
                      <CCol>
                        <CFormGroup row>
                            <CCol tag="label" sm="3" className="col-form-label">
                                Está Ativo  ?
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

export default ProcessSave;
