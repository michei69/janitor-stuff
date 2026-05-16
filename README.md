# doggo-script

a custom-made userscript that adds or fixes certain functionality that was either denied or not thought of by the janitorAI team

note: due to the nature of hooking almost the entire site, this userscript WILL slow down your initial load time!

# features

### hooks mobx states / stores

- saves any available stores under the `Janitor` object for easy access
- should be up to date even across page navigation

### hooks all esModules and react, reactDOM, reactJSX

- means u can use react for any UI mods if you want to for some reason
- would also mean you can load official components too (i dont tho, i just rewrite the jsx lol)
- reactDOM and reactJSX are loaded separately, as are all esModules because theres no real way to hook them unfortunately
- react is hooked directly from the original script though

### enables deletion and editing of first message

- i hate the formatting or layout of certain bots' first messages but love the idea, and the fact this is marked as `not likely` by the jAI team is kinda disappointing

### autoformats bot messages

- [this userscript](https://greasyfork.org/en/scripts/551458-janitor-ai-automatic-message-formatting-corrector-settings-menu), but automatically applied per message
- also gives u the ability to rerun it for any message via a button

### rudimentary TTS support

- currently not given much thought, but you can host a local server that generates and plays back the TTS
- check out [this script](./tts/main.py) which kinda does that
- technically i could rewrite it so the wav files get downloaded to the webpage (similar to [this userscript](https://greasyfork.org/en/scripts/543441-janitorai-text-to-speech-built-in-elevenlabs-geminitts)) but im lazy and its just for fun

### search filtering

- removes any non-proxy characters (redundant now that janitor added better search filters)
- removes any characters with default pfp (aka those characters that used to have nsfw pics)
- sorts all characters by tokens in descending order

### hiddengems filter

- that hiddengems tab is entirely useless to me w/o the filters
- only shows proxy-enabled and with >=500 tokens, that are tagged with male (and, optionally, furry)

### word counter

- adds a button in the chat hamburger menu thing that counts the words for u
- helpful cause sometimes 30 messages is more content than 70

### import / export / reset chat messages

- adds buttons to import / export / reset current messages state
- useful if you have a huge chat and want to move it elsewhere

### system prompt fetching

- adds the ability to fetch system prompts of bots (proxy only)
- "why not just sniff network?" because the `/generateAlpha` worker can now fetch the proxy itself if it recognizes a provider (e.g. deepseek)
- useful to revive deleted / privated bots

### trending, hidden gems filter

- adds the filter bar to the main search as well
- works with other filters too