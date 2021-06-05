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

const AttorneySave = () => {

  const style = {
    label: {
      fontSize: '.75rem',
      fontWeight: 'bold',
      lineHeight: 2,
    },
  };

  const [validated, setValidated] = React.useState(false);
  const [companies, setCompanies] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [haveSearchPermission, sethaveSearchPermission] = React.useState(true);
  const [city, setCity] = React.useState({label: '', value: ''});

  const form = document.getElementById('attorneysave');

  const isEmpty = (obj) => Object.keys(obj).length  === 0;
  const existKey = (array,key) => !isEmpty(array.filter((obj) => { return obj === key}));
  const handleChange = (value) => {setCity(value)};
  const handleInputChange = (value) => {setSearch(value)}

  const handleMask = (event) => {
    let onlyNumber = event.target.value.replace(/\D/g, '');
    onlyNumber = onlyNumber.substr(0,11);
    event.target.value = onlyNumber.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  const handleMaskPhone = (event) => {
    let onlyNumber = event.target.value.replace(/\D/g, '');
    onlyNumber = onlyNumber.substr(0,11);
    if(onlyNumber.length === 10){
        event.target.value = onlyNumber.replace(/^(\d{2})(\d{4})(\d{4})/, "($1)$2-$3");
        return;
    }
    event.target.value = onlyNumber.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1)$2.$3-$4");
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
      value = existKey(['city','office'],key) ?  {"id":value} : value;
      if(key !== 'situation') object[key] = value;
      if(key === 'cpf') object[key] = value.replace(/\D/g, '');
    });
    object['situation'] = document.getElementById('situation').checked ? {"id":1} : {"id":2}
    object['id'] = document.getElementById('id').value;
    
    if(isEmpty(object.id)) {
      postAttorney(object);
      return;
    }
    putAttorney(object); 
  }

  const getAttorney = async (id) => {
    const result = await api.get(`/attorney?id=${id}`);
    const data = result.data.data.data[0];

    if(data) {
      Object.keys(data).forEach(function(key) {
        try{
          if(['office'].includes(key)) {
            document.getElementsByName(key)[0].value = data[key].id
            return;
          }

          if(['city'].includes(key)) {
            setCity({label: data[key].name.concat(' - ', data[key].state.uf), value: data[key].id});
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

  const putAttorney = async (payload) => {
    try{
      const result = await api.put(`/attorney/${payload.id.replace(/\D/g, '')}`,payload);

      if(result.status === 200){
        setValidated(false);
        form.reset();
        toast.success("Advogado atualizado com sucesso!", {duration: 6000, icon: '👏'});
        sethaveSearchPermission(false);
        return;
      }
    } catch(error) {
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar atualizar advogado!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const postAttorney = async (payload) => {
    try{
      const result = await api.post('/attorney',payload);

      if(result.status === 201){
        setValidated(false);
        form.reset();
        const message = result.data.data.message ?? "Cadastrado com sucesso!"
        toast.success(message, {duration: 6000, icon: '👏'});
        sethaveSearchPermission(false);
        return;
      }
    } catch(error) {
      const message = error.response.data.error[0].message_error ?? "Erro ao tentar cadastrar advogado!"
      toast.error(message, {duration: 6000 ,icon: '🔥'});
    }
  }

  const findCompanies = async () => {
    try{
      const result = await api.get('/companies',{
        companyType: 2,
        situation: 1,
        limit: 200,
        order: 'nameFantasy',
        sort: 'ASC'
      });
      setCompanies(result.data.data.data ?? []);
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
    findCompanies();
  },[]);

  React.useEffect(() => {
    findCities();
  },[search])
  
  let { id } = useParams();

  if(id !== undefined && haveSearchPermission) {
    getAttorney(id.replace(/\D/g, ''));
    sethaveSearchPermission(false);
  }

  return (
    <>
        <CRow>
          <CCol xs="12" sm="12">
            <CCard>
            <CCardHeader>
              Advogado   
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to="/administrativo/attorney/list">
                  <CButton size="sm" color="info"> Listar Advogados!</CButton>
                </Link>
              </div>
            </CCardHeader>
              <CCardBody>
                <CForm  wasValidated={validated} id="attorneysave">
                  <CRow>
                    <CCol xs="2">
                      <CFormGroup>
                        <CLabel htmlFor="id">ID Advogado</CLabel>
                        <CInput id="id" name="id" placeholder="" disabled/>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel htmlFor="name">Nome</CLabel>
                        <CInput id="name" name="name" placeholder="Informe o nome" required />
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
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="oab">OAB</CLabel>
                        <CInput id="oab" name="oab" placeholder="Informe o identificador OAB" required />
                        <CInvalidFeedback>OAB não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel htmlFor="email">Email</CLabel>
                        <CInput id="email" name="email"  type="email" placeholder="Informe o email" required />
                        <CInvalidFeedback>Email não não é válido</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="2">
                      <CFormGroup>
                        <CLabel htmlFor="phone">Telefone</CLabel>
                        <CInput id="phone" name="phone" placeholder="Informe o telefone" onChange={handleMaskPhone} required />
                        <CInvalidFeedback>Telefone não pode ser vazio</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel htmlFor="city" style={style.label} id="aria-label">Cidade</CLabel>
                        <Select
                          value={city}
                          onChange={handleChange}
                          onInputChange={handleInputChange}
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
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="office">Escritório</CLabel>
                        <CSelect custom id="office" name="office" required>
                          <option></option>
                          { companies.map((type) => (
                              <option key={type.id} value={type.id}>{type.nameFantasy}</option>
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

export default AttorneySave;
