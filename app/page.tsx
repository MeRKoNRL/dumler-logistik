'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
