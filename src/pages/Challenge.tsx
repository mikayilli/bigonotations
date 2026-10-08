import { useState } from "react";
import { QuizQuestion } from "../components/quiz/QuizQuestion";
import { Button, Card, PageHeading } from "../components/layout/ui";
import { QUESTIONS } from "../data/quiz";
import { useI18n } from "../i18n";
import { bi } from "../i18n/types";

const TXT = {
  title: bi("Code → Complexity", "Kod → Mürəkkəblik"),
  sub: bi(
    "Read the code, decide how its work grows with n, then watch it run and check your reasoning against real operation counts.",
    "Koda baxın, işin n ilə necə artdığını müəyyən edin, sonra kodun işləməsinə baxın və mühakimənizi real əməliyyat sayları ilə yoxlayın.",
  ),
  score: bi("Score: {s} / {t}", "Xal: {s} / {t}"),
  done: bi("Finished!", "Bitdi!"),
  result: bi("You got {s} of {t} right.", "{t} sualdan {s}-ni düz cavablandırdınız."),
  again: bi("Try again", "Yenidən cəhd et"),
  keep: bi(
    "Remember: Big-O describes growth — ask “how many times does the main operation run, and how does that change when n doubles?”",
    "Unutmayın: Big-O artımı təsvir edir — soruşun: “əsas əməliyyat neçə dəfə işləyir və n ikiqat artanda bu necə dəyişir?”",
  ),
};

export function Challenge() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const finished = index >= QUESTIONS.length;
  const question = QUESTIONS[index];

  return (
    <div>
      <PageHeading title={t(TXT.title)} sub={t(TXT.sub)} />
      <p className="mb-4 font-mono text-sm font-semibold text-muted" aria-live="polite">
        {t(TXT.score, { s: score, t: QUESTIONS.length })}
      </p>
      {finished || !question ? (
        <Card className="max-w-xl space-y-3">
          <h2 className="text-2xl font-bold">🎉 {t(TXT.done)}</h2>
          <p className="text-lg">{t(TXT.result, { s: score, t: QUESTIONS.length })}</p>
          <p className="text-sm text-muted">{t(TXT.keep)}</p>
          <Button
            variant="primary"
            onClick={() => {
              setIndex(0);
              setScore(0);
              setRound((r) => r + 1);
            }}
          >
            {t(TXT.again)}
          </Button>
        </Card>
      ) : (
        <div className="max-w-3xl">
          <QuizQuestion
            key={`${round}-${question.id}`}
            question={question}
            index={index}
            count={QUESTIONS.length}
            isLast={index === QUESTIONS.length - 1}
            onAnswer={(ok) => ok && setScore((s) => s + 1)}
            onNext={() => setIndex((i) => i + 1)}
          />
        </div>
      )}
    </div>
  );
}
