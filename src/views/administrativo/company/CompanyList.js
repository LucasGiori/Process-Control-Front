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
  CAlert,
  CSpinner,
  CButton,
} from '@coreui/react'
import { Redirect } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import api from '../../../services/http-request';

const fields = [
    {key:'id',label:'Id'},
    {key:'nameFantasy',label:"Fantasia"}, 
    {key:'companyName',label:"Nome"}, 
    {key:'city',label:"Cidade"},
    {key:'companyType',label:"Tipo"}, 
    {key:'situation',label:"Situação"},
    {key:'editar',label:"", sorter: false, filter: false},
    {key:'deletar',label:"", sorter: false, filter: false}
];

const getSituationColor = (situation) => {
    switch (situation.toLowerCase()) {
        case 'ativo': return 'success'
        case 'inativo': return 'secondary'
        default: return 'primary'
      }
};

const CompanyList = () => {
  
  const [paginationState,setPaginationState] = React.useState({currentPage:1,perPage:10});
  const [error, setError] = React.useState(null);
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [data,setData] =  React.useState([]);

  const [redirect, setRedirect] = React.useState({isRedirect: false, id: false});
  let redirecting = redirect.isRedirect ? (<Redirect push to={`/administrativo/company/salvar/${redirect.id}`}/>) : '';
          
  
  const findCompanies = async () => {
      try{
        const result = await api.get('/companies',{
            page: paginationState.currentPage,
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
  
  const handleDeleteCompany = async (id) => {
      if(window.confirm(`Deseja mesmo excluir a empresa: ${id}`)) {
        try{
        
          const result = await api.put(`/companies/${id}`,{situation: {id:2}});
          if(result.status === 200){
            toast.success("Empresa Inativada com sucesso!", {duration: 6000, icon: '👏'});
            document.getElementById(`btnedit${id}`).disabled = true;
            document.getElementById(`btndelete${id}`).disabled = true;
            return;
          }
        } catch(error) {
          const message = error.response.data.error[0].message_error ?? "Erro ao tentar atualizar empresa!"
          toast.error(message, {duration: 6000 ,icon: '🔥'});
        }
    }
    
  }

  React.useEffect(()=> {
    findCompanies()
  },[paginationState.currentPage])

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
              Empresas
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={data?.data?.data ?? []}
              fields={fields}
              striped
              scopedSlots = {{
                'city':
                  (item)=>{ return (<td><CBadge>{item.city.name}</CBadge></td>) },
                'companyType':
                  (item)=>{return (<td><CBadge>{item.companyType.name}</CBadge></td>) },
                'situation':
                  (item)=>{return (<td><CBadge color={getSituationColor(item.situation.description)}>{item.situation.description}</CBadge></td>)},
                'editar':
                  (item, index)=>{
                    return (
                      <td className="py-2">
                        <CButton
                          id={`btnedit${item.id}`}
                          color="info"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={()=>{setRedirect({isRedirect: true, id: item.id})}}
                          disabled={item.situation.id === 1 ? false : true}
                        >
                          Editar
                        </CButton>
                      </td>
                      )
                  },
                'deletar':
                  (item, index)=>{
                    return (
                      <td className="py-2">
                        <a herf={`/administrativo/company/salvar/${item.id}`}>                
                        <CButton
                          id={`btndelete${item.id}`}
                          color="danger"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={()=>{handleDeleteCompany(item.id);}}
                          disabled={item.situation.id === 1 ? false : true}
                        >
                          Excluir
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

export default CompanyList