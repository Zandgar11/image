const outputElement = document.getElementById('output');
const inputElement = document.getElementById('input');

let webhookUrl = '';
let username = '';
let message = '';
let avatarUrl = '';
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
                mode = 'spam';
                output('Spam mode selected. Please enter the webhook URL.');
            } else if (input.toLowerCase() === 'coup par coup') {
                mode = 'coup';
                output('Coup par coup mode selected. Please enter the webhook URL.');
            } else {
                output('Invalid mode. Please type "spam" or "coup par coup".');
            }
        } else if (mode === 'spam' || mode === 'coup') {
            if (input.startsWith('https://discord.com/api/webhooks/')) {
                webhookUrl = input;
                output('Webhook URL set. Please enter the username.');
                mode = 'username';
            } else {
                output('Invalid webhook URL. Please try again.');
            }
        } else if (mode === 'username') {
            username = input;
            output('Username set. Please enter the avatar URL.');
            mode = 'avatar';
        } else if (mode === 'avatar') {
            if (input.startsWith('http')) {
                avatarUrl = input;
                output('Avatar URL set. Please enter the message.');
                mode = 'message';
            } else {
                output('Invalid avatar URL. Please try again.');
            }
        } else if (mode === 'message') {
            message = input;
            if (mode === 'spam') {
                startSpam();
                output('Spam started. Type "stop" to stop spamming.');
                mode = 'spamControl';
            } else if (mode === 'coup') {
                await sendMessage(webhookUrl, username, message, avatarUrl);
                output('Message sent. Please enter a new message or type "exit" to finish.');
                mode = 'coupControl';
            }
        } else if (mode === 'spamControl') {
            if (input.toLowerCase() === 'stop') {
                clearInterval(spamInterval);
                output('Spam stopped. Please enter a new message or type "exit" to finish.');
                mode = 'message';
            } else {
                output('Invalid command. Type "stop" to stop spamming.');
            }
        } else if (mode === 'coupControl') {
            if (input.toLowerCase() === 'exit') {
                output('Goodbye!');
                inputElement.disabled = true;
            } else {
                await sendMessage(webhookUrl, username, input, avatarUrl);
                output('Message sent. Please enter a new message or type "exit" to finish.');
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

async function sendMessage(webhookUrl, username, message, avatarUrl) {
    const payload = {
        content: message,
        username: username,
        avatar_url: avatarUrl
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
        await sendMessage(webhookUrl, username, message, avatarUrl);
    }, 1000); // Change interval time as needed
}
