'use client'
import React, { useState, useEffect, use } from "react";
import { MockInterview } from "../../../../utils/schema";
import { db } from "../../../../utils/db";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import Link from "next/link";
import { Lightbulb, WebcamIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Alert, AlertDescription } from "../../../../@/components/ui/alert";

const InterviewPage = ({ params }) => {
  const resolvedParams = use(params);
  const interviewId = resolvedParams.interviewId;

  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    } else {
      setLoading(false);
      setError("No interview ID provided");
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (result?.length > 0) {
        setInterviewData(result[0]);
      } else {
        setError(`No interview found with ID: ${interviewId}`);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch interview data");
    } finally {
      setLoading(false);
    }
  };

  const handleWebcamEnable = () => {
    try {
      setWebCamEnabled(true);
    } catch (error) {
      setError("Failed to enable webcam. Please check your permissions.");
    }
  };

  const handleWebcamError = (error) => {
    setWebCamEnabled(false);
    setError("Failed to access webcam. Please check your permissions.");
  };

  const renderWebcamSection = () => {
    return (
      <Card className="w-full max-w-2xl border-blue-100">
        <CardHeader className="bg-slate-900 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex gap-2">
              <WebcamIcon className="h-5 w-5" />
              <p>Interview Camera</p>
            </div>
            <Link href={'/dashboard/interview/'+interviewId+'/start'}>
              <Button className="bg-blue-600 hover:bg-blue-700">Start Interview</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {webCamEnabled ? (
            <div className="relative">
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={handleWebcamError}
                mirrored={true}
                className="w-full h-auto rounded-lg shadow-md"
                style={{
                  minHeight: "400px",
                  maxHeight: "500px"
                }}
              />
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Live
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                <WebcamIcon className="h-24 w-24 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium mb-2">Camera is disabled</h3>
                <p className="text-slate-600 mb-6">Enable your camera to start the interview session</p>
                <Button 
                  onClick={handleWebcamEnable}
                  className="w-full max-w-xs bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Enable Camera & Microphone
                </Button>
              </div>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Make sure you're in a well-lit, quiet environment for the best interview experience.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderInterviewDetails = () => {
    if (loading) {
      return (
        <Card className="w-full max-w-2xl animate-pulse border-blue-100">
          <CardContent className="p-6">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-6" />
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="h-24 bg-slate-200 rounded w-full" />
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="w-full max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!interviewData) return null;

    return (
      <Card className="w-full max-w-2xl border-blue-100">
        <CardHeader className="bg-slate-900 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-400" />
            Interview Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900">Position</h3>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {interviewData.jobPosition}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900">Technical Requirements</h3>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
              {interviewData.jobDesc}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h1 className="font-bold text-4xl mb-4">Mock Interview Session</h1>
            <p className="text-slate-300">Get ready for your technical interview</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center max-w-4xl mx-auto space-y-8">
          {process.env.NEXT_PUBLIC_INFORMATION && (
            <Alert className="bg-blue-50 border-blue-200 w-full max-w-2xl">
              <Lightbulb className="h-16 w-16 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {process.env.NEXT_PUBLIC_INFORMATION}
              </AlertDescription>
            </Alert>
          )}
          
          {renderWebcamSection()}
          {renderInterviewDetails()}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;