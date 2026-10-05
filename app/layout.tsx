import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import FloatingOrderButton from "./components/FloatingOrderButton";

export const metadata: Metadata = {
  title: "TastyByte - Food & Ordering",
  description: "Delicious chef-crafted food and drinks delivered fresh to your door.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <OrderProvider>
            {children}
            <FloatingOrderButton />
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}