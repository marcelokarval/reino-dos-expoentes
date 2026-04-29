import type { Question } from '@reino/game-core';

interface QuestionCardProps {
  question: Question;
  timerPercent: number;
}

export function QuestionCard({ question, timerPercent }: QuestionCardProps) {
  return (
    <div className="question-box">
      <div dangerouslySetInnerHTML={{ __html: question.text }} />
      <div id="timer-bar" style={{ width: `${timerPercent}%` }} />
    </div>
  );
}
