export function ToggleTTS() {
    wnd.Janitor.TTSEnabled = !wnd.Janitor.TTSEnabled
    localStorage.setItem("TTSEnabled", wnd.Janitor.TTSEnabled + "")
    console.log(`TTS is now ${wnd.Janitor.TTSEnabled ? "enabled" : "disabled"}`)

    if (wnd.Janitor.TTSEnabled) setupTTS()
    else {
        wnd.Janitor.Hooks.Delta = (...args) => {}
        wnd.Janitor.Hooks.StopStream = (...args) => {}
        wnd.Janitor.Hooks.SaveMessage = (message) => {}
    }
}
export function ToggleDeltaTTS() {
    wnd.Janitor.UseDeltaForTTS = !wnd.Janitor.UseDeltaForTTS
    localStorage.setItem("UseDeltaForTTS", wnd.Janitor.UseDeltaForTTS + "")
    console.log(`Delta TTS is now ${wnd.Janitor.UseDeltaForTTS ? "enabled" : "disabled"}`)
}

//* util
function sendToTTS(data: any) {
    GM.xmlHttpRequest({
        method: 'POST',
        url: 'http://127.0.0.1:3246/tts',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        onerror: function (error: any) {
            console.error('Request failed:', error);
        }
    });
}
function parseTextWithMarkersRegex(text: string) { // ily deepseek
    const result = [];
    const pattern = /(\*\*`.*?`\*\*|\*`.*?`\*|`.*?`|\*\*.*?\*\*|\*.*?\*|"[^"]*"|\S+)/g;

    const matches = text.match(pattern) || [];

    for (const match of matches) {
        let text = match;
        let type = 'chat';

        // Check patterns in order of specificity
        if (match.startsWith('**`') && match.endsWith('`**')) {
            text = match.slice(3, -3).trim();
            type = 'thought';
        } else if (match.startsWith('*`') && match.endsWith('`*')) {
            text = match.slice(2, -2).trim();
            type = 'thought';
        } else if (match.startsWith('`') && match.endsWith('`')) {
            text = match.slice(1, -1).trim();
            type = 'thought';
        } else if (match.startsWith('**') && match.endsWith('**')) {
            text = match.slice(2, -2).trim();
            type = 'action';
        } else if (match.startsWith('*') && match.endsWith('*')) {
            text = match.slice(1, -1).trim();
            type = 'action';
        } else if (match.startsWith('"') && match.endsWith('"')) {
            text = match.slice(1, -1).trim();
            type = 'chat';
        }

        result.push({ text, type });
    }

    return result;
}

export type JMessage = {
    character_id: string,
    chat_id: number,
    created_at: string,
    id: number,
    is_bot: boolean,
    is_main: boolean,
    message: string,
    rating: null|number
}

//* main stuff
export default function setupTTS() {
    var message = ""
    wnd.Janitor.Hooks.Delta = (delta: string) => {
        if (!wnd.Janitor.UseDeltaForTTS) return
        for (let el of [".", "?", "!", "*"]) {
            if (delta.includes(el) && message.replaceAll(el, "").trim().length > 0) {
                sendToTTS({ text: message.trim() })
                message = ""
            }
        }
    }
    wnd.Janitor.Hooks.StopStream = () => {
        if (!wnd.Janitor.UseDeltaForTTS) return
        if (message.trim().length > 0) {
            sendToTTS({ text: message.trim() })
        }
    }

    // non delta (aka better cuz its after we reformat the shit)
    wnd.Janitor.Hooks.SaveMessage = (e: JMessage) => {
        if (wnd.Janitor.UseDeltaForTTS) return
        if (!e.is_bot) return // dont read user messages
        const message = e.message
        if (message.trim().length > 0) {
            for (let data of parseTextWithMarkersRegex(message.trim())) {
                sendToTTS(data)
            }
        }
    }
}