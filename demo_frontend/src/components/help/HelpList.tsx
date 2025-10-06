interface HelpListProps {
  title: string;
  items: string[];
  ordered?: boolean;
}

export default function HelpList({
  title,
  items,
  ordered = false,
}: HelpListProps) {
  const ListComponent = ordered ? "ol" : "ul";
  const listClass = ordered ? "list-decimal" : "list-disc";

  return (
    <div>
      <p>
        <strong>{title}:</strong>
      </p>
      <ListComponent className={`${listClass} list-inside space-y-1 ml-4 mt-2`}>
        {items.map((item, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ListComponent>
    </div>
  );
}
