import React from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
  CSpinner,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormGroup,
  CInput,
  CLabel,
  CForm,
  CInputGroup
} from '@coreui/react'
import Select from 'react-select';
import { Redirect } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import api from '../../../services/http-request';
import { array } from 'prop-types';

const fields = [
    {key:'id',label:'Id'},
    {key:'name', label: 'Nome'},
    {key:'cpf',label:"CPF"}, 
    {key:'oab',label:"OAB"}, 
    {key:'phone',label:"Telefone"},
    {key:'email',label:"E-Mail"}, 
    {key:'city',label:"Cidade"}, 
    {key:'office',label:"Escritório"}, 
    {key:'situation',label:"Situação", sorter: true, filter: true},
];

const getSituationColor = (situation) => {
    switch (situation.toLowerCase()) {
        case 'ativo': return 'success'
        case 'inativo': return 'secondary'
        default: return 'primary'
      }
};

const CompanyReport = () => {
    const style = {
        label: {
            fontSize: '.75rem',
            fontWeight: 'bold',
            lineHeight: 2,
        },
    };
  
  const [paginationState,setPaginationState] = React.useState({currentPage:1,perPage:10});
  const [error, setError] = React.useState(null);
  const [offices, setOffices] = React.useState([]);
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [data,setData] =  React.useState([]);
  const [search, setSearch] = React.useState('');
  const [searchOffice, setSearchOffice] = React.useState('');
  const [office, setOffice] = React.useState({label: '', value: ''});

  const handleChange = (value) => {setOffice(value)};
  const handleInputChange = (value) => {setSearchOffice(value)}

  const FILTER_CPF = "cpf";
  const FILTER_NAME = "name";

  const arrayTypeFilter = [
    {key: FILTER_CPF, value: "CPF"},
    {key: FILTER_NAME, value: "Nome"}
  ];

  const getDescriptionTypeFilter = (typeFilter) => {
    switch (typeFilter) {
        case FILTER_CPF: return 'CPF'
        case FILTER_NAME: return 'Nome'
      }
  }

  const [typeFilter, setTypeFilter] = React.useState(FILTER_NAME);

  const [redirect, setRedirect] = React.useState({isRedirect: false, id: false});
  let redirecting = redirect.isRedirect ? (<Redirect push to={`/reports/process/list/${redirect.id}`}/>) : '';
          
  
  const findAttorney = async () => {
      try{
        let filters = {
            search: search,
            search_field: typeFilter,
            page: parseInt(paginationState.currentPage) < 1 ? 1 : paginationState.currentPage,
            limit: paginationState.perPage,
            order: 'name',
            sort: 'ASC'
        }
        
        if(office.value) {
            filters['office'] = office.value
        }

        const result = await api.get('/attorney',filters);
        setData(result.data);
      } catch(error){
        setError(error);
      } finally {
        setIsLoaded(true);
      }
  } 

  const findOffices = async () => {
    try{
      const result =  await api.get('/companies',
        {
          order: "nameFantasy",
          sort: "ASC",
          search_field:"nameFantasy",
          search:searchOffice,
          limit: 120
        }
      );

      let offices = result.data.data.data ?? [];
      offices.unshift({id:'', nameFantasy:'Todos'});
      setOffices(offices);

    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar cidades!", {duration: 4000 ,icon: '🔥'});
    }
  }

  React.useEffect(()=> {
    findAttorney()
  },[search, paginationState.currentPage, office])

  React.useEffect(()=> {
    findOffices()
  },[searchOffice])

  if(!isLoaded){
    return (
      <React.Fragment>
          <CSpinner color="primary" />
      </React.Fragment>
    )
  }
  
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Relatório Advogados
            </CCardHeader>
            <CCardBody>
                <CForm className="form-horizontal">
                    <CFormGroup row>
                        <CCol md="4">
                            <CInputGroup>
                            
                            <CDropdown className="input-group-prepend">
                                <CDropdownToggle caret color="primary">
                                    {getDescriptionTypeFilter(typeFilter)}
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {arrayTypeFilter.map((item) => {
                                        return (<CDropdownItem onClick={() => {setTypeFilter(item.key)}}>{item.value}</CDropdownItem>)
                                    })}
                                </CDropdownMenu>
                            </CDropdown>
                            <CInput 
                                id="input1-group3" 
                                name="input1-group3" 
                                placeholder={getDescriptionTypeFilter(typeFilter)} 
                                onKeyUp={(event)=>{setSearch(event.target.value)}}
                            />
                            </CInputGroup>
                        </CCol>
                        
                    </CFormGroup>
                    <CFormGroup row>
                    <CCol md="4">
                            <CFormGroup>
                                <CLabel htmlFor="office" style={style.label} id="aria-label">Escritório</CLabel>
                                <Select
                                value={office}
                                onChange={handleChange}
                                onInputChange={handleInputChange}
                                inputId="aria-input"
                                name="city"
                                options={offices.map((office)=>{
                                    return {value: office.id, label: office.nameFantasy}
                                })}
                                />
                            </CFormGroup>
                        </CCol>
                    </CFormGroup>
                    
                </CForm>
            <hr/>

            <CDataTable
              items={data?.data?.data ?? []}
              fields={fields}
              striped
              scopedSlots = {{
                'cpf': 
                  (item)=>{
                      let cpfFormatted = item.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                      return (<td><CBadge>{cpfFormatted}</CBadge></td>)},
                'city':
                  (item)=>{ return (<td><CBadge>{item.city.name}</CBadge></td>) },
                'office':
                  (item)=>{return (<td><CBadge>{item.office.nameFantasy}</CBadge></td>) },
                'situation':
                  (item)=>{return (<td><CBadge color={getSituationColor(item.situation.description)}>{item.situation.description}</CBadge></td>)},
                }}
            />
            <CPagination
              activePage={paginationState.currentPage}
              pages={data?.data?.last_page ?? 0}
              align="start"
              onActivePageChange={(page) => setPaginationState({currentPage:page,perPage:paginationState.perPage})}
            />
            {redirecting}
            <Toaster  position="top-right"/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      </>
  )
}

export default CompanyReport