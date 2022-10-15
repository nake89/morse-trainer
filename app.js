console.log("start");
var AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();
var dot = 1.2 / 15;

const kevin = "-.- . ...- .. -.";
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
};
function morse(msg) {
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
  mainButton.innerText = "hello";
});
