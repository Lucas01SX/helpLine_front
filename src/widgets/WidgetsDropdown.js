import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importe o plugin

const WidgetsDropdown = ({ className, dados }) => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);

  // Calcular as somas totais
  const totalLogados = dados.reduce((acc, curr) => acc + curr.logados, 0);
  const totalAcionamentos = dados.reduce((acc, curr) => acc + curr.acionamentos, 0);
  const totalTempoMedioEspera = dados.reduce((acc, curr) => acc + curr.tempoMedioEspera, 0);
  const totalChamadosCancelados = dados.reduce((acc, curr) => acc + curr.chamadosCancelados, 0);

  // Preparar os dados para os gráficos
  const labels = dados.map((item) => item.hora);
  const logadosData = dados.map((item) => item.logados);
  const acionamentosData = dados.map((item) => item.acionamentos);
  const tempoMedioEsperaData = dados.map((item) => item.tempoMedioEspera);
  const chamadosCanceladosData = dados.map((item) => item.chamadosCancelados);

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary');
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info');
          widgetChartRef2.current.update();
        });
      }
    });
  }, [widgetChartRef1, widgetChartRef2]);

  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {totalLogados}{' '}
            </>
          }
          title="Logados"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '100px' }}
              data={{
                labels: labels,
                datasets: [
                  {
                    label: 'Logados',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(255, 255, 255)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: logadosData,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      title: () => '', // Remove o título (label da faixa de hora)
                      label: (context) => {
                        return `${context.label}`; // Exibe apenas o valor do ponto
                      },
                    },
                  },
                  datalabels: {
                    color: '#fff', // Texto branco
                    anchor: 'end', // Posiciona o rótulo no topo do ponto
                    align: 'top', // Alinha o rótulo acima do ponto
                    formatter: (value) => value, // Exibe o valor do ponto
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                      color: '#fff', // Texto branco para os ticks do eixo X
                    },
                  },
                  y: {
                    min: 0,
                    max: Math.max(...logadosData) + 100,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
              plugins={[ChartDataLabels]} // Adicione o plugin ao gráfico
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {totalAcionamentos}{' '}
            </>
          }
          title="Acionamentos"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '100px' }}
              data={{
                labels: labels,
                datasets: [
                  {
                    label: 'Acionamentos',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(255, 255, 255)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: acionamentosData,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                  datalabels: {
                    color: '#fff', // Texto branco
                    anchor: 'end', // Posiciona o rótulo no topo do ponto
                    align: 'top', // Alinha o rótulo acima do ponto
                    formatter: (value) => value, // Exibe o valor do ponto
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                      color: '#fff', // Texto branco para os ticks do eixo X
                    },
                  },
                  y: {
                    min: 0,
                    max: Math.max(...acionamentosData) + 100,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
              plugins={[ChartDataLabels]} // Adicione o plugin ao gráfico
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {totalTempoMedioEspera.toFixed(2)}{' '}
            </>
          }
          title="Tempo Médio Espera"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '100px' }}
              data={{
                labels: labels,
                datasets: [
                  {
                    label: 'Tempo Médio Espera',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: tempoMedioEsperaData,
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                  datalabels: {
                    color: '#fff', // Texto branco
                    anchor: 'end', // Posiciona o rótulo no topo do ponto
                    align: 'top', // Alinha o rótulo acima do ponto
                    formatter: (value) => value.toFixed(2), // Exibe o valor do ponto com 2 casas decimais
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                    max: Math.max(...tempoMedioEsperaData) + 0.10,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
              plugins={[ChartDataLabels]} // Adicione o plugin ao gráfico
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              {totalChamadosCancelados}{' '}
            </>
          }
          title="Abandonadas"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '100px' }}
              data={{
                labels: labels,
                datasets: [
                  {
                    label: 'Chamados Cancelados',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: chamadosCanceladosData,
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  datalabels: {
                    color: '#fff', // Texto branco
                    anchor: 'end', // Posiciona o rótulo no topo da barra
                    align: 'top', // Alinha o rótulo acima da barra
                    formatter: (value) => value, // Exibe o valor da barra
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: true,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    max: Math.max(...chamadosCanceladosData) + 15,
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
              plugins={[ChartDataLabels]} // Adicione o plugin ao gráfico
            />
          }
        />
      </CCol>
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  dados: PropTypes.array.isRequired,
};

export default WidgetsDropdown;