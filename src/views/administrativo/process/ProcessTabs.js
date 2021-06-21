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
const ProcessTabs = () => {

    return (
        <>
          <CRow>
            <CCol xs="12" md="6" className="mb-4">
                <CCard>
                <CCardHeader>
                    Controlled tabs
                </CCardHeader>
                <CCardBody>
                    <CTabs activeTab={active} onActiveTabChange={idx => setActive(idx)}>
                    <CNav variant="tabs">
                        <CNavItem>
                        <CNavLink>
                            <CIcon name="cil-calculator" />
                            { active === 0 && ' Processo'}
                        </CNavLink>
                        </CNavItem>
                        <CNavItem>
                        <CNavLink>
                            <CIcon name="cil-basket" />
                            { active === 1 && ' Movimentação'}
                        </CNavLink>
                        </CNavItem>
                        <CNavItem>
                        <CNavLink>
                            <CIcon name="cil-chart-pie"/>
                            { active === 2 && ' Mensagens'}
                        </CNavLink>
                        </CNavItem>
                    </CNav>
                    <CTabContent>
                        <CTabPane>
                        {`1. ${lorem}`}
                        </CTabPane>
                        <CTabPane>
                        {`2. ${lorem}`}
                        </CTabPane>
                        <CTabPane>
                        {`3. ${lorem}`}
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

export default CompanyReport