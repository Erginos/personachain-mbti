'use client';

import AssessmentForm from '@/components/AssessmentForm';

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <AssessmentForm />
      </div>
    </main>
  );
}
