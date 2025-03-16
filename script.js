let radioButtons = document.querySelectorAll('input[type="radio"]');

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


// function requiredOff(){
//   const inputs = document.querySelectorAll("#cadastro input")
  
//   inputs.forEach((input) => {
//     input.removeAttribute("required");
//   });

//   console.log("Atributo required removido")
// };