interface HelpStepsProps {
  title: string;
  steps: string[];
}

export default function HelpSteps({ title, steps }: HelpStepsProps) {
  return (
    <div>
      <p>
        <strong>{title}:</strong>
      </p>
      <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
        {steps.map((step, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
        ))}
      </ol>
    </div>
  );
}
