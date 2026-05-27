import React, { useState, useEffect } from 'react';

const AlertsView = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/alerts')
      .then(response => response.json())
      .then(data => setAlerts(data))
      .catch(error => console.error(error));
  }, []);

  const getRiskColor = (level) => {
    switch (level) {
      case 'ALTO': return 'red';
      case 'MEDIO': return 'orange';
      case 'BAJO': return 'green';
      case 'RESUELTO': return 'blue';
      default: return 'gray';
    }
};

    const getRiskLabel = (level) => {
        switch (level) {
          case 'ALTO': return 'Alto Riesgo';
            case 'MEDIO': return 'Riesgo Medio';
            case 'BAJO': return 'Riesgo Bajo';
            case 'RESUELTO': return 'Resuelto';
            default: return 'Desconocido';
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#13131a', color: 'white', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '250px', padding: '30px 20px', borderRight: '1px solid #272732', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 'bold', marginBottom: '50px', color: '#3b82f6' }}>
          <div style={{ width: '30px', height: '30px', backgroundColor: '#3b82f6', borderRadius: '8px' }}></div>
          Vera
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: '12px', borderRadius: '8px' }}>Panel Principal</button>
          <button style={{ background: '#1c1c26', border: '1px solid #3b82f6', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer' }}>Alertas</button>
          <button style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: '12px', borderRadius: '8px' }}>Analizar</button>
          <button style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: '12px', borderRadius: '8px' }}>Contactos</button>
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: '12px' }}>Configuracion</button>
          <button style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: '12px' }}>Cerrar Sesion</button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '40px 60px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Alertas y Notificaciones</h2>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Monitorea actividad sospechosa y amenazas detectadas</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #272732', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N</div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #272732', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>U</div>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', background: '#1c1c26', borderRadius: '12px', flex: 1, border: '1px solid #272732' }}>
            <h3 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>{alerts.length}</h3>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Total Alertas</p>
          </div>
          <div style={{ padding: '24px', background: '#1c1c26', borderRadius: '12px', flex: 1, border: '1px solid #272732' }}>
            <h3 style={{ fontSize: '32px', margin: '0 0 8px 0', color: '#ef4444' }}>{alerts.filter(a => a.riskLevel === 'ALTO').length}</h3>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Riesgo Alto</p>
          </div>
          <div style={{ padding: '24px', background: '#1c1c26', borderRadius: '12px', flex: 1, border: '1px solid #272732' }}>
            <h3 style={{ fontSize: '32px', margin: '0 0 8px 0', color: '#eab308' }}>{alerts.filter(a => a.riskLevel === 'MEDIO').length}</h3>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Riesgo Medio</p>
          </div>
          <div style={{ padding: '24px', background: '#1c1c26', borderRadius: '12px', flex: 1, border: '1px solid #272732' }}>
            <h3 style={{ fontSize: '32px', margin: '0 0 8px 0', color: '#14b8a6' }}>{alerts.filter(a => a.riskLevel === 'RESUELTO').length}</h3>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Resueltas</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '20px', fontSize: '14px' }}>Todas</button>
          <button style={{ padding: '8px 16px', background: 'transparent', color: '#9ca3af', border: 'none', fontSize: '14px' }}>Riesgo Alto</button>
          <button style={{ padding: '8px 16px', background: 'transparent', color: '#9ca3af', border: 'none', fontSize: '14px' }}>Riesgo Medio</button>
          <button style={{ padding: '8px 16px', background: 'transparent', color: '#9ca3af', border: 'none', fontSize: '14px' }}>Riesgo Bajo</button>
          <button style={{ padding: '8px 16px', background: 'transparent', color: '#9ca3af', border: 'none', fontSize: '14px' }}>Resueltas</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {alerts.map(alert => (
            <div key={alert.id} style={{ background: '#1c1c26', padding: '24px', borderRadius: '12px', border: '1px solid #272732', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ color: getRiskColor(alert.riskLevel) }}>⚠</div>
                  <h4 style={{ margin: 0, fontSize: '18px' }}>{alert.title}</h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ color: getRiskColor(alert.riskLevel), fontSize: '14px', fontWeight: 'bold', border: `1px solid ${getRiskColor(alert.riskLevel)}`, padding: '4px 12px', borderRadius: '20px' }}>{getRiskLabel(alert.riskLevel)}</span>
                </div>
              </div>
              <p style={{ margin: 0, color: '#e5e7eb', fontSize: '15px', fontWeight: 'bold' }}>{alert.description}</p>
              <div style={{ background: '#13131a', padding: '15px', borderRadius: '8px', border: '1px solid #272732', color: '#9ca3af', fontSize: '14px' }}>
                <p style={{ margin: 0 }}>Fuente: {alert.source}</p>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button style={{ padding: '8px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Ver Detalles</button>
                <button style={{ padding: '8px 20px', background: 'transparent', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Marcar Seguro</button>
                <button style={{ padding: '8px 20px', background: 'transparent', color: '#ef4444', border: '1px solid #7f1d1d', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Reportar</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AlertsView;