// util

import type { JMessage } from "./tts";

// https://greasyfork.org/en/scripts/551458-janitor-ai-automatic-message-formatting-corrector-settings-menu
function processText(text: string) {
    // 1. Remove tags if enabled
    text = text.replace(/\n?\s*<(thought|thoughts)>[\s\S]*?<\/(thought|thoughts)>\s*\n?/g, '')
        .replace(/<(system|response)>|<\/response>/g, '')
        .replace(/\n?\s*<think>[\s\S]*?<\/think>\s*\n?/g, '')
        .replace('</think>', '')

    // 3. Format Narration
    const wrapper = "*"; // i only use this so idgaf abt others
    const normalizedText = text.replace(/[«“”„‟⹂❞❝]/g, '"');
    const lines = normalizedText.split('\n');

    return lines.map(line => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return '';
        const cleanLine = trimmedLine.replace(/\*/g, ''); // Strip existing asterisks

        // Regex to find quotes or code blocks
        if (cleanLine.includes('"') || cleanLine.includes('`')) {
            const fragments = cleanLine.split(/("[\s\S]*?"|`[\s\S]*?`)/);
            return fragments.map(frag => {
                // If it's a quote or code, leave it alone
                if ((frag.startsWith('"') && frag.endsWith('"')) || (frag.startsWith('`') && frag.endsWith('`'))) {
                    return frag;
                }
                // If it's narration and not empty, wrap it
                return frag.trim() !== '' ? `${wrapper}${frag.trim()}${wrapper}` : '';
            }).filter(Boolean).join(' ');
        }
        // Entire line is narration
        return `${wrapper}${cleanLine}${wrapper}`;
    }).join('\n');
}

export default async function patchChat() {
    if (typeof wnd.Janitor.Stores.generationStore == "undefined") return

    //* Hooking new message
    if (typeof wnd.Janitor.Stores.generationStore.runGenerateAnswer != "undefined") {
        if (wnd.Janitor.Stores.generationStore.runGenerateAnswer.patched) return // already patched
        
        if (typeof wnd.Janitor.Generation.Answer == "undefined") {
            wnd.Janitor.Generation.Answer = wnd.Janitor.Stores.generationStore.runGenerateAnswer
        }
        wnd.Janitor.Stores.generationStore.runGenerateAnswer = (message: string, callback: any) => {
            return wnd.Janitor.Generation.Answer(message, (delta: string) => {
                wnd.Janitor.Hooks.Delta(delta)
                callback(delta)
            }).then(wnd.Janitor.Hooks.StopStream)
        }
        wnd.Janitor.Stores.generationStore.runGenerateAnswer.patched = true // so we know if we patched already
    }
    //* Hooking generate alternative message
    if (typeof wnd.Janitor.Stores.generationStore.runGenerateAlternative != "undefined") {
        if (typeof wnd.Janitor.Generation.Alternative == "undefined") {
            wnd.Janitor.Generation.Alternative = wnd.Janitor.Stores.generationStore.runGenerateAlternative
        }
        wnd.Janitor.Stores.generationStore.runGenerateAlternative = (callback: any) => {
            return wnd.Janitor.Generation.Alternative((delta: string) => {
                wnd.Janitor.Hooks.Delta(delta)
                callback(delta)
            }).then(wnd.Janitor.Hooks.StopStream)
        }
    }
    //* Hooking regenerate
    if (typeof wnd.Janitor.Stores.generationStore.runRegenerate != "undefined") {
        if (typeof wnd.Janitor.Generation.Regenerate == "undefined") {
            wnd.Janitor.Generation.Regenerate = wnd.Janitor.Stores.generationStore.runRegenerate
        }
        wnd.Janitor.Stores.generationStore.runRegenerate = (callback: any) => {
            return wnd.Janitor.Generation.Regenerate((delta: string) => {
                wnd.Janitor.Hooks.Delta(delta)
                callback(delta)
            }).then(wnd.Janitor.Hooks.StopStream)
        }
    }
    //* Hooking continue
    if (typeof wnd.Janitor.Stores.generationStore.runContinueMessage != "undefined") {
        if (typeof wnd.Janitor.Generation.Continue == "undefined") {
            wnd.Janitor.Generation.Continue = wnd.Janitor.Stores.generationStore.runContinueMessage
        }
        wnd.Janitor.Stores.generationStore.runContinueMessage = (message: string, callback: any) => {
            return wnd.Janitor.Generation.Continue(message, (delta: string) => {
                wnd.Janitor.Hooks.Delta(delta)
                callback(delta)
            }).then(wnd.Janitor.Hooks.StopStream)
        }
    }
    //* Hooking stop stream
    if (typeof wnd.Janitor.Stores.generationStore.stopStream != "undefined") {
        if (typeof wnd.Janitor.Generation.Stop == "undefined") {
            wnd.Janitor.Generation.Stop = wnd.Janitor.Stores.generationStore.stopStream
        }
        wnd.Janitor.Stores.generationStore.stopStream = () => {
            // console.warn("STOPPED!")
            wnd.Janitor.Hooks.StopStream()
            return wnd.Janitor.Generation.Stop()
        }
    }

    //* Hooking save message
    if (typeof wnd.Janitor.Stores.generationStore.saveNewMessageAndApplyId != "undefined") {
        if (typeof wnd.Janitor.Generation.saveNewMessage == "undefined") {
            wnd.Janitor.Generation.saveNewMessage = wnd.Janitor.Stores.generationStore.saveNewMessageAndApplyId
        }
        wnd.Janitor.Stores.generationStore.saveNewMessageAndApplyId = (e: JMessage) => {
            // fix formatting automatically
            if (e.is_bot && !e.message.toLowerCase().includes("{{user}}") && !e.message.toLowerCase().includes("{{char}}"))
                e.message = processText(e.message)
            wnd.Janitor.Hooks.SaveMessage(e)

            return wnd.Janitor.Generation.saveNewMessage.call(wnd.Janitor.Stores.generationStore, e)
        }
    }
}