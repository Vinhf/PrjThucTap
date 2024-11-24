import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

interface AuthInfo {
    role: string[]; 
    sub: string; 
    iat: Date; 
    exp: Date; 
    id: string;
}

function parseToken(token: string): AuthInfo | null {
    try {
        const decoded = jwtDecode<AuthInfo>(token); 
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

export function useAuth(): AuthInfo | null {
    const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); 

        if (token) {
            const decodedToken = parseToken(token);
            if (decodedToken) {
                setAuthInfo(decodedToken);
            }
        }
    }, []); // Add an empty dependency array to run this effect only once

    return authInfo;
}
export function useEmail(): string | null {
    const authInfo = useAuth();

    if (authInfo) {
        return authInfo.sub; // Assuming 'sub' field contains the email
    }

    return null;
}

