'use client';
import { MockInterview } from '../../../utils/schema';
import { desc } from 'drizzle-orm';
import React, { useEffect,useState } from 'react'
import { db } from '../../../utils/db';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {
    const {user} =useUser();
    const [interviewList, setInterviewList]= useState([]);

    useEffect(() => {
        if (user) {
            (async () => {
                await GetInterviewList();
            })();
        }
    }, [user]);
    
    const GetInterviewList = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
                .orderBy(desc(MockInterview.id));
    
            console.log(result);
            setInterviewList(result);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        }
    };
    
  return (
    <div>
        <h2  className='font-medium text-xl'>Previous Mock Interviews</h2>
        <div>
            {interviewList && interviewList.map((interview,index)=>(
                <InterviewItemCard key={index} interview={interview}/>
                
            ))}
        </div>
    </div>
  )
}

export default InterviewList