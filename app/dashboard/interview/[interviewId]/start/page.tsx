'use client';
import React, { useEffect, useState } from 'react';
import { db } from "../../../../../utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "../../../../../utils/schema";
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';

function Page({ params }) {
    const { interviewId } = params;
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        if (interviewId) {
            GetInterviewDetails();
        }
    }, [interviewId]);

    const GetInterviewDetails = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, interviewId));

            if (result.length > 0) {
                const jsonMockResp = typeof result[0].jsonMockResp === "string"
                    ? JSON.parse(result[0].jsonMockResp)
                    : result[0].jsonMockResp;

                setMockInterviewQuestion(jsonMockResp);
                setInterviewData(result[0]);
            }
        } catch (error) {
            console.error("Unable to fetch user details:", error);
        }
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions */}
                {mockInterviewQuestion && (
                    <QuestionSection 
                        mockInterviewQuestion={mockInterviewQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                    />
                )}

                {interviewData && (
                    <RecordAnswerSection 
                        mockInterviewQuestion={mockInterviewQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                        interviewData={interviewData}
                    />
                )}
            </div>
            <div className='flex justify-end gap-6'>
           {activeQuestionIndex>0 &&   <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
           {activeQuestionIndex !=mockInterviewQuestion?.length-1  && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
              {activeQuestionIndex ==mockInterviewQuestion?.length-1 && <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}><Button>End Interview</Button></Link>}
            </div>
        </div>
    );
}

export default Page;
