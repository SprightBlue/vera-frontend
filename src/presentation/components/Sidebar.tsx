function Sidebar() {
    return (
        <div style={{
            width: "240px",
            height: "100vh",
            backgroundColor: "#111827",
            color: "white",
            padding: "30px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "30px"
        }}>

            <div>
                <h1 style={{
                    margin: 0,
                    fontSize: "28px"
                }}>
                    Vera
                </h1>

                <p style={{
                    color: "#9CA3AF",
                    marginTop: "5px"
                }}>
                    Protección digital
                </p>
            </div>

            <ul style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "20px"
            }}>
                <li>Dashboard</li>
                <li>Alertas</li>
                <li>Historial</li>
                <li>Personas</li>
                <li>Ajustes</li>
            </ul>

        </div>
    );
}

export default Sidebar;