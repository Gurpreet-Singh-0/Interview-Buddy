"use client";

import React, { useState, useEffect, use} from "react";
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
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex gap-2">
            <WebcamIcon className="flex h-5 w-5" />
            <p>Interview Camera</p>
            </div>
            <Link href={'/dashboard/interview/'+interviewId+'/start'}>
            <Button >Start</Button>
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
                <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Live
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <WebcamIcon className="h-24 w-24 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Camera is disabled</h3>
                <p className="text-gray-500 mb-6">Enable your camera to start the interview session</p>
                <Button 
                  onClick={handleWebcamEnable}
                  className="w-full max-w-xs"
                  size="lg"
                >
                  Enable Camera & Microphone
                </Button>
              </div>
              <Alert variant="info" className="bg-blue-50 flex gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
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
        <Card className="w-full max-w-2xl animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-24 bg-gray-200 rounded w-full" />
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
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Interview Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Position</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {interviewData.jobPosition}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Technical Requirements</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
              {interviewData.jobDesc}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-4">
            <h1 className="font-bold text-4xl mb-4">Mock Interview Session</h1>
            <p className="text-gray-600">Get ready for your technical interview</p>
          </div>

          {process.env.NEXT_PUBLIC_INFORMATION && (
            <Alert className="bg-yellow-50 border-yellow-200 w-full max-w-2xl flex gap-2">
              <Lightbulb className="h-16 w-16 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
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