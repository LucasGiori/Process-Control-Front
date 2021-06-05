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
    {key:'id',label:'ID'},
    {key:'name',label:"Nome"}, 
    {key:'cpf',label:"CPF"}, 
    {key:'login',label:"Login"},
    {key:'email',label:"Email"},
    {key:'userType',label:"Tipo"},
    {key:'status',label:"Status"},
    {key:'editar',label:"", sorter: false, filter: false},
    {key:'deletar',label:"", sorter: false, filter: false}
];

const getSituationColor = (status) => {
    switch (status) {
        case true: return 'success'
        case false: return 'secondary'
        default: return 'primary'
      }
};

const getDescription = (status) => {
  switch (status) {
      case true: return 'Ativo'
      case false: return 'Inativo'
      default: return 'Indefinido'
    }
};

const UserList = () => {
  
  const [paginationState,setPaginationState] = React.useState({currentPage:1,perPage:10});
  const [error, setError] = React.useState(null);
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [data,setData] =  React.useState([]);

  const [redirect, setRedirect] = React.useState({isRedirect: false, id: false});
  let redirecting = redirect.isRedirect ? (<Redirect push to={`/gestao/user/salvar/${redirect.id}`}/>) : '';
          
  
  const findUsers = async () => {
      try{
        const result = await api.get('/users',{
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
  
  const handleDeleteUser = async (id) => {
      if(window.confirm(`Deseja mesmo inativar o usuário: ${id}`)) {
        try{
          const result = await api.put(`/users/${id}`,{status: false});

          if(result.status === 200){
            toast.success("Usuário Inativado com sucesso!", {duration: 6000, icon: '👏'});
            document.getElementById(`btnedit${id}`).disabled = true;
            document.getElementById(`btndelete${id}`).disabled = true;
            return;
          }
        } catch(error) {
          const message = error.response.data.error[0].message_error ?? "Erro ao tentar inativar usuário!";
          toast.error(message, {duration: 6000 ,icon: '🔥'});
        }
    }    
  }

  React.useEffect(()=> {
    findUsers()
  },[paginationState.currentPage])

  if(error){
    return (
        <React.Fragment>
            <CAlert color="danger">${error.message}</CAlert>
        </React.Fragment>
    )
  } else if (!isLoaded) {
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
              Usuários
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={data.data.data}
              fields={fields}
              striped
              scopedSlots = {{
                'userType':
                  (item)=>{ return (<td><CBadge>{item.userType.description}</CBadge></td>) },
                'status':
                  (item)=>{return (<td><CBadge color={getSituationColor(item.status)}>{getDescription(item.status)}</CBadge></td>)},
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
                          disabled={item.status ? false : true}
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
                        <a herf={`/gestao/user/salvar/${item.id}`}>                
                        <CButton
                          id={`btndelete${item.id}`}
                          color="danger"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={()=>{handleDeleteUser(item.id);}}
                          disabled={item.status ? false : true}
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
              pages={data.data.last_page}
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

export default UserList