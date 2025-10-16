let salario = parseFloat(localStorage.getItem("salario")) || 0;
let gastosVariaveis = JSON.parse(localStorage.getItem("gastosVariaveis")) || [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];
let gastosFixos = JSON.parse(localStorage.getItem("gastosFixos")) || [
  { nome: "BB", valor: 0, logo: "https://logopng.com.br/logos/banco-do-brasil-5.png" },
  { nome: "Nubank", valor: 0, logo: "https://logodownload.org/wp-content/uploads/2019/08/nubank-logo-2.png" },
  { nome: "Banco Pan", valor: 0, logo: "https://melhorinvestimento.net/wp-content/uploads/2024/11/banco-pan-bpan4-768x768.jpg" },
  { nome: "Mercado Pago", valor: 0, logo: "https://images.seeklogo.com/logo-png/34/1/mercado-pago-logo-png_seeklogo-342347.png" },
  { nome: "Shopee Parcelado", valor: 0, logo: "https://static.cdnlogo.com/logos/s/2/shopee.png" }
];

const salarioInput = document.getElementById("salarioInput");
const listaFixos = document.getElementById("listaFixos");
const listaVariaveis = document.getElementById("listaVariaveis");
const descVariavel = document.getElementById("descVariavel");
const valorVariavel = document.getElementById("valorVariavel");
const addVariavelBtn = document.getElementById("addVariavel");
const totalFixosEl = document.getElementById("totalFixos");
const totalVariaveisEl = document.getElementById("totalVariaveis");
const saldoAtualEl = document.getElementById("saldoAtual");
const salvarMesBtn = document.getElementById("salvarMes");
const listaHistorico = document.getElementById("listaHistorico");
const metaEconomia = document.getElementById("metaEconomia");
const statusMeta = document.getElementById("statusMeta");
const graficoGastosCanvas = document.getElementById("graficoGastos");
const graficoEvolucaoCanvas = document.getElementById("graficoEvolucao");

function alternarCadastro() {
  const nomeCadastroGroup = document.getElementById("nomeCadastroGroup");
  const fotoPerfilGroup = document.getElementById("fotoPerfilGroup");
  const titulo = document.getElementById("loginTitle");
  const authButton = document.getElementById('authButton');
  const loginMsg = document.getElementById("loginMsg");
  const links = document.querySelector('.login-links a');

  loginMsg.textContent = "";

  const modoCadastroAtivo = nomeCadastroGroup.style.display === "block";

  if (!modoCadastroAtivo) {
    nomeCadastroGroup.style.display = "block";
    fotoPerfilGroup.style.display = "block";
    titulo.textContent = "CADASTRO";
    authButton.textContent = "CADASTRAR";
    authButton.setAttribute('onclick', 'cadastrar()');
    links.textContent = "Já tem uma conta? Faça login";

  } else {
    nomeCadastroGroup.style.display = "none";
    fotoPerfilGroup.style.display = "none";
    titulo.textContent = "LOGIN";
    authButton.textContent = "LOGIN";
    authButton.setAttribute('onclick', 'login()');
    links.textContent = "Não tem conta? Crie uma";
  }
}

function cadastrar() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const nome = document.getElementById("nomeCadastro").value;
  const foto = document.getElementById("fotoPerfil").files[0];
  const loginMsg = document.getElementById("loginMsg");

  if (!email || !senha || !nome) {
    loginMsg.textContent = "Preencha todos os campos de cadastro!";
    return;
  }

  const finalizarCadastro = (fotoBase64 = "") => {
    const usuario = { email, senha, nome, foto: fotoBase64 };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    loginMsg.textContent = "Cadastro realizado! Faça login agora.";
    setTimeout(() => { alternarCadastro(); }, 1500);
  };

  if (foto) {
    const reader = new FileReader();
    reader.onload = function (e) {
      finalizarCadastro(e.target.result);
    };
    reader.readAsDataURL(foto);
  } else {
    finalizarCadastro();
  }
}

function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const loginMsg = document.getElementById("loginMsg");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || usuario.email !== email || usuario.senha !== senha) {
    loginMsg.textContent = "E-mail ou senha incorretos.";
    return;
  }

  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("nomeUsuario").textContent = usuario.nome;
  document.getElementById("userEmail").textContent = usuario.email;
  document.getElementById("fotoUsuario").src = usuario.foto || "https://cdn-icons-png.flaticon.com/512/1077/1077012.png";
  
  carregarTema();
  renderTudo();
}

