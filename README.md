# Caldronis Owlbear

Extensão do [Owlbear Rodeo](https://www.owlbear.rodeo/) para a mesa de RPG do Caldronis:
ficha automática do sistema da mesa e rolagens no mesmo formato do bot Caldronis Dice
(`d30+FOR atacar o guarda`), pensada para jogar pelo celular.

**Estado:** Etapa 0, um teste mínimo para validar o uso no celular e o espaço de dados da sala.
Veja o [roadmap](ROADMAP.md).

## Rodar localmente

```bash
pnpm install
pnpm dev
```

No Owlbear Rodeo, abra uma sala → **Extensões** → **Adicionar extensão personalizada** e use
`http://localhost:5173/manifest.json` (funciona só no computador que roda o servidor).

## Publicação

Cada envio para `main` publica o site no GitHub Pages pelo workflow em `.github/workflows/pages.yml`.
O endereço da extensão fica em `https://igordigitos.github.io/caldronis-owlbear/manifest.json`.

## Tecnologias

TypeScript, Vite e o SDK oficial de extensões do Owlbear Rodeo (`@owlbear-rodeo/sdk`).

Desenvolvido com auxílio de IA (Claude).
