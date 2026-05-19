type Props = {
    title: string;
    value: string;
};

function StatCard({ title, value }: Props) {
    return (
        <div style={{
            backgroundColor: "#111827",
            color: "white",
            padding: "25px",
            borderRadius: "16px",
            minWidth: "220px",
            flex: 1
        }}>

            <h3 style={{
                margin: 0,
                color: "#9CA3AF",
                fontSize: "16px"
            }}>
                {title}
            </h3>

            <p style={{
                fontSize: "36px",
                fontWeight: "bold",
                marginTop: "15px",
                marginBottom: 0
            }}>
                {value}
            </p>

        </div>
    );
}

export default StatCard;