function logout() {
  document.getElementById("app").style.display = "none";
  document.getElementById("loginContainer").style.display = "flex";
}

function salvarDados() {
  localStorage.setItem("salario", salario);
  localStorage.setItem("gastosFixos", JSON.stringify(gastosFixos));
  localStorage.setItem("gastosVariaveis", JSON.stringify(gastosVariaveis));
  localStorage.setItem("historico", JSON.stringify(historico));
}

function renderFixos() {
  listaFixos.innerHTML = "";
  gastosFixos.forEach((gasto, i) => {
    const div = document.createElement("div");
    div.classList.add("gasto-card");
    div.innerHTML = `
      <img src="${gasto.logo}" alt="${gasto.nome}">
      <span>${gasto.nome}</span>
      <input type="number" value="${gasto.valor}" id="fixo-${i}">
    `;
    listaFixos.appendChild(div);
    document.getElementById(`fixo-${i}`).addEventListener("input", () => {
      gasto.valor = parseFloat(document.getElementById(`fixo-${i}`).value) || 0;
      atualizarResumo();
    });
  });
}

function renderVariaveis() {
  listaVariaveis.innerHTML = "";
  gastosVariaveis.forEach((gasto, i) => {
    const div = document.createElement("div");
    div.classList.add("gasto-variavel-card");
    div.innerHTML = `
      <span>${gasto.desc}</span>
      <span>R$ ${gasto.valor.toFixed(2)}</span>
      <button class="excluir" onclick="excluirVariavel(${i})">X</button>
    `;
    listaVariaveis.appendChild(div);
  });
}

