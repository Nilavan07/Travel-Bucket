// app/not-found.tsx

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <a href="/" className="text-blue-600 hover:underline font-medium">
        Go back home
      </a>
    </div>
  );
}
