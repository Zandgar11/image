const outputElement = document.getElementById('output');
const inputElement = document.getElementById('input');

let webhookUrl = '';
let username = '';
let mode = 'webhook';

inputElement.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const input = inputElement.value.trim();
        inputElement.value = '';
        
        if (mode === 'webhook') {
            if (input.startsWith('https://discord.com/api/webhooks/')) {
                webhookUrl = input;
                output('Webhook URL set. Please enter the username.');
                mode = 'username';
            } else {
                output('Invalid webhook URL. Please try again.');
            }
        } else if (mode === 'username') {
            username = input;
            output('Username set. Please enter the message.');
            mode = 'message';
        } else if (mode === 'message') {
            const message = input;
            output(`Sending message: ${message}`);
            await sendMessage(webhookUrl, username, message);
            output('Message sent. Please enter a new message or type "exit" to finish.');
        } else if (mode === 'exit') {
            if (input.toLowerCase() === 'exit') {
                output('Goodbye!');
                inputElement.disabled = true;
            } else {
                output('Please type "exit" to finish or enter a new message.');
            }
        }
    }
});

function output(text) {
    const p = document.createElement('p');
    p.textContent = text;
    outputElement.appendChild(p);
    outputElement.scrollTop = outputElement.scrollHeight;
}

async function sendMessage(webhookUrl, username, message) {
    const payload = {
        content: message,
        username: username,
        avatar_url: "https://raw.githubusercontent.com/Zandgar11/image/main/JordanLeCopainDaxxio.png"
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
    } catch (error) {
        output(`Failed to send message: ${error.message}`);
    }
}
