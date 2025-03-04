import ContributionGridEditor from "./graph-editor";

function App() {
  // get year from query param ?year=2025
  const params = new URLSearchParams(window.location.search);

  const yearParam = parseInt(params.get("year") ?? "");

  const year = isNaN(yearParam) ? new Date().getFullYear() : yearParam;

  return (
    <main className="flex w-full h-[100dvh]">
      <ContributionGridEditor year={year} />
    </main>
  );
}

export default App;
