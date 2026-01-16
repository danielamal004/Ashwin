import React from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { ArrowRight, Activity, ScanEye, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative pt-12 pb-12 text-center md:pt-24 md:pb-24">
                <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[100px]"></div>
                <h1 className="bg-gradient-to-r from-blue-100 to-indigo-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
                    Visionary AI Scan
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
                    Turning Images into Actionable Intelligence. Experience real-time eye disease prediction using advanced computer vision directly in your browser.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Button size="lg" onClick={() => navigate('/scan')}>
                        Start Live Scan <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                        Learn More
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4">
                <h2 className="mb-12 text-center text-3xl font-bold text-white">Why Visionary AI?</h2>
                <div className="grid gap-8 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <Activity className="mb-2 h-10 w-10 text-blue-500" />
                            <CardTitle>Real-Time Prediction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-400">
                                Instant analysis of live camera feed using trained deep learning models to detect potential eye diseases like Cataracts and Glaucoma.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <ScanEye className="mb-2 h-10 w-10 text-purple-500" />
                            <CardTitle>Computer Vision</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-400">
                                Advanced image preprocessing and eye region detection ensure clarity and focus for accurate disease classification.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Zap className="mb-2 h-10 w-10 text-emerald-500" />
                            <CardTitle>Instant Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-400">
                                Receive immediate feedback with disease classification, confidence scores, and health recommendations on screen.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* How It Works */}
            <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 md:p-12 backdrop-blur-sm">
                <div className="grid gap-12 md:grid-cols-2 items-center">
                    <div>
                        <h2 className="mb-6 text-3xl font-bold text-white">How It Works</h2>
                        <ul className="space-y-6">
                            {[
                                { title: "Live Capture", desc: "Camera continuously captures eye images at 30-60 fps." },
                                { title: "Region Detection", desc: "Algorithms isolate the eye region automatically." },
                                { title: "AI Analysis", desc: "Deep learning models compare patterns against disease datasets." },
                                { title: "Instant Result", desc: "View diagnosis, confidence score, and recommendations." }
                            ].map((step, idx) => (
                                <li key={idx} className="flex gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-500 font-bold border border-blue-500/30">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">{step.title}</h4>
                                        <p className="text-sm text-slate-400">{step.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950/80 shadow-2xl">
                        <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                            {/* Abstract Visual representation of scanning */}
                            <div className="absolute h-32 w-32 rounded-full border-2 border-blue-500/30 animate-ping"></div>
                            <div className="absolute h-48 w-48 rounded-full border border-indigo-500/20 animate-pulse"></div>
                            <ScanEye className="h-16 w-16 text-slate-500 opacity-50" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
