'use client';

import { useEffect, useState } from 'react';
import { getAuth, sendEmailVerification, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const resend = async () => {
