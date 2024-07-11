// Reads a text file with the api key
const getApiKey = async () => {
    try {
        const response = await fetch('resources/api_key.txt');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const apiKey = await response.text();
        return apiKey.trim();
    } catch (error) {
        console.error('Problem getting API key: ', error);
        return "";
    }
}

export { getApiKey };