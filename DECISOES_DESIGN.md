# Decisões de design: Prado FC

> Decisões combinadas com o Arthur em 12/11/2026, numa sessão de perguntas e respostas sobre o `PRADO_FC_SITE.md`.
> **A fonte da verdade é sempre o `PRADO_FC_SITE.md`.** Este arquivo só registra o que o documento deixava em aberto.

## Ferramenta

- O design é feito no **FigCraft** (github.com/storytold/figcraft), não no Figma. Ele é open source e gratuito.
- O Arthur abre o app com `figcraft --control 7979`, e o Claude se conecta pelo MCP `figcraft-app` (`figcraft-cli mcp --attach 7979`, registrado no escopo de usuário). Assim o Arthur vê as mudanças acontecendo.
- O arquivo é novo, chamado **"Prado FC — Site"**, com as páginas **Tokens**, **Componentes** e **Telas**.
- Se faltar alguma informação no MD, o Arthur pode mandar a identidade visual do Prado como complemento.

## Aprovação em 3 etapas

1. Tokens (cores e tipografia) e biblioteca de componentes → **parar e pedir aprovação**.
2. Home mobile, que define a linguagem visual → **parar e pedir aprovação**.
3. As demais telas (desktop 1440 px e mobile 390 px) → **parar e pedir aprovação** antes de qualquer código.

## Referências de qualidade

- A skill `styles.refero.design` não está instalada; o trabalho segue sem ela.
- Usar como referência o site do Cavalry FC e a skill **frontend-design** da Anthropic, sempre abaixo das regras e da identidade do Prado.

## Fontes

- Anton, Montserrat e Cinzel estão instaladas no Windows do Arthur.

## Decisões por tela e componente

| Tema | Decisão |
|---|---|
| Próximo jogo | Ainda não há data, horário nem adversário da Rodada 2. No design, usar um **jogo de exemplo** (só no Figma) para desenhar o card do próximo jogo e a contagem regressiva. O Arthur passa os dados reais depois. |
| Hero (desktop) | **Dividido**: texto e card do próximo jogo à esquerda; imagem (harpia ou foto do elenco, ambas verticais) à direita, esvaindo no fundo `noite`. |
| Hero (mobile) | Imagem em cima e card do próximo jogo sobreposto embaixo. |
| Header | Escudo pequeno com "PRADO FC" em Anton ao lado. Itens: Home, Jogos, Estatísticas, Elenco, Notícias. Botão turquesa "Jogue com a gente"; no mobile, ele vai para dentro do menu. |
| Jogos | **Seções empilhadas** (não abas): Próximos primeiro, Resultados abaixo, como no Cavalry. |
| Elenco: agrupamento | Pela **primeira posição** do campo `posicao`, em ordem fixa: Goleiros → Fixos → Alas → Meias → Pivôs → **Comissão técnica**. O card mostra a posição completa (ex.: "Ala/Pivô"). Com o seed atual: Goleiros (2), Fixos (5), Alas (3), Meias (2), Pivôs (2), Comissão técnica (1). |
| Elenco: card sem foto | **Escudo em marca-d'água** com o número grande em Anton por cima (não usar silhueta). |
| Elenco: técnico | Felipe Trigueiro (Técnico, sem número) fica no grupo "Comissão técnica", com o mesmo card, sem número e só com o escudo. |
| Uniformes | As fotos de `referencias/uniformes/` servem só como referência visual; não entram no site. |
