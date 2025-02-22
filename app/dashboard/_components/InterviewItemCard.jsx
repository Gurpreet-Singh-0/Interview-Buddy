import React from 'react'
import {Button} from '../../../components/ui/button'
import { useRouter } from 'next/navigation'

function InterviewItemCard({interview}) {
    const router = useRouter();
    const onStart= ()=>{
        router.push("/dashboard/interview/"+interview?.mockId);
    }
    const onFeedback =()=>{
        router.push("/dashboard/interview/"+interview?.mockId+"/feedback");
    }
  return (
    <div className='border shadow-sm rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'
    >
        <h2 className='font-bold text-blue-700'>{interview?.jobPosition}</h2>
        <h2 className='text-xs text-gray-500'>Created At:{interview?.createdAt}</h2>
        <div className='flex justify-between mt-2 gap-5'>
            <Button onClick={onFeedback} size='sm' variant='outline' className='w-full'>Feedback</Button>
            <Button onClick={onStart} size='sm' className='w-full'>Start</Button>
        </div>
    </div>
  )
}

export default InterviewItemCard