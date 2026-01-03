'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';

const translations = { en, es };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Default to 'es' since the user specifically requested it
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        const storedLang = localStorage.getItem('byteguard-lang');
        if (storedLang && translations[storedLang]) {
            const timer = setTimeout(() => setLanguage(storedLang), 0);
            return () => clearTimeout(timer);
        }
    }, []);

    const toggleLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
            localStorage.setItem('byteguard-lang', lang);
        }
    };

    const t = (keyPath) => {
        const keys = keyPath.split('.');
        let result = translations[language];

        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                return keyPath; // Fallback to key name if not found
            }
        }

        return result;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
