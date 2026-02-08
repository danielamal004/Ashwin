import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { AlertCircle, CheckCircle, Activity, MapPin, Info, ShieldAlert, Stethoscope } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const ResultDisplay = ({ result, imageSrc }) => {
    if (!result) return null;

    const isHealthy = result.disease === "Normal" || result.disease === "Healthy";
    const statusColor = isHealthy ? "text-emerald-400" : "text-amber-400";
    const borderColor = isHealthy ? "border-emerald-500/50" : "border-amber-500/50";
    const bgColor = isHealthy ? "bg-emerald-500/10" : "bg-amber-500/10";

    // Access the detailed data from the backend
    // Fallback to top-level properties if 'data' object isn't present yet
    const data = result.data || result || {};
    const { overview, causes, symptoms, precautions, doctor_advice, recommendation } = data;

    const openHospitalSearch = () => {
        window.open("https://www.google.com/maps/search/eye+hospital+near+me", "_blank");
    };

    const confidenceValue = typeof result.confidence === 'number' ? result.confidence : 0;

    return (
        <Card className={cn("mt-6 overflow-hidden border-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4", borderColor, bgColor)}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Analysis Result</CardTitle>
                    {isHealthy ? (
                        <CheckCircle className="h-6 w-6 text-emerald-500" />
                    ) : (
                        <AlertCircle className="h-6 w-6 text-amber-500" />
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Main Result & Confidence */}
                    <div>
                        {/* Captured Image Preview in Results */}
                        {imageSrc && (
                            <div className="mb-4 rounded-lg overflow-hidden border-2 border-slate-700/50 shadow-lg">
                                <img src={imageSrc} alt="Analyzed Eye" className="w-full h-48 object-cover" />
                            </div>
                        )}

                        <div className="flex justify-between items-end mb-2">
                            <span className="text-slate-400 text-sm tracking-uppercase font-semibold">Detected Condition</span>
                            <span className={cn("text-2xl font-bold", statusColor)}>{result.disease}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={cn("h-2.5 rounded-full transition-all duration-1000 ease-out", isHealthy ? "bg-emerald-500" : "bg-amber-500")}
                                style={{ width: `${confidenceValue * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-slate-500">
                            <span>Confidence</span>
                            <span>{(confidenceValue * 100).toFixed(1)}%</span>
                        </div>
                    </div>

                    {/* Overview */}
                    {overview && (
                        <div>
                            <h4 className="flex items-center gap-2 mb-2 font-medium text-slate-200">
                                <Info className="h-4 w-4 text-blue-400" />
                                Overview
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed text-justify">
                                {overview}
                            </p>
                        </div>
                    )}

                    {/* Symptoms & Causes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {symptoms && (
                            <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-700/30">
                                <h4 className="text-sm font-medium text-slate-300 mb-2">Common Symptoms</h4>
                                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                                    {Array.isArray(symptoms) ? symptoms.slice(0, 4).map((s, i) => (
                                        <li key={i}>{s}</li>
                                    )) : <li>{symptoms}</li>}
                                </ul>
                            </div>
                        )}
                        {causes && (
                            <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-700/30">
                                <h4 className="text-sm font-medium text-slate-300 mb-2">Potential Causes</h4>
                                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                                    {Array.isArray(causes) ? causes.slice(0, 4).map((c, i) => (
                                        <li key={i}>{c}</li>
                                    )) : <li>{causes}</li>}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Precautions */}
                    {precautions && (
                        <div>
                            <h4 className="flex items-center gap-2 mb-2 font-medium text-slate-200">
                                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                                Precautions & Prevention
                            </h4>
                            <ul className="grid grid-cols-1 gap-2">
                                {Array.isArray(precautions) ? precautions.slice(0, 3).map((p, i) => (
                                    <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                        {p}
                                    </li>
                                )) : <li className="text-sm text-slate-400">{precautions}</li>}
                            </ul>
                        </div>
                    )}

                    {/* Doctor Advice / Recommendation */}
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                        <h4 className="flex items-center gap-2 mb-2 font-medium text-slate-200">
                            <Stethoscope className="h-4 w-4 text-purple-400" />
                            Doctor's Advice
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed italic">
                            "{doctor_advice || recommendation}"
                        </p>
                    </div>

                    {/* Hospital Finder Button */}
                    <Button
                        onClick={openHospitalSearch}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    >
                        <MapPin className="h-4 w-4" />
                        Find Nearby Eye Hospitals
                    </Button>

                    <div className="text-xs text-center text-slate-600 pt-2 border-t border-slate-800">
                        * AI prediction for informational purposes only. Always consult a specialist.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResultDisplay;
