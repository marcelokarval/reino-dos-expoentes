interface AnswerGridProps {
  options: number[];
  onAnswer: (selected: number) => void;
}

export function AnswerGrid({ options, onAnswer }: AnswerGridProps) {
  return (
    <div className="options-grid">
      {options.map((option) => (
        <button key={option} type="button" onClick={() => onAnswer(option)}>{option}</button>
      ))}
    </div>
  );
}
