let radioButtons = document.querySelectorAll('input[type="radio"]');
let formulario = document.getElementById('cadastro');

// Função para formatar os campos automaticamente
function formatarCPF() {
  const input = document.getElementById("cpfNumber");
  const valor = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  input.value = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarData() {
  const input = document.getElementById("nascimento");
  const valor = input.value.replace(/\D/g, "");
  input.value = valor.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
}

function formatarPhone() {
  const input = document.getElementById("phone");
  const valor = input.value.replace(/\D/g, "");
  input.value = valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

function formatarCEP() {
  const input = document.getElementById("cepNumber");
  const valor = input.value.replace(/\D/g, "");
  input.value = valor.replace(/(\d{5})(\d{3})/, "$1-$2");
  disableCampo('city', true);
  disableCampo('uf', true);
}

// Função para alterar o estilo das trilhas ao serem clicadas
radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    // Restaura o estilo de todos os labels
    radioButtons.forEach((r) => {
      let label = r.closest("#trilhas");
      label.style.borderColor = "";
      label.style.backgroundColor = "";
    });

    // Altera o estilo do label do botão selecionado
    if (radio.checked) {
      let label = radio.closest("#trilhas");
      label.style.borderColor = "#f3541c";
      label.style.backgroundColor = "#ffffff";
    }
  });
});

// Autocompletar com base no CEP usando a API ViaCEP - https://viacep.com.br
function pesquisacep(valor) {
  // Nova variável "cep" somente com dígitos.
  var cep = valor.replace(/\D/g, '').replace('-', '');

  // Verifica se campo cep possui valor informado.
  if (cep != "") {
    resetMensagemDeErro("cepNumber");
    document.querySelector(`p[for="cepNumber"]`).style.display = 'none';

    
    // Expressão regular para validar o CEP.
    var validacep = /^[0-9]{8}$/;

    // Valida o formato do CEP.
    if (validacep.test(cep)) {
      // Preenche os campos com "..." enquanto consulta webservice.
      document.getElementById('city').value = "...";
      document.getElementById('uf').value = "...";

      // Cria um elemento javascript.
      var script = document.createElement('script');

      // Sincroniza com o callback.
      script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=callback';

      // Insere script no documento e carrega o conteúdo.
      document.body.appendChild(script);
    } else {
      // cep é inválido.
      mensagemDeErro("cepNumber");
    }
  } else {
    mensagemDeErro("cepNumber");
    disableCampo('city', true);
    disableCampo('uf', true);
  }
}

function callback(conteudo) {
  if (!("erro" in conteudo)) {
    // Atualiza os campos com os valores.
    document.getElementById('city').value = (conteudo.localidade);
    document.getElementById('uf').value = (conteudo.uf);
  } else {
    // CEP não Encontrado.
    mensagemDeErro("cepNumber");
  }
  disableCampo('city');
  disableCampo('uf');
}

function disableCampo(id, value) {
  let campo = document.getElementById(id);

  if (!value) {
    campo.disabled = true;
    campo.classList.add('campo-disable');
  } else {
    campo.disabled = false;
    campo.classList.remove('campo-disable');
  }
}

// Funções de validação de campos
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) {
    mensagemDeErro("email");
    document.querySelector(`p[for="email"]`).textContent = "Insira um e-mail válido!";
    
  } else {
    resetMensagemDeErro("email");
    document.querySelector(`p[for="email"]`).style.display = 'none';
    document.querySelector(`p[for="email"]`).textContent = "Campo obrigatório!";
  }
}

function validarIdade(data) {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();

  // Divide a data no formato dd/mm/aaaa
  const partes = data.split("/");
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);
  const ano = parseInt(partes[2], 10);

  console.log(dia, mes, ano);

  // Verifica e exibir mensegems de erro
  if ((dia >= 1 && dia <= 31) && (mes >= 1 && mes <= 12) && (ano <= anoAtual && ano >= (anoAtual - 100))) {
    resetMensagemDeErro("nascimento");
    document.querySelector(`p[for="nascimento"]`).style.display = 'none';
    document.querySelector(`p[for="nascimento"]`).textContent = "Campo obrigatório!";
  } else {
    mensagemDeErro("nascimento");
    document.querySelector(`p[for="nascimento"]`).textContent = "Insira uma data válida!";
  }
}

function validarCPF(cpfValue) {
  var valid = true;
  cpfValue = cpfValue.replace(/[^\d]+/g, '');
  if (cpfValue.length !== 11 || /^(\d)\1+$/.test(cpfValue)) valid = true;

  console.log(cpfValue);
  
  let soma = 0, resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpfValue.charAt(i - 1)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfValue.charAt(9))) valid = false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpfValue.charAt(i - 1)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfValue.charAt(10))) valid = false;

  if (!valid) {
    mensagemDeErro("cpfNumber");
    document.querySelector(`p[for="cpfNumber"]`).textContent = "Insira um CPF válido!";
  } else{
    resetMensagemDeErro("cpfNumber");
    document.querySelector(`p[for="cpfNumber"]`).style.display = 'none';
    document.querySelector(`p[for="cpfNumber"]`).textContent = "Campo obrigatório!";
  }
}


// Função para validar se os campos do formulário estão preenchidos
if (window.location.pathname === '/index.html') { //Para evitar conflitos entre as paginas que está em bundle única
  formulario.addEventListener('submit', (event) => {

    // Impede o envio do formulário
    event.preventDefault();

    // Seleciona todos os campos do formulário
    const campos = document.querySelectorAll(".validate");
    let contCampos = 0;
    
    for (let i = 0; i < campos.length; i++) {
      if (!campos[i].value) { // se o campo não estiver preenchido
        mensagemDeErro(campos[i].id);

        // Adiciona o foco no primeiro campo que não foi preenchido
        contCampos == 0 ? campos[i].focus() : null; 
        contCampos++;
      } else {
        // limpar mensagem de erro do que já foi preenchido depois da primeira tentativa
        document.getElementById(campos[i].id).classList.remove('error');
        document.querySelector(`p[for="${campos[i].id}"]`).style.display = 'none';
      }
    }

    if (contCampos == 0) {
      // Se todos os campos estiverem preenchidos, envia o formulário
      showModal();
    } 
  })
};

// Adiciona a classe error ao campo e avisa a mensagem de erro
function mensagemDeErro(value) {
  let input = document.getElementById(value).type;
  // Verifica se o campo é um input do tipo file
  if (input != "file" && input != "radio") {
    document.getElementById(value).classList.add('error');
    document.querySelector(`p[for="${value}"]`).style.display = 'flex';
  } else {
    document.querySelector(`p[for="${value}"]`).style.display = 'flex';
  }
}

// Função para resetar a mensagem de erro
function resetMensagemDeErro(value) {
  document.getElementById(value).classList.remove('error');
}

// Adiciona event listeners para resetar a mensagem de erro ao clicar nos inputs
const campos = document.querySelectorAll(".validate");
campos.forEach((campo) => {
  campo.addEventListener('focus', () => resetMensagemDeErro(campo.id));
});

// Funções para salva as informações do formulário

// Função para salvar os dados no LocalStorage
function salvarInformacoes() {
  const nome = document.getElementById("nome").value;
  const nascimento = document.getElementById("nascimento").value;
  const cpfNumber= document.getElementById("cpfNumber").value;
  const sexo = document.getElementById("sexo").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const cepNumber = document.getElementById("cepNumber").value;
  const rua = document.getElementById("rua").value;
  const numero = document.getElementById("numero").value;
  const city = document.getElementById("city").value;
  const uf = document.getElementById("uf").value;

  const campos = {
    nome, nascimento, cpfNumber, sexo, email, phone, 
    cepNumber, rua, numero, city, uf
  };

  Object.keys(campos).forEach(campo => {
    localStorage.setItem(campo, campos[campo]);
  });

  alert("Informações salvas com sucesso!");
}

// Função para carregar os dados salvos
function carregarDados() {
  const campos = [
    "nome", "nascimento", "cpfNumber", "sexo",
    "email", "phone", "cepNumber", "rua", 
    "numero", "city", "uf"
  ];

  campos.forEach(campo => {
    const valor = localStorage.getItem(campo);
    if (valor) {
      document.getElementById(campo).value = valor;
    }
  });
}

function limparDados() {
  const campos = [
    "nome", "nascimento", "cpfNumber", "sexo",
    "email", "phone", "cepNumber", "rua", 
    "numero", "city", "uf"
  ];

  campos.forEach(campo => {
    document.getElementById(campo).value = "";
    localStorage.removeItem(campo);
  });

}

function cancelar(){
  limparDados();
  window.location.href = "index.html";
}

//Função mensagem de incrição concluida e popup para criação de credenciais
function showModal() {
  document.getElementById("modal").style.display = "block";
  document.getElementById('overlay').style.display = "block";
  document.body.style.overflow = 'hidden';
}

//Salvar credenciais 
function salvarCredenciais() {
  const id = document.getElementById('new-userId').value;
  const senha = document.getElementById('new-senha').value;

  console.log(id, senha);

  // Verifica se os campos estão preenchidos
  if (id && senha) {
    // Salva as credenciais no localStorage
    localStorage.setItem(id, senha);
    alert("Credenciais salvas com sucesso!");
    window.location.href = 'home.html';

  } else {
    alert("Por favor, preencha todos os campos.");
  }
}


//Realizar login - pagina home 

function login() {
  const id = document.getElementById('userId').value;
  const senha = document.getElementById('senha').value;

  // Verifica se os campos estão preenchidos
  if (id && senha) {
    // Verifica se as credenciais estão armazenadas no localStorage
    if (localStorage.getItem(id) === senha) {
      alert("Login realizado com sucesso!");
    }
    else {
      alert("Credenciais inválidas. Tente novamente.");
    }
  }
  else {
    alert("Por favor, preencha todos os campos.");
  }
}
