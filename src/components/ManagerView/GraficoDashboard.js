import React from 'react';
import { CCard, CCardBody, CCol, CRow, CButton, CButtonGroup } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';
import MainChart from './MainChart';

const GraficoDashboard = () => {
    return (
        <CCard className="mb-4">
            <CCardBody>
                <CRow>
                    <CCol sm={5}>
                        <h4 id="traffic" className="card-title mb-0">
                            Traffic
                        </h4>
                        <div className="small text-body-secondary">January - July 2023</div>
                    </CCol>
                    <CCol sm={7} className="d-none d-md-block">
                        <CButton color="primary" className="float-end">
                            <CIcon icon={cilCloudDownload} />
                        </CButton>
                        <CButtonGroup className="float-end me-3">
                            {['Day', 'Month', 'Year'].map((value) => (
                                <CButton color="outline-secondary" key={value} active={value === 'Month'}>
                                    {value}
                                </CButton>
                            ))}
                        </CButtonGroup>
                    </CCol>
                </CRow>
                <MainChart />
            </CCardBody>
        </CCard>
    );
};

export default GraficoDashboard;
