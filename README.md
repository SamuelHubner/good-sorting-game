# Arruma Prateleira

Jogo de organizar produtos no estilo "goods sort", feito para jogar no celular.
Fases infinitas geradas proceduralmente, todas verificadas como resolvíveis.

## Como jogar

- **Arraste** um produto para uma prateleira com espaço livre, ou **toque** nele e
  depois toque na prateleira de destino.
- **3 produtos iguais** na mesma prateleira somem.
- Quando a frente de uma prateleira esvazia, a **camada de trás** vem para a frente.
  O selo `+2` mostra quantas camadas ainda estão atrás, e os produtos escurecidos
  são a próxima camada.
- Esvazie todas as prateleiras **antes do tempo acabar**. Limpar trios em sequência
  (até 6 s entre eles) gera **combos** que multiplicam os pontos.
- Estrelas: 3 se terminar com metade do tempo ou mais, 2 com um quarto, 1 nos demais casos.

### Ajudas (por fase)

| Ajuda     | Qtd | O que faz                                        |
|-----------|-----|--------------------------------------------------|
| Voltar    | 3   | Desfaz a última jogada                           |
| Dica      | 3   | Destaca um produto e para onde movê-lo           |
| Misturar  | 1   | Embaralha todos os produtos entre as prateleiras |
| Congelar  | 1   | Para o relógio por 10 segundos                   |

Se o tempo acabar, dá para continuar uma vez com mais 30 segundos.

## Geração das fases

Cada número de fase vira uma semente, então a fase 37 é sempre a mesma.

1. `levelParams(n)` define a dificuldade: número de prateleiras (3 a 12), camadas
   (2 a 5), quantos tipos de produto, espaço livre inicial e segundos por produto.
2. `buildLayout` sorteia quantos itens ficam em cada camada, ajusta o total para
   um múltiplo de 3 e distribui os trios da frente para o fundo. As cópias de um
   mesmo produto ficam em profundidades próximas, com espalhamento maior nas fases altas.
3. Um solucionador guloso aleatório (`solve`) joga a fase. Se não conseguir
   esvaziar tudo, a semente é descartada e outra é testada. O mesmo
   solucionador alimenta o botão de dica.

## Rodar

É um único arquivo HTML, sem build nem dependências. Abra `index.html` no
navegador ou sirva a pasta:

```sh
python3 -m http.server 8000
```

Para jogar no celular com instalação na tela inicial (funciona offline), publique
no GitHub Pages: **Settings → Pages → Deploy from a branch**, escolha o branch e a
pasta raiz. Depois abra o link no celular e use "Adicionar à tela inicial".

O progresso (fase atual, estrelas, recorde) fica salvo no navegador.
