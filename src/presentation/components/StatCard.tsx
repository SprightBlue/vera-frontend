type Props = {
    title: string;
    value: string;
};

function StatCard({ title, value }: Props) {
    return (
        <div style={{
            backgroundColor: "#111827",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "200px"
        }}>
            <h3>{title}</h3>

            <p style={{
                fontSize: "24px",
                fontWeight: "bold"
            }}>
                {value}
            </p>
        </div>
    );
}

export default StatCard;