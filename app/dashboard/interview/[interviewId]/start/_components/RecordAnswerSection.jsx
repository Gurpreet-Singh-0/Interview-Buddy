'use client';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { Button } from '../../../../../../components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from "sonner";
import { chatSession } from '../../../../../../utils/GeminiAIModel';
import { db } from '../../../../../../utils/db';
import { UserAnswer } from '../../../../../../utils/schema';
import { useUser } from '@clerk/clerk-react';
import moment from 'moment';

const RecordAnswerSection = ({ mockInterviewQuestion, activeQuestionIndex, interviewData }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        if (results.length > 0) {
            const newTranscript = results[results.length - 1]?.transcript || '';
            setUserAnswer(prevAns => prevAns + ' ' + newTranscript);
        }
    }, [results]);

    const handleSaveUserAnswer = async () => {
        try {
            if (isRecording) {
                stopSpeechToText();
                await UpdateUserAnswer();  
            } else {
                startSpeechToText();
            }
        } catch (error) {
            console.error('Error in handleSaveUserAnswer:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const UpdateUserAnswer = async () => {
      console.log("User answer:", userAnswer);
      setLoading(true);
  
      if (!mockInterviewQuestion || !mockInterviewQuestion[activeQuestionIndex]) {
          toast.error("Question data not loaded yet.");
          setLoading(false);
          return;
      }
  
      const correctAnswer = mockInterviewQuestion[activeQuestionIndex]?.answer;
      console.log("Extracted Correct Answer:", correctAnswer);
  
      if (!correctAnswer) {
          console.error("No correct answer found for this question.");
          setLoading(false);
          return;
      }
  
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex].question}, 
      User Answer: ${userAnswer}, Based on the question and user's answer, provide a rating 
      and feedback for improvement in JSON format with fields: rating (integer) and feedback (string). 
      Example: {"rating": 4, "feedback": "Your response is good but could be more detailed."}`;
  
      try {
          const result = await chatSession.sendMessage(feedbackPrompt);
          let mockJsonResp = result.response.text().trim()
              .replace(/^```json/, '')
              .replace(/```$/, '');
  
          console.log("Raw response from AI:", mockJsonResp);
  
          const jsonStart = mockJsonResp.indexOf("{");
          const jsonEnd = mockJsonResp.lastIndexOf("}");
  
          if (jsonStart === -1 || jsonEnd === -1) {
              throw new Error("Invalid JSON format received from AI");
          }
  
          mockJsonResp = mockJsonResp.substring(jsonStart, jsonEnd + 1);
          const JsonFeedbackResp = JSON.parse(mockJsonResp);
  
          const resp = await db.insert(UserAnswer).values({
              mockIdRef: interviewData?.mockId,
              question: mockInterviewQuestion[activeQuestionIndex]?.question,
              correctAnswer: correctAnswer,
              userAns: userAnswer,
              feedback: JsonFeedbackResp?.feedback,
              rating: JsonFeedbackResp?.rating,
              userEmail: user?.primaryEmailAddress?.emailAddress,
              createdAt: moment().format("DD-MM-yyyy"),
          });
  
          if (resp) {
              toast.success("User answer recorded successfully!");
              setUserAnswer("");
              setResults([]);
          }
  
          setResults([]);
          setLoading(false);
      } catch (error) {
          console.error("Error processing answer:", error);
          toast.error("Error saving answer. Please try again.");
          setLoading(false);
      }
  };
  
  

   

    return (
        <div className="items-center justify-center flex flex-col">
            <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 my-20 relative">
                <Image 
                    src="/webcam.png" 
                    width={200} 
                    height={200}
                    alt="webcam placeholder"
                    className="absolute z-0"
                />
                <Webcam mirrored className="z-10 w-full h-[300px]" />
            </div>
            
            <Button disabled={loading} variant="outline" className="my-10" onClick={handleSaveUserAnswer}>
                {isRecording ? (
                    <span className="text-red-600 flex gap-2 items-center">
                        <Mic />
                        Stop Recording
                    </span>
                ) : (
                    'Record Answer'
                )}
            </Button>
            
         
        </div>
    );
};

export default RecordAnswerSection;
