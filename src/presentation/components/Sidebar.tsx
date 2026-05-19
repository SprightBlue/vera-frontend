function Sidebar() {
    return (
        <div style={{
            width: "220px",
            height: "100vh",
            backgroundColor: "#0A0EEC",
            color: "white",
            padding: "20px"
        }}>
            <h2>Vera</h2>

            <ul style={{ listStyle: "none", padding: 0 }}>
                <li>Dashboard</li>
                <li>Alertas</li>
                <li>Historial</li>
                <li>Ajustes</li>
            </ul>
        </div>
    );
}

export default Sidebar;