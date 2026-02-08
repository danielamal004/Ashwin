import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { CameraOff, Scan, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { loadModels, detectEye, isEyeAligned } from '../../lib/eyeDetection';

const LiveCameraSection = ({ isScanning, onCapture, isActive, onDetectionUpdate }) => {
    const webcamRef = useRef(null);
    const [scanStatus, setScanStatus] = useState('idle'); // idle, loading, searching, aligning, perfect
    const [instruction, setInstruction] = useState('');
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const requestRef = useRef();
    const captureTimeoutRef = useRef();

    // Load models once
    useEffect(() => {
        if (isActive && !modelsLoaded) {
            setScanStatus('loading');
            loadModels().then(() => {
                setModelsLoaded(true);
                setScanStatus('searching');
            }).catch(err => {
                console.error("Failed to load models:", err);
                setInstruction("Model loading failed");
            });
        }
    }, [isActive, modelsLoaded]);

    const performDetection = async () => {
        if (!webcamRef.current || !webcamRef.current.video || webcamRef.current.video.readyState !== 4) {
            requestRef.current = requestAnimationFrame(performDetection);
            return;
        }

        const video = webcamRef.current.video;
        const result = await detectEye(video);

        let newStatus = 'searching';
        let newInstruction = 'Place eye in box';
        let isDetected = false;

        if (result) {
            isDetected = true;
            const { leftEye, rightEye } = result;
            const videoSize = { width: video.videoWidth, height: video.videoHeight };

            // Normalized target box matching the UI (0.3, 0.3, 0.4, 0.4)
            const targetBox = { x: 0.3, y: 0.3, width: 0.4, height: 0.4 };

            const leftAligned = isEyeAligned(leftEye, videoSize, targetBox);
            const rightAligned = isEyeAligned(rightEye, videoSize, targetBox);

            if (leftAligned || rightAligned) {
                newStatus = 'perfect';
                newInstruction = 'Perfect! Hold still...';
            } else {
                newStatus = 'aligning';
                newInstruction = 'Center your eye';
            }
        }

        setScanStatus(newStatus);
        setInstruction(newInstruction);

        if (onDetectionUpdate) {
            onDetectionUpdate({
                status: newStatus,
                eyeDetected: isDetected
            });
        }

        // Auto-capture logic
        if (newStatus === 'perfect') {
            if (!captureTimeoutRef.current) {
                captureTimeoutRef.current = setTimeout(() => {
                    if (webcamRef.current) {
                        const imageSrc = webcamRef.current.getScreenshot();
                        if (imageSrc) {
                            onCapture(imageSrc);
                        }
                    }
                }, 1000);
            }
        } else {
            if (captureTimeoutRef.current) {
                clearTimeout(captureTimeoutRef.current);
                captureTimeoutRef.current = null;
            }
        }

        if (isScanning && isActive) {
            requestRef.current = requestAnimationFrame(performDetection);
        }
    };

    useEffect(() => {
        if (isActive && isScanning && modelsLoaded) {
            requestRef.current = requestAnimationFrame(performDetection);
        } else {
            cancelAnimationFrame(requestRef.current);
            if (captureTimeoutRef.current) {
                clearTimeout(captureTimeoutRef.current);
                captureTimeoutRef.current = null;
            }
            if (!isScanning) {
                setScanStatus('searching');
                setInstruction('Ready to scan');
            }
        }

        return () => {
            cancelAnimationFrame(requestRef.current);
            if (captureTimeoutRef.current) {
                clearTimeout(captureTimeoutRef.current);
            }
        };
    }, [isActive, isScanning, modelsLoaded]);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    };

    const getStatusColor = () => {
        switch (scanStatus) {
            case 'searching': return 'border-blue-500/50';
            case 'aligning': return 'border-yellow-500';
            case 'perfect': return 'border-emerald-500';
            case 'loading': return 'border-slate-700 animate-pulse';
            default: return 'border-slate-700';
        }
    };

    if (!isActive) {
        return (
            <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50">
                <div className="text-center text-slate-500">
                    <CameraOff className="mx-auto mb-4 h-12 w-12 opacity-50" strokeWidth={1.5} />
                    <p>Camera is inactive</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-black shadow-2xl ring-4 ring-slate-800/50">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="h-full w-full object-cover"
            />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-[40px] border-slate-950/60 rounded-2xl"></div>

                {/* Center Focus Box */}
                <div className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 border-4 rounded-lg transition-colors duration-300",
                    getStatusColor()
                )}>
                    {/* Corner Markers */}
                    <div className={cn("absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 transition-colors duration-300",
                        scanStatus === 'perfect' ? 'border-emerald-500' : 'border-blue-500')}></div>
                    <div className={cn("absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 transition-colors duration-300",
                        scanStatus === 'perfect' ? 'border-emerald-500' : 'border-blue-500')}></div>
                    <div className={cn("absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 transition-colors duration-300",
                        scanStatus === 'perfect' ? 'border-emerald-500' : 'border-blue-500')}></div>
                    <div className={cn("absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 transition-colors duration-300",
                        scanStatus === 'perfect' ? 'border-emerald-500' : 'border-blue-500')}></div>

                    {/* Scanning Line */}
                    {isScanning && scanStatus !== 'perfect' && scanStatus !== 'loading' && (
                        <div className="absolute left-0 right-0 h-0.5 bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan"></div>
                    )}
                </div>

                {/* Status Instruction */}
                {(isScanning || scanStatus === 'loading') && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-32">
                        <div className={cn(
                            "px-6 py-2 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 flex items-center gap-2",
                            scanStatus === 'perfect'
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                                : "bg-black/60 border-white/10 text-white"
                        )}>
                            {scanStatus === 'perfect' && <CheckCircle2 className="h-5 w-5" strokeWidth={3} />}
                            {scanStatus === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-blue-400" />}
                            <span className="font-bold tracking-wide text-lg">
                                {scanStatus === 'loading' ? 'Initializing AI...' : instruction}
                            </span>
                        </div>
                    </div>
                )}

                {/* Rec Indicator */}
                {isScanning && modelsLoaded && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs font-bold font-mono text-red-400 tracking-wider">REC</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveCameraSection;
