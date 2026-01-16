import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import LiveCameraSection from '../components/scanner/LiveCameraSection';
import DetectionPanel from '../components/scanner/DetectionPanel';
import { Play, Square } from 'lucide-react';

const EyeScan = () => {
    const navigate = useNavigate();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);

    const handleStartScan = () => {
        setIsCameraActive(true);
        setIsScanning(true);
        setError(null);
    };

    const handleStopScan = () => {
        setIsCameraActive(false);
        setIsScanning(false);
    };

    const processFrame = useCallback(async (imageSrc) => {
        // Stop scanning immediately upon capture
        setIsScanning(false);
        setIsCameraActive(false);

        try {
            // Convert base64 to blob or send directly if backend supports it
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageSrc }),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();

            // Navigate to results page with data
            navigate('/result', { state: { result: data, imageSrc: imageSrc } });

        } catch (err) {
            console.error("Scanning error:", err);
            setError("Failed to analyze image. Please try again.");
        }
    }, [navigate]);

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col gap-8 md:flex-row">
                {/* Left Column: Camera Feed */}
                <div className="w-full md:w-2/3">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Live Eye Scan</h1>
                            <p className="text-slate-400">Real-time disease detection engine</p>
                        </div>
                        {/* Control Buttons */}
                        <div className="flex gap-3">
                            {!isCameraActive && (
                                <Button onClick={handleStartScan} className="gap-2">
                                    <Play className="h-4 w-4" /> Start Scan
                                </Button>
                            )}

                            {isCameraActive && (
                                <Button variant="danger" onClick={handleStopScan} className="gap-2">
                                    <Square className="h-4 w-4" /> Stop Scan
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Show Camera if active, otherwise intro placeholder */}
                    {isCameraActive ? (
                        <LiveCameraSection
                            isActive={isCameraActive}
                            isScanning={isScanning}
                            onCapture={processFrame}
                        />
                    ) : (
                        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 flex h-[400px] w-full items-center justify-center">
                            <div className="text-center text-slate-500">
                                <Play className="mx-auto mb-4 h-12 w-12 opacity-50 cursor-pointer hover:text-slate-400 transition-colors" onClick={handleStartScan} />
                                <p>Ready to start scanning</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Analytics Status Only */}
                <div className="w-full md:w-1/3 space-y-6">
                    {/* Show detection panel during active scan */}
                    {isCameraActive && (
                        <DetectionPanel
                            isCameraActive={isCameraActive}
                            isScanning={isScanning}
                        />
                    )}

                    {/* Initial State Instructions */}
                    {!isCameraActive && (
                        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center">
                            <p className="text-slate-500">
                                Click "Start Scan" to begin. The AI will guide you to align your eye and automatically capture the best image for analysis.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EyeScan;
