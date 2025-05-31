'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    try {
