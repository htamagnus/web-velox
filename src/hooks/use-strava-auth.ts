import { useState } from 'react';

export function useStravaAuth() {
  const [loading, setLoading] = useState(false);

  const redirectToStrava = () => {
    setLoading(true);
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI;
    const scope = 'read,activity:read_all';

    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=${scope}`;

    window.location.href = stravaAuthUrl;
  };

  return {
    redirectToStrava,
    loading,
    setLoading,
  };
}
