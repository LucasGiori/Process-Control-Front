import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
  CAlert,
  CSpinner
} from '@coreui/react'
import api from '../../../services/http-request';

const fields = ['id','name', 'uf']

const States = () => {
  
  const [paginationState,setPaginationState] = React.useState({currentPage:1,perPage:10});
  const [error, setError] = React.useState(null);
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [data,setData] =  React.useState([]);
  
  const findStates = async () => {
      try{
        const result = await api.get('/states',{
            page: paginationState.currentPage,
            limit: paginationState.perPage
        });
        setData(result.data ?? {});
      } catch(error){
        setError(error);
      } finally {
        setIsLoaded(true);
      }
  } 
  
  React.useEffect(()=> {
    findStates()
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
              Estados
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={data?.data?.data ?? []}
              fields={fields}
              striped
            />
            <CPagination
              activePage={paginationState.currentPage}
              pages={data?.data?.last_page ?? 0}
              align="start"
              onActivePageChange={(page) => setPaginationState({currentPage:page,perPage:paginationState.perPage})}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      </>
  )
}

export default States