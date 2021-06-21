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
    {key:'number',label:"Número"}, 
    {key:'company',label:"Empresa"}, 
    {key:'movements',label:"Escritório/Advogado Responsável"},
    {key:'status',label:"Situação"},
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
        case false: return 'Baixado'
        default: return 'Indefinido'
      }
  };

const ProcessList = () => {
  
  const [paginationState,setPaginationState] = React.useState({currentPage:1,perPage:10});
  const [error, setError] = React.useState(null);
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [data,setData] =  React.useState([]);

  const [redirect, setRedirect] = React.useState({isRedirect: false, id: false});
  let redirecting = redirect.isRedirect ? (<Redirect push to={`/administrativo/process/salvar/${redirect.id}`}/>) : '';
          
  
  const findProcess = async () => {
      try{
        const result = await api.get('/process',{
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
  
  const handleDeleteProcess = async (id) => {
      if(window.confirm(`Deseja mesmo baixar o processo: ${id}`)) {
        try{
        
          const result = await api.put(`/process/${id}`,{status: false});
          if(result.status === 200){
            toast.success("Processo Baixado com sucesso!", {duration: 6000, icon: '👏'});
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
    findProcess()
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
              Processos
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={data?.data?.data ?? []}
              fields={fields}
              striped
              scopedSlots = {{
                'company':
                  (item)=>{ return (<td><CBadge>{item.company.nameFantasy}</CBadge></td>) },
                'movements':
                  (item)=>{ 
                      let lastMovement = item.movements.slice(-1)[0];

                      return (<td><CBadge>{lastMovement.office.nameFantasy.concat(' / ', lastMovement.attorney.name)}</CBadge></td>) 
                    },
                'status':
                  (item)=>{return (<td><CBadge color={getSituationColor(item.status)}>{getDescription(item.status)}</CBadge></td>)},
                'editar':
                  (item, index)=>{
                      console.log(item.id);
                    return (
                      <td className="py-2">
                        <CButton
                          id={`btnedit${item.id}`}
                          color="info"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={()=>{setRedirect({isRedirect: true, id: item.id})}}
                          disabled={item.status === true ? false : true}
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
                        <a herf={`/administrativo/process/salvar/${item.id}`}>                
                        <CButton
                          id={`btndelete${item.id}`}
                          color="danger"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={()=>{handleDeleteProcess(item.id);}}
                          disabled={item.status === true ? false : true}
                        >
                          Baixar
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

export default ProcessList