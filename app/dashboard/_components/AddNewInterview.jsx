'use client';
import React, {useState} from 'react'
import { Button } from '../../../components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import {db} from '../../../utils/db.js'
import moment from 'moment/moment';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "../../../components/ui/dialog"
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { chatSession } from '../../../utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '../../../utils/schema.js';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [openDailog, setOpenDailog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc,setJobDesc] = useState();
    const [jobExperience, setJobExperience]= useState();
    const [loading, setLoading]= useState(false);
    const [JsonResponse, setJsonResponse]= useState([]);
    const router = useRouter();
    const {user}= useUser();
    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition, jobDesc, jobExperience);
    
        const InputPrompt = `Job position:${jobPosition}, Job Description:${jobDesc}, Years of Experience:${jobExperience}, Depends on Job Position, Job Description & Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview questions along with Answer in JSON format. Provide only a JSON object with "question" and "answer" fields.`;
    
        try {
            const result = await chatSession.sendMessage(InputPrompt);
            const responseText = await result.response.text(); // Await the response
            let cleanedJson = responseText.trim()
                .replace(/^```json/, '')
                .replace(/```$/, '');
            
            console.log("Cleaned JSON response:", cleanedJson);
    
            // Attempt to parse the JSON
            const parsedJson = JSON.parse(cleanedJson);
            console.log("Parsed JSON:", parsedJson);
            setJsonResponse(parsedJson);
    
            // Now save to database
            const resp = await db.insert(MockInterview)
                .values({
                    mockId: uuidv4(),
                    jsonMockResp: JSON.stringify(parsedJson), // Ensure proper string format
                    jobPosition: jobPosition,
                    jobDesc: jobDesc,
                    jobExperience: jobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-yyyy'),
                })
                .returning({ mockId: MockInterview.mockId });
    
            console.log("Inserted ID:", resp);
    
            if (resp) {
                setOpenDailog(false);
                router.push('/dashboard/interview/' + resp[0]?.mockId);
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    
        setLoading(false);
    };
    
    

     
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary
        hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDailog(true)}>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDailog}>
          
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                <DialogTitle className="text-2xl">Tell us more about your job interviewing</DialogTitle>
                <DialogDescription>
                    <form onSubmit={onSubmit} >
                    <div>
                        <h2>Add Details about your job position/role, Job description and years of experience</h2>
                        <div className='mt-7 my-3'>
                            <label htmlFor="">Job Role/Job Position</label>
                            <Input placeholder="Ex.Software Engineer" required
                            onChange={(event)=>setJobPosition(event.target.value)}/>
                        </div>
                        <div className='my-3'>
                            <label htmlFor="">Job Description/Tech-Stack</label>
                            <Textarea placeholder="Ex.React,Node js, My SQL etc" required
                            onChange={(e)=>setJobDesc(e.target.value)}/>
                        </div>
                        <div className='my-3'>
                            <label htmlFor="">Years of Experience</label>
                            <Input placeholder="Ex.0,1,2..." type='number' max='100' required
                            onChange={(e)=>setJobExperience(e.target.value)}/>
                        </div>
                    </div>
                    <div className='flex gap-5 justify-end'>
                    <Button type='button' variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
                    <Button type='submit' disabled={loading}>
                        {loading?
                        <>
                        <LoaderCircle className='animate-spin'/>'Generating from AI'</>:'Start Interview'}
                        </Button>
                </div>
                </form>
                </DialogDescription>

                </DialogHeader>
            </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview