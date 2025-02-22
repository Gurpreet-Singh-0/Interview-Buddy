'use client';
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../../utils/db.js';
import moment from 'moment/moment';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { chatSession } from '../../../utils/GeminiAIModel';
import { LoaderCircle, PlusCircle } from 'lucide-react';
import { MockInterview } from '../../../utils/schema.js';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);

    const InputPrompt = `Job position:${jobPosition}, Job Description:${jobDesc}, Years of Experience:${jobExperience}, Depends on Job Position, Job Description & Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview questions along with Answer in JSON format. Provide only a JSON object with "question" and "answer" fields.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const responseText = await result.response.text();
      let cleanedJson = responseText.trim()
        .replace(/^```json/, '')
        .replace(/```$/, '');

      console.log("Cleaned JSON response:", cleanedJson);

      const parsedJson = JSON.parse(cleanedJson);
      console.log("Parsed JSON:", parsedJson);
      setJsonResponse(parsedJson);

      const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsedJson),
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy'),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID:", resp);

      if (resp) {
        setOpenDialog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockId);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 
        hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-300
        flex flex-col items-center justify-center space-y-2"
        onClick={() => setOpenDialog(true)}
      >
        <PlusCircle className="h-8 w-8 text-blue-600" />
        <h2 className="font-semibold text-lg text-slate-900">Create New Interview</h2>
        <p className="text-sm text-slate-600">Click to prepare for your next interview</p>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Prepare Your Interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit} className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Role/Position
                    </label>
                    <Input
                      placeholder="Ex. Software Engineer"
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500"
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Description/Tech-Stack
                    </label>
                    <Textarea
                      placeholder="Ex. React, Node.js, MySQL etc"
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Years of Experience
                    </label>
                    <Input
                      placeholder="Ex. 0, 1, 2..."
                      type="number"
                      max="100"
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin h-4 w-4" />
                        <span>Generating Questions...</span>
                      </>
                    ) : (
                      'Start Interview'
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;