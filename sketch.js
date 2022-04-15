
let keys = {};

const QUIZ = [
  {
    "question": "Who is among us?",
    "answers": [
      "Brett Mathes",
      "Nathan Chen",
      "I don't play among us",
      "Red"
    ],
    "correct": 3,
    "tip": "Among moment"
  },
  {
    "question": "Nathan is short?",
    "answers": [
      "Yes, definetely",
      "No shot",
      "Maybe",
      "Idk"
    ],
    "correct": 0,
    "tip": "Short moment"
  },
  {
    "question": "Pick the right one",
    "answers": [
      "The right one",
      "The answer to the right",
      "The left one",
      "Idk"
    ],
    "correct": 0,
    "tip": "Clearly you know your left and rights"
  }
];

let quizRunning = false;
let quizComplete = false;
let showingTip = false;

let score = 1000;

let fullShake = {x: 0, y: 0};
let shakeAmount = 0;

let index = 0;
let answersTried = [];

let questionLerp = 0;
let quizDt = 0;
let tipLerp = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  windowResized();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  keys[keyCode] = 0;
}

function keyReleased() {
  keys[keyCode] = -1;
}

function update() {

  Object.keys(keys).forEach(key => {
    if (keys[key] >= 0) {
      keys[key] += 1;
    }
  });

  if (!quizRunning && keys[' '.charCodeAt(0)] == 1) {
    quizRunning = true;
    quizComplete = false;
    score = 1000;
    fullShake = {x: 0, y: 0};
    shakeAmount = 0;
    index = 0;
    answersTried = [];
    questionLerp = 1;
    quizDt = 0;
  }

  if (quizRunning) {
    if (!showingTip) {
      shakeAmount = lerp(shakeAmount, 0, 0.1);
      fullShake = {x: random(-shakeAmount, shakeAmount), y: random(-shakeAmount, shakeAmount)};
      questionLerp = lerp(questionLerp, 0, 0.1);

      

      if (frameCount % 10 == 0) {
        score -= 1;
      }

      quizDt += 1;
    } else {
      if (keys[' '.charCodeAt(0)] == 1) {
        advanceQuestion();
      }
    }

    tipLerp = lerp(tipLerp, showingTip ? 1 : 0, 0.2);
  }

}

function advanceQuestion() {
  showingTip = false;
  index += 1;
  score += 1000;
  answersTried = [];
  if (index >= QUIZ.length) {
    quizComplete = true;
    quizRunning = false;
  } else {
    questionLerp = 1;
  }
}

function mousePressed() {
  if (quizRunning && !showingTip) {
    for (let i = 0; i < 4; i++) {
      if (mouseX > i * (width / 4) && mouseY > (3 * height / 8) && mouseX < i * (width / 4) + width / 4 && mouseY < (3 * height / 8) + height / 4) {
        if (i == QUIZ[index].correct) {
          if (!answersTried.includes(i)) {
            answersTried.push(i);
            showingTip = true;
          }
        } else {
          shakeAmount = 10;
          if (!answersTried.includes(i)) {
            answersTried.push(i);
            score -= 100 * answersTried.length * answersTried.length;
          }
        }

      }
    }
  }
}

function draw() {
  update();
  background(250);

  if (!quizRunning) {
    if (!quizComplete) {
      fill(0);
      textAlign(CENTER, BOTTOM);
      textSize(100);
      textStyle(BOLD);
      text("Diabetes Quiz", width / 2, height / 2);

      textAlign(CENTER, TOP);
      textSize(24);
      textStyle(NORMAL);
      text("Press the space bar to start the quiz!", width / 2, height / 2);
    } else {
      fill(0);
      textAlign(CENTER, TOP);
      textSize(100);
      textStyle(BOLD);
      text("Quiz Results", width / 2, height / 4);

      textSize(48);
      textStyle(NORMAL);
      text(score, width / 2, height / 2);

      let scorePercent = score / ((index + 1) * 1000);
      text(nf(scorePercent * 100, 1, 1) + "% (" + getVerbalEquivalent(scorePercent) + ")", width / 2, height / 2 + height / 8);
      
      textSize(24);
      textAlign(CENTER, BOTTOM);
      text("Score", width / 2, height / 2);
      text("Grade", width / 2, height / 2 + height / 8);

      textSize(16);
      text("Press the space bar to try again!", width / 2, height / 2 + height / 4);
    }
  } else {
    push();

    translate(width / 2, height / 2);
    rotate(map(noise(quizDt * 0.01, 300), 0, 1, -0.02, 0.02));
    translate(map(noise(quizDt * 0.01, 100), 0, 1, -10, 10) + fullShake.x, map(noise(quizDt * 0.01, 200), 0, 1, -10, 10) + fullShake.y - questionLerp * height / 4);

    function drawBox(x, y, i) {

      stroke(0);
      fill(200);
      if (QUIZ[index].correct == i && answersTried.includes(i)) {
        fill(0, 200, 0);
      } else if (answersTried.includes(i)) {
        fill(200, 0, 0);
      }

      if (mouseX > x * (width / 4) && mouseY > (3 * height / 8) + y * (width / 4) && mouseX < x * (width / 4) + width / 4 && mouseY < (3 * height / 8) + y * (width / 4) + height / 4) {
        if (QUIZ[index].correct == i && answersTried.includes(i)) {
          fill(20, 210, 20);
        } else if (answersTried.includes(i)) {
          fill(210, 20, 20);
        } else {
          fill(210);
        }
        
      }
      rect(-width / 2 + x * (width / 4), -height / 8 + y * (width / 4), width / 4, height / 4);

      textAlign(CENTER, CENTER);
      fill(0);
      noStroke();
      textSize(16);
      text(QUIZ[index].answers[i], -width / 2 + x * (width / 4) + width / 8, -height / 8 + y * (width / 4) + height / 8);

    }
    

    stroke(0);
    fill(200);

    for (let i = 0; i < 4; i++) {
      drawBox(i, 0, i);
    }
    

    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(QUIZ[index].question, 0, -height / 4);

    textSize(32);
    text(score, 0, height / 5);

    let scorePercent = score / ((index + 1) * 1000);
    
    text(nf(scorePercent * 100, 1, 1) + "% (" + getVerbalEquivalent(scorePercent) + ")", 0, height / 5 + height / 12);
    
    text((index + 1) + " / " + QUIZ.length, 0, height / 5 + height / 6);

    textSize(16);
    textStyle(NORMAL);
    text("Score", 0, height / 5 - 24);
    text("Grade", 0, height / 5 + height / 12 - 24);
    text("Progress", 0, height / 5 + height / 6 - 24);

    pop();

    fill(255, 100 * tipLerp);
    rect(0, 0, width, height);

    stroke(0);
    fill(255);
    rect(10, -height / 2 + height * tipLerp - 30, width - 20, 60);
    
    noStroke();
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(24);
    text(QUIZ[index].tip, width / 2, - height / 2 + height * tipLerp);

    textSize(12);
    text("Press space to continue", width / 2, -height / 2 + height * tipLerp + 22);
  }
}

function getVerbalEquivalent(p) {
  if (p > 0.9667) {
    return "Outstanding";
  } else if (p > 0.9333) {
    return "Excellent";
  } else if (p > 0.90) {
    return "Nearly Excellent";
  } else if (p > 0.8667) {
    return "Very Good";
  } else if (p > 0.8333) {
    return "Good";
  } else if (p > 0.80) {
    return "Fairly Good";
  } else if (p > 0.7667) {
    return "Better than Satisfactory";
  } else if (p > 0.7333) {
    return "Satisfactory";
  } else if (p > 0.7) {
    return "Less than Satisfactory";
  } else if (p > 0.6) {
    return "Barely Passing";
  } else if (p > 0) {
    return "Fail";
  }
  return "Complete Faliure";
}