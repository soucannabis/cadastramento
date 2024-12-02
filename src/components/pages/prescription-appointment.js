import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import User from "../../modules/User";
import directusRequestUpload from "../../modules/directusRequestUpload";
import apiRequest from "../../modules/apiRequest";

function Prescription() {
  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();
  }, []);

  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);

  if (user.associate_status == 6) {
    window.location.assign("/cadastro");
  }

  const handleFileChange = async event => {
    setFile(event.target.files[0]);

    const userFolder = localStorage.getItem("user_folder");

    const file = event.target.files[0];

    
    file.filename_download = file.name;

    var formData = new FormData();
    formData.append("folder", userFolder);
    formData.append("file", file);

    var fileId = "";

    await directusRequestUpload("/files", formData, "POST", { "Content-Type": "multipart/form-data" })
      .then(response => {
        fileId = response.id;
        return fileId;
      })
      .catch(error => {
        console.error(error);
      });

    const bodyRequest = { medical_prescription: fileId };
    await apiRequest("/api/directus/update", { userId: user.id, formData: bodyRequest }, "POST");
    await apiRequest("/api/directus/update", { userId: user.id, formData: { associate_status: 6 } }, "POST")
      .then(response => {})
      .catch(error => {
        console.error(error);
      });

    window.location.assign("/cadastro");
  };

  return (
    <div className="form-container">
      <h1 className="title">Sua consulta foi agendada com sucesso! </h1>
      <h1 className="sub-title">Após realizar a consulta com o médico, ele enviará o arquivo da sua receita médica, para dar andamento em seu cadastro, envie o arquivo pelo botão abaixo: </h1>
      <br></br>
      <br></br>
      <Form>
        <Form.Group controlId="formFile1">
          <Form.Label className="label-upload">Enviar receita Médica</Form.Label>
          <Form.Control className="input-upload" type="file" onChange={handleFileChange} />
        </Form.Group>
      </Form>
    </div>
  );
}

export default Prescription;
