"use client";

// Last-resort error page. It replaces the root layout, so it can't use the
// translations or the app's CSS — plain inline styles in both languages.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fbf8f3", color: "#1b1611" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            fontFamily: "system-ui, sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
            Something went wrong · Er is iets misgegaan
          </h2>
          <p style={{ color: "#6f665b", fontSize: "0.875rem", margin: 0 }}>
            Please try again, or refresh the page. · Probeer het opnieuw of vernieuw de pagina.
          </p>
          <button
            onClick={() => reset()}
            style={{
              border: 0,
              borderRadius: "0.5rem",
              backgroundColor: "#9f7b3b",
              color: "#fff",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again · Opnieuw proberen
          </button>
        </div>
      </body>
    </html>
  );
}
