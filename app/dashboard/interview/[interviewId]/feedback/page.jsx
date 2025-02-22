'use client';
import { UserAnswer } from '../../../../../utils/schema'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../../utils/db';
import { eq } from 'drizzle-orm';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../../../../@/components/ui/collapsible"
import { ChevronsUpDown, Star, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../../components/ui/button';

function InterviewFeedback({ params }) {
    const [feedbackList, setFeedbackList] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const router = useRouter();

    useEffect(() => {
        GetFeedback();
    }, []);

    const GetFeedback = async () => {
        const result = await db.select().from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);
        
        setFeedbackList(result);

        if (result.length > 0) {
            const totalRating = result.reduce((sum, item) => sum + Number(item.rating), 0);
            const avg = (totalRating / result.length).toFixed(1)
            setAverageRating(avg);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-4 text-blue-400">Congratulations!</h1>
                        <p className="text-xl text-slate-300">Here is your interview feedback</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {feedbackList.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl text-slate-500 font-semibold">No Interview Feedback Available</h2>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-xl text-blue-800 mb-2">
                                <Star className="h-6 w-6 text-blue-600" />
                                <span>Overall Interview Rating: <strong>{averageRating}/5</strong></span>
                            </div>
                            <p className="text-slate-600">
                                Review your performance for each question below
                            </p>
                        </div>

                        <div className="space-y-4">
                            {feedbackList.map((item, index) => (
                                <Collapsible key={index}>
                                    <CollapsibleTrigger className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg w-full text-left flex justify-between items-center transition-colors duration-200 border border-slate-200">
                                        <span className="font-medium text-slate-800">{item.question}</span>
                                        <ChevronsUpDown className="h-5 w-5 text-slate-400" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="mt-2 space-y-3 p-4 bg-white rounded-lg border border-slate-200">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-slate-800">
                                                <Star className="h-5 w-5 text-blue-600" />
                                                <span><strong>Rating:</strong> {item.rating}/5</span>
                                            </div>

                                            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                                                <MessageCircle className="h-5 w-5 text-slate-600 mt-1" />
                                                <div>
                                                    <strong className="text-slate-800">Your Answer:</strong>
                                                    <p className="mt-1 text-slate-700">{item.userAns}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                                                <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                                                <div>
                                                    <strong className="text-blue-800">Model Answer:</strong>
                                                    <p className="mt-1 text-blue-700">{item.correctAnswer}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                                                <AlertCircle className="h-5 w-5 text-blue-600 mt-1" />
                                                <div>
                                                    <strong className="text-slate-800">Feedback:</strong>
                                                    <p className="mt-1 text-slate-700">{item.feedback}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>

                        <div className="text-center pt-8">
                            <Button 
                                onClick={() => router.replace('/dashboard')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                size="lg"
                            >
                                Return to Dashboard
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InterviewFeedback;