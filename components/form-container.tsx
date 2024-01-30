interface FormContainerProps {
  label: string;
  errorMessage?: string;
  children?: React.ReactNode;
}

export function FormContainer({
  label,
  errorMessage,
  children,
}: FormContainerProps) {
  return (
    <div className="grid gap-1 text-left">
      <label className="text-left text-sm font-bold">{label}</label>
      {children}
      {errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
