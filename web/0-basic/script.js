let serverOnline = false;

// Auto-resize textarea
const textarea = document.getElementById('prompt');
textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Temperature slider
const temperatureSlider = document.getElementById('temperature');
const temperatureValue = document.getElementById('temperatureValue');
temperatureSlider.addEventListener('input', function() {
    temperatureValue.textContent = this.value;
});

async function checkServerStatus() {
    const statusIndicator = document.getElementById('serverStatus');
    const statusText = document.getElementById('serverStatusText');
    const generateButton = document.getElementById('generate');

    try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (response.ok) {
            statusIndicator.className = 'status-indicator status-online';
            statusText.textContent = 'Server Online';
            generateButton.disabled = false;
            serverOnline = true;
            return true;
        }
    } catch (error) {
        console.error('Server check failed:', error);
    }

    statusIndicator.className = 'status-indicator status-offline';
    statusText.textContent = 'Server Offline';
    generateButton.disabled = true;
    serverOnline = false;
    return false;
}

async function fetchModels() {
    const isOnline = await checkServerStatus();
    if (!isOnline) {
        document.getElementById('modelList').innerHTML = 
            '<option value="">Server offline</option>';
        return;
    }

    try {
        const response = await fetch('http://localhost:11434/api/tags');
        const data = await response.json();
        const modelSelect = document.getElementById('modelList');
        modelSelect.innerHTML = '';
        
        data.models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.name;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching models:', error);
        document.getElementById('modelList').innerHTML = 
            '<option value="">Error loading models</option>';
    }
}

async function generateResponse() {
    if (!serverOnline) {
        alert('Server is offline. Please check your Ollama server.');
        return;
    }

    const prompt = document.getElementById('prompt').value;
    const model = document.getElementById('modelList').value;
    const temperature = parseFloat(document.getElementById('temperature').value);
    const button = document.getElementById('generate');
    const status = document.getElementById('status');
    const responseDiv = document.getElementById('response');

    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }

    button.disabled = true;
    status.textContent = 'Generating response...';
    responseDiv.textContent = '';

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                temperature: temperature
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        let fullResponse = '';

        while (true) {
            const {value, done} = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const jsonResponse = JSON.parse(line);
                        if (jsonResponse.response) {
                            fullResponse += jsonResponse.response;
                            responseDiv.innerHTML = marked.parse(fullResponse);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        }

        status.textContent = 'Generation complete!';
    } catch (error) {
        console.error('Error:', error);
        status.textContent = 'Error generating response: ' + error.message;
    } finally {
        button.disabled = false;
    }
}

// Enter key to submit
textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateResponse();
    }
});

setInterval(checkServerStatus, 5000);
fetchModels(); 