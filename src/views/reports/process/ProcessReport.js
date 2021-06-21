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

const fields = [
    {key:'id',label:'Id'},
    {key:'number', label: 'Número Processo'},
    {key:'notificationDate',label:"Data Notif."}, 
    {key:'company',label:"Empresa"}, 
    {key:'office',label:"Escritório"}, 
    {key:'attorney',label:"Advogado"},
    {key:'stageProcess',label:"Estágio Processo"},  
    {key:'status',label:"Situação"},
    {key:'detalhes',label:"Detalhes"},
];

const getSituationColor = (situation) => {
    switch (situation) {
        case true: return 'success'
        case false: return 'info'
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

  const FILTER_NUMBER = "number";
  const FILTER_ID = "id";

  const arrayTypeFilter = [
    {key: FILTER_NUMBER, value: "Número Processo"},
    {key: FILTER_ID, value: "ID Processo"}
  ];

  const getDescriptionTypeFilter = (typeFilter) => {
    switch (typeFilter) {
        case FILTER_NUMBER: return 'Número Processo'
        case FILTER_ID: return 'ID Processo'
      }
  }

  const [typeFilter, setTypeFilter] = React.useState(FILTER_NUMBER);

  const [redirect, setRedirect] = React.useState({isRedirect: false, id: false});
  let redirecting = redirect.isRedirect ? (<Redirect push to={`/administrativo/process/salvar/${redirect.id}`}/>) : '';
          
  
  const findProcess = async () => {
      try{
        let filters = {
            typeFilter: search,
            page: parseInt(paginationState.currentPage) < 1 ? 1 : paginationState.currentPage,
            limit: paginationState.perPage,
            order: 'id',
            sort: 'ASC'
        }
        
        if(search) {
            filters[typeFilter] = search;
        }
        
        if(office.value) {
            filters['office'] = office.value
        }

        const result = await api.get('/process',filters);
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
    findProcess()
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
                'company': 
                  (item)=>{ return (<td><CBadge>{item.company.nameFantasy}</CBadge></td>)},
                'office':
                  (item)=>{ 
                    let lastMovement = item.movements.slice(-1)[0];
                    return (<td><CBadge>{lastMovement.office.nameFantasy}</CBadge></td>) 
                },
                'attorney':
                  (item)=>{ 
                    let lastMovement = item.movements.slice(-1)[0];
                    return (<td><CBadge>{lastMovement.attorney.name}</CBadge></td>) 
                },
                'stageProcess':
                  (item)=>{ 
                    let lastMovement = item.movements.slice(-1)[0];
                    return (<td><CBadge>{lastMovement.stageProcess}</CBadge></td>) 
                },
                'status':
                  (item)=>{return (<td><CBadge color={getSituationColor(item.status)}>{item.status ? "Ativo" : "Baixado"}</CBadge></td>)
                },
                'detalhes':
                  (item, index)=>{
                    return (
                      <td className="py-2">
                        <a herf={`/reports/process/list/${item.id}`}>                
                        <CButton
                          id={`btndelete${item.id}`}
                          color="info"
                          variant="outline"
                          shape="square"
                          size="sm"
                        >
                          Detalhes
                        </CButton>
                        </a>
                      </td>
                      )
                  },
                
                
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