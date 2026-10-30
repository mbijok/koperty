import { WifiOff } from "lucide-react";
import { useOnline } from "@koperty/ui/lib/online";
import { Alert, AlertDescription, AlertTitle } from "@koperty/ui/primitives/alert";

// US-23: no offline mode, but a clear message while the connection is gone. It appears and
// disappears by itself and is announced politely (WCAG 4.1.3).
function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <Alert data-slot="offline-banner">
      <AlertTitle className="flex items-center gap-inline">
        <WifiOff aria-hidden="true" className="size-icon" />
        Brak połączenia z internetem
      </AlertTitle>
      <AlertDescription>
        Widzisz dane wczytane wcześniej. Zapis zadziała, gdy połączenie wróci.
      </AlertDescription>
    </Alert>
  );
}

export { OfflineBanner };
