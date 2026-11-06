# Roadmap — Caldronis Owlbear

Extensão do [Owlbear Rodeo](https://www.owlbear.rodeo/) com a ficha automática do sistema
da mesa e rolagens no padrão do bot Caldronis Dice, usável no celular, no mesmo lugar do mapa.

## Decisões

- **Usuários:** só os jogadores têm ficha; cada jogador pode ter vários personagens.
- **Visibilidade:** o jogador vê só as próprias fichas; o mestre vê todas.
- **Edição:** o dono da ficha e o mestre.
- **Decimais:** mantidos. Deslocamento em metros e em quadrados (1 quadrado = 1,5 m).
- **Corpo e Mente:** usam o valor base dos atributos, de propósito.
- **Armadura:** lista de peças; toda peça listada conta como equipada.
- **Defesas:** em %, apenas exibidas na ficha.
- **Contrabalanço:** `inteiro(nível ÷ 3) + 1` usos por dia; só o total, sem contador.
- **Outros campos** (Origem, Almas, Ambição, Talentos, Resistências, Fraquezas, Imunidades,
  Vulnerabilidades): campos de texto.
- **Rolagens:** d30 é o padrão; dano por dados (`2d4+FOR`). Digitadas, sem botões automáticos.
  Sem rolagens secretas.
- **Personagem ativo:** escolhido numa lista no painel de rolagens; vale até o jogador trocar.
- **Barras nos tokens:** todos veem a proporção, ninguém vê o número (só na ficha).
- **Discord:** cada rolagem feita no Owlbear também aparece num canal, por webhook. O endereço
  do webhook fica na configuração da sala, **nunca no código**.
- **Infra:** plano gratuito do Owlbear, repositório público no GitHub, hospedagem no GitHub Pages.
- **Documentação:** simples — README e este roadmap.

## Etapas

### 0. Teste no celular
- Extensão mínima hospedada e aberta no celular do jogador.
- Confirmar onde salvar as fichas no plano gratuito e o limite de tamanho.
- **Pronto quando:** abre bem no celular e um dado salvo sobrevive a recarregar a página.

### 1. Ficha automática (aba Combate)
- Atributos (base, extra, perda), Corpo, Mente, Contrabalanço.
- Vida, Stamina, Mana e PA com máximo e atual; Deslocamento; defesas e defesas naturais.
- Listas de armadura e de armas; campos de texto.
- Vários personagens por jogador; permissões de dono e mestre.
- **Pronto quando:** os números batem com a planilha para o mesmo personagem (testes automáticos).

### 2. Rolador no padrão Caldronis
- Mesma sintaxe do bot (`d30+FOR`, comentários, `#`, `>>`, `<<`, `!`, `++`), usando os
  atributos do personagem ativo; resultado visível para todos na sala.
- **Pronto quando:** as mesmas mensagens dão os mesmos cálculos que o bot.

### 3. Recursos no estilo Roll20
- Gastar e recuperar Vida, Stamina, Mana e PA.
- Ligar personagem a um token e desenhar barras de proporção sobre ele.

### 4. Registro no Discord
- Webhook configurado pelo mestre; cada rolagem publicada no canal.

### 5. Sessão real e ajustes

### Depois
Magias, técnicas, habilidades e combos; dados 3D (Dice+); abas Base e INFO+ da planilha.

## Fórmulas de referência (aba Combate)

| Campo | Cálculo |
| --- | --- |
| Atributo atual | base + extra − perda |
| Corpo | média(FOR, DES, CON base) + extra − perda |
| Mente | média(INT, SAB, CAR base) + extra − perda |
| Contrabalanço | inteiro(nível ÷ 3) + 1 |
| Vida | nível × 5 + Corpo × 2 + CON × 5 |
| Stamina | 5 + Corpo × 2 + CON |
| Mana | 5 + Mente × 3 |
| PA | 4 + inteiro(nível ÷ 5) |
| Recurso atual | máximo + extra − perda |
| Deslocamento | 7,5 + inteiro(Corpo ÷ 3) × 1,5 m |
| Def. Natural | Corpo + CON ÷ 2 + extra − perda |
| Def. Mágica Natural | Mente + SAB ÷ 2 + extra − perda |
| Def. Física | Def. Natural + soma da Def. F das armaduras + extra − perda |
| Def. Mágica | Def. Mágica Natural + soma da Def. M das armaduras + extra − perda |
