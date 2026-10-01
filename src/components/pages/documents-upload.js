import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import apiRequest from "../../modules/apiRequest";
import User from "../../modules/User";
import { useUser } from "../../contexts/UserContext";
import AlertError from "../forms/AlertError";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "pdf"];

const getExtension = fileName => fileName.split(".").pop().toLowerCase();

const isAllowedExtension = ext => ALLOWED_EXTENSIONS.includes(ext);

const buildFileName = (prefix, user, ext) => {
  var nameFile = prefix + "-" + user.name_associate + "-" + user.lastname_associate + "-" + user.user_code + "." + ext;
  nameFile = nameFile.replace(/\s/g, "");
  nameFile = nameFile.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  nameFile = nameFile.replace(/ç/g, "c");
  return nameFile;
};

const buildContractData = user => {
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()} de ${months[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;
  const fullname = user.name_associate + " " + user.lastname_associate;

  return [
    { name: "usercode", default_value: user.id, readonly: true },
    { name: "email", default_value: user.email_account, readonly: true },
    { name: "Nome do Responsavel", default_value: fullname, readonly: true },
    { name: "Estado Civil", default_value: user.marital_status, readonly: true },
    { name: "Nacionalidade", default_value: user.nationality, readonly: true },
    { name: "CPF", default_value: user.cpf_associate, readonly: true },
    { name: "RG", default_value: user.rg_associate, readonly: true },
    { name: "Orgao", default_value: user.emiiter_rg_associate, readonly: true },
    { name: "Rua", default_value: user.street, readonly: true },
    { name: "Numero", default_value: user.number, readonly: true },
    { name: "Bairro", default_value: user.neighborhood, readonly: true },
    { name: "Cidade", default_value: user.city, readonly: true },
    { name: "Estado", default_value: user.state, readonly: true },
    { name: "CEP", default_value: user.cep, readonly: true },
    { name: "Data", default_value: formattedDate, readonly: true },
  ];
};

const FileUploadComponent = () => {
  const { user, fetchUser } = useUser();
  const [rgProof, setRgProof] = useState(false);
  const [rg_patient_proof, setRg_patient_proof] = useState(false);
  const [proof_of_address, setProof_of_address] = useState(false);
  const [contract, setContract] = useState(false);
  const [generateContract, setGenerateContract] = useState(false);
  const [docError, setdocError] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingC, setIsLoadingC] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [isMonitoringStatus, setIsMonitoringStatus] = useState(false);
  const contractRequestedRef = useRef(false);

  // Função para verificar o status do associado
  const checkAssociateStatus = () => {
    try {
      if (user?.associate_status === 4) {
        window.location.assign("/consulta");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao verificar status do associado:", error);
      return false;
    }
  };

  // Função para iniciar o monitoramento do status
  const startStatusMonitoring = () => {
   
    setIsMonitoringStatus(true);

    // Configura verificação a cada 10 segundos
    const intervalId = setInterval(async () => {      
      try {
        console.log("🔄 Verificando status...");
        // Busca dados atualizados do servidor
        const updatedUser = await fetchUser(true);
        
        if (updatedUser?.associate_status === 4) {
          clearInterval(intervalId);
          setIsMonitoringStatus(false);
          window.statusMonitoringInterval = null;
          window.location.assign("/consulta");
          return;
        }
        
      } catch (error) {
        console.error("❌ Erro ao buscar dados atualizados:", error);
      }
    }, 10000); // 10 segundos
    
    // Armazena o ID do intervalo para limpeza posterior
    window.statusMonitoringInterval = intervalId;
  };

  // Função para parar o monitoramento
  const stopStatusMonitoring = () => {
    setIsMonitoringStatus(false);
    if (window.statusMonitoringInterval) {
      clearInterval(window.statusMonitoringInterval);
      window.statusMonitoringInterval = null;
    }
  };

  const showDocError = () => {
    setdocError(true);
    setTimeout(() => {
      setdocError(false);
    }, 5000);
  };

  const showFileError = () => {
    setFileError(true);
    setTimeout(() => {
      setFileError(false);
    }, 5000);
  };

  const ensureUserFolder = async () => {
    const storedFolder = localStorage.getItem("user_folder");
    if (storedFolder && storedFolder !== "null" && storedFolder !== "undefined") {
      return storedFolder;
    }

    if (user?.user_path) {
      localStorage.setItem("user_folder", user.user_path);
      return user.user_path;
    }

    const createFolder = await apiRequest("/api/directus/create-folder", { name: user.user_code }, "POST");
    const userFolder = createFolder.data.id;
    localStorage.setItem("user_folder", userFolder);
    await apiRequest("/api/directus/update", { userId: user.id, formData: { user_path: userFolder } }, "POST");
    return userFolder;
  };

  const uploadUserFile = async (file, nameFile) => {
    const userFolder = await ensureUserFolder();

    const formData = new FormData();
    formData.append("file", file);

    const response = await apiRequest("/api/directus/files?filename=" + nameFile + "&folder=" + userFolder, formData, "POST", { "Content-Type": "multipart/form-data" });
    const fileId = response?.data?.id;
    if (!fileId) {
      throw new Error("Upload sem fileId");
    }

    await apiRequest("/api/directus/upload-files", { userId: user.id, fileId: fileId }, "POST");
    return fileId;
  };

  // O termo só pode ser gerado com RG e comprovante de endereço confirmados no backend
  const generateTermIfReady = async confirmedUser => {
    if (!confirmedUser?.rg_proof || !confirmedUser?.proof_of_address) return;
    if (confirmedUser.contract || generateContract || contractRequestedRef.current) return;

    contractRequestedRef.current = true;
    setIsGeneratingContract(true);

    try {
      const createContract = await apiRequest("/api/docuseal/create-contract", buildContractData(confirmedUser), "POST");
      const contractUrl =
        createContract?.[0]?.embed_src ||
        (import.meta.env.VITE_DOCUSEAL_URL + "/s/" + createContract[0].slug);

      await apiRequest("/api/directus/update", { userId: confirmedUser.id, formData: { contract: contractUrl } }, "POST");
      setGenerateContract(contractUrl);
      setContract(true);
    } catch (error) {
      console.error("Erro ao gerar o termo de responsabilidade:", error);
      contractRequestedRef.current = false;
      showDocError();
    } finally {
      setIsGeneratingContract(false);
    }
  };

  useEffect(() => {
    // Limpa os dados dos formulários do localStorage quando acessar /documentos
    localStorage.removeItem("form_patient_signup");
    localStorage.removeItem("form_associate_signup");
  
    // Verifica se o status do associado é 4 e redireciona se necessário
    if (user?.associate_status === 4) {
      window.location.assign("/consulta");
      return;
    }

    if (user?.rg_proof == null) {
      setRgProof(false);
    } else {
      setRgProof(true);
    }

    if (user?.rg_patient_proof == null) {
      setRg_patient_proof(false);
    } else {
      setRg_patient_proof(true);
    }
    if (user?.proof_of_address == null) {
      setProof_of_address(false);
    } else {
      setProof_of_address(true);
    }
    if (user?.contract == null) {
      setContract(false);
    } else {
        setContract(true);
      }
      if (user?.responsable_type == "himself" || user?.responsable_type == "pet") {
        setVisible(true);
      } else {
        setVisible(false);
      }

    if (user?.rg_proof && user?.proof_of_address && !user?.contract) {
      generateTermIfReady(user);
    }

    // Cleanup não precisa limpar o intervalo de monitoramento
    // Quando o status mudar para 4, a página redireciona automaticamente
  }, [user]); // ✅ Reagir às mudanças do usuário

  const handleFileAssociateChange = async event => {
    const file = event.target.files[0];
    if (!file) return;

    const ext = getExtension(file.name);
    if (!isAllowedExtension(ext)) {
      showFileError();
      return;
    }

    setIsLoading(true);
    try {
      const fileId = await uploadUserFile(file, buildFileName("doc-identidade", user, ext));
      await apiRequest("/api/directus/update", { userId: user.id, formData: { rg_proof: fileId } }, "POST");
      await apiRequest("/api/directus/update", { userId: user.id, formData: { status: "proofs" } }, "POST");
      setRgProof(true);

      const confirmedUser = await User();
      await generateTermIfReady(confirmedUser);
    } catch (error) {
      console.error("Erro ao enviar documento de identidade:", error);
      showDocError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleProofOfAddressChange = async event => {
    const file = event.target.files[0];
    if (!file) return;

    const ext = getExtension(file.name);
    if (!isAllowedExtension(ext)) {
      showFileError();
      return;
    }

    setIsLoadingAddress(true);
    try {
      const fileId = await uploadUserFile(file, buildFileName("comprovante-endereco", user, ext));
      await apiRequest("/api/directus/update", { userId: user.id, formData: { proof_of_address: fileId } }, "POST");

      const confirmedUser = await User();
      if (!confirmedUser?.proof_of_address) {
        throw new Error("Comprovante de endereço não confirmado pelo servidor");
      }

      setProof_of_address(true);
      await generateTermIfReady(confirmedUser);
    } catch (error) {
      console.error("Erro ao enviar comprovante de endereço:", error);
      showDocError();
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const hasPatient = user?.responsable_type === "another";
  const contractUrl = generateContract || user?.contract;
  const canSignTerm =
    rgProof && proof_of_address && (!hasPatient || rg_patient_proof) && !!contractUrl && !isGeneratingContract;

  const missingDocuments = [];
  if (!proof_of_address) missingDocuments.push("o comprovante de endereço");
  if (hasPatient && !rg_patient_proof) missingDocuments.push("o documento de identidade do paciente");

  const handleSignTermClick = (event) => {
    if (!canSignTerm) {
      event.preventDefault();
      return;
    }

    startStatusMonitoring();
  };

  const handlePatientFileChange = async event => {
    const file = event.target.files[0];
    if (!file) return;

    const ext = getExtension(file.name);
    if (!isAllowedExtension(ext)) {
      showFileError();
      return;
    }

    setIsLoadingC(true);
    try {
      const fileId = await uploadUserFile(file, buildFileName("doc-paciente", user, ext));
      await apiRequest("/api/directus/update", { userId: user.id, formData: { rg_patient_proof: fileId } }, "POST");
      setRg_patient_proof(true);
    } catch (error) {
      console.error("Erro ao enviar documento do paciente:", error);
      showDocError();
    } finally {
      setIsLoadingC(false);
    }
  };

  return (
    <div className="justify-content-center">
      <h1 style={{ paddingTop: "10px" }}>Envie seus Documentos</h1>
      <h2 style={{ textAlign: "center" }}>Clique nos botões para enviar uma foto do seu documento de identidade e do seu comprovante de endereço.</h2>
      <h2 style={{ textAlign: "center" }}>Você pode enviar a parte de trás do seu RG ou seu CNH, e um comprovante de endereço recente (conta de água, luz, telefone...).</h2>
      <h2 style={{ textAlign: "center" }}>O termo de responsabilidade será gerado após o envio dos dois documentos.</h2>
      <br></br>
      <div className="">
        {!rgProof && (
          <Form>
            <Form.Group controlId="formFile1">
              <Form.Label className="label-upload">
                {isLoading && (
                  <span className="loading-text">
                    <img className="animated-icon" width="40" src="/icons/data-cloud.gif" />
                    <span>Carregando documento...</span>
                    <img className="animated-icon" width="40" src="/icons/data-cloud.gif" />
                  </span>
                )}
                {!isLoading && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
                    <span style={{ fontSize: '18px' }}>📋</span>
                    Documento de identidade
                  </span>
                )}
              </Form.Label>
              <Form.Control className="input-upload" type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" onChange={handleFileAssociateChange} />
            </Form.Group>
          </Form>
        )}
        {rgProof && (
          <div className="document-send">
            <Form.Label className="label-upload send-ok">✅ Documento de identidade enviado</Form.Label>
          </div>
        )}

        {!proof_of_address && (
          <Form>
            <Form.Group controlId="formFileAddress">
              <Form.Label className="label-upload">
                {isLoadingAddress && (
                  <span className="loading-text">
                    <img className="animated-icon" width="40" src="/icons/data-cloud.gif" /> Carregando documento... <img className="animated-icon" width="40" src="/icons/data-cloud.gif" />
                  </span>
                )}
                {!isLoadingAddress && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
                    <span style={{ fontSize: '18px' }}>🏠</span>
                    Comprovante de endereço
                  </span>
                )}
              </Form.Label>
              <Form.Control className="input-upload" type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" onChange={handleProofOfAddressChange} />
            </Form.Group>
          </Form>
        )}
        {proof_of_address && (
          <div className="document-send">
            <Form.Label className="label-upload send-ok">✅ Comprovante de endereço enviado</Form.Label>
          </div>
        )}

        {!rg_patient_proof && (
          <Form hidden={visible}>
            <Form.Group controlId="formFile3">
              <Form.Label className="label-upload">
                {isLoadingC && (
                  <span className="loading-text">
                    <img className="animated-icon" width="40" src="/icons/data-cloud.gif" /> Carregando documento... <img className="animated-icon" width="40" src="/icons/data-cloud.gif" />
                  </span>
                )}
                {!isLoadingC && (
                  <span className="doc-patient" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
                    <span style={{ fontSize: '18px' }}>📋</span>
                    Documento de Identidade do paciente
                  </span>
                )}
              </Form.Label>
              <Form.Control className="input-upload" type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" onChange={handlePatientFileChange} />
            </Form.Group>
          </Form>
        )}

        {rg_patient_proof && (
          <div className="document-send">
            <Form.Label hidden={visible} className="label-upload send-ok">
            ✅ Documento de identidade enviado
            </Form.Label>
          </div>
        )}

        {rgProof && (
          <>
            {missingDocuments.length > 0 && (
              <p
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "16px",
                  marginTop: "10px",
                  marginBottom: "15px",
                  padding: "0 15px",
                }}
              >
                Envie {missingDocuments.join(" e ")} para poder assinar o termo e dar continuidade ao cadastro.
              </p>
            )}
            {missingDocuments.length === 0 && !contractUrl && !isGeneratingContract && (
              <p
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "16px",
                  marginTop: "10px",
                  marginBottom: "15px",
                  padding: "0 15px",
                }}
              >
                Não foi possível gerar o termo de responsabilidade. Recarregue a página para tentar novamente.
              </p>
            )}
            {isGeneratingContract ? (
              <span
                className="label-upload assign-term disabled"
                aria-disabled="true"
                style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", opacity: 0.7 }}
              >
                <span style={{ fontSize: "18px" }}>📄</span>
                Gerando termo para assinatura
              </span>
            ) : canSignTerm ? (
              <a
                className="label-upload assign-term"
                target="_blank"
                rel="noreferrer"
                href={contractUrl}
                onClick={handleSignTermClick}
                style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                <span style={{ fontSize: "18px" }}>✍️</span>
                Assinar Termo de Responsabilidade
              </a>
            ) : (
              <span
                className="label-upload assign-term disabled"
                aria-disabled="true"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "center",
                  opacity: 0.7,
                  cursor: "not-allowed",
                }}
              >
                <span style={{ fontSize: "18px" }}>✍️</span>
                Assinar Termo de Responsabilidade
              </span>
            )}
          </>
        )}

        <br></br>
        {import.meta.env.VITE_ASSOCIATION_NAME =="Sou Cannabis" && (
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <a target="_blank" style={{textDecoration:'none', color:'#fff'}} href={`https://enviararquivos.soucannabis.ong.br?u=${user.user_code}`}>
            Algum problema em enviar seus documentos?<br></br> <strong>Clique aqui</strong>
          </a>
        </div>
        )}
        <br></br>
        {isMonitoringStatus && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              🔄 Após assinatura do Termo de responsabilidade, está página será atualizada automaticamente.
            </p>
          </div>
        )}
        <br></br>
   
        <br></br>
        <br></br>
        <br></br>
      </div>
      {docError && (
        <div className="alert1">
          <AlertError message="Erro ao enviar o arquivo, recarregue a página e tente novamente." />
        </div>
      )}
      {fileError && (
        <div className="alert1">
          <AlertError message="Formato do documento inválido, formatos aceitos (JPG, PNG, GIF e PDF)" />
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
