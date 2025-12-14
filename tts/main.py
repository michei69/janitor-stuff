import torchaudio as ta
from chatterbox.tts import ChatterboxTTS
import flask
import time
import queue
import threading
import re
import sounddevice as sd
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)

tts_q = queue.PriorityQueue()
tts_q2 = queue.PriorityQueue()
last_tts = -1
last_played = -1
last_generated = -1

def play_from_queue():
    global tts_q2, last_played
    while True:
        while tts_q2.qsize() > 0:
            seq_num, wav = tts_q2.get()
            if seq_num != last_played + 1:
                tts_q2.put((seq_num, wav))
                time.sleep(0.1)
                continue
            last_played = seq_num
            if wav is None:
                continue
            print(f"playing ({seq_num})")
            
            sd.play(wav.T, model.sr)
            sd.wait()

        time.sleep(0.1)

VOICE_TYPE = {
    "thought": "voice1.wav",
    "chat": "voice1.wav",
    "action": "voice3.wav"
}

def generate_from_queue():
    global tts_q, last_generated
    while True:
        while tts_q.qsize() > 0:
            seq_num, text, msg_type = tts_q.get()
            if seq_num != last_generated + 1:
                tts_q.put((seq_num, text))
                time.sleep(0.1)
                continue
            last_generated = seq_num
            if text is None:
                continue
            print(f"generating ({text}) ({seq_num})")
            wav = model.generate(text, audio_prompt_path=VOICE_TYPE[msg_type])
            tts_q2.put((seq_num, wav.numpy()))
            del wav
        time.sleep(0.1)

threading.Thread(target=play_from_queue, daemon=True).start()
threading.Thread(target=generate_from_queue, daemon=True).start()

model = ChatterboxTTS.from_pretrained(device="cuda")

def process_text(text: str):
    text = text.replace("**", "*")
    text = text.replace("**", "*")
    text = re.sub(r"\*([^\*]*)\*", lambda m: f"{m.group(1)}.", text)
    text = text.replace("<3", "")
    text = text.replace(":3", "")
    text = text.strip()
    return text
def generate_tts_en(text, dedicated_number, msg_type):
    global p, tts_q
    print(f"Received request for tts ({dedicated_number}) ->", text)
    try:
        text = process_text(text)
        if len(text) < 1: return
        print("Transformed into:", text)

        tts_q.put((dedicated_number, text, msg_type))
    except Exception as e:
        print(e)
        tts_q.put((dedicated_number, None))


@app.route("/tts", methods=["POST"])
def generate_tts():
    global last_tts
    text = flask.request.json["text"]
    msg_type = flask.request.json["type"]
    last_tts += 1
    threading.Thread(target=generate_tts_en, args=(text, last_tts, msg_type), daemon=True).start()
    return flask.Response(status=200)

app.run("0.0.0.0", 3246)