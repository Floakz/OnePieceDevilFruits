## Uso de Ko-fi para doativos com atribuição manual de “frutos”
Contexto

O site tem tráfego elevado relacionado com One Piece. A ideia é permitir que visitantes façam um donativo e, como recompensa simbólica, recebam um “fruto”, que será reservado com o nome deles por um periodo determinado.

Nesta fase inicial, não será feita integração automática com webhooks ou APIs do Kofi. A gestão dos doativos e a atribuição dos frutos será feita manualmente por nós.

#### Objetivo do spike

Avaliar se o Ko-fi é uma boa opção para:

- Receber doativos de forma rápida e simples.
- Validar se a comunidade tem interesse em apoiar o site.
- Criar uma recompensa simbólica ligada ao universo One Piece.
- Gerir a atribuição dos frutos manualmente numa primeira fase.
- Perceber se vale a pena automatizar o processo no futuro.

### Fluxo inicial

O utilizador acede à página de apoio no site.
O site explica que, ao fazer um donativo, recebe um fruto.
O utilizador clica no botão/link para Ko-fi.
Faz o doativo
Consultamos os novos donativos no painel do Ko-fi.
Respondemos ao utilizador com o fruto dedicado (também fica o comprovativo que a doação já foi tratada)
Atribuimos manualmente um fruto ao utilizador.
A página relativa ao fruto passa a ter uma ligação ao nome do utilizador

A utilização inicial é bastante simples.

Só precisamos de:

- Criar e configurar a página Ko-fi
- Adicionar o link para a página Ko-fi no site
- Definir instruções claras
- Consultar os donativos
- Atribuir frutos manualmente

O maior cuidado será garantir consistência no processo.

### Considerações

### Polls e Posts

Pessoas que doaram podem ter acesso a posts/polls que fazemos para ajudarem a definir novas funcionalidades no site ou dar feedback.

##### Escalabilidade limitada


##### Propriedade intelectual

Como a ideia está ligada a One Piece, existe risco se forem usados nomes, imagens, logos ou assets oficiais.

Uma possível abordagem seria criar frutos inspirados, com nomes próprios do site.

Exemplo:

Fruto da Borracha
Fruto da Chama
Fruto da Sombra
Fruto do Gelo
Fruto da Luz

A recompensa deve ser apresentada como uma mecânica da comunidade, não como produto oficial.
Provavelmente isto não faz sentido no momento, mas caso seja necessário é uma opção. 

#### Conta PayPal

O Ko-fi paga diretamente conforme doação/subscrição recebida.
O valor retido por eles é de 5% o montante recebido.
A criação de uma conta Paypal é obrigatória (a outra opção seria criar uma conta de Stripe)
Ao fazer a doação o utilizador vai conseguir ver o nome associado á conta de PayPal.
É algo a termos em consideração.

##### Outras plataformas

Patreon

Patreon faria mais sentido se a ideia fosse criar uma comunidade com benefícios recorrentes, tiers mensais, etc.

Para uma recompensa pontual por donativo, parece menos adequado.

Buy Me a Coffee

É uma alternativa parecida com Ko-fi. Pode cumprir o mesmo objetivo, mas não parece trazer uma vantagem clara suficiente para substituir Ko-fi nesta fase.

#### Webhooks

O Ko-fi também permite utilizar webhooks para gerir eventos como donativos, subscrições etc.
Isto pode ser usado numa primeira fase para nos alertar que alguem fez um donativo e futuramente para automatizar processos.



### Conclusão

Ko-fi é uma boa opção para a fase inicial porque permite validar a ideia com pouco esforço técnico. Como a atribuição dos frutos será manual, não é necessário implementar webhooks, API ou automações nesta etapa.

A maior vantagem é a rapidez: conseguimos colocar isto em live rapidamente, começar a receber doativos e perceber se a comunidade responde bem.

Decisão sugerida:
- Avançar com Ko-fi para a fase inicial.
- Usar o username da doação.
- Atribuir frutos manualmente.
- Reavaliar automação se o volume crescer.