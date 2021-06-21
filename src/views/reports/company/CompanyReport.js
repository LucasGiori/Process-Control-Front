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
import { Redirect } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import api from '../../../services/http-request';

const fields = [
    {key:'id',label:'Id'},
    {key:'cnpj', label: 'Cnpj'},
    {key:'nameFantasy',label:"Fantasia"}, 
    {key:'companyName',label:"Nome"}, 
    {key:'city',label:"Cidade", sorter: false, filter: false},
    {key:'companyType',label:"Tipo", sorter: false, filter: false}, 
    {key:'situation',label:"Situação", sorter: false, filter: false},
];

const getSituationColor = (situation) => {
    switch (situation.toLowerCase()) {
        case 'ativo': return 'success'
        case 'inativo': return 'secondary'
        default: return 'primary'
      }
};

const CompanyReport = () => {
  
  const [paginationState,setPaginationState] = React.useState({currentPage:1,perPage:10});
  const [error, setError] = React.useState(null);
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [data,setData] =  React.useState([]);
  const [search, setSearch] = React.useState('');

  const FILTER_NAME_FANTASY = "nameFantasy";
  const FILTER_NAME_COMPANY = "companyName";
  const FILTER_TYPE_COMPANY = "companyType";

  const arrayTypeFilter = [
    {key: FILTER_NAME_FANTASY, value: "Nome Fantasia"},
    {key: FILTER_NAME_COMPANY, value: "Nome Empresa"}
  ];

  const getDescriptionTypeFilter = (typeFilter) => {
    switch (typeFilter) {
        case FILTER_NAME_FANTASY: return 'Nome Fantasia'
        case FILTER_NAME_COMPANY: return 'Nome Empresa'
        case FILTER_TYPE_COMPANY: return 'Tipo Empresa'
      }
  }

  const [typeFilter, setTypeFilter] = React.useState(FILTER_NAME_FANTASY);

  const [redirect, setRedirect] = React.useState({isRedirect: false, id: false});
  let redirecting = redirect.isRedirect ? (<Redirect push to={`/administrativo/company/salvar/${redirect.id}`}/>) : '';
          
  
  const findCompanies = async () => {
      try{
        const result = await api.get('/companies',{
            search: search,
            search_field: typeFilter,
            page: parseInt(paginationState.currentPage) < 1 ? 1 : paginationState.currentPage,
            limit: paginationState.perPage,
            order: 'id',
            sort: 'ASC'
        });
        setData(result.data);
      } catch(error){
        setError(error);
      } finally {
        setIsLoaded(true);
      }
  } 


  React.useEffect(()=> {
    findCompanies()
  },[search, paginationState.currentPage])//paginationState.currentPage,

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
              Relatório Empresas
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
                </CForm>
            <hr/>

            <CDataTable
              items={data?.data?.data ?? []}
              fields={fields}
              columnFilter
              striped
              hover
              sorter
              scopedSlots = {{
                'cnpj': 
                  (item)=>{
                      let cnpjFormated = item.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                      return (<td><CBadge>{cnpjFormated}</CBadge></td>)},
                'city':
                  (item)=>{ return (<td><CBadge>{item.city.name}</CBadge></td>) },
                'companyType':
                  (item)=>{return (<td><CBadge>{item.companyType.name}</CBadge></td>) },
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