export async function getAlerts() {

    const response = await fetch("http://localhost:8080/alerts");

    return response.json();

}