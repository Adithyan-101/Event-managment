import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { attendanceService } from '../services/attendanceService';
import { CheckCircle, XCircle } from 'lucide-react';

const ScanQR = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Clear any existing scanner DOM to prevent duplicates
        const element = document.getElementById("reader");
        if (element) element.innerHTML = "";

        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(error => {
                console.warn("Scanner clear error or already cleared.", error);
            });
        };
    }, []);

    const onScanSuccess = async (decodedText) => {
        // Stop scanning temporarily or handle debounce?
        // For simplicity, we process every scan but UI will show last result.

        try {
            const result = await attendanceService.markAttendance(decodedText);
            setScanResult({ success: true, message: `Market present: ${result.studentName}` });
            setError(null);
        } catch (err) {
            setScanResult(null);
            setError(err.message);
        }
    };

    const onScanFailure = (error) => {
        // console.warn(`Code scan error = ${error}`);
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Scan Attendance QR</h2>

            <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: '500px', margin: '0 auto' }}>
                <div id="reader" style={{ width: '100%' }}></div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', minHeight: '60px' }}>
                    {scanResult && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#4ade80' }}>
                            <CheckCircle size={24} />
                            <span>{scanResult.message}</span>
                        </div>
                    )}

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#f87171' }}>
                            <XCircle size={24} />
                            <span>{error}</span>
                        </div>
                    )}

                    {!scanResult && !error && (
                        <p style={{ color: 'var(--text-muted)' }}>Waiting for QR code...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScanQR;
