import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Juliet's Babysitting Service",
  description: "Book babysitting with Juliet! Reliable, fun, and caring.",
};

export default function BabysittingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
