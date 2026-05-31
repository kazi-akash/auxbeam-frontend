import Header from '@/app/(public)/_components/Header';
import Footer from '@/app/(public)/_components/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gray-100 py-5 px-4">
        {children}
      </main>
      <Footer />
    </>
  );
}