function renderHistorico() {
  listaHistorico.innerHTML = "";
  historico.forEach((mes, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${mes.mesAno}</span>
      <div>
        <button onclick="carregarMes(${i})">Carregar</button>
        <button class="excluir" onclick="excluirMes(${i})">Excluir</button>
      </div>`;
    listaHistorico.appendChild(li);
  });
}

function atualizarResumo() {
  const totalFixos = gastosFixos.reduce((acc, g) => acc + g.valor, 0);
  const totalVariaveisTotal = gastosVariaveis.reduce((acc, g) => acc + g.valor, 0);
  const saldo = salario - totalFixos - totalVariaveisTotal;

  totalFixosEl.textContent = `R$ ${totalFixos.toFixed(2)}`;
  totalVariaveisEl.textContent = `R$ ${totalVariaveisTotal.toFixed(2)}`;
  saldoAtualEl.textContent = `R$ ${saldo.toFixed(2)}`;
  saldoAtualEl.classList.toggle("positivo", saldo >= 0);
  saldoAtualEl.classList.toggle("negativo", saldo < 0);

  if (metaEconomia.value) {
    const meta = parseFloat(metaEconomia.value);
    statusMeta.textContent = saldo >= meta ? "🎯 Meta atingida!" : "💸 Meta não alcançada.";
  }

  gerarGraficos(totalFixos, totalVariaveisTotal);
}

document.getElementById("addVariavel").addEventListener("click", () => {
  const desc = descVariavel.value.trim();
  const valor = parseFloat(valorVariavel.value);
  if (!desc || !valor || valor <= 0) return;
  gastosVariaveis.push({ desc, valor });
  descVariavel.value = "";
  valorVariavel.value = "";
  renderVariaveis();
  atualizarResumo();
  salvarDados();
});

function excluirVariavel(i) {
  gastosVariaveis.splice(i, 1);
  renderVariaveis();
  atualizarResumo();
  salvarDados();
}

document.getElementById("addFixo").addEventListener("click", () => {
  const nome = document.getElementById("nomeFixo").value.trim();
  const valor = parseFloat(document.getElementById("valorFixo").value);
  const logo = document.getElementById("logoFixo").value.trim();
  if (!nome || !valor) return;
  gastosFixos.push({ nome, valor, logo: logo || "https://cdn-icons-png.flaticon.com/512/2331/2331941.png" });
  document.getElementById("nomeFixo").value = "";
  document.getElementById("valorFixo").value = "";
  document.getElementById("logoFixo").value = "";
  renderFixos();
  atualizarResumo();
  salvarDados();
});

salvarMesBtn.addEventListener("click", () => {
  const data = new Date();
  const mesAno = `${data.toLocaleString("pt-BR", { month: "long" })} ${data.getFullYear()}`;
  historico.push({
    mesAno,
    salario,
    gastosFixos,
    gastosVariaveis,
  });
  salvarDados();
  renderHistorico();
});

function carregarMes(i) {
  const mes = historico[i];
  salario = mes.salario;
  gastosFixos = mes.gastosFixos;
  gastosVariaveis = mes.gastosVariaveis;
  salarioInput.value = salario;
  renderTudo();
  salvarDados();
}

function excluirMes(i) {
  historico.splice(i, 1);
  salvarDados();
  renderHistorico();
}

let grafico1, grafico2;

function gerarGraficos(fixos, variaveis) {
  if (grafico1) grafico1.destroy();
  if (grafico2) grafico2.destroy();

  grafico1 = new Chart(graficoGastosCanvas, {
    type: "doughnut",
    data: {
      labels: ["Fixos", "Variáveis"],
      datasets: [{
        data: [fixos, variaveis],
        backgroundColor: ["#2563eb", "#16a34a"]
      }]
    },
    options: { plugins: { legend: { labels: { color: getComputedStyle(document.body).color } } } }
  });
}

const darkToggle = document.getElementById("darkModeToggle");

function carregarTema() {
  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "light") {
    document.body.classList.add("light");
    darkToggle.checked = false;
  } else {
    document.body.classList.remove("light");
    darkToggle.checked = true;
  }
}

darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    document.body.classList.remove("light");
    localStorage.setItem("tema", "dark");
  } else {
    document.body.classList.add("light");
    localStorage.setItem("tema", "light");
  }
});

function renderTudo() {
  renderFixos();
  renderVariaveis();
  renderHistorico();
  atualizarResumo();
}

salarioInput.value = salario;
salarioInput.addEventListener("input", () => {
  salario = parseFloat(salarioInput.value) || 0;
  atualizarResumo();
  salvarDados();
});

function abrirResetSenha() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("resetContainer").style.display = "flex";
}

function fecharResetSenha() {
  document.getElementById("resetContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "flex";
}

function verificarEmail() {
  const email = document.getElementById("resetEmail").value;
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const msg = document.getElementById("resetMsg");

  if (!usuario || usuario.email !== email) {
    msg.textContent = "E-mail não encontrado!";
    return;
  }

  msg.textContent = "E-mail confirmado. Digite sua nova senha.";
  document.getElementById("novaSenha").style.display = "block";
  document.getElementById("salvarNovaSenhaBtn").style.display = "block";
  document.getElementById("verificarEmailBtn").style.display = "none";
}

function salvarNovaSenha() {
  const novaSenha = document.getElementById("novaSenha").value;
  const email = document.getElementById("resetEmail").value;
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const msg = document.getElementById("resetMsg");

  if (!novaSenha) {
    msg.textContent = "Digite a nova senha!";
    return;
  }

  if (usuario && usuario.email === email) {
    usuario.senha = novaSenha;
    localStorage.setItem("usuario", JSON.stringify(usuario));
    msg.textContent = "Senha alterada com sucesso! Volte e faça login.";
    setTimeout(() => fecharResetSenha(), 1500);
  }
}

function abrirModalPerfil() {
  const modal = document.getElementById("profileModal");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) return; 

  document.getElementById("nomeUsuarioModal").value = usuario.nome;
  document.getElementById("emailUsuarioModal").value = usuario.email;
  
  document.getElementById("senhaAtualModal").value = "";
  document.getElementById("novaSenhaModal").value = "";
  document.getElementById("profileMsg").textContent = "";

  modal.style.display = "flex"; 
}

function fecharModalPerfil() {
  const modal = document.getElementById("profileModal");
  modal.style.display = "none";
}
function salvarPerfil() {
  const profileMsg = document.getElementById("profileMsg");
  let usuario = JSON.parse(localStorage.getItem("usuario"));

  const nome = document.getElementById("nomeUsuarioModal").value.trim();
  const email = document.getElementById("emailUsuarioModal").value.trim();
  const senhaAtual = document.getElementById("senhaAtualModal").value;
  const novaSenha = document.getElementById("novaSenhaModal").value;
  const novaFotoFile = document.getElementById("fotoPerfilModal").files[0];

  if (!nome || !email || !senhaAtual) {
    profileMsg.textContent = "Nome, e-mail e senha atual são obrigatórios!";
    profileMsg.style.color = "#f44336";
    return;
  }
  if (senhaAtual !== usuario.senha) {
    profileMsg.textContent = "Senha atual incorreta!";
    profileMsg.style.color = "#f44336";
    return;
  }

  usuario.nome = nome;
  usuario.email = email;
  if (novaSenha) {
    usuario.senha = novaSenha;
  }

  const atualizarTudo = (usuarioAtualizado) => {
    localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

    document.getElementById("nomeUsuario").textContent = usuarioAtualizado.nome;
    document.getElementById("userEmail").textContent = usuarioAtualizado.email;
    document.getElementById("fotoUsuario").src = usuarioAtualizado.foto || "https://cdn-icons-png.flaticon.com/512/1077/1077012.png";

    profileMsg.textContent = "Perfil atualizado com sucesso!";
    profileMsg.style.color = "#4CAF50";
    setTimeout(fecharModalPerfil, 1500);
  };

  if (novaFotoFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      usuario.foto = e.target.result;
      atualizarTudo(usuario);
    };
    reader.readAsDataURL(novaFotoFile);
  } else {
    atualizarTudo(usuario);
  }
}
window.onclick = function(event) {
  const modal = document.getElementById("profileModal");
  if (event.target == modal) {
    fecharModalPerfil();
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const saveButton = document.getElementById('saveProfileBtn');
    if (saveButton) {
        saveButton.addEventListener('click', function(event) {
            event.preventDefault();
            salvarPerfil();
        });
    }
});

function resizeImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality)); 
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}


async function salvarPerfil() {
    const profileMsg = document.getElementById("profileMsg");
    profileMsg.textContent = "";

    const nome = document.getElementById("nomeUsuarioModal").value.trim();
    const email = document.getElementById("emailUsuarioModal").value.trim();
    const senhaAtual = document.getElementById("senhaAtualModal").value;
    const novaSenha = document.getElementById("novaSenhaModal").value;
    const novaFotoFile = document.getElementById("fotoPerfilModal").files[0];

    if (!nome || !email || !senhaAtual) {
        profileMsg.textContent = "Nome, e-mail e senha atual são obrigatórios!";
        profileMsg.style.color = "#f44336";
        return;
    }

    let usuario = JSON.parse(localStorage.getItem("usuario"));
    if (senhaAtual !== usuario.senha) {
        profileMsg.textContent = "Senha atual incorreta!";
        profileMsg.style.color = "#f44336";
        return;
    }

    usuario.nome = nome;
    usuario.email = email;
    if (novaSenha) {
        usuario.senha = novaSenha;
    }

    const atualizarTudo = (usuarioAtualizado) => {
        try {
            localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
            document.getElementById("nomeUsuario").textContent = usuarioAtualizado.nome;
            document.getElementById("userEmail").textContent = usuarioAtualizado.email;
            document.getElementById("fotoUsuario").src = usuarioAtualizado.foto || "https://cdn-icons-png.flaticon.com/512/1077/1077012.png";

            profileMsg.textContent = "Perfil atualizado com sucesso!";
            profileMsg.style.color = "#4CAF50";
            setTimeout(fecharModalPerfil, 1500);
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                 profileMsg.textContent = "Erro: A imagem ainda é muito grande, mesmo após a otimização.";
                 profileMsg.style.color = "#f44336";
            }
        }
    };

    if (novaFotoFile) {
        try {
            const resizedImageData = await resizeImage(novaFotoFile, 400, 400, 0.8);
            usuario.foto = resizedImageData;
            atualizarTudo(usuario);
        } catch (error) {
            profileMsg.textContent = "Erro ao processar a imagem.";
            profileMsg.style.color = "#f44336";
        }
    } else {
        atualizarTudo(usuario);
    }
}