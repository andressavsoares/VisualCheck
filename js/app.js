function hexParaRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }
  
  function luminancia([r, g, b]) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  
  function calcularContraste(hex1, hex2) {
    const l1 = luminancia(hexParaRgb(hex1));
    const l2 = luminancia(hexParaRgb(hex2));
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  
  function atualizarBotaoSimulador() {
    const cor1 = document.querySelector('[data-id="1"] .input').value || '#000000';
    const cor2 = document.querySelector('[data-id="2"] .input').value || '#ffffff';
    const btn = document.getElementById('btnSimulador');
    const avaliacaoTexto = document.getElementById('avaliacaoTexto');
  
    btn.style.backgroundColor = cor1;
    btn.style.color = cor2;
  
    const contraste = calcularContraste(cor1, cor2);
    const nota = Math.min(10, Math.round(contraste * 2));
  
    let descricao = '';
    if (contraste < 3) {
      descricao = 'Ruim ❌ – contraste baixo';
    } else if (contraste < 4.5) {
      descricao = 'Média ⚠️ – pode ser difícil de ler';
    } else {
      descricao = 'Boa ✅ – atende acessibilidade';
    }
  
    btn.innerText = `Exemplo (Nota: ${nota}/10)`;
    avaliacaoTexto.innerText = descricao;
  }
  
  // Inicializa os campos e botões
  document.querySelectorAll('.color-selector').forEach((selector) => {
    const picker = selector.querySelector('.picker');
    const input = selector.querySelector('.input');
    const botaoCopiar = selector.querySelector('.copiar');
  
    input.addEventListener('input', () => {
      if (/^#([0-9A-F]{3}){1,2}$/i.test(input.value)) {
        picker.value = input.value;
        atualizarBotaoSimulador();
      }
    });
  
    picker.addEventListener('input', () => {
      input.value = picker.value;
      atualizarBotaoSimulador();
    });
  
    botaoCopiar.addEventListener('click', () => {
      navigator.clipboard.writeText(input.value);
      botaoCopiar.innerText = "✅";
      setTimeout(() => botaoCopiar.innerText = "📋", 1000);
    });
  
    picker.dispatchEvent(new Event('input'));
  });
  
  // Inverter cores
  document.getElementById('btnInverter').addEventListener('click', () => {
    const campo1 = document.querySelector('[data-id="1"] .input');
    const campo2 = document.querySelector('[data-id="2"] .input');
    const temp = campo1.value;
  
    campo1.value = campo2.value;
    campo2.value = temp;
  
    campo1.dispatchEvent(new Event('input'));
    campo2.dispatchEvent(new Event('input'));
  });
  