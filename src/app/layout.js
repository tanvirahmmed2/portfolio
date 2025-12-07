
import Navbar from "@/components/UI/Navbar";
import "./globals.css";
import Footer from "@/components/UI/Footer";



export const metadata = {
  title: "Tanvir Ahmmed",
  description: "Tanvir Ahmmed's official portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`w-full overflow-x-hidden relative bg-gray-100`}
      >
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
