import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {toasts.map(toast => (
                    <div key={toast.id} className="glass-panel" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem 1.5rem',
                        minWidth: '300px',
                        background: 'rgba(30, 41, 59, 0.95)',
                        borderLeft: `4px solid ${toast.type === 'success' ? '#22c55e' :
                                toast.type === 'error' ? '#ef4444' : '#6366f1'
                            }`,
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        {toast.type === 'success' && <CheckCircle size={20} color="#22c55e" />}
                        {toast.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
                        {toast.type === 'info' && <Info size={20} color="#6366f1" />}

                        <span style={{ flex: 1, fontSize: '0.95rem' }}>{toast.message}</span>

                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
