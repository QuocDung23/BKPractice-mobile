import { router } from 'expo-router';
import { useState, type Dispatch, type SetStateAction } from 'react';

import { authenticateDemoStudent } from '@/domain/auth/demo-session';
import { createDemoSession } from '@/lib/auth/demo-student';
import { useAuthSession } from '@/stores/auth-session';

type DemoSignInResult = {
  feedback: string;
  setFeedback: Dispatch<SetStateAction<string>>;
  submitSignIn: (studentId: string, password: string) => void;
};

export function useDemoSignIn(): DemoSignInResult {
  const { setSession } = useAuthSession();
  const [feedback, setFeedback] = useState('');

  function submitSignIn(studentId: string, password: string): void {
    if (!studentId.trim() || !password) {
      setFeedback('Enter your student ID and password.');
      return;
    }
    if (!authenticateDemoStudent(studentId, password)) {
      setFeedback('Student ID or password is incorrect.');
      return;
    }

    setFeedback('');
    setSession(createDemoSession());
    router.replace('/home');
  }

  return { feedback, setFeedback, submitSignIn };
}
