// app/not-found.tsx

export default function NotFound() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8">Sorry, the page you&amp;re looking for does not exist.</p>
      {/* <button
        onClick={() => router.push('/')}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Go Back Home
      </button> */}
    </div>
  );
}