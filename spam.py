import string, json, requests, random
from pystyle import Colorate, Colors, Center
from os import system
from time import sleep

system('cls')
boucle1 = True
boucle2 = True
failed_previous = False

sent_count = 0

def random_number(digits):
    range_start = 10**(digits-1)
    range_end = (10**digits)-1
    return random.randint(range_start, range_end)

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def send_message(webhook_url):
    username = "toi"
    message = "@everyone"
    avatar = "https://raw.githubusercontent.com/Zandgar11/image/main/JordanLeCopainDaxxio.png"
    data = json.dumps({
        "content": message,
        "username": username,
        "avatar_url": avatar,
        "tts": False
    })

    header = {
        "content-type": "application/json"
    }

    response = requests.post(webhook_url, data, headers=header)

    if not response.ok:
        if response.status_code == 429:
            system('cls')
            print(Colorate.Horizontal(Colors.black_to_red, Center.XCenter(header_final)))
            print(Colorate.Horizontal(Colors.black_to_red, "[/] Too many requests - rate limited"))
            sleep(2)
        else:
            system('cls')
            print(Colorate.Horizontal(Colors.black_to_red, Center.XCenter(header_final)))
            print(Colorate.Horizontal(Colors.black_to_red, f"[!] Failed to send message ! Status code: {response.status_code}"))
            print(Colorate.Horizontal(Colors.black_to_red, f"[!] Error details: {response.text}"))
            sleep(15)
        return False

    try:
        system('cls')
        print(Colorate.Horizontal(Colors.blue_to_green, Center.XCenter(header_final)))
        print(Colorate.Horizontal(Colors.blue_to_green, f"[+] Message sent ! [ {sent_count} ]"))
    except:
        system('cls')
        print(Colorate.Horizontal(Colors.black_to_red, Center.XCenter(header_final)))
        print(Colorate.Horizontal(Colors.black_to_red, "[!] Failed to send message !"))
        sleep(15)
    return True

header_final = """
██╗    ███████████████╗██╗  ██╗██████╗ ██████╗██╗  ██ 
██║    ████╔════██╔══████║  ████╔═══████╔═══████║ ██╔ 
██║ █╗ ███████╗ ██████╔█████████║   ████║   ███████╔╝ 
██║███╗████╔══╝ ██╔══████╔══████║   ████║   ████╔═██╗ 
╚███╔███╔█████████████╔██║  ██╚██████╔╚██████╔██║  ██ 
 ╚══╝╚══╝╚══════╚═════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═ 
\n\n\n\n"""

while boucle1:
    print(Colorate.Horizontal(Colors.yellow_to_red, Center.XCenter(header_final)))
    print(Colorate.Horizontal(Colors.yellow_to_red, "[-] Webhook URL ↓"))
    webhook_url = input("")
    if webhook_url.startswith("https://discord.com/api/webhooks/"):
        boucle1 = False
        system('cls')
    else:
        system('cls')
        print(Colorate.Horizontal(Colors.black_to_red, Center.XCenter(header_final)))
        print(Colorate.Horizontal(Colors.black_to_red, "[!] Error valid link !"))
        sleep(2)
        system('cls')

while boucle2:
    if send_message(webhook_url):
        sent_count += 1
