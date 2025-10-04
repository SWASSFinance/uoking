import { redirect } from 'next/navigation';

export default function NotFound() {
  // 301 redirect to homepage
  redirect('/');
}

