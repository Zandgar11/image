const outputElement = document.getElementById('output');
const inputElement = document.getElementById('input');

let webhookUrl = '';
let username = '';
let message = '';
let mode = 'instructions';
let spamInterval;
let spamMessage = '';

const instructions = `
Welcome to the Command Line Webhook Sender!
Please follow the instructions below:
1. Type "spam" to enter spam mode.
2. Type "coup par coup" to enter coup par coup mode.
`;

document.addEventListener('DOMContentLoaded', () => {
    output(instructions);
});

inputElement.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const input = inputElement.value.trim();
        inputElement.value = '';
        output('>' + input);
        
        if (mode === 'instructions') {
            if (input.toLowerCase() === 'spam') {
                mode = 'webhook';
                output('Spam mode selected. Please enter the webhook URL.');
            } else if (input.toLowerCase() === 'coup par coup') {
                mode = 'webhook';
                output('Coup par coup mode selected. Please enter the webhook URL.');
            } else {
                output('Invalid mode. Please type "spam" or "coup par coup".');
            }
        } else if (mode === 'webhook') {
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
            message = input;
            if (spamMessage) {
                clearInterval(spamInterval);
                spamMessage = '';
            }
            if (mode === 'spam') {
                spamMessage = message;
                startSpam();
                output('Spam started. Type "stop" to stop spamming.');
                mode = 'spamControl';
            } else {
                await sendMessage(webhookUrl, username, message);
                output('Message sent. Please enter a new message or type "exit" to finish.');
            }
        } else if (mode === 'spamControl') {
            if (input.toLowerCase() === 'stop') {
                clearInterval(spamInterval);
                spamMessage = '';
                output('Spam stopped. Please enter a new message or type "exit" to finish.');
                mode = 'message';
            } else {
                output('Invalid command. Type "stop" to stop spamming.');
            }
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

function startSpam() {
    spamInterval = setInterval(async () => {
        await sendMessage(webhookUrl, username, spamMessage);
    }, 1000); // Change interval time as needed
}
