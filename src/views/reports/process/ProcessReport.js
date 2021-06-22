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
import CsvDownload from 'react-json-to-csv'

const fields = [
    {key:'id',label:'Id'},
    {key:'number', label: 'Número Processo'},
    {key:'notificationDate',label:"Data Notif."}, 
    {key:'company',label:"Empresa", sorter: false, filter: false}, 
    {key:'office',label:"Escritório", sorter: false, filter: false}, 
    {key:'attorney',label:"Advogado", sorter: false, filter: false},
    {key:'stageProcess',label:"Estágio Processo", sorter: true, filter: true},  
    {key:'status',label:"Situação"},
    {key:'detalhes',label:"Detalhes", sorter: false, filter: false},
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
  const [companies, setCompanies] = React.useState([]);
  const [arrayStatus, setArrayStatus] = React.useState([]);
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [data,setData] =  React.useState([]);
  const [search, setSearch] = React.useState('');
  const [searchOffice, setSearchOffice] = React.useState('');
  const [searchCompany, setSearchCompany] = React.useState('');
  const [office, setOffice] = React.useState({label: '', value: ''});
  const [company, setCompany] = React.useState({label: '', value: ''});
  const [status, setStatus] = React.useState({label: '', value: ''});
  const [dataDownload, setDataDownload] = React.useState([]);

  const handleChange = (value) => {setOffice(value)};
  const handleInputChange = (value) => {setSearchOffice(value)}
  const handleChangeCompany = (value) => {setCompany(value)};
  const handleChangeStatus = (value) => {setStatus(value)};
  const handleInputChangeCompany = (value) => {setSearchCompany(value)}

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
  let redirecting = redirect.isRedirect ? (<Redirect push to={`/administrativo/process/maintenance/${redirect.id}`}/>) : '';
          
  
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

        function filterData(obj) {
            let isValidReturn = true;
            let lastMovement = obj.movements.slice(-1)[0];

            if(office.value) {
                isValidReturn = parseInt(lastMovement.office.id) === parseInt(office.value)
            }

            if(isValidReturn && company.value) {
                isValidReturn = parseInt(obj.company.id) === parseInt(company.value)
            }

            if(isValidReturn && status.value !== "") {
                isValidReturn =  obj.status  === !status.value ?  false : true;
            }
            
            return isValidReturn
        }

        if(result.data.data.data) {
            const result_filtered = result.data.data.data.filter(filterData);
            result.data.data.data = result_filtered
        }
        
        const arrayData = result?.data?.data?.data ?? [];
        const csvData = arrayData.map((item) => {
            return {
              id: item.id,
              number: item.number,
              description: item.description,
              observation: item.observation,
              createdAt: item.createdAt,
              notificationDate: item.notificationDate
            }
        });
        setDataDownload(csvData)
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
          companyType: 2,
          search_field:"nameFantasy",
          search:searchOffice,
          limit: 120
        }
      );

      let offices = result.data.data.data ?? [];
      offices.unshift({id:'', nameFantasy:'Todos'});
      setOffices(offices);
      
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar Escritórios!", {duration: 4000 ,icon: '🔥'});
    }
  }

  const findCompany = async () => {
    try{
      const result =  await api.get('/companies',
        {
          order: "nameFantasy",
          sort: "ASC",
          companyType: 1,
          search_field:"nameFantasy",
          search:searchCompany,
          limit: 120
        }
      );

      let companies = result.data.data.data ?? [];
      companies.unshift({id:'', nameFantasy:'Todos'});
      setCompanies(companies);
      
    } catch(error){
      toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar Empresas!", {duration: 4000 ,icon: '🔥'});
    }
  }
  
  const findStatus = () => {
    const data = [
        {label: "Todos", value: ''},
        {label: "Ativo", value:true},
        {label: "Baixado", vaue:false}
    ];

    setArrayStatus(data);
  }

  React.useEffect(()=> {
    findProcess()
  },[search, paginationState.currentPage, office, company, status])

  React.useEffect(()=> {
    findOffices()
  },[searchOffice])

  React.useEffect(()=> {
    findCompany()
  },[searchCompany])

  React.useEffect(()=> {
    findStatus()
  },[])

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
                                name="office"
                                options={offices.map((itemOffice)=>{
                                    return {value: itemOffice.id, label: itemOffice.nameFantasy}
                                })}
                                />
                            </CFormGroup>
                        </CCol>
                        <CCol md="4">
                            <CFormGroup>
                                <CLabel htmlFor="company" style={style.label} id="aria-label-company">Empresa</CLabel>
                                <Select
                                value={company}
                                onChange={handleChangeCompany}
                                onInputChange={handleInputChangeCompany}
                                inputId="aria-input-company"
                                name="company"
                                options={companies.map((itemCompany)=>{
                                    return {value: itemCompany.id, label: itemCompany.nameFantasy}
                                })}
                                />
                            </CFormGroup>
                        </CCol>
                        <CCol md="4">
                            <CFormGroup>
                                <CLabel htmlFor="status" style={style.label} id="aria-label-status">Status</CLabel>
                                <Select
                                value={status}
                                onChange={handleChangeStatus}
                                name="status"
                                options={arrayStatus}
                                />
                            </CFormGroup>
                        </CCol>
                    </CFormGroup>
                    
                </CForm>
            <hr/>
            <CsvDownload className={"btn btn-outline-info btn-sm btn-square"} data={dataDownload} />                     
            <CDataTable
              items={data?.data?.data ?? []}
              fields={fields}
              columnFilter
              striped
              hover
              sorter
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
                        <CButton
                          id={`btndetalhes${item.id}`}
                          color="info"
                          variant="outline"
                          shape="square"
                          onClick={() => setRedirect({isRedirect: true, id: item.id})}
                          size="sm"
                        >
                          Detalhes
                        </CButton>
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