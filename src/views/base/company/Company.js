import React from 'react'
import {
  CButton,
  CCard,
  CCardFooter,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CSelect,
  CRow,
  CSwitch
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'

const Company = () => {
  const [collapsed, setCollapsed] = React.useState(true)
  const [showElements, setShowElements] = React.useState(true)

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12">
          <CCard>
            <CCardHeader>
              Empresa   
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs="2">
                  <CFormGroup>
                    <CLabel htmlFor="idcompany">ID Empresa</CLabel>
                    <CInput id="idcompany" placeholder="" disabled />
                  </CFormGroup>
                </CCol>
                <CCol xs="10">
                  <CFormGroup>
                    <CLabel htmlFor="name">Razão Social</CLabel>
                    <CInput id="name" placeholder="Informe a razão social" required />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="8">
                  <CFormGroup>
                    <CLabel htmlFor="nameFantasy">Nome Fantasia</CLabel>
                    <CInput id="nameFantasy" placeholder="Informe o nome fantasia" required />
                  </CFormGroup>
                </CCol>
                <CCol xs="2">
                  <CFormGroup>
                    <CLabel htmlFor="city">Cidade</CLabel>
                    <CSelect custom name="city" id="city">
                      <option value="1">Ji-Ṕaraná - RO</option>
                      <option value="2">Douradina - PR</option>
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol xs="2">
                  <CFormGroup>
                    <CLabel htmlFor="typeCompany">Tipo empresa</CLabel>
                    <CSelect custom name="typeCompany" id="typeCompany">
                      <option>Escritório Advocacia</option>
                      <option>Empresa Negócio</option>
                      <option>Outros</option>
                      
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                  <CCol>
                <CFormGroup row>
                        <CCol tag="label" sm="3" className="col-form-label">
                            Está Ativa ?
                        </CCol>
                        <CCol sm="12">
                            <CSwitch
                            className="mr-1"
                            color="info"
                            defaultChecked
                            shape="pill"
                            variant="outline"
                            />
                            <CSwitch
                            className="mr-1"
                            color="dark"
                            defaultChecked
                            shape="pill"
                            variant="opposite"
                            />
                        </CCol>
                    </CFormGroup>
                </CCol>
            </CRow>
            </CCardBody>
            <CCardFooter>
                <CButton type="submit" size="sm" color="primary"><CIcon name="cil-user" /> Salvar</CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Company
