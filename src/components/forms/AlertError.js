import React, { useState } from 'react';

function AlertComponent({ message, emptyFields }) {
    const [showAlert, setShowAlert] = useState(false);

    const handleShowAlert = () => {
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    // Executa automaticamente quando o componente é montado
    React.useEffect(() => {
        if (emptyFields && emptyFields.length > 0) {
            // Pequeno delay para garantir que o alerta seja exibido primeiro
            setTimeout(() => {
                scrollToFirstEmptyField();
            }, 100);
        }
        
        // Caso especial: se a mensagem for sobre CPF inválido, redireciona para o campo CPF
        if (message === "O CPF digitado não é válido") {
            setTimeout(() => {
                const cpfField = document.getElementById("cpf_associate");
                if (cpfField) {
                    cpfField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    cpfField.focus();
                    // Adiciona uma classe temporária para destacar o campo
                    cpfField.classList.add('highlight-error');
                    setTimeout(() => {
                        cpfField.classList.remove('highlight-error');
                    }, 2000);
                }
            }, 100);
        }
        
        // Caso especial: se a mensagem for sobre senha muito curta, redireciona para o campo de senha
        if (message === "A senha precisa ter pelo menos 6 dígitos") {
            setTimeout(() => {
                const passField = document.getElementById("pass_account");
                if (passField) {
                    passField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    passField.focus();
                    // Adiciona uma classe temporária para destacar o campo
                    passField.classList.add('highlight-error');
                    setTimeout(() => {
                        passField.classList.remove('highlight-error');
                    }, 2000);
                }
            }, 100);
        }
        
        // Caso especial: se a mensagem for sobre telefone inválido, redireciona para o campo de telefone
        if (message === "O número de telefone precisa ter pelo menos 10 dígitos") {
            setTimeout(() => {
                const phoneField = document.getElementById("mobile_number");
                if (phoneField) {
                    phoneField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    phoneField.focus();
                    // Adiciona uma classe temporária para destacar o campo
                    phoneField.classList.add('highlight-error');
                    setTimeout(() => {
                        phoneField.classList.remove('highlight-error');
                    }, 2000);
                }
            }, 100);
        }
    }, [emptyFields, message]);

    const scrollToFirstEmptyField = () => {
        if (emptyFields && emptyFields.length > 0) {
            // Mapeia os nomes dos campos para seus IDs
            const fieldIdMap = {
                'Tipo de responsável': 'responsable_type',
                'Nome do associado': 'name_associate',
                'Sobrenome do associado': 'lastname_associate',
                'Data de nascimento': 'birthday_associate',
                'Gênero': 'gender',
                'Nacionalidade': 'nationality',
                'CPF': 'cpf_associate',
                'RG': 'rg_associate',
                'Órgão emissor': 'emiiter_rg_associate',
                'Estado civil': 'marital_status',
                'Senha da conta': 'pass_account',
                'Número de celular': 'mobile_number',
                'Rua': 'street',
                'Número': 'number',
                'Bairro': 'neighborhood',
                'Cidade': 'city',
                'Estado': 'state',
                'CEP': 'cep',
                'Motivo do tratamento': 'reason_treatment',
                'Motivo do tratamento com suas palavras': 'reason_treatment_text',
                'Como nos conheceu': 'met_us'
            };

            // Encontra o primeiro campo vazio
            const firstEmptyField = emptyFields.split(', ')[0];
            const fieldId = fieldIdMap[firstEmptyField];

            if (fieldId) {
                const element = document.getElementById(fieldId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                    // Adiciona uma classe temporária para destacar o campo
                    element.classList.add('highlight-error');
                    setTimeout(() => {
                        element.classList.remove('highlight-error');
                    }, 2000);
                }
            }
        }
    };

    return (
        <div className={`custom-alert ${showAlert ? 'show-alert' : ''}`}>
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <b className="message">
                    {message}
                    {emptyFields && emptyFields.length > 0 && (
                        <span style={{ fontWeight: 'normal' }}>
                            {emptyFields}
                        </span>
                    )}
                </b>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <style jsx>{`
                .highlight-error {
                    animation: shake 0.5s ease-in-out;
                    border: 2px solid #dc3545 !important;
                    box-shadow: 0 0 10px rgba(220, 53, 69, 0.5) !important;
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
}

export default AlertComponent;
