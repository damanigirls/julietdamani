import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sparkles from "@/components/Sparkles";
import { getAbout, getProjects } from "@/lib/api";

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

export default function Home() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getAbout().then((data) => {
      // Add robotics fun fact
      const hasRobotics = data.funFacts.some((f: { text: string }) => f.text.toLowerCase().includes("robotics"));
      if (!hasRobotics) {
        data.funFacts.push({ emoji: "🤖", text: "My friends and I run Robotics Minors" });
      }
      setAbout(data);
    }).catch(() => {});
    getProjects()
      .then((d: { projects: Project[] }) => {
        // Remove Robotics from projects (moved to fun facts)
        const filtered = d.projects.filter((p) => p.title !== "Robotics for Kids");
        const hasSpelling = filtered.some((p) => p.title === "Spelling Adventure");
        const allProjects = hasSpelling
          ? filtered
          : [...filtered, {
              title: "Spelling Adventure",
              description: "A fun spelling app with lessons, games, battles, and cute characters",
              emoji: "📝",
              status: "live",
            }];
        setProjects(allProjects);
      })
      .catch(() => {});
  }, []);

  if (!about) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="rainbow-sparkle text-2xl font-bold">Loading...</span>
      </div>
    );
  }

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
              <p className="mt-3 text-center font-medium text-white">
                {fact.text.replace("kind and useful", "helpful")}
              </p>
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
              const linkMap: Record<string, string> = {
                "Babysitting Service": "/babysitting",
                "Coral Reef Quiz": "/coral-reef",
                "Spelling Adventure": "/spelling",
              };
              const linkTo = linkMap[project.title];
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
              return linkTo ? (
                <Link key={i} to={linkTo}>
                  {card}
                </Link>
              ) : (
                <div key={i}>{card}</div>
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
          React + Cloudflare + Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
