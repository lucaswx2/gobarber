import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface AuthState {
    token: string;
    user: object;
}

interface SignInCredentials {
    email: string;
    password: string;
}
interface AuthContextInterface {
    user: object;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
}
export const AuthContext = createContext<AuthContextInterface>(
    {} as AuthContextInterface,
);

export const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@Gobarber:token');
        const user = localStorage.getItem('@Gobarber:user');

        if (token && user) {
            return { token, user: JSON.parse(user) };
        }

        return {} as AuthState;
    });
    const signIn = useCallback(async ({ email, password }) => {
        const response = await api.post('sessions', {
            email,
            password,
        });
        const { token, user } = response.data;
        localStorage.setItem('@Gobarber:token', token);
        localStorage.setItem('@Gobarber:user', JSON.stringify(user));

        setData({ token, user });
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('@Gobarber:token');
        localStorage.removeItem('@Gobarber:user');

        setData({} as AuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextInterface {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used withn an AuthProvider');
    }

    return context;
}
