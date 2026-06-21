export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="error" role="alert">
      <p className="error__message">😕 {message}</p>
    </div>
  );
}
