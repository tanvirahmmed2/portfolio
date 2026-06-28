import "./globals.css";
import { AuthProvider } from "@/components/helper/ContextProvider.jsx";
import { ToastProvider } from "@/components/helper/ToastProvider.jsx";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
