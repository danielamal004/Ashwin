import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Camera, Eye, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const DetectionPanel = ({ isCameraActive, isScanning, eyeDetected, scanStatus }) => {
    const StatusItem = ({ icon: Icon, label, isActive, activeColor = "text-emerald-500", inactiveColor = "text-slate-600" }) => (
        <div className="flex items-center justify-between rounded-lg bg-slate-900/50 p-4 border border-slate-800">
            <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5", isActive ? activeColor : inactiveColor)} strokeWidth={2.5} />
                <span className={cn("font-bold tracking-tight", isActive ? "text-slate-200" : "text-slate-500")}>
                    {label}
                </span>
            </div>
            {isActive ? (
                <CheckCircle2 className={cn("h-6 w-6", activeColor)} strokeWidth={3} />
            ) : (
                <div className="h-5 w-5 rounded-full border-2 border-slate-700" />
            )}
        </div>
    );

    return (
        <div className="grid gap-4">
            <StatusItem
                icon={Camera}
                label="Camera Feed"
                isActive={isCameraActive}
            />
            <StatusItem
                icon={Eye}
                label="Eye Detected"
                isActive={isCameraActive && eyeDetected}
                activeColor="text-blue-500"
            />
            <StatusItem
                icon={Cpu}
                label="AI Model"
                isActive={isScanning && scanStatus !== 'loading'}
                activeColor="text-purple-500"
            />
        </div>
    );
};

export default DetectionPanel;
