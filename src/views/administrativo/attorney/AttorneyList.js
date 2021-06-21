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
    {key:'name',label:"Nome"}, 
    {key:'cpf',label:"CPF"}, 
    {key:'oab',label:"OAB"},
    {key:'email',label:"Email"},
    {key:'city',label:"Cidade"},
    {key:'phone',label:"Telefone"},
    {key:'office',label:"Escritório"},
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

const AttorneyList = () => {
  
  const [paginationState,setPaginationState] = React.useState({currentPage:1,perPage:100});
  const [error, setError] = React.useState(null);
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [data,setData] =  React.useState([]);

  const [redirect, setRedirect] = React.useState({isRedirect: false, id: false});
  let redirecting = redirect.isRedirect ? (<Redirect push to={`/administrativo/attorney/salvar/${redirect.id}`}/>) : '';
          
  
  const findAttorney = async () => {
      try{
        const result = await api.get('/attorney',{
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
      if(window.confirm(`Deseja mesmo excluir a advogado: ${id}`)) {
        try{
          const result = await api.put(`/attorney/${id}`,{situation: {id:2}});

          if(result.status === 200){
            toast.success("Advogado Inativado com sucesso!", {duration: 6000, icon: '👏'});
            document.getElementById(`btnedit${id}`).disabled = true;
            document.getElementById(`btndelete${id}`).disabled = true;
            return;
          }
        } catch(error) {
          const message = error.response.data.error[0].message_error ?? "Erro ao tentar atualizar advogado!";
          toast.error(message, {duration: 6000 ,icon: '🔥'});
        }
    }    
  }

  React.useEffect(()=> {
    findAttorney()
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
              Advogados
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={data?.data?.data ?? []}
              fields={fields}
              striped
              scopedSlots = {{
                'city':
                  (item)=>{ return (<td><CBadge>{item.city.name}</CBadge></td>) },
                'office':
                  (item)=>{return (<td><CBadge>{item.office.nameFantasy}</CBadge></td>) },
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

export default AttorneyList