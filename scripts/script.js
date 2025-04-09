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

// Função para validar se os campos do formulário estão preenchidos
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
    event.target.submit();
  } 
});

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

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarIdade(idade) {
  return idade >= 18 && idade <= 120;
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0, resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

function salvarInformacoes() {
  const email = document.getElementById("email").value;
  const idade = parseInt(document.getElementById("idade").value);
  const cpf = document.getElementById("cpf").value;
  const id = document.getElementById("id").value;
  const senha = document.getElementById("senha").value;

  if (!validarEmail(email)) {
    alert("E-mail inválido!");
    return;
  }

  if (!validarIdade(idade)) {
    alert("Idade deve ser entre 18 e 120 anos.");
    return;
  }

  if (!validarCPF(cpf)) {
    alert("CPF inválido!");
    return;
  }

  if (!id || !senha) {
    alert("Preencha ID e senha.");
    return;
  }

  alert("Informações salvas com sucesso!");
}
