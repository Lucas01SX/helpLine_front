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
  const { resultado = [], total = {} } = dados ?? {};  

  const totalLogados = total?.logados ?? 0;
  const totalAcionamentos = total?.acionamentos ?? 0;
  const totalTempoMedioEspera = total?.tempoMedioEspera ?? 0;
  const totalChamadosCancelados = total?.chamadosCancelados ?? 0;

  const converterParaHHMMSS = (tempoEmMinutos) => {
    const horas = Math.floor(tempoEmMinutos / 60);
    const minutos = Math.floor(tempoEmMinutos % 60);
    const segundos = Math.floor((tempoEmMinutos - Math.floor(tempoEmMinutos)) * 60);
    
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };
  // Preparar os dados para os gráficos
  const labels = resultado.map((item) => item.hora);
  const logadosData = resultado.map((item) => item.logados);
  const acionamentosData = resultado.map((item) => item.acionamentos);
  const tempoMedioEsperaData = resultado.map((item) => item.tempoMedioEspera);
  const chamadosCanceladosData = resultado.map((item) => item.chamadosCancelados);  

  const formattedLabels = labels.map((label) => {
    // Converte cada label de hora (ex. '07:00:00') para 'HH:mm'
    const timeParts = label.split(':');
    return timeParts.length > 1 ? `${timeParts[0]}:${timeParts[1]}` : label;
  });

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
              {totalLogados}
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
                labels: formattedLabels,
                datasets: [
                  {
                    label: 'Logados',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(255, 255, 255)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: logadosData,
                    fill: false,
                    borderWidth: 1.4,
                    pointRadius: 2.6,
                    tension: 0.34,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: { 
                    display: false,
                  },
                  datalabels: {
                    color: '#fff',
                    anchor: 'end',
                    align: 'top',
                    offset: 5,
                    clip: false,
                    clamp: true,
                    padding: 2,
                    formatter: (value) => value,
                  },
                  tooltip: {enabled: true,},
                },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {
                    border: { display: true },
                    grid: { display: false, drawBorder: false },
                    ticks: {
                      display: true,
                      color: '#fff',
                      autoSkip: false,
                      maxRotation: 0,
                      minRotation: 0,
                      formattedLabels,
                    },
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {enabled: false},
                layout: {
                  padding: { left: 20, right: 20, top: 20, bottom: 20 },
                },
              }}
              plugins={[ChartDataLabels]}
            />

          }
        />
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={totalAcionamentos}
          title="Acionamentos"
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '100px' }}
              data={{
                labels: formattedLabels, // Usando os mesmos labels formatados
                datasets: [
                  {
                    label: 'Acionamentos',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(255, 255, 255)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: acionamentosData,
                    fill: false,
                    borderWidth: 1.4,
                    pointRadius: 2.6,
                    tension: 0.34,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: { 
                    display: false,
                  },
                  tooltip: {
                    enabled: false, // Desativa o tooltip
                  },
                  datalabels: {
                    color: '#fff',
                    anchor: 'end',
                    align: 'top',
                    offset: 5,
                    clip: false,
                    clamp: true,
                    padding: 2,
                    formatter: (value) => value,
                  },
                },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {
                    border: { display: true },
                    grid: { display: false, drawBorder: false },
                    ticks: {
                      display: true,
                      color: '#fff',
                      autoSkip: false,
                      maxRotation: 0,
                      minRotation: 0,
                      formattedLabels,
                    },
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: { borderWidth: 1.4, tension: 0.34 },
                  point: { radius: 2.6, hitRadius: 10, hoverRadius: 4 },
                },
                layout: {
                  padding: { left: 20, right: 20, top: 20, bottom: 20 },
                },
              }}
              plugins={[ChartDataLabels]}
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={converterParaHHMMSS(totalTempoMedioEspera)}
          title="Tempo Médio de Espera"
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '100px' }}
              data={{
                labels: formattedLabels,
                datasets: [
                  {
                    label: 'Tempo Médio Espera',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: tempoMedioEsperaData,
                    fill: false,
                    borderWidth: 1.4,
                    pointRadius: 2.6,
                    tension: 0.34,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: { 
                    display: false,
                  },
                  tooltip: {
                    enabled: false, // Desativa o tooltip
                  },
                  datalabels: {
                    color: '#fff',
                    anchor: 'end',
                    align: 'top',
                    offset: 5,
                    clip: false,
                    clamp: true,
                    padding: 2,
                    formatter: (value) => converterParaHHMMSS(value),
                  },
                },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {
                    border: { display: true },
                    grid: { display: false, drawBorder: false },
                    ticks: {
                      display: true,
                      color: '#fff',
                      autoSkip: false,
                      maxRotation: 0,
                      minRotation: 0,
                      formattedLabels,
                    },
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: { borderWidth: 1.4, tension: 0.34 },
                  point: { radius: 2.6, hitRadius: 10, hoverRadius: 4 },
                },
                layout: {
                  padding: { left: 30, right: 30, top: 20, bottom: 20 },
                },
              }}
              plugins={[ChartDataLabels]}
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={totalChamadosCancelados}
          title="Abandonadas"
          chart={
            <CChartBar
            className="mt-3 mx-3"
            style={{ height: '100px' }}
            data={{
              labels: formattedLabels, // Usando os mesmos labels formatados
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
                tooltip: {
                  enabled: false, // Desativa o tooltip
                },
                datalabels: {
                  color: '#fff',
                  anchor: 'center',
                  align: 'center',
                  offset: 0,
                  formatter: (value) => value,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false, // Desativa as linhas de grade do eixo X
                  },
                  ticks: {
                    display: true, // Garante que os ticks do eixo X sejam exibidos
                    color: '#fff', // Cor branca para os rótulos
                    autoSkip: false, // Desativa a omissão automática de rótulos
                    maxRotation: 0,
                    minRotation: 0,
                    formattedLabels,
                  },
                },
                y: {
                  display: false, // Desabilita o eixo Y
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false, // Não exibe os ticks do eixo Y
                  },
                },
              },
              layout: {
                padding: {
                  left: 20, // Adiciona padding à esquerda
                  right: 20, // Adiciona padding à direita
                },
              },
            }}
            plugins={[ChartDataLabels]} // Adiciona o plugin ao gráfico
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