import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";
import { AlertCircle } from "lucide-react";
import { SplashScreen } from "@capacitor/splash-screen";

export default function App() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Initial check
    Network.getStatus().then((status) => {
      setIsOnline(status.connected);
    });

    // Hide splash screen
    SplashScreen.hide();

    let handler: any;
    Network.addListener("networkStatusChange", (status) => {
      setIsOnline(status.connected);
    }).then(h => handler = h);

    return () => {
      if (handler) handler.remove();
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      {!isOnline && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '12px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            fontWeight: '500'
          }}
        >
          <AlertCircle size={20} />
          <span>Offline mode: Some features may be limited.</span>
        </div>
      )}
    </>
  );
}