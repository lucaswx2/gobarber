import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, Background, AnimationContent } from './styles';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}
const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const handleSubmit = useCallback(
        async (data: object) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome é obrigatório'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido!'),
                    password: Yup.string().min(6, 'No mínimo 6 dígitos'),
                });
                await schema.validate(data, { abortEarly: false });
                await api.post('/users', data);
                history.push('/');
                addToast({
                    type: 'success',
                    title: 'Cadastro realizado!',
                    description: 'Você já pode fazer seu logon no GoBarber',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);

                    formRef.current?.setErrors(errors);
                } else {
                    addToast({
                        type: 'error',
                        title: 'Erro no cadastro',
                        description:
                            'Ocorreu um erro ao fazer o cadastro,tente novamente',
                    });
                }
            }
        },
        [addToast, history],
    );

    return (
        <Container>
            <Background />
            <Content>
                <AnimationContent>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu cadastro</h1>
                        <Input
                            icon={FiMail}
                            name="email"
                            type="text"
                            placeholder="E-mail"
                        />
                        <Input
                            icon={FiUser}
                            name="name"
                            type="text"
                            placeholder="Nome"
                        />
                        <Input
                            icon={FiLock}
                            name="password"
                            type="password"
                            placeholder="Senha"
                        />
                        <Button type="submit">Cadastrar</Button>
                    </Form>

                    <Link to="/">
                        <FiArrowLeft /> Voltar para o Logon
                    </Link>
                </AnimationContent>
            </Content>
        </Container>
    );
};

export default SignUp;
