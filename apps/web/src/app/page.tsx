import Link from "next/link";
import Sparkles from "./Sparkles";

type AboutData = {
  name: string;
  grade: string;
  tagline: string;
  favoriteColor: string;
  funFacts: { emoji: string; text: string }[];
};

type Project = {
  title: string;
  description: string;
  emoji: string;
  status: string;
};

async function getAbout(): Promise<AboutData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/about`,
    { cache: "no-store" }
  );
  return res.json();
}

async function getProjects(): Promise<{ projects: Project[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/projects`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function Home() {
  const [about, { projects }] = await Promise.all([
    getAbout(),
    getProjects(),
  ]);

  return (
    <div className="relative min-h-screen font-sans">
      <Sparkles />
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-black px-6 text-center text-white">
        <span className="rainbow-sparkle animate-wave text-8xl">&#x2764;&#xFE0E;</span>
        <h1 className="rainbow-sparkle mt-6 text-5xl font-bold tracking-tight sm:text-7xl">
          Hi, I&apos;m {about.name.split(" ")[0]}!
        </h1>
        <p className="rainbow-sparkle mt-4 max-w-lg text-xl sm:text-2xl">
          {about.grade} grader &middot; {about.tagline}
        </p>
      </section>

      {/* Fun Facts */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="rainbow-sparkle mb-10 text-center text-3xl font-bold sm:text-4xl">
          Fun Facts About Me
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {about.funFacts.map((fact, i) => (
            <div
              key={i}
              className="animate-float flex flex-col items-center"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {fact.emoji === "🐠" ? (
                <img
                  src="/coral-reef.jpg"
                  alt="Coral reef"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : fact.emoji === "4th" ? (
                <span className="rainbow-sparkle text-5xl font-black">4th</span>
              ) : (
                <span className="text-5xl">{fact.emoji}</span>
              )}
              <p className="mt-3 text-center font-medium text-white">{fact.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-gray-900/50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="rainbow-sparkle mb-10 text-center text-3xl font-bold sm:text-4xl">
            My Projects
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => {
              const isLink = project.title === "Babysitting Service";
              const card = (
                <div
                  key={i}
                  className="rounded-2xl border-2 border-purple-mid/30 bg-gray-900 p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="text-5xl">{project.emoji}</span>
                  <h3 className="mt-4 text-xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    {project.description}
                  </p>
                  {project.status === "live" ? (
                    <span className="mt-4 inline-block rounded-full bg-green-900 px-3 py-1 text-xs font-semibold text-green-400">
                      Live
                    </span>
                  ) : (
                    <span className="mt-4 inline-block rounded-full bg-purple-dark/30 px-3 py-1 text-xs font-semibold text-purple-light">
                      Coming Soon
                    </span>
                  )}
                </div>
              );
              return isLink ? (
                <Link key={i} href="/babysitting">{card}</Link>
              ) : (
                card
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black px-6 py-10 text-center text-white">
        <p className="rainbow-sparkle text-lg font-medium">
          Built by Juliet with vibe coding ✨
        </p>
        <p className="mt-2 text-sm text-white/50">
          Next.js + Python + Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
