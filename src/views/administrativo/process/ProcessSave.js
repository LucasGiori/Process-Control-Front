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
// import DatePicker, { CalendarContainer } from 'react-datepicker';
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
  const [action, setAction] = React.useState([]);
  const [startDate, setStartDate] = React.useState(new Date());
  const [visibleFields,setVisibleFields] = React.useState(true);

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
    if(!document.getElementById('id')?.value && action.length <= 0) {
      toast.error("Selecione as ações referente ao processo!", {duration: 6000 ,icon: '🔥'});
      return;
    }

    const dt = document.getElementById("notificationDate").value.split('-');
    let object = {
      "id":document.getElementById('id')?.value ?? "",
      "number": document.getElementById("number").value,
      "company": {id: parseInt(document.getElementById("company").value)},
      "notificationDate": `${dt[1]}/${dt[2]}/${dt[0]} 00:00:00`,
      "observation": document.getElementById("observation").value,
      "description": document.getElementById("description").value,
      "status": document.getElementById('status').checked ? true : false,
    }
    const movements = [
      {
        "office": {id: parseInt(document.getElementById("office").value)},
        "attorney": {id: parseInt(document.getElementById("attorney").value)},
        "links": document.getElementById("links")?.value ?? "",
        "stageProcess": document.getElementById("stageProcess")?.value ?? "",
        "comment": document.getElementById("comment")?.value ?? ""
      }
    ];
    
    object["items"] = action.map(function(item) {return {action: {id: parseInt(item.value)}}})

    if(isEmpty(object.id)) {
      object["movements"] = movements;
      postProcess(object);
      return;
    }
    putProcess(object); 
  }

  const getProcess = async (id) => {
    setVisibleFields(false);
    const result = await api.get(`/process?id=${id}`);
    findAttorney(null);
    const data = result.data.data.data[0];
    console.log(data);
    if(data) {
      Object.keys(data).forEach(function(key) {
        try{
          if(['company'].includes(key)) {
            document.getElementById("company").value = data[key].id
            return;
          }

          if(['situation'].includes(key)) {
            const situation = data[key].id === 1 ? true : false;
            document.getElementsByName(key)[0].checked = situation;
            return;
          }

          if(['description'].includes(key)) {
            console.log('teste',data[key]);
            document.getElementById('description').value = data[key];
            return
          }

          document.getElementsByName(key)[0].value = data[key]
          return;
        } catch(error) {
          console.log(key);
        }
      });
    }
  }

  const putProcess = async (payload) => {
    try{
      const result = await api.put(`/process/${payload.id.replace(/\D/g, '')}`,payload);

      if(result.status === 200){
        setValidated(false);
        form.reset();
        setAction([]);
        toast.success("Processo Atualizado com sucesso!", {duration: 6000, icon: '👏'});
        sethaveSearchPermission(false);
        return;
      }
    } catch(error) {
      console.log(error.response)
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar atualizar Processo!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const postProcess = async (payload) => {
    try{

      const result = await api.post('/process',payload);
      
      if(result.status === 201){
        setValidated(false);
        form.reset();
        setAction([]);
        const message = result.data.data.message ?? "Process cadastrado com sucesso!"
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
      let filters = {
        order: "name",
        sort: "ASC",
        limit: 120
      };

      if(event?.target?.value) {
        filters["office"] = event.target.value;
      }

      const result = await api.get('/attorney',);
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
    getProcess(id.replace(/\D/g, ''));
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
                        
                        
                        <CInput type="date" id="notificationDate" name="notificationDate" placeholder="date" />
                        <CInvalidFeedback>A data não pode ser vazia</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="company">Empresa ref. Processo</CLabel>
                        <CSelect 
                          custom 
                          id="company" 
                          name="company"
                          required>
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
                    <CCol xs="4" hidden={!visibleFields}>
                        <CFormGroup >
                        <CLabel htmlFor="office">Escritório Responsável</CLabel>
                        <CSelect custom id="office" name="office" onChange={findAttorney} required={visibleFields}>
                            <option></option>
                            { offices.map((company) => (
                                <option key={company.id} value={company.id}>{company.nameFantasy}</option>
                            ))
                            }
                        </CSelect>
                        {visibleFields ? <CInvalidFeedback >Selecione um escritório</CInvalidFeedback> : ""}
                        </CFormGroup>
                    </CCol>
                    <CCol xs="4" hidden={!visibleFields}>
                        <CFormGroup>
                        <CLabel htmlFor="attorney">Advogado Responsável</CLabel>
                        <CSelect custom id="attorney" name="attorney" required={visibleFields}>
                            <option></option>
                            { attorney.map((attorneyItem) => (
                                <option key={attorneyItem.id} value={attorneyItem.id}>{attorneyItem.name}</option>
                            ))
                            }
                        </CSelect>
                        {visibleFields ? <CInvalidFeedback >Selecione um Advogado</CInvalidFeedback> : "" }
                        </CFormGroup>
                    </CCol>
                    <CCol xs="4" hidden={!visibleFields}>
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
                    <CCol xs="4" hidden={!visibleFields}>
                          <CLabel htmlFor="links">Links Útils</CLabel>
                          <CTextarea 
                            name="links" 
                            id="links" 
                            rows="2"
                            placeholder="https://brasilia.gov.com.br, ..." 
                            />
                      </CCol>
                      <CCol xs="8" hidden={!visibleFields}>
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
