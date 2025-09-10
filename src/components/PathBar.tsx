type PathBarProps = {
  path: { id: number | null; name: string }[];
  onClick: (id: number | null) => void;
};

export default function PathBar({ path, onClick }: PathBarProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      {path.map((p, idx) => (
        <span
          key={p.id ?? "root"}
          style={{ cursor: "pointer" }}
          onClick={() => onClick(p.id)}
        >
          {p.name}
          {idx < path.length - 1 ? " > " : ""}
        </span>
      ))}
    </div>
  );
}
