export async function getDashboardData() {

    const response = await fetch("http://localhost:8080/dashboard");

    return response.json();
}