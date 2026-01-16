import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultDisplay from '../components/scanner/ResultDisplay';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

const ScanResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve data passed from the navigation state
    const { result, imageSrc } = location.state || {};

    const handleBack = () => {
        navigate('/scan');
    };

    if (!result) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8 text-center text-slate-400">
                <p>No result data found.</p>
                <Button onClick={handleBack} className="mt-4 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Go to Scanner
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="mb-6">
                <Button variant="ghost" onClick={handleBack} className="gap-2 text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" /> Back to Scanner
                </Button>
            </div>

            <div className="grid gap-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Scan Analysis</h1>
                    <p className="text-slate-400">Detailed report based on your eye scan.</p>
                </div>

                <ResultDisplay result={result} imageSrc={imageSrc} />
            </div>
        </div>
    );
};

export default ScanResult;
