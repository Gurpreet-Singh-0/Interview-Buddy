'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../../components/ui/button';
import { ArrowRight, Brain, Users, Calendar, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import userimg from '../../../public/user.jpg'

const HomePage = () => {
    const router = useRouter();
  return (
    <main className="min-h-screen bg-white">
     
      <section className="relative bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-slate-900/20" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Master Your Next Interview with AI
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl">
              Practice with our advanced AI interviewer and get real-time feedback to improve your interview skills. 
              Available 24/7 to help you prepare for your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={()=>router.push('/dashboard')} size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                Start Practicing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button  onClick={()=>router.push('https://www.linkedin.com/in/gurpreet-singh-b5a1a7231/')}
                size="lg" 
                variant="outline" 
                className="text-white bg-slate-400 border-white hover:bg-slate-300 w-full sm:w-auto"
              >
                Follow us on LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>

   
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our AI-powered platform provides everything you need to prepare for your interviews
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard 
              icon={<Brain className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />}
              title="AI-Powered Practice"
              description="Get realistic interview experience with our advanced AI that adapts to your responses in real-time."
            />
            <FeatureCard 
              icon={<CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />}
              title="Instant Feedback"
              description="Receive detailed feedback on your answers, body language, and speaking patterns after each session."
            />
            <FeatureCard 
              icon={<Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />}
              title="Flexible Schedule"
              description="Practice anytime, anywhere. No need to coordinate with human interviewers or wait for availability."
            />
          </div>
        </div>
      </section>

    
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <StatCard number="50,000+" label="Users Trained" />
            <StatCard number="95%" label="Success Rate" />
            <StatCard number="1,000+" label="Interview Questions" />
          </div>
        </div>
      </section>

    
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg sm:text-xl text-slate-700 mb-6">
                "This AI interview practice platform completely transformed my interview preparation. 
                I went from being nervous and unprepared to confident and well-spoken."
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image 
                    src={userimg}
                    alt="User avatar"
                    width={48}
                    height={100}
                 
                  />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">Sarah Chen</div>
                  <div className="text-sm text-slate-600">Software Engineer at Google</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="bg-blue-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who have mastered their interview skills with our AI platform.
          </p>
          <Button  onClick={()=>router.push("/dashboard")}
            size="lg" 
            className="bg-white text-blue-600 hover:bg-slate-100 w-full sm:w-auto"
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </main>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-lg border border-slate-200 hover:shadow-lg transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-900">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="text-center p-6">
    <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-slate-600">{label}</div>
  </div>
);

export default HomePage;