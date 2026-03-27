import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dice6, RotateCcw, TrendingUp, AlertTriangle } from "lucide-react";

const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

const quizSquares = {
  3: {
    question: "What does an R² of 0.72 mean in a multiple regression?",
    options: [
      "72% of variance in Y is explained by the predictors in the model",
      "72% of the predictors are significant",
      "The regression slope is 0.72",
      "Y increases by 72 units for each X"
    ],
    answer: 0,
    correctText: "Exactly — R² is the proportion of variance in the outcome explained by the model.",
    incorrectText: "Not quite. R² refers to explained variance in the dependent variable."
  },
  8: {
    question: "If a predictor has a negative coefficient, what does that suggest?",
    options: [
      "As that predictor increases, the outcome tends to decrease, holding others constant",
      "The model is invalid",
      "The predictor must be removed",
      "The intercept becomes negative"
    ],
    answer: 0,
    correctText: "Right — the sign of the coefficient shows the direction of the relationship, controlling for other predictors.",
    incorrectText: "The coefficient sign indicates direction, not model failure."
  },
  15: {
    question: "What is multicollinearity?",
    options: [
      "When two or more predictors are highly correlated with each other",
      "When the outcome variable has multiple categories",
      "When residuals are all positive",
      "When the sample size is too large"
    ],
    answer: 0,
    correctText: "Correct — multicollinearity makes coefficients unstable and harder to interpret.",
    incorrectText: "Multicollinearity is about strong correlation among predictors."
  },
  22: {
    question: "Why do we say 'holding other variables constant' in multiple regression?",
    options: [
      "Because each coefficient isolates the estimated effect of one predictor while controlling for the others",
      "Because all predictors are fixed and never change",
      "Because the dependent variable is constant",
      "Because regression cannot handle changing predictors"
    ],
    answer: 0,
    correctText: "Yes — that phrase is central to interpreting partial regression coefficients.",
    incorrectText: "The key idea is controlling for the influence of the other predictors."
  },
  30: {
    question: "A p-value below 0.05 for a predictor usually suggests: ",
    options: [
      "Evidence that its coefficient differs from zero under the model assumptions",
      "The predictor explains 95% of the variance",
      "The model is perfectly accurate",
      "The data are normally distributed"
    ],
    answer: 0,
    correctText: "Correct — it suggests the coefficient is statistically distinguishable from zero.",
    incorrectText: "A small p-value is about evidence against a zero coefficient, not perfect prediction."
  },
  39: {
    question: "What is the dependent variable in multiple regression?",
    options: [
      "The outcome being predicted",
      "Any predictor with the largest coefficient",
      "The variable with the most missing values",
      "The intercept"
    ],
    answer: 0,
    correctText: "Exactly — the dependent variable is the response or outcome.",
    incorrectText: "The dependent variable is the outcome you are trying to explain or predict."
  },
  45: {
    question: "If residual plots show a funnel shape, what assumption may be violated?",
    options: [
      "Homoscedasticity",
      "Independence of observations",
      "Measurement scale",
      "Random sampling of predictors"
    ],
    answer: 0,
    correctText: "Right — a funnel pattern often suggests non-constant error variance.",
    incorrectText: "A funnel shape is a classic sign of heteroscedasticity."
  },
  54: {
    question: "What does the intercept represent?",
    options: [
      "The predicted outcome when all predictors equal zero",
      "The average of the predictors",
      "The strongest predictor in the model",
      "The prediction error"
    ],
    answer: 0,
    correctText: "Correct — the intercept is the model's baseline prediction at zero values for all predictors.",
    incorrectText: "The intercept is the predicted Y value when every X is 0."
  },
  63: {
    question: "Adding more predictors to a model will always increase which metric?",
    options: [
      "R²",
      "Adjusted R²",
      "Prediction accuracy on new data",
      "Coefficient stability"
    ],
    answer: 0,
    correctText: "Exactly — raw R² never decreases when predictors are added.",
    incorrectText: "R² always stays the same or increases when you add predictors."
  },
  72: {
    question: "Why is adjusted R² useful?",
    options: [
      "It penalizes adding predictors that do not improve the model much",
      "It converts regression into classification",
      "It guarantees causal interpretation",
      "It removes all outliers automatically"
    ],
    answer: 0,
    correctText: "Yes — adjusted R² helps compare models with different numbers of predictors.",
    incorrectText: "Adjusted R² is helpful because it accounts for model complexity."
  },
  81: {
    question: "What is an outlier in regression?",
    options: [
      "A data point unusually far from the overall pattern",
      "A predictor with a large coefficient",
      "Any point with a negative residual",
      "A variable measured in different units"
    ],
    answer: 0,
    correctText: "Correct — outliers can distort coefficient estimates and model fit.",
    incorrectText: "An outlier is an unusually unusual observation relative to the pattern."
  },
  90: {
    question: "Which statement best matches the goal of multiple regression?",
    options: [
      "To estimate how several predictors together relate to one outcome",
      "To compare only two group means",
      "To prove causation from correlation",
      "To eliminate all uncertainty"
    ],
    answer: 0,
    correctText: "Perfect — multiple regression models one outcome using several predictors.",
    incorrectText: "Multiple regression is about relating multiple predictors to a single outcome."
  }
};

const boardNumbers = Array.from({ length: 100 }, (_, i) => {
  const row = Math.floor(i / 10);
  const col = i % 10;
  const number = row % 2 === 0 ? row * 10 + col + 1 : row * 10 + (10 - col);
  return number;
}).reverse();

function Square({ number, playerPosition }) {
  const isSnake = snakes[number];
  const isLadder = ladders[number];
  const isQuiz = quizSquares[number];
  const isPlayerHere = playerPosition === number;

  return (
    <motion.div
      layout
      className={`relative aspect-square rounded-2xl border p-1 sm:p-2 shadow-sm ${
        isSnake
          ? "bg-red-50"
          : isLadder
          ? "bg-emerald-50"
          : isQuiz
          ? "bg-blue-50"
          : "bg-white"
      }`}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="text-[10px] sm:text-xs font-semibold text-slate-500">{number}</div>
        <div className="flex items-end justify-between">
          <div className="flex gap-1">
            {isSnake && <span className="text-[10px] sm:text-xs">🐍</span>}
            {isLadder && <span className="text-[10px] sm:text-xs">🪜</span>}
            {isQuiz && <span className="text-[10px] sm:text-xs">📊</span>}
          </div>
          {isPlayerHere && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-base sm:text-lg"
            >
              🎓
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MultipleRegressionSnakesAndLadders() {
  const [position, setPosition] = useState(1);
  const [lastRoll, setLastRoll] = useState(null);
  const [message, setMessage] = useState("Roll the die to start your climb through multiple regression.");
  const [quiz, setQuiz] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [stats, setStats] = useState({ rolls: 0, correct: 0, wrong: 0 });

  const progress = useMemo(() => position, [position]);

  const rollDie = () => {
    if (quiz || gameWon) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setLastRoll(roll);
    setStats((s) => ({ ...s, rolls: s.rolls + 1 }));

    let next = position + roll;
    if (next > 100) {
      setMessage(`You rolled a ${roll}. You need the exact number to land on 100.`);
      return;
    }

    setPosition(next);

    if (quizSquares[next]) {
      setQuiz({ square: next, ...quizSquares[next] });
      setMessage(`You landed on square ${next}. Answer the regression challenge to keep your momentum.`);
      return;
    }

    if (ladders[next]) {
      const climbTo = ladders[next];
      setPosition(climbTo);
      setMessage(`You rolled a ${roll} and landed on a ladder at ${next}. Climb up to ${climbTo}!`);
      if (climbTo === 100) setGameWon(true);
      return;
    }

    if (snakes[next]) {
      const slideTo = snakes[next];
      setPosition(slideTo);
      setMessage(`You rolled a ${roll} and hit a snake at ${next}. Slide down to ${slideTo}.`);
      return;
    }

    if (next === 100) {
      setGameWon(true);
      setMessage("You reached square 100 and mastered the regression board. You win!");
      return;
    }

    setMessage(`You rolled a ${roll} and moved to square ${next}.`);
  };

  const answerQuiz = (index) => {
    if (!quiz) return;

    const correct = index === quiz.answer;
    const square = quiz.square;

    setStats((s) => ({
      ...s,
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
    }));

    if (correct) {
      if (ladders[square]) {
        const climbTo = ladders[square];
        setPosition(climbTo);
        setMessage(`${quiz.correctText} Bonus ladder! You move from ${square} to ${climbTo}.`);
        if (climbTo === 100) setGameWon(true);
      } else {
        setMessage(quiz.correctText);
      }
    } else {
      const setback = Math.max(1, square - 3);
      setPosition(setback);
      setMessage(`${quiz.incorrectText} Penalty: slide back to ${setback}.`);
    }

    setQuiz(null);
  };

  const resetGame = () => {
    setPosition(1);
    setLastRoll(null);
    setMessage("Roll the die to start your climb through multiple regression.");
    setQuiz(null);
    setGameWon(false);
    setStats({ rolls: 0, correct: 0, wrong: 0 });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="rounded-3xl border-0 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-2xl md:text-3xl">Multiple Regression Snakes & Ladders</CardTitle>
                <p className="mt-2 text-sm text-slate-600">
                  Race to 100 while dodging model mistakes, climbing good interpretation, and answering regression questions.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className="rounded-full px-3 py-1 text-xs">🐍 snakes = setbacks</Badge>
                <Badge className="rounded-full px-3 py-1 text-xs">🪜 ladders = breakthroughs</Badge>
                <Badge className="rounded-full px-3 py-1 text-xs">📊 quiz squares</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-1 sm:gap-2">
              {boardNumbers.map((number) => (
                <Square key={number} number={number} playerPosition={position} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="rounded-3xl border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5" />
                Game Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Progress to 100</span>
                  <span>Square {position}</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Last roll</div>
                  <div className="mt-1 text-2xl font-bold">{lastRoll ?? "—"}</div>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Total rolls</div>
                  <div className="mt-1 text-2xl font-bold">{stats.rolls}</div>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-700">Correct answers</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-800">{stats.correct}</div>
                </div>
                <div className="rounded-2xl bg-red-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-red-700">Wrong answers</div>
                  <div className="mt-1 text-2xl font-bold text-red-800">{stats.wrong}</div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="mb-2 text-sm font-semibold text-slate-700">Status</div>
                <p className="text-sm leading-6 text-slate-600">{message}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={rollDie} disabled={!!quiz || gameWon} className="rounded-2xl">
                  <Dice6 className="mr-2 h-4 w-4" />
                  Roll Die
                </Button>
                <Button variant="outline" onClick={resetGame} className="rounded-2xl">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              {gameWon && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-emerald-50 p-4 text-emerald-900 ring-1 ring-emerald-200"
                >
                  <div className="font-semibold">Regression Champion!</div>
                  <p className="mt-1 text-sm">You reached 100 and navigated the model assumptions like a pro.</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertTriangle className="h-5 w-5" />
                Learning Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
              <p><strong>Snakes</strong> represent common regression pitfalls like overfitting, heteroscedasticity, and multicollinearity.</p>
              <p><strong>Ladders</strong> represent good practice: clear interpretation, better model fit, and stronger diagnostics.</p>
              <p><strong>Quiz squares</strong> reinforce key ideas such as coefficients, p-values, R², adjusted R², and assumptions.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {quiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <Card className="rounded-3xl border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl">Regression Challenge — Square {quiz.square}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-7 text-slate-700">{quiz.question}</p>
                <div className="grid gap-3">
                  {quiz.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto justify-start rounded-2xl whitespace-normal p-4 text-left"
                      onClick={() => answerQuiz(index)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
