let radioButtons = document.querySelectorAll('input[type="radio"]');
let formulario = document.getElementById('cadastro');

//Área responsável por formatar os campos automaticamente
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
}

// Área responsável por alterar o estilo das trilhas quando forem clicadas
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

// Área responsável por validar se os campos do formulário estão preenchidos
formulario.addEventListener('submit', (event) => {
  // Impede o envio do formulário
  event.preventDefault();

  // Seleciona todos os campos do formulário
  const campos = document.querySelectorAll(".validate");
  let contCampos = 0
  
  for(let i = 0; i < campos.length; i++){
    
    if(!campos[i].value){ //se o campo não estiver preenchido
      mensagemDeErro(campos[i].id);

      // Adiciona o foco no primeiro campo que não foi preenchido
      contCampos == 0 ? campos[i].focus(): null; 
      contCampos++
    } 
    else {
      //limpar mensagem de erro do que já foi preenchido depois da primeira tentativa
      document.getElementById(campos[i].id).classList.remove('error');
      document.querySelector(`p[for="${campos[i].id}"]`).style.display = 'none';
    };
  };

  if (contCampos == 0 ){
    event.target.submit()
  } 

});

// Adiciona a classe error ao campo e adivando a mensagem de erro
function mensagemDeErro(value) {
  let input = document.getElementById(value).type;
  // Verifica se o campo é um input do tipo file
  if (input != "file" || input != "radio") {
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

