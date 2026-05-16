// util

// https://greasyfork.org/en/scripts/551458-janitor-ai-automatic-message-formatting-corrector-settings-menu
export function processText(text: string) {
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

export default async function patchChat(chatStore: ChatStore) {
    if ((chatStore.generationStore.runGenerateAnswer as any).patched) return // already patched

    //* Hooking new message
    if (typeof wnd.Janitor.Generation.Answer == "undefined") {
        wnd.Janitor.Generation.Answer = chatStore.generationStore.runGenerateAnswer
    }
    chatStore.generationStore.runGenerateAnswer = (message: string, callback: any) => {
        return wnd.Janitor.Generation.Answer(message, (delta: string) => {
            wnd.Janitor.Hooks.Delta(delta)
            callback(delta)
        }).then(wnd.Janitor.Hooks.StopStream)
    };
    (chatStore.generationStore.runGenerateAnswer as any).patched = true // so we know if we patched already

    //* Hooking generate alternative message
    if (typeof wnd.Janitor.Generation.Alternative == "undefined") {
        wnd.Janitor.Generation.Alternative = chatStore.generationStore.runGenerateAlternative
    }
    chatStore.generationStore.runGenerateAlternative = (callback: any) => {
        return wnd.Janitor.Generation.Alternative((delta: string) => {
            wnd.Janitor.Hooks.Delta(delta)
            callback(delta)
        }).then(wnd.Janitor.Hooks.StopStream)
    }

    //* Hooking regenerate
    if (typeof chatStore.generationStore.runRegenerate != "undefined") {
        if (typeof wnd.Janitor.Generation.Regenerate == "undefined") {
            wnd.Janitor.Generation.Regenerate = chatStore.generationStore.runRegenerate
        }
        chatStore.generationStore.runRegenerate = (callback: any) => {
            return wnd.Janitor.Generation.Regenerate((delta: string) => {
                wnd.Janitor.Hooks.Delta(delta)
                callback(delta)
            }).then(wnd.Janitor.Hooks.StopStream)
        }
    }
    //* Hooking continue
    if (typeof chatStore.generationStore.runContinueMessage != "undefined") {
        if (typeof wnd.Janitor.Generation.Continue == "undefined") {
            wnd.Janitor.Generation.Continue = chatStore.generationStore.runContinueMessage
        }
        chatStore.generationStore.runContinueMessage = (message: string, callback: any) => {
            return wnd.Janitor.Generation.Continue(message, (delta: string) => {
                wnd.Janitor.Hooks.Delta(delta)
                callback(delta)
            }).then(wnd.Janitor.Hooks.StopStream)
        }
    }
    //* Hooking stop stream
    if (typeof chatStore.generationStore.stopStream != "undefined") {
        if (typeof wnd.Janitor.Generation.Stop == "undefined") {
            wnd.Janitor.Generation.Stop = chatStore.generationStore.stopStream
        }
        chatStore.generationStore.stopStream = () => {
            // console.warn("STOPPED!")
            wnd.Janitor.Hooks.StopStream()
            return wnd.Janitor.Generation.Stop()
        }
    }

    //* Hooking save message
    if (typeof chatStore.generationStore.saveNewMessageAndApplyId != "undefined") {
        if (typeof wnd.Janitor.Generation.saveNewMessage == "undefined") {
            wnd.Janitor.Generation.saveNewMessage = chatStore.generationStore.saveNewMessageAndApplyId
        }
        chatStore.generationStore.saveNewMessageAndApplyId = (e: ChatMessage) => {
            // fix formatting automatically
            if (e.is_bot && !e.message.toLowerCase().includes("{{user}}") && !e.message.toLowerCase().includes("{{char}}"))
                e.message = processText(e.message)
            wnd.Janitor.Hooks.SaveMessage(e)

            return wnd.Janitor.Generation.saveNewMessage.call(chatStore.generationStore, e)
        }
    }

    //* Hooking llm generate
    if (typeof chatStore.generationStore.chatGenerateInstance != "undefined" && typeof chatStore.generationStore.chatGenerateInstance.generate != "undefined") {
        if (typeof wnd.Janitor.Generation.LLMGenerate == "undefined") {
            wnd.Janitor.Generation.LLMGenerate = chatStore.generationStore.chatGenerateInstance.generate
        }
        chatStore.generationStore.chatGenerateInstance.generate = (data: any) => {
            if (wnd.Janitor.Settings.RandomizeTemperature) {
                data = {
                    ...data,
                    userConfig: {
                        ...data.userConfig,
                        generation_settings: {
                            ...data.userConfig.generation_settings,
                            temperature: data.userConfig.generation_settings.temperature + Math.random() * 0.4 - 0.2
                        }
                    }
                }
            }
            return wnd.Janitor.Generation.LLMGenerate.call(chatStore.generationStore.chatGenerateInstance, data)
        }
    }

    console.log("patched chat")
}

export function patchMessagesStore(store: MessagesStore) {
    // Force all messages to be deletable
    store.canBeDeleted = (_: any) => true;

    // Force initial message to be editable
    if (typeof (store as any).canEditMessage_ORIGINAL == "undefined")
        (store as any).canEditMessage_ORIGINAL = store.canEditMessage
    store.canEditMessage = (s: any) => {
        if (s.id == (store.messages.at(0)?.id ?? 0)) {
            let resp = (store as any).canEditMessage_ORIGINAL.call(store, {
                ...s,
                id: 1
            })
            return resp
        }
        return (store as any).canEditMessage_ORIGINAL.call(store, s)
    }

    console.log("patched messages")
}

export async function fetchSystemMessage(): Promise<string | undefined> {
    try {
        const token = (await wnd.Janitor.Stores.settingsStore.supabase.auth.getSession())?.data?.session?.access_token
        if (!token) return;
        const genClient = wnd.Janitor.Stores.chatStore.generationStore.chatGenerateInstance.nineClient
        if (typeof genClient.fetchOpenAIProxyGenerate_og == "undefined") {
            genClient.fetchOpenAIProxyGenerate_og = genClient.fetchOpenAIProxyGenerate
        }
        var resp: any;
        genClient.fetchOpenAIProxyGenerate = async (response: any, t: any, s: any) => {
            if (t.reverseProxyKey == "notAProxyKey") {
                resp = await response.json()
                return; // error it out
            }
            return await genClient.fetchOpenAIProxyGenerate_og(response, t, s)
        }

        try {

            const data = wnd.Janitor.Stores.chatStore.generationStore.chatGenerateInstance.nineClient.generate({
                access_token: token,
                generateMode: "NEW",
                userConfig: {
                    ...wnd.Janitor.Stores.userStore.config,
                    reverseProxyKey: "notAProxyKey"
                },
                userId: wnd.Janitor.Stores.userStore.profile.id,
                requestBody: {
                    chat: {
                        character_id: wnd.Janitor.Stores.chatStore.characterId
                    },
                    chatMessages: [{
                        is_bot: true,
                        is_main: true,
                        message: "."
                    }],
                    generateMode: "NEW",
                    generateType: "CHAT",
                    profile: {},
                    profiles: [],
                    userConfig: {
                        api: "openai",
                        generation_settings: {},
                        open_ai_mode: "proxy"
                    }
                }
            })
            for await (const _ of data) { }
        } catch { } // this will error out
        return resp?.messages?.[0]?.content;
    } catch (e) {
        console.error(e)
    }
}