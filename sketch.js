
let keys = {};

const QUIZ = [
  {
    "question": "Is diabetes 1 or diabetes 2 more likely to raise major health complications?",
    "answers": [
      "Diabetes 1",
      "Diabetes 2",
      "Equally dangerous",
      "Neither is dangerous"
    ],
    "correct": 0,
    "tip": "Type 1 usually requires more frequent treatment with daily insulin shots, though both are dangerous."
  },
  {
    "question": "How much physical activity daily does the CDC recommend for adolescents?",
    "answers": [
      "30 minutes",
      "60 minutes",
      "90 minutes",
      "120 minutes"
    ],
    "correct": 1,
    "tip": "Excersizing to treat diabetes doesn't have to be hard; it can be as simple as taking a bike ride around the area or signing up for the local sports team."
  },
  {
    "question": "Which of these hormones does type 2 diabetes create a resistance to?",
    "answers": [
      "Testosterone",
      "Adrenaline",
      "Serotonin",
      "Insulin"
    ],
    "correct": 3,
    "tip": "Type 2 diabetes creates a resistance to insulin, which helps cells process the sugar in the bloodstream."
  },
  {
    "question": "Where is insulin produced?",
    "answers": [
      "The liver",
      "The appendix",
      "The pancreas",
      "The heart"
    ],
    "correct": 2,
    "tip": "Insulin is produced in the pancreas in response to glucose."
  },
  {
    "question": "Which one of these complications can diabetes cause?",
    "answers": [
      "Heart disease",
      "Stroke",
      "Kidney failure",
      "All of the above"
    ],
    "correct": 3,
    "tip": "Insulin is produced in the pancreas in response to glucose."
  },
  {
    "question": "Which one of these fats can increase one's risk for type 2 diabetes?",
    "answers": [
      "Poly-unsaturated fats",
      "Saturated fats",
      "Unsaturated fats",
      "All of the above"
    ],
    "correct": 1,
    "tip": "Saturated fats, such as in red meats / dairy, can increase one's risk for type 2 diabetes. Poly-unsaturated and unsaturated fats can actually lower risk."
  },
  {
    "question": "Who is the most at risk of diabetes?",
    "answers": [
      "Children",
      "White people (20-30yo)",
      "People of color (20-30yo)",
      "People of color (45+yo)"
    ],
    "correct": 3,
    "tip": "People of color may have less access to healthy food and older people normally have a reduced insulin production"
  },
  {
    "question": "What is not a common symptom of diabetes 2?",
    "answers": [
      "Fatigue",
      "Tingling limbs",
      "Frequent urination",
      "Cough"
    ],
    "correct": 3,
    "tip": "A cough is not frequently associated with diabetes 2."
  },
  {
    "question": "Which of the following is not used to test for diabetes?",
    "answers": [
      "Sucrose test",
      "CMP",
      "Urine test",
      "All of them are used to test"
    ],
    "correct": 0,
    "tip": "Sucrose doesn't have anyhting to do with diabetes. It is commonly mixed up with glucose, which is what is stored in fat cells."
  },
  {
    "question": "What's an example of an ultra-processed food?",
    "answers": [
      "Ketchup",
      "Bacon",
      "Tofu",
      "Wine"
    ],
    "correct": 1,
    "tip": "Bacon and hot dogs are actually listed as type 1 carcinogens by the USDA. This doesn't mean that they're off the table, but only in moderation."
  },
  {
    "question": "What is not benificial for preventing diabetes 2?",
    "answers": [
      "Eating less sugary foods",
      "Limiting screen time",
      "Attempting to gain weight",
      "More daily physical activity"
    ],
    "correct": 2,
    "tip": "Gaining more weight would be detremental to preventing diabetes 2, especially if eating processed foods."
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
    textSize(32);
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