import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Film, CheckCircle2, XCircle, ScanLine, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TicketStatus = "valid" | "used" | "invalid" | null;

interface Ticket {
  movie: string;
  used: boolean;
  time?: string;
  place?: string;
}

interface TicketDatabase {
  [key: string]: Ticket;
}

const Index = () => {
  const [tickets, setTickets] = useState<TicketDatabase>({
    QR001: { movie: "Leo", used: false },
    QR002: { movie: "Jawan", used: true, time: "9:45 PM", place: "Theatre 2" },
    QR003: { movie: "Pushpa 2", used: false },
  });

  const [scannedCode, setScannedCode] = useState<string>("");
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>(null);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (result: any) => {
    if (result && isScanning) {
      const code = result.text;
      setScannedCode(code);
      setIsScanning(false);

      if (tickets[code]) {
        const ticket = tickets[code];
        setCurrentTicket(ticket);

        if (ticket.used) {
          setTicketStatus("used");
        } else {
          setTicketStatus("valid");
          // Mark ticket as used
          setTickets((prev) => ({
            ...prev,
            [code]: { ...ticket, used: true, time: new Date().toLocaleTimeString(), place: "Theatre 1" },
          }));
        }
      } else {
        setTicketStatus("invalid");
        setCurrentTicket(null);
      }
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const resetScanner = () => {
    setScannedCode("");
    setTicketStatus(null);
    setCurrentTicket(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[var(--gradient-cinema)] opacity-50" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Film className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-[var(--gradient-gold)] bg-clip-text text-transparent">
              CineScan
            </h1>
          </div>
          <p className="text-muted-foreground">Scan movie tickets instantly</p>
        </div>

        {/* Scanner Card */}
        {isScanning && (
          <Card className="p-6 bg-card border-border shadow-[var(--shadow-strong)] animate-scale-in">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <ScanLine className="w-6 h-6 animate-pulse" />
                <h2 className="text-xl font-semibold">Position QR Code</h2>
              </div>
              
              <div className="relative rounded-lg overflow-hidden border-2 border-primary/30">
                <QrReader
                  onResult={handleScan}
                  constraints={{ facingMode: "environment" }}
                  containerStyle={{ width: "100%" }}
                  videoContainerStyle={{ paddingTop: "100%" }}
                />
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Point your camera at the ticket's QR code
              </p>
            </div>
          </Card>
        )}

        {/* Valid Ticket Result */}
        {ticketStatus === "valid" && currentTicket && (
          <Card className="p-8 bg-success/10 border-success shadow-[var(--shadow-gold)] animate-scale-in">
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-20 h-20 text-success mx-auto animate-scale-in" />
              <div>
                <h2 className="text-3xl font-bold text-success mb-2">Valid Ticket!</h2>
                <p className="text-xl text-foreground font-semibold">{currentTicket.movie}</p>
                <p className="text-muted-foreground mt-2">Ticket has been validated</p>
              </div>
              <div className="pt-4">
                <Button
                  onClick={resetScanner}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Scan Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Used Ticket Result */}
        {ticketStatus === "used" && currentTicket && (
          <Card className="p-8 bg-destructive/10 border-destructive shadow-[var(--shadow-strong)] animate-scale-in">
            <div className="text-center space-y-4">
              <XCircle className="w-20 h-20 text-destructive mx-auto animate-scale-in" />
              <div>
                <h2 className="text-3xl font-bold text-destructive mb-2">Already Used</h2>
                <p className="text-xl text-foreground font-semibold">{currentTicket.movie}</p>
                {currentTicket.time && currentTicket.place && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Used at:</p>
                    <p className="text-foreground font-medium">{currentTicket.time}</p>
                    <p className="text-foreground font-medium">{currentTicket.place}</p>
                  </div>
                )}
              </div>
              <div className="pt-4">
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Scan Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Invalid Ticket Result */}
        {ticketStatus === "invalid" && (
          <Card className="p-8 bg-destructive/10 border-destructive shadow-[var(--shadow-strong)] animate-scale-in">
            <div className="text-center space-y-4">
              <XCircle className="w-20 h-20 text-destructive mx-auto animate-scale-in" />
              <div>
                <h2 className="text-3xl font-bold text-destructive mb-2">Invalid Ticket</h2>
                <p className="text-muted-foreground">
                  This QR code is not recognized
                </p>
                <p className="text-sm text-muted-foreground mt-2">Code: {scannedCode}</p>
              </div>
              <div className="pt-4">
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Scan Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Test QR Codes Info */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg backdrop-blur-sm animate-fade-in">
          <p className="text-xs text-muted-foreground text-center mb-2 font-semibold">
            Test QR Codes Available:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <p className="text-foreground font-medium">QR001</p>
              <p className="text-muted-foreground">Leo (Valid)</p>
            </div>
            <div>
              <p className="text-foreground font-medium">QR002</p>
              <p className="text-muted-foreground">Jawan (Used)</p>
            </div>
            <div>
              <p className="text-foreground font-medium">QR003</p>
              <p className="text-muted-foreground">Pushpa 2 (Valid)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
