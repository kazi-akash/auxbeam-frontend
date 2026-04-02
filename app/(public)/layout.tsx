import Header from './_components/Header';
import Footer from './_components/Footer';
import CallToAction from './_components/landing/CallToAction';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <CallToAction />
      <Footer />
    </>
  );
}
