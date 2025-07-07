import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/components/AuthProvider';
import Header from '@/components/Header';

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ 
  subsets: ["arabic"],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: "منصة الدورات التعليمية",
  description: "تعلم البرمجة بطريقة تفاعلية وممتعة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${inter.className} ${cairo.variable} min-h-screen bg-white text-gray-900`} suppressHydrationWarning>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t bg-white">
              <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                  <p className="text-center text-sm leading-loose text-gray-600 md:text-left">
                    Built by{" "}
                    <a
                      href="#"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      KidsCode
                    </a>
                    . All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
