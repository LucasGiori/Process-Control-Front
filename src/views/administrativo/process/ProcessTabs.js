import React from 'react'
import {
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CCardBody,
  CTabs,
  CCardHeader,
  CButton,
  CCard,
  CCardFooter,
  CFormGroup,
  CInput,
  CLabel,
  CSelect,
  CSwitch,
  CInvalidFeedback,
  CForm,
  CTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Chrono } from "react-chrono";
import Select from 'react-select';
// import { Redirect } from 'react-router-dom'
import { Link,useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../../services/http-request';

const ProcessTabs = () => {
    const [activeTab, setActiveTab] = React.useState(1);
    const [data,setData] =  React.useState([]);
    const [validated, setValidated] = React.useState(false);
    const [searchOffice, setSearchOffice] = React.useState('');
    const [office, setOffice] = React.useState({label: '', value: ''});
    const [isLoaded,setIsLoaded] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [offices, setOffices] = React.useState([]);
    const [attorney, setAttorney] = React.useState([]);
    const [idprocess, setIdprocess] = React.useState(null);
    // const [paginationState,setPaginationState] = React.useState({currentPage:1,perPage:10});

      const findProcess = async (id) => {
        try{
          let filters = {
              id: idprocess ? idprocess : id,
              page: 1,
              limit: 200,
              order: 'id',
              sort: 'ASC'
          }

          const result = await api.get('/process',filters);
          const processResult = result?.data?.data?.data[0];

          if(processResult) {
              
            const movements = processResult.movements.reverse();
            const items  =  movements.map(function(item) {
                const title = "N°: ".concat(processResult.number," Empresa: ",processResult.company.nameFantasy);
                const text = ` Escritório Atual: ${item.office.nameFantasy}; | Advogado Atual: ${item.attorney.name}; Estágio Atual: ${item.stageProcess}`
                return {
                    title: item.createdAt,
                    cardTitle: title,
                    cardSubtitle: `Usuário: ${item.user.name}`,
                    cardDetailedText: text
                }
            })

            setData(items);
        }

          
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

    const findAttorney = async (event) => {
        try{
          let filters = {
            order: "name",
            sort: "ASC",
            limit: 120
          };
    
          if(event?.target?.value) {
            filters["office"] = event.target.value;
          }
    
          const result = await api.get('/attorney',);
          setAttorney(result.data.data.data ?? []);
        } catch(error){
          toast.error(error.response.data.error[0].message_error ?? "Erro ao tentar buscar advogados!", {duration: 4000 ,icon: '🔥'});
        } 
      }

    let { id } = useParams();

    React.useEffect(()=> {
        findOffices()
      },[searchOffice])
    
    React.useEffect(()=> {
        findProcess(id)
    },[])//paginationState.currentPage,
    

    return (
        <>
          <CRow>
            <CCol xs="12" md="12" className="mb-4">
                <CCard>
                    <CCardHeader>
                        Manutenção
                    </CCardHeader>
                    <CCardBody>
                        <CTabs activeTab={activeTab} onActiveTabChange={idx => setActiveTab(idx)}>
                        <CNav variant="tabs">
                            <CNavItem>
                            <CNavLink>
                                <CIcon name="cil-asterisk"/>
                                { activeTab === 0 && ' Processo'}
                            </CNavLink>
                            </CNavItem>

                            <CNavItem>
                            <CNavLink>
                                <CIcon name="cil-laptop"/>
                                { activeTab === 1 && ' Histórico'}
                            </CNavLink>
                            </CNavItem>

                            <CNavItem>
                            <CNavLink>
                                <CIcon name="cil-arrow-right" />
                                { activeTab === 2 && ' Movimentação'}
                            </CNavLink>
                            </CNavItem>

                            <CNavItem>
                            <CNavLink>
                                <CIcon name="cil-comment-square"/>
                                { activeTab === 3 && ' Mensagens'}
                            </CNavLink>
                            </CNavItem>
                        </CNav>
                        <CTabContent>
                            <CTabPane>
                                <CRow>
                                    <CCol xs="12" sm="12">
                                        <CCard>
                                        <CCardHeader>
                                        Processo   
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <Link to="/reports/process/list">
                                            <CButton size="sm" color="info"> Relatório Processos!</CButton>
                                            </Link>
                                        </div>
                                        </CCardHeader>
                                        <CCardBody>
                                            <CForm  wasValidated={validated} id="processsave">                          
                                                <CRow>
                                                    <CCol xs="4">
                                                        <CFormGroup >
                                                        <CLabel htmlFor="office">Escritório Responsável</CLabel>
                                                        <CSelect custom id="office" name="office" onChange={findAttorney}>
                                                            <option></option>
                                                            { offices.map((company) => (
                                                                <option key={company.id} value={company.id}>{company.nameFantasy}</option>
                                                            ))
                                                            }
                                                        </CSelect>
                                                         <CInvalidFeedback >Selecione um escritório</CInvalidFeedback>
                                                        </CFormGroup>
                                                    </CCol>
                                                    <CCol xs="4">
                                                        <CFormGroup>
                                                        <CLabel htmlFor="attorney">Advogado Responsável</CLabel>
                                                        <CSelect custom id="attorney" name="attorney">
                                                            <option></option>
                                                            { attorney.map((attorneyItem) => (
                                                                <option key={attorneyItem.id} value={attorneyItem.id}>{attorneyItem.name}</option>
                                                            ))
                                                            }
                                                        </CSelect>
                                                        <CInvalidFeedback >Selecione um Advogado</CInvalidFeedback>
                                                        </CFormGroup>
                                                    </CCol>
                                                    <CCol xs="4">
                                                    <CFormGroup>
                                                        <CLabel htmlFor="stageProcess">Estágio processo</CLabel>
                                                        <CInput id="stageProcess" name="stageProcess" placeholder="Estágio em que o processo se encontra" />
                                                    </CFormGroup>
                                                    </CCol>
                  
                                                </CRow>
                                            </CForm>
                                            <Toaster  position="top-right"/>
                                        </CCardBody>
                                        <CCardFooter>
                                            {/* <CButton  onClick={handleSubmit} type="button" color="primary">Salvar</CButton> */}
                                            </CCardFooter>
                                        </CCard>
                                    </CCol>
                                    </CRow>
                            </CTabPane>
                            <CTabPane>
                                {`2. Movimentação`}
                                <CRow>
                                    <CCol md="2"></CCol>
                                    <CCol>
                                        <div style={{ width: "900px", height: "950px" }}>
                                            <Chrono
                                                allowDynamicUpdate
                                                items={data}
                                                mode="VERTICAL_ALTERNATING"
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                            </CTabPane>
                            <CTabPane>
                                {`3. Mensagens`}
                            </CTabPane>
                        </CTabContent>
                        </CTabs>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
      </>
  )
}

export default ProcessTabs