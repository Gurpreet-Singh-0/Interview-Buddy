'use client';
import React,{useEffect, useState,use} from 'react'
import { db } from "../../../../../utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "../../../../../utils/schema";
import QuestionSection from './_components/QuestionSection'
import RecordAnswerSection from './_components/RecordAnswerSection'

function page({params}) {
    const resolvedParams = use(params);
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const[activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const interviewId = resolvedParams?.interviewId;
    useEffect(() => {
        GetInterviewDetails();
      }, []);
    
      const GetInterviewDetails = async () => {
        try {
       
          
          const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId));
            
            const jsonMockResp= JSON.parse(result[0].jsonMockResp);
            console.log(jsonMockResp);
            setMockInterviewQuestion(jsonMockResp);
            console.log(mockInterviewQuestion);

            setInterviewData(result[0]);
    
         
        } catch (error) {
         console.log("Unable to fetch user details:",error)
        } 
      };
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2  gap-10'>
            {/* Questions*/}
            <QuestionSection mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}/>

            <RecordAnswerSection mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}/>
        </div>
    </div>
  )
}

export default page