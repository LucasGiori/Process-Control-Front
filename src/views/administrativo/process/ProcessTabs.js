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
  CBadge
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
    const [movementsData, setMovementsData] = React.useState([]);
    // const [paginationState,setPaginationState] = React.useState({currentPage:1,perPage:10});
    const formmovement = document.getElementById('processmovementsave');
    const formcomment = document.getElementById('commentform');

    const handleSubmit = (event) => {
        if (!formmovement.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
          setValidated(true);
          return
        }
        
        setValidated(true);
        
        const movements = {
            "process": {id: parseInt(document.getElementById('idprocess').value)},
            "office": {id: parseInt(document.getElementById("officetab").value)},
            "attorney": {id: parseInt(document.getElementById("attorneytab").value)},
            "links": document.getElementById("links")?.value ?? "",
            "stageProcess": document.getElementById("stageProcess")?.value ?? "",
            "comment": document.getElementById("comment")?.value ?? ""
        };
    
        if(document.getElementById('idprocess').value) {
            postProcessMovement(movements);
          return;
        }
    }

    const handleSubmitComment = (event) => {
        
        if (!formcomment.checkValidity()) {
            alert("oi")
          event.preventDefault()
          event.stopPropagation()
          setValidated(true);
          return
        }
        
        setValidated(true);
        
        const movements = {
            "process": {id: parseInt(document.getElementById('idprocess').value)},
            "office": {id: parseInt(document.getElementById("officetab").value)},
            "attorney": {id: parseInt(document.getElementById("attorneytab").value)},
            "links": document.getElementById("links")?.value ?? "",
            "stageProcess": document.getElementById("stageProcess")?.value ?? "",
            "comment": document.getElementById("commentnew")?.value ?? ""
        };
        console.log(movements)
    
        if(document.getElementById('idprocess').value) {
            postProcessMovement(movements);
            console.log("passou")
          return;
        }
    }

    const postProcessMovement = async (payload) => {
        try{
    
          const result = await api.post('/process/movements',payload);
          
          if(result.status === 201){
            setValidated(false);
            findProcess(payload.process.id)
            const message = result.data.data.message ?? "Movimento cadastrado com sucesso!"
            toast.success(message, {duration: 6000, icon: '👏'});
            return;
          }
        } catch(error) {
          const message = error.response.data.error[0].message_error ?? "Erro ao tentar cadastrar o Movimento!"
          toast.error(message, {duration: 6000 ,icon: '🔥'});
        }
      }

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

            const comments  =  movements.map(function(item) {
                const title = "Comentário....";
                return {
                    title: item.createdAt,
                    cardTitle: title,
                    cardSubtitle: `Usuário: ${item.user.name}`,
                    cardDetailedText: item.comment
                }
            })
            
            // document.getElementById('officetab').value = movements[0].office.id;
            // document.getElementById('attorneytab').value = movements[0].attorney.id;
            document.getElementById('idprocess').value =  processResult.id
            document.getElementById('stageProcess').value = movements[0].stageProcess
            document.getElementById('links').value = movements[0].links
            document.getElementById('comment').value = movements[0].comment
      
            let opt = document.getElementById('officetab').appendChild(document.createElement("option"));
            opt.value = movements[0].office.id;
            opt.selected = true;
            opt.label = movements[0].office.nameFantasy;

            let optAttorney = document.getElementById('attorneytab').appendChild(document.createElement("option"));
            optAttorney.value = movements[0].attorney.id;
            optAttorney.selected = true;
            optAttorney.label = movements[0].attorney.name;
             
            setData(items);
            setMovementsData(comments);
        }

          
        } catch(error){
          console.log(error);
          setError(error);
        } finally {
          setIsLoaded(true);
        }
    } 

    const findOffices = async () => {
    try{
      const result = await api.get('/companies',
        {
          order: "nameFantasy",
          sort: "ASC",
          companyType: 2,
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
        findOffices();
        findAttorney();
        findProcess(id);
    },[])//paginationState.currentPage,
    
    // React.useEffect(()=> {
        
    // },[activeTab])
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
                                { activeTab === 0 && ' Movimentação Processo'}
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
                                <CIcon name="cil-comment-square"/>
                                { activeTab === 2 && ' Mensagens'}
                            </CNavLink>
                            </CNavItem>
                        </CNav>
                        <CTabContent>
                            <CTabPane>
                                <CRow>
                                    <CCol xs="12" sm="12">
                                        <CCard>
                                        <CCardHeader>
                                        Movimentação Processo   
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <Link to="/reports/process/list">
                                            <CButton size="sm" color="info"> Relatório Processos!</CButton>
                                            </Link>
                                        </div>
                                        </CCardHeader>
                                        <CCardBody>
                                            <CForm  wasValidated={validated} id="processmovementsave">                          
                                                <CRow>
                                                    <CCol xs="1" hidden={true}>
                                                        <CFormGroup >
                                                        <CLabel htmlFor="idprocess">Escritório Responsável</CLabel>
                                                        <CInput id="idprocess" name="idprocess" placeholder="ID" />
                                                        <CInvalidFeedback >Selecione um escritório</CInvalidFeedback>
                                                        </CFormGroup>
                                                    </CCol>
                                                    <CCol xs="4">
                                                        <CFormGroup >
                                                        <CLabel htmlFor="officetab">Escritório Responsável</CLabel>
                                                        <CSelect custom id="officetab" name="officetab" onChange={findAttorney}>
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
                                                        <CLabel htmlFor="attorneytab">Advogado Responsável</CLabel>
                                                        <CSelect custom id="attorneytab" name="attorneytab">
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
                                                <CRow>
                                                    <CCol xs="12">
                                                        <CLabel htmlFor="links">Links Útils</CLabel>
                                                        <CTextarea 
                                                            name="links" 
                                                            id="links" 
                                                            rows="2"
                                                            placeholder="https://brasilia.gov.com.br, ..." 
                                                            />
                                                    </CCol>
                                                    <CCol xs="8" hidden={true}>
                                                        <CLabel htmlFor="comment">Comentário</CLabel>
                                                        <CTextarea 
                                                            name="comment" 
                                                            id="comment" 
                                                            rows="2"
                                                            placeholder="Comentário para movimentação inicial do processo..." 
                                                            />
                                                    </CCol>
                                                </CRow>
                                            </CForm>
                                            <Toaster  position="top-right"/>
                                            </CCardBody>
                                            <CCardFooter>
                                                <CButton  onClick={handleSubmit} type="button" color="primary">Salvar</CButton>
                                            </CCardFooter>
                                        </CCard>
                                    </CCol>
                                    </CRow>
                            </CTabPane>
                            <CTabPane>
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
                                <CRow>
                                    <CCol xs="12" sm="12">
                                        <CCard>
                                        <CCardBody>
                                            <CForm  wasValidated={validated} id="commentform">    
                                                <CRow>
                                                    <CCol xs="12">
                                                        <CLabel htmlFor="commentnew">Comentário</CLabel>
                                                        <CTextarea 
                                                            name="commentnew" 
                                                            id="commentnew" 
                                                            rows="2"
                                                            placeholder="Insira um novo comentário" 
                                                            />
                                                    </CCol>
                                                </CRow><CForm  wasValidated={validated} id="commentform"> 
                                            </CForm>
                                            </CForm>
                                            <Toaster  position="top-right"/>
                                            
                                        </CCardBody>
                                        <CCardFooter>
                                                <CButton  onClick={handleSubmitComment} type="button" color="primary">Salvar</CButton>
                                        </CCardFooter>
                                        </CCard>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md="2"></CCol>
                                    <CCol>
                                        <div style={{ width: "900px", height: "950px" }}>
                                            <Chrono
                                                allowDynamicUpdate
                                                items={movementsData}
                                                mode="VERTICAL_ALTERNATING"
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                                {/* <CRow>
                                    <CCol xs="12" sm="12">
                                        <CCardHeader>
                                                Comentários Registrados
                                        </CCardHeader>
                                        <CCard>
                                        {
                                            movementsData.map((item) => {
                                                
                                                return item.comment ? (
                                                    <CRow>
                                                        <CCol xs="12" sm="12">
                                                            <CCard>
                                                                <CRow>
                                                                    <CCol xs="12">
                                                                        <CTextarea rows="2" disabled defaultValue={item.comment}></CTextarea>
                                                                        <CBadge>Usuário: {item.user.name} - {item.createdAt}</CBadge>
                                                                    </CCol>
                                                                </CRow>
                                                            </CCard>
                                                        </CCol>
                                                    </CRow>
                                                ) : "";
                                            })
                                        }
                                        </CCard>
                                    </CCol>
                                </CRow> */}
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