import { useRef, useState } from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";
import { api } from './api';
import logoImage from './assets/logo.png'
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [modelData, setModelData] = useState({});
  const [nameFolder, setNameFolder] = useState('');
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [inputValues, setInputValues] = useState({}); // Estado para armazenar valores dos inputs
  const [requestTitle, setRequestTitle] = useState(null)

  const modalRequestsRef = useRef(null);
  const completeRequestRef = useRef(null);
  const newRequestRef = useRef(null);

  const sendRequest = async () => {
    try {
      // Envia os inputValues para o servidor via POST
      const response = await api.post(`/${nameFolder}/new-request.php`, inputValues);
      closeNewRequest(); // Fecha o modal após o envio
      setInputValues({})
      window.location.reload();
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  const handleChangeInput = (e, titleInput) => {
    const { value } = e.target;
    setInputValues(prevValues => ({
      ...prevValues,
      [titleInput]: value
    }));
  };

  const closeNewRequest = () => {
    newRequestRef.current.style.display = 'none';
  };

  const handleNewRequest = async () => {
    const response = await api.get(`/${nameFolder}/view-model.php`);
    setModelData(response.data[0].model);
    newRequestRef.current.style.display = 'flex';
  };

  const openModalRequest = async (requestQuery) => {
    const response = await api.get(`/${requestQuery}/index.php`);
    setNameFolder(requestQuery);
    setData(response.data);
    modalRequestsRef.current.style.display = 'flex';
  };

  const openCompleteRequest = (request) => {
    setSelectedRequest(request);
    completeRequestRef.current.style.display = 'flex';
  };

  const closeModalRequests = () => {
    modalRequestsRef.current.style.display = 'none';
  };

  const closeCompleteRequest = () => {
    completeRequestRef.current.style.display = 'none';
  };

  return (
    <div className='App'>
      <div className='modal' ref={modalRequestsRef}>
        <div className='sub-collections'>
          <i className="bi bi-x-lg" onClick={closeModalRequests}></i>
          <span className='nova-solicitacao' onClick={handleNewRequest}>NOVA SOLICITAÇÃO</span>
          {data.map((r) =>
            <div
              className='latest-request'
              key={r.id}
              onClick={() => openCompleteRequest(r)}
            >
              <span>{r.nome} </span>
              <i className="bi bi-file-earmark-x"></i>
            </div>
          )}
        </div>
      </div>

      <div className='new-request' ref={newRequestRef}>
        <div className='model-request-form'>
          <i className="bi bi-x-lg" onClick={closeNewRequest}></i>
          <div className='all-models'>
            {Object.keys(modelData).map(key => (
              <div className='models-frame' key={key}>
                <input
                  type="text"
                  placeholder={modelData[key].toUpperCase()}
                  onChange={(e) => handleChangeInput(e, modelData[key])}
                />
              </div>
            ))}
            <button
              className='btn-submit'
              onClick={() => sendRequest(inputValues)} // Aqui você pode processar ou enviar os dados
            >
              ENVIAR
            </button>
          </div>
        </div>
      </div>

      <div className='modal2' ref={completeRequestRef}>
        {selectedRequest && (
          <div className='complete-request'>
            <i className="bi bi-x-lg" onClick={closeCompleteRequest}></i>
            <h2>{selectedRequest.nome}</h2>
            <div className='items-list'>
              {Object.entries(selectedRequest).map(([key, value]) => (
                key !== 'nome' && (
                  <div className='item' key={key}>
                    <span className='item-name'><b>{key}: </b></span>
                    <span className='item-value'>{value}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='collections'>
        <img className='logo' src={logoImage} alt="" />
        <div className='element' onClick={() => openModalRequest('molhos')}>MOLHOS & ADICIONAIS</div>
        <div className='element' onClick={() => openModalRequest('comidas')}>COMIDAS</div>
        <div className='element' onClick={() => openModalRequest('bebidas-geladas')}>BEBIDAS GELADAS</div>
        <div className='element' onClick={() => openModalRequest('bebidas-quentes')}>BEBIDAS QUENTES & CHÁS</div>
        <div className='element' onClick={() => openModalRequest('embalagens')}>EMBALAGENS</div>
        <div className='element' onClick={() => openModalRequest('limpeza')}>PRODUTOS DE LIMPEZA</div>
        <div className='element' onClick={() => openModalRequest('outros')}>OUTROS</div>
        <div className='element' onClick={() => openModalRequest('toclient')}>PARA O CLIENTE</div>
        <div className='element' onClick={() => openModalRequest('alcolinas')}>ALCOLINAS</div>
      </div>
    </div>
  );
}

export default App;
