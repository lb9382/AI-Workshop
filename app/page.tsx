export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <header className="hero">
        <h1>Lilli-Lyn</h1>
        <p className="tagline">a senior at UH Manoa studying second language studies.</p>
      </header>

      <main>
        <section className="section">
          <h2>About</h2>
          <p>
            Lilli-Lyn is a senior at UH Manoa studying second language studies, with a
            particular interest in how people acquire and use language across different
            cultural contexts. Her coursework has pushed her toward questions about
            bilingual education and the ways classrooms can better support multilingual
            learners. She is especially drawn to research and fieldwork that connects
            theory to real classrooms and communities.
          </p>
        </section>

        <section className="section">
          <h2>This semester</h2>
          {/* Placeholder items below — Lilli-Lyn will replace these with her actual coursework, project, and activities later. */}
          <ul className="list">
            <li>Taking a course in second language acquisition theory</li>
            <li>Working on a research project about bilingual education in Hawaii schools</li>
            <li>Volunteering with a campus language exchange program</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>
          Lilli-Lyn &copy; {year}
        </p>
      </footer>
    </>
  );
}
