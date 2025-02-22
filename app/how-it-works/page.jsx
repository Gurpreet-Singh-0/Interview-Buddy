'use client';
import React from 'react';
import { Button } from '../../components/ui/button';
import { Play, MessageSquare, BarChart, Settings, ArrowRight, Video, Book, ThumbsUp ,Check} from 'lucide-react';
import { useRouter } from 'next/navigation';

const HowItWorksPage = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">How Our AI Interview Platform Works</h1>
            <p className="text-xl text-slate-300 mb-8">
              Master your interview skills through our advanced AI-powered practice platform
            </p>
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/dashboard')}
            >
              Start Your First Interview
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-12">
              <ProcessStep
                number="1"
                title="Choose Your Interview Type"
                description="Select from various interview types including behavioral, technical, or industry-specific scenarios."
                icon={<Settings className="h-8 w-8 text-blue-600" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <OptionCard
                    icon={<MessageSquare className="h-6 w-6" />}
                    title="Behavioral"
                    description="Practice common behavioral questions and STAR method responses"
                  />
                  <OptionCard
                    icon={<Book className="h-6 w-6" />}
                    title="Technical"
                    description="Handle technical questions specific to your field"
                  />
                  <OptionCard
                    icon={<ThumbsUp className="h-6 w-6" />}
                    title="Custom"
                    description="Create your own interview scenario"
                  />
                </div>
              </ProcessStep>

              <ProcessStep
                number="2"
                title="Start Your Interview Session"
                description="Experience a realistic interview with our AI interviewer that adapts to your responses."
                icon={<Video className="h-8 w-8 text-blue-600" />}
              >
                <div className="bg-slate-50 rounded-lg p-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">During Your Interview:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <div className="h-2 w-2 bg-blue-600 rounded-full mr-2" />
                          Real-time voice or text responses
                        </li>
                        <li className="flex items-center">
                          <div className="h-2 w-2 bg-blue-600 rounded-full mr-2" />
                          Dynamic follow-up questions
                        </li>
                        <li className="flex items-center">
                          <div className="h-2 w-2 bg-blue-600 rounded-full mr-2" />
                          Natural conversation flow
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button onClick={()=> router.forward('https://www.linkedin.com/in/gurpreet-singh-b5a1a7231/')}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Watch Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </ProcessStep>

              <ProcessStep
                number="3"
                title="Receive Detailed Feedback"
                description="Get comprehensive analysis and actionable insights after each session."
                icon={<BarChart className="h-8 w-8 text-blue-600" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <FeedbackCard
                    title="Response Analysis"
                    items={[
                      "Answer completeness",
                      "STAR method usage",
                      "Key points coverage"
                    ]}
                  />
                  <FeedbackCard
                    title="Communication Skills"
                    items={[
                      "Clarity of expression",
                      "Professional language",
                      "Response structure"
                    ]}
                  />
                  <FeedbackCard
                    title="Improvement Tips"
                    items={[
                      "Personalized suggestions",
                      "Example responses",
                      "Practice exercises"
                    ]}
                  />
                </div>
              </ProcessStep>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience It Yourself?</h2>
          <p className="text-xl mb-8">Start with a free interview session and see how our platform can help you succeed.</p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-slate-100"
            onClick={() => router.push('/dashboard')}
          >
            Try Free Interview
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </main>
  );
};

const ProcessStep = ({ number, title, description, icon, children }) => (
  <div className="relative">
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 rounded-full p-4 mr-4">
        {icon}
      </div>
      <div>
        <div className="text-sm text-blue-600 font-semibold mb-1">Step {number}</div>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
    </div>
    <p className="text-slate-600 text-lg mb-4">{description}</p>
    {children}
  </div>
);

const OptionCard = ({ icon, title, description }) => (
  <div className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-slate-600 text-sm">{description}</p>
  </div>
);

const FeedbackCard = ({ title, items }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
    <h4 className="font-semibold mb-4">{title}</h4>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <Check className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <span className="text-slate-600">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default HowItWorksPage;