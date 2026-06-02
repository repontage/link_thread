import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alternatives',
  description: 'See how VoidSay compares to other commenting platforms.',
};

export default function AlternativesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
