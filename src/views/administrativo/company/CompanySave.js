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

const CompanySave = () => {

  const style = {
    label: {
      fontSize: '.75rem',
      fontWeight: 'bold',
      lineHeight: 2,
    },
  };

  const [validated, setValidated] = React.useState(false);
  const [companiesTypes, setCompaniesTypes] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [haveSearchPermission, sethaveSearchPermission] = React.useState(true);

  const form = document.getElementById('companysave');

  const isEmpty = (obj) => Object.keys(obj).length  === 0;
  const existKey = (array,key) => !isEmpty(array.filter((obj) => { return obj === key}));
  const handleChange = (value) => {setSearch(value)};


  const handleMask = (event) => {
    let onlyNumber = event.target.value.replace(/\D/g, '');
    onlyNumber = onlyNumber.substr(0,14);
    event.target.value = onlyNumber.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
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
      value = existKey(['city','companyType'],key) ?  {"id":value} : value;
      if(key !== 'situation') object[key] = value;
      if(key === 'cnpj') object[key] = value.replace(/\D/g, '');
    });
    object['situation'] = document.getElementById('situation').checked ? {"id":1} : {"id":2}
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
          if(['city','companyType'].includes(key)) {
            document.getElementsByName(key)[0].value = data[key].id
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
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar atualizar empresa!"
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
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar cadastrar empresa!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const findCompaniesTypes = async () => {
    try{
      const result = await api.get('/companies/types',{});
      setCompaniesTypes(result.data.data.data ?? []);
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar tipos de empresa!", {duration: 4000 ,icon: '🔥'});
    } 
  }

  const findCities = async () => {
    try{
      const result =  await api.get('/cities',
        {
          order: "name",
          sort: "ASC",
          search_field:"name",
          search:search,
          limit: 120
        }
      );
      setCities(result.data.data.data ?? []);
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar cidades!", {duration: 4000 ,icon: '🔥'});
    }
  }

  React.useEffect(()=> {
    findCompaniesTypes();
  },[]);

  React.useEffect(() => {
    findCities();
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
              Empresa   
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to="/administrativo/company/list">
                  <CButton size="sm" color="info"> Listar Empresas!</CButton>
                </Link>
              </div>
            </CCardHeader>
              <CCardBody>
                <CForm  wasValidated={validated} id="companysave">
                  <CRow>
                    <CCol xs="2">
                      <CFormGroup>
                        <CLabel htmlFor="idcompany">ID Empresa</CLabel>
                        <CInput id="id" name="id" placeholder="" disabled/>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="7">
                      <CFormGroup>
                        <CLabel htmlFor="name">Razão Social</CLabel>
                        <CInput id="name" name="companyName" placeholder="Informe a razão social" required />
                        <CInvalidFeedback>Razão social não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel htmlFor="name">CNPJ</CLabel>
                        <CInput id="cnpj" name="cnpj" placeholder="Informe o cnpj" onChange={handleMask}  required />
                        <CInvalidFeedback>Cnpj não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs="8">
                      <CFormGroup>
                        <CLabel htmlFor="nameFantasy">Nome Fantasia</CLabel>
                        <CInput id="nameFantasy" name="nameFantasy" placeholder="Informe o nome fantasia" required />
                        <CInvalidFeedback>Nome Fantasia não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="2">
                      <CFormGroup>
                        <CLabel htmlFor="city" style={style.label} id="aria-label">Cidade</CLabel>
                        <Select
                          onInputChange={handleChange}
                          inputId="aria-input"
                          name="city"
                          options={cities.map((city)=>{
                            return {value: city.id, label: city.name.concat(' - ', city.state.uf)}
                          })}
                          required
                        />
                        <CInvalidFeedback >Selecione uma cidade</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="2">
                      <CFormGroup>
                        <CLabel htmlFor="typeCompany">Tipo empresa</CLabel>
                        <CSelect custom id="typeCompany" name="companyType" required>
                          <option></option>
                          { companiesTypes.map((type) => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))
                          }
                        </CSelect>
                        <CInvalidFeedback >Selecione um tipo de empresa</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                      <CCol>
                        <CFormGroup row>
                            <CCol tag="label" sm="3" className="col-form-label">
                                Está Ativa ?
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

export default CompanySave;
