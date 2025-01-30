import React from 'react';
import { CRow, CCol, CAvatar, CCard, CCardBody, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';

const TabelaDashboard = ({ dados }) => {
    return (
        <CCard className="mb-0" style={{ overflowY: 'auto', maxHeight: '589px', padding: '10px', backgroundColor: '#6495ed'}}>
            <CRow>
                <CCol >
                    <h4 id="traffic" className="card-title mb-0" style={{textAlign: 'center', color: '#FFF'}}>
                        Usuarios Logados
                    </h4>
                </CCol>
                <CCardBody style={{  maxHeight: '589px', borderRadius: '5px' }}>
                    <CTable align="middle" className="mb-0 border" hover responsive>
                        <CTableHead className="text-nowrap">
                            <CTableRow>
                                <CTableHeaderCell className="bg-body-tertiary text-center"><CIcon icon={cilPeople} /></CTableHeaderCell>
                                <CTableHeaderCell className="bg-body-tertiary">Login</CTableHeaderCell>
                                <CTableHeaderCell className="bg-body-tertiary">Nome</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {dados.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell className="text-center">
                                        <CAvatar size="md" src={item.avatar} status={item.status} />
                                    </CTableDataCell>
                                    <CTableDataCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <div>{item.login}</div>
                                    </CTableDataCell>
                                    <CTableDataCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <div>{item.nome}</div>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CRow>
        </CCard>
    );
};

export default TabelaDashboard;
