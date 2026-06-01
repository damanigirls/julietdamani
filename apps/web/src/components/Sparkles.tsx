const SPARKLES = [
  { emoji: "✦", top: "5%", left: "8%", delay: "0s", duration: "2.5s", color: "#ef4444", size: "1.5rem" },
  { emoji: "✧", top: "12%", left: "85%", delay: "0.3s", duration: "3s", color: "#f97316", size: "1.2rem" },
  { emoji: "✦", top: "25%", left: "3%", delay: "0.7s", duration: "2s", color: "#eab308", size: "1rem" },
  { emoji: "✧", top: "18%", left: "92%", delay: "1s", duration: "2.8s", color: "#22c55e", size: "1.3rem" },
  { emoji: "✦", top: "35%", left: "95%", delay: "0.5s", duration: "3.2s", color: "#3b82f6", size: "1.4rem" },
  { emoji: "✧", top: "45%", left: "2%", delay: "1.2s", duration: "2.3s", color: "#8b5cf6", size: "1.1rem" },
  { emoji: "✦", top: "55%", left: "90%", delay: "0.2s", duration: "2.7s", color: "#ec4899", size: "1.5rem" },
  { emoji: "✧", top: "65%", left: "5%", delay: "0.8s", duration: "3.1s", color: "#ef4444", size: "1rem" },
  { emoji: "✦", top: "75%", left: "88%", delay: "1.5s", duration: "2.2s", color: "#f97316", size: "1.3rem" },
  { emoji: "✧", top: "80%", left: "10%", delay: "0.4s", duration: "2.9s", color: "#eab308", size: "1.2rem" },
  { emoji: "✦", top: "8%", left: "45%", delay: "1.1s", duration: "2.6s", color: "#22c55e", size: "1rem" },
  { emoji: "✧", top: "40%", left: "50%", delay: "0.6s", duration: "3.3s", color: "#3b82f6", size: "0.9rem" },
  { emoji: "✦", top: "60%", left: "40%", delay: "1.3s", duration: "2.4s", color: "#8b5cf6", size: "1.1rem" },
  { emoji: "✧", top: "90%", left: "60%", delay: "0.9s", duration: "2.8s", color: "#ec4899", size: "1.2rem" },
  { emoji: "✦", top: "15%", left: "30%", delay: "1.4s", duration: "3s", color: "#ef4444", size: "0.8rem" },
  { emoji: "✧", top: "50%", left: "75%", delay: "0.1s", duration: "2.5s", color: "#22c55e", size: "1rem" },
  { emoji: "✦", top: "70%", left: "20%", delay: "1.6s", duration: "2.7s", color: "#3b82f6", size: "1.4rem" },
  { emoji: "✧", top: "85%", left: "35%", delay: "0.7s", duration: "3.2s", color: "#8b5cf6", size: "0.9rem" },
  { emoji: "✦", top: "30%", left: "65%", delay: "1.8s", duration: "2.1s", color: "#f97316", size: "1.3rem" },
  { emoji: "✧", top: "95%", left: "80%", delay: "0.3s", duration: "2.9s", color: "#eab308", size: "1.1rem" },
];

export default function Sparkles() {
  return (
    <>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="sparkle-particle"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: `${s.duration}, 6s`,
            color: s.color,
            fontSize: s.size,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </>
  );
}
