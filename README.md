# janitor-userscript

a custom-made userscript that adds or fixes certain functionality that was either denied or not thought of by the janitorAI team

# features

### hooks mobx states / stores

- saves any available stores and storeprops under the `Janitor` object for easy access
- should be up to date even across page navigation

### enables deletion and editing of first message

- i hate the formatting or layout of certain bots' first messages but love the idea, and the fact this is marked as `not likely` by the jAI team is kinda disappointing

### autoformats bot messages

- [this userscript](https://greasyfork.org/en/scripts/551458-janitor-ai-automatic-message-formatting-corrector-settings-menu), but automatically applied per message

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