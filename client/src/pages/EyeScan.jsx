import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import LiveCameraSection from '../components/scanner/LiveCameraSection';
import DetectionPanel from '../components/scanner/DetectionPanel';
import { Play, Square } from 'lucide-react';

const EyeScan = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [detectionResult, setDetectionResult] = useState({ eyeDetected: false, status: 'idle' });

    const handleStartScan = () => {
        setIsCameraActive(true);
        setIsScanning(true);
        setError(null);
    };

    const handleStopScan = () => {
        setIsCameraActive(false);
        setIsScanning(false);
        setDetectionResult({ eyeDetected: false, status: 'idle' });
    };

    const handleDetectionUpdate = useCallback((result) => {
        setDetectionResult(result);
    }, []);

    const processFrame = useCallback(async (imageSrc) => {
        // Stop scanning but keep camera active purely for visual continuity until we have a result
        // or show a frozen frame. For now, let's stop scanning logic.
        setIsScanning(false);
        setIsProcessing(true);
        setError(null);

        try {
            // Convert base64 to blob or send directly if backend supports it
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageSrc }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Analysis failed');
            }

            const data = await response.json();

            // Navigate to results page with data
            navigate('/result', { state: { result: data, imageSrc: imageSrc } });

        } catch (err) {
            console.error("Scanning error:", err);
            setError("Failed to analyze image. Please try again. (" + err.message + ")");
            setIsCameraActive(false); // Stop camera on error so user sees the error state
        } finally {
            setIsProcessing(false);
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
                            {!isCameraActive && !isProcessing && (
                                <Button onClick={handleStartScan} className="gap-2">
                                    <Play className="h-4 w-4" /> Start Scan
                                </Button>
                            )}

                            {isCameraActive && !isProcessing && (
                                <Button variant="danger" onClick={handleStopScan} className="gap-2">
                                    <Square className="h-4 w-4" /> Stop Scan
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Show Camera if active, otherwise intro placeholder */}
                    <div className="relative">
                        {isCameraActive || isProcessing ? (
                            <LiveCameraSection
                                isActive={isCameraActive}
                                isScanning={isScanning}
                                onCapture={processFrame}
                                onDetectionUpdate={handleDetectionUpdate}
                            />
                        ) : (
                            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 flex h-[400px] w-full items-center justify-center">
                                <div className="text-center text-slate-500">
                                    <Play className="mx-auto mb-4 h-12 w-12 opacity-50 cursor-pointer hover:text-slate-400 transition-colors" onClick={handleStartScan} />
                                    <p>Ready to start scanning</p>
                                </div>
                            </div>
                        )}

                        {/* Processing Overlay */}
                        {isProcessing && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                <p className="mt-4 text-lg font-semibold text-blue-400">Analyzing Image...</p>
                            </div>
                        )}

                        {/* Error Overlay */}
                        {error && !isCameraActive && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm p-6 text-center">
                                <div className="mb-4 rounded-full bg-red-500/20 p-4">
                                    <Square className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Scan Failed</h3>
                                <p className="text-red-400 mb-6">{error}</p>
                                <Button onClick={handleStartScan} className="gap-2">
                                    <Play className="h-4 w-4" /> Try Again
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Analytics Status Only */}
                <div className="w-full md:w-1/3 space-y-6">
                    {/* Show detection panel during active scan */}
                    {(isCameraActive || isProcessing) && (
                        <DetectionPanel
                            isCameraActive={isCameraActive}
                            isScanning={isScanning || isProcessing}
                            eyeDetected={detectionResult.eyeDetected}
                            scanStatus={detectionResult.status}
                        />
                    )}

                    {/* Initial State Instructions */}
                    {!isCameraActive && !isProcessing && (
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
