import "./globals.css";
import { AuthProvider } from "@/components/helper/ContextProvider.jsx";
import { ToastProvider } from "@/components/helper/ToastProvider.jsx";

export const metadata = {
  title: 'Tanvir Ahmmed | Full-Stack Web Developer',
  description: 'Professional developer portfolio of Tanvir Ahmmed, specializing in MERN/PERN stacks, scalable databases, and hardware integrations.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
