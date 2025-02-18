import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CWidgetStatsA } from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine, CChartBar } from '@coreui/react-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const WidgetsDropdown = ({ className, dados }) => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);

  // Verifica se os dados são válidos e extrai as propriedades necessárias
  const { resultado = [], total = {}, logados = [], tempoMedioGlobal = 0, tempoMedioPorHora = [] } = dados ?? {};

  // Extrair os valores de logados por hora
  const labels = Array.isArray(resultado) ? resultado.map((item) => {
    return item && typeof item.horario === 'string' ? item.horario : '';
  }) : [];

  const logadosData = Array.isArray(logados) ? logados.map((item) => {
    return item && Array.isArray(item.usuarios) ? item.usuarios.length : 0;
  }) : [];

  // Contar o total de logados na última hora
  const totalLogados = logados.length > 0 && Array.isArray(logados[logados.length - 1].usuarios) 
    ? logados[logados.length - 1].usuarios.length 
    : 0;

  // Extrair os valores de acionamentos e chamados cancelados
  const acionamentosData = Array.isArray(resultado) ? resultado.map((item) => {
    let totalAcionamentos = 0;
    if (item && item.segmentos && typeof item.segmentos === 'object') {
      Object.values(item.segmentos).forEach(segmento => {
        if (segmento && segmento.filas && typeof segmento.filas === 'object') {
          Object.values(segmento.filas).forEach(fila => {
            totalAcionamentos += fila.acionamentos || 0;
          });
        }
      });
    }
    return totalAcionamentos;
  }) : [];

  const chamadosCanceladosData = Array.isArray(resultado) ? resultado.map((item) => {
    let totalChamadosCancelados = 0;
    if (item && item.segmentos && typeof item.segmentos === 'object') {
      Object.values(item.segmentos).forEach(segmento => {
        if (segmento && segmento.filas && typeof segmento.filas === 'object') {
          Object.values(segmento.filas).forEach(fila => {
            totalChamadosCancelados += fila.chamadosCancelados || 0;
          });
        }
      });
    }
    return totalChamadosCancelados;
  }) : [];

  // Outros totais (acionamentos, chamados cancelados)
  const totalAcionamentos = acionamentosData.reduce((acc, curr) => acc + curr, 0);
  const totalChamadosCancelados = chamadosCanceladosData.reduce((acc, curr) => acc + curr, 0);

  // Converter tempo médio de espera para HH:MM:SS
  const converterParaHHMMSS = (tempoEmMinutos) => {
    const horas = Math.floor(tempoEmMinutos / 60);
    const minutos = Math.floor(tempoEmMinutos % 60);
    const segundos = Math.floor((tempoEmMinutos - Math.floor(tempoEmMinutos)) * 60);
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };

  // Formatar labels para exibição
  const formattedLabels = Array.isArray(labels) ? labels.map((label) => {
    if (typeof label !== 'string' || label === null || label === undefined) return ''; // Garante que label seja uma string válida
    const timeParts = label.split(':');
    return timeParts.length > 1 ? `${timeParts[0]}:${timeParts[1]}` : label;
  }) : [];

  // Dados do tempo médio de espera por hora
  const tempoMedioEsperaData = Array.isArray(tempoMedioPorHora) ? tempoMedioPorHora.map((hora) => hora.tempoMedio || 0) : [];

  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      {/* Gráfico de Logados */}
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={totalLogados}
          title="Logados"
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '150px' }}
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
                  legend: { display: false },
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
                  tooltip: { enabled: false },
                },
                hover: { mode: null },
                interaction: { mode: 'none' },
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
                    },
                  },
                  y: { display: false },
                },
                elements: {
                  point: {
                    radius: 2.6,
                    hitRadius: 0,
                    hoverRadius: 0,
                  },
                },
                layout: {
                  padding: { left: 20, right: 20, top: 20, bottom: 10 },
                },
              }}
              plugins={[ChartDataLabels]}
            />
          }
        />
      </CCol>

      {/* Gráfico de Acionamentos */}
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={totalAcionamentos}
          title="Acionamentos"
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '150px' }}
              data={{
                labels: formattedLabels,
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
                  legend: { display: false },
                  tooltip: { enabled: false },
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
                    },
                  },
                  y: { display: false },
                },
                elements: {
                  line: { borderWidth: 1.4, tension: 0.34 },
                  point: { radius: 2.6, hitRadius: 10, hoverRadius: 4 },
                },
                layout: {
                  padding: { left: 20, right: 20, top: 20, bottom: 10 },
                },
              }}
              plugins={[ChartDataLabels]}
            />
          }
        />
      </CCol>

      {/* Gráfico de Tempo Médio de Espera */}
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={converterParaHHMMSS(tempoMedioGlobal)}
          title="Tempo Médio de Espera"
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '150px' }}
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
                  legend: { display: false },
                  tooltip: { enabled: false },
                  datalabels: {
                    color: '#fff',
                    anchor: 'end',
                    align: 'top',
                    offset: 5,
                    clip: false,
                    clamp: true,
                    padding: 2,
                    formatter: (value) => converterParaHHMMSS(value),
                    rotation: -65,
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
                    },
                  },
                  y: { display: false },
                },
                elements: {
                  line: { borderWidth: 1.4, tension: 0.34 },
                  point: { radius: 2.6, hitRadius: 10, hoverRadius: 4 },
                },
                layout: {
                  padding: { left: 30, right: 30, top: 60, bottom: 10 },
                },
              }}
              plugins={[ChartDataLabels]}
            />
          }
        />
      </CCol>

      {/* Gráfico de Chamados Cancelados */}
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={totalChamadosCancelados}
          title="Abandonadas"
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '150px' }}
              data={{
                labels: formattedLabels,
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
                  legend: { display: false },
                  tooltip: { enabled: false },
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
                    grid: { display: false },
                    ticks: {
                      display: true,
                      color: '#fff',
                      autoSkip: false,
                      maxRotation: 0,
                      minRotation: 0,
                    },
                  },
                  y: { display: false },
                },
                layout: {
                  padding: { left: 20, right: 20, top: 20, bottom: 10 },
                },
              }}
              plugins={[ChartDataLabels]}
            />
          }
        />
      </CCol>
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  dados: PropTypes.object.isRequired,
};

export default WidgetsDropdown;