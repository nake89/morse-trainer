console.log("start");
const MORSE_MODE = 1;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();
var dot = 1.2 / 15;

const kevin = "-.- . ...- .. -.";
const easyWords = [
  "me",
  "at",
  "tie",
  "tea",
  "ten",
  "tan",
  "neat",
  "meat",
  "mate",
  "team",
  "time",
];
const morseTable = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  " ": "/",
};

function textToMorse(str) {
  let morse = "";
  str.split("").forEach((e) => {
    e !== " " ? (morse += morseTable[e] + " ") : (morse += morseTable[e]);
  });
  return morse;
}

function morse(msg) {
  if (MORSE_MODE) {
    vibrateMorse(msg);
  } else {
    soundMorse(msg);
  }
}

function vibrateMorse(msg) {
  const DIT_LENGTH = 120;
  const DAH_LENGTH = DIT_LENGTH * 3;
  const CHAR_PAUSE = DIT_LENGTH;
  const WORD_PAUSE = DAH_LENGTH + DAH_LENGTH;
  let vibrationArray = [];
  msg.split("").forEach(function (letter) {
    switch (letter) {
      case ".":
        // dit
        vibrationArray.push(DIT_LENGTH);
        // paus
        vibrationArray.push(CHAR_PAUSE);
        break;
      case "-":
        vibrationArray.push(DAH_LENGTH);
        vibrationArray.push(CHAR_PAUSE);
        break;
      case "/":
        vibrationArray.push(0);
        vibrationArray.push(WORD_PAUSE);
        break;
      case " ":
        vibrationArray.push(0);
        vibrationArray.push(CHAR_PAUSE);
        break;
    }
  });
  navigator.vibrate(vibrationArray);
}

function soundMorse(msg) {
  var t = ctx.currentTime;

  var oscillator = ctx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = 600;

  var gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, t);

  msg.split("").forEach(function (letter) {
    switch (letter) {
      case ".":
        gainNode.gain.setValueAtTime(1, t);
        t += dot;
        gainNode.gain.setValueAtTime(0, t);
        t += dot;
        break;
      case "-":
        gainNode.gain.setValueAtTime(1, t);
        t += 3 * dot;
        gainNode.gain.setValueAtTime(0, t);
        t += dot;
        break;
      case " ":
        t += 3 * dot;
        break;
      case "/":
        t += 7 * dot;
        break;
    }
  });

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
}

function button(str, id = null) {
  const buttonElement = document.createElement("button");
  buttonElement.innerText = str;
  id ? buttonElement.setAttribute("id", id) : null;
  return buttonElement;
}

const app = document.getElementById("app");
app.append(button("Start", "mainButton"));
const mainButton = document.getElementById("mainButton");
mainButton.addEventListener("click", () => {
  let word = getRandom(easyWords);
  let suggestedWords = [];
  suggestedWords.push(word);
  addWords(suggestedWords);
  console.log(suggestedWords);
  morse(textToMorse(word));
  mainButton.innerText = "hello";
});

function addWords(suggestedWords) {
  console.log(easyWords);
  let maxCount = easyWords.length < 6 ? easyWords.length : 6;
  while (suggestedWords.length < maxCount) {
    let suggestWord = getRandom(easyWords);
    if (!suggestedWords.includes(suggestWord)) {
      suggestedWords.push(suggestWord);
    }
  }
  console.log("exited loop");
}

function getRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

(function () {
  var src = "//cdn.jsdelivr.net/npm/eruda";
  if (
    !/eruda=true/.test(window.location) &&
    localStorage.getItem("active-eruda") != "true"
  )
    return;
  document.write("<scr" + 'ipt src="' + src + '"></scr' + "ipt>");
  document.write("<scr" + "ipt>eruda.init();</scr" + "ipt>");
})();
