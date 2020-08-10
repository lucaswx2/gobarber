import React, { useEffect } from 'react';
import { FiAlertCircle, FiXCircle } from 'react-icons/fi';
import { Container } from './styles';
import { useToast, ToastMessage } from '../../../hooks/toast';

interface ToastProps {
    message: ToastMessage;
    style: object;
    // hasDescription: boolean;
}
const Toast: React.FC<ToastProps> = ({ message, style }) => {
    const { removeToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(message.id);
        }, 3000);
        return () => {
            clearTimeout(timer);
        };
    }, [removeToast, message.id]);

    return (
        <Container
            type={message.type}
            description={message.description ? 1 : 0}
            style={style}
        >
            <FiAlertCircle size={20} />

            <div>
                <strong>{message.title}</strong>
                {message.description && <p>{message.description}</p>}
            </div>

            <button type="button" onClick={() => removeToast(message.id)}>
                <FiXCircle size={18} />
            </button>
        </Container>
    );
};

export default Toast;
