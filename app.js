console.log("start");
var AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();
var dot = 1.2 / 15;

let currentWord = "";
const kevin = "-.- . ...- .. -.";
const easyWords = [
  "me",
  "at",
  "tie",
  "tea",
  "ten",
  "tan",
  // "neat",
  // "meat",
  // "mate",
  // "team",
  // "time",
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
  const morseMode = document.getElementById("morseMode");
  if (!morseMode.checked) {
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

function div(str, id = null) {
  const divElement = document.createElement("div");
  divElement.innerText = str;
  id ? divElement.setAttribute("id", id) : null;
  return divElement;
}

function checkbox(str, id) {
  const labelElement = document.createElement("label");
  labelElement.setAttribute("for", id);
  labelElement.innerText = str;
  const checkboxElement = document.createElement("input");
  id ? checkboxElement.setAttribute("id", id) : null;
  checkboxElement.setAttribute("type", "checkbox");
  labelElement.append(checkboxElement);
  return labelElement;
}

const app = document.getElementById("app");
app.append(button("Start", "mainButton"));

const replayButton = button("Replay", "replay");
replayButton.style.display = "none";
replayButton.style.backgroundColor = "#00ccff";
app.append(replayButton);

let suggestButtons = [];
for (i = 0; i < 6; i++) {
  const buttonId = i.toString();
  const suggestButton = button("", buttonId);
  suggestButton.style.display = "none";
  app.append(suggestButton);
  suggestButtons.push(suggestButton);
}

const mainButton = document.getElementById("mainButton");
const responseDiv = div("");
responseDiv.style.display = "none";
app.append(responseDiv);
const br = document.createElement("br");
app.append(br);
app.append(checkbox("Sound?: ", "morseMode"));

function play() {
  replayButton.style.display = "inline";
  responseDiv.style.display = "none";
  let word = getRandom(easyWords);
  currentWord = word;
  let suggestedWords = [];
  suggestedWords.push(word);
  addWords(suggestedWords);
  shuffleArray(suggestedWords);
  let i = 0;
  for (let suggestWord of suggestedWords) {
    suggestButtons[i].innerText = suggestWord;
    suggestButtons[i].style.display = "inline";
    suggestButtons[i].addEventListener("click", () => {
      let response;
      if (suggestWord === word) {
        response = "Correct";
      } else {
        response = "Incorrect. It was: " + currentWord;
      }
      responseDiv.innerText = response;
      responseDiv.style.display = "inline";
      reset();
    });
    i++;
  }
  console.log(suggestedWords);
  morse(textToMorse(word));
  mainButton.style.display = "none";
}

function reset() {
  for (let suggestButton of suggestButtons) {
    suggestButton.style.display = "none";
  }
  mainButton.style.display = "inline";
  replayButton.style.display = "none";
}

mainButton.addEventListener("click", () => {
  play();
});

replayButton.addEventListener("click", () => {
  morse(textToMorse(currentWord));
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
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
