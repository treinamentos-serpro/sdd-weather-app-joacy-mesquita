# Discovery — Weather App

## Contexto

A empresa solicitou uma aplicação de previsão do tempo. O briefing indica que usuários precisam buscar cidades, consultar o clima atual, ver a previsão de cinco dias e alternar entre Celsius e Fahrenheit. Também exige que a aplicação possa ser usada em dispositivos móveis.

Para a baseline v1, as decisões deste discovery definem a fonte, o conteúdo meteorológico, o intervalo e a granularidade da previsão, a busca, as unidades, a localização, a persistência e os critérios de qualidade. A seção **Decisões** registra os defaults para que a especificação e a implementação não dependam de novas perguntas.

## Requisitos Funcionais

- **RF-01 — Buscar cidades:** permitir busca global por nome entre 2 e 80 caracteres após normalização, com sugestões após dois caracteres e seleção explícita entre até cinco resultados identificados por cidade, região e país.
- **RF-02 — Consultar clima atual:** exibir temperatura, condição, umidade relativa, velocidade do vento, pressão e precipitação da cidade selecionada; campos ausentes devem ser identificados como indisponíveis. Buscar clima e previsão quando a cidade for selecionada; sem atualização em segundo plano.
- **RF-03 — Consultar previsão:** exibir previsão diária para hoje e os quatro dias seguintes no fuso local da cidade; cada dia inclui condição, temperaturas mínima/máxima, probabilidade de precipitação e velocidade do vento.
- **RF-04 — Alternar unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit.
- **RF-05 — Indicar estados:** estados de carregamento, erro e vazio.

## Requisitos Não-Funcionais

- **RNF-01 — Responsividade:** mobile-first, utilizável de 320 px a 1920 px sem rolagem horizontal da página.
- **RNF-02 — Desempenho:** campo e ação de busca interativos em até 2 s p75; feedback após submissão em até 100 ms e resultados em até 2,5 s p95, no perfil de teste definido nas decisões.
- **RNF-03 — Acessibilidade:** WCAG 2.2 AA nos fluxos principais, incluindo teclado, leitor de tela, semântica e contraste.
- **RNF-04 — Usabilidade:** pelo menos 4 de 5 participantes de teste concluem busca + consulta atual em até 30 s e consulta da previsão em até 60 s, sem ajuda.
- **RNF-05 — Tolerância a falhas:** timeout de 10 s por requisição, sem nova tentativa automática; apresentar erro claro e permitir nova tentativa manual.
- **RNF-06 — Compatibilidade:** versões estável atual e anterior de Chrome, Edge e Firefox; viewports de 320x568, 768x1024, 1280x800 e 1920x1080.
- **RNF-07 — Privacidade:** sem autenticação, geolocalização, telemetria, cache offline, favoritos, histórico ou persistência local na v1.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Requisitos vagos levarem a uma solução diferente das necessidades dos usuários. | Média | Médio: retrabalho ou baixa adoção. | Validar os fluxos e métricas definidos com participantes que representem as três personas. |
| A fonte de dados ficar indisponível, lenta ou limitar requisições. | Média | Alto: usuários podem não conseguir consultar o clima ou a previsão. | Aplicar timeout de 10 s e retry manual; verificar termos e limites publicados antes do release. |
| Dados meteorológicos estarem desatualizados, incompletos ou indisponíveis para algumas localidades. | Média | Alto: usuários podem tomar decisões com informações incorretas ou não encontrar dados para a cidade escolhida. | Rotular observações com mais de 2 h como desatualizadas e indicar campos/períodos indisponíveis. |
| A busca retornar cidades homônimas ou resultados imprecisos. | Média | Alto: o usuário pode consultar a previsão do local errado. | Identificar resultados com cidade, região e país e exigir seleção explícita. |
| O significado de “previsão de cinco dias” ou o fuso horário variar entre interpretações. | Baixa | Médio: período ou apresentação podem não corresponder às expectativas. | Exibir exatamente cinco datas diárias consecutivas no fuso local da cidade. |
| Celsius e Fahrenheit serem exibidos ou convertidos de forma inconsistente. | Baixa | Médio: a leitura da temperatura pode induzir o usuário ao erro. | Usar a unidade selecionada, regra de arredondamento definida e testes com valores de referência. |
| Falhas de conexão impedirem a consulta dos dados meteorológicos. | Média | Médio: o app pode ficar sem conteúdo útil ou deixar o usuário sem saber como continuar. | Apresentar estado de erro acessível, preservar o termo de busca e oferecer retry manual; sem cache na v1. |
| A experiência móvel ou acessível ser difícil de usar. | Média | Alto: parte dos usuários pode não conseguir completar as tarefas principais. | Validar viewports definidos e fluxos principais com teclado, leitor de tela e avaliação WCAG 2.2 AA. |
| Latência elevada tornar a busca e a consulta da previsão frustrantes. | Média | Médio | Medir o p75/p95 no perfil de rede/dispositivo definido e corrigir qualquer violação dos limites. |
| Coleta de localização ou telemetria fora do escopo causar perda de confiança. | Baixa | Alto: coleta desnecessária pode causar consequências legais ou reputacionais. | Não coletar localização nem telemetria na v1; exigir aprovação de escopo e revisão de privacidade antes de adicioná-las. |

## Perguntas em Aberto

Nenhuma para a baseline v1. As decisões abaixo fecham o escopo funcional e os critérios de validação. Antes da publicação, deve-se verificar os termos, a atribuição e os limites de uso publicados pela Open-Meteo.

## Decisões

| Decisão | Justificativa | Escopo definido |
|---|---|---|
| **Fonte de dados:** Open-Meteo, sem API key. | Evita exigir uma credencial de API para o uso previsto. | Uso sujeito aos termos, à atribuição e aos limites publicados pelo provedor, verificados antes do release. |
| **Busca:** global por nome de 2 a 80 caracteres Unicode após trim e colapso de espaços; autocomplete com debounce de 300 ms após dois caracteres alfanuméricos; comparação sem distinção entre caixa e diacríticos; até cinco resultados com cidade, região e país; seleção explícita. | Mantém busca previsível e evita escolher automaticamente localidades ambíguas. | Define cobertura, limites, normalização, sugestões e desambiguação. |
| **Clima atual:** temperatura, condição, umidade relativa, velocidade do vento, pressão e precipitação. Valores indisponíveis são rotulados como “Indisponível”, nunca substituídos por zero. | Registra os campos indicados nos requisitos e define resposta parcial. | Define o conteúdo do clima atual. |
| **Previsão:** diária, hoje mais os quatro dias seguintes, no fuso local da cidade; condição, mínima/máxima, probabilidade de precipitação e velocidade do vento. | Fixa o período, granularidade e fuso. | Define o conteúdo e a organização da previsão. |
| **Unidade:** Celsius por padrão; alternância para Fahrenheit durante a sessão; escolha não persiste após recarregar. Exibição em graus inteiros, arredondados a partir do valor de origem. | Evita adicionar persistência local e define o arredondamento visível. | Define unidade inicial, persistência e arredondamento. |
| **Localização e estado inicial:** sem geolocalização; iniciar sem cidade selecionada e solicitar busca manual. | Evita permissão e coleta de localização, sem escolher um local arbitrário. | Define a tela inicial e o uso de localização. |
| **Idioma e unidades:** UI pt-BR; data com dia da semana e dd/MM; horário 24 h; separador decimal pt-BR; vento km/h, pressão hPa, precipitação mm no atual e probabilidade % na previsão. | Mantém apresentação consistente para o público-alvo. | Define formato de datas, horários e unidades meteorológicas. |
| **Busca sem resultados e erro:** lista vazia do geocoding mostra estado vazio; falha HTTP/rede mostra erro; ambos permitem corrigir a busca ou tentar novamente, respectivamente. | Distingue ausência de correspondência de indisponibilidade do provedor. | Define os estados de busca e consulta. |
| **Timeout e retries:** timeout de 10 s por requisição, sem retry automático; oferecer tentativa manual após erro. Resposta 429 informa limite temporário. | Controla espera e evita repetição automática de chamadas. | Define timeout e política de retry. |
| **Atualidade e offline:** buscar clima e previsão ao selecionar uma cidade; sem atualização em segundo plano, cache ou modo offline. Mostrar horário da observação; acima de 2 h, rotular clima atual como desatualizado. Selecionar novamente uma cidade refaz a consulta. | Evita confundir dados antigos com condições atuais e limita chamadas em segundo plano. | Define frequência de atualização, cache, offline e idade máxima do clima atual. |
| **Plataforma e compatibilidade:** web responsiva; sem PWA ou app nativo na v1. Suporte às duas versões estáveis mais recentes de Chrome, Edge e Firefox; viewports 320x568, 768x1024, 1280x800 e 1920x1080. | Define uma matriz objetiva de entrega e validação. | Fecha a forma de distribuição e os ambientes de suporte. |
| **Desempenho:** viewport 390x844, CPU 4x slowdown, rede 10 Mbps down/2 Mbps up/100 ms RTT e Chrome estável atual; medir 20 cargas frias e 20 buscas bem-sucedidas. Campo e ação de busca interativos em até 2 s p75, feedback após submissão em até 100 ms e resultado em até 2,5 s p95, contado do último caractere digitado. | Converte “conexão típica” e “instantânea” em metas reproduzíveis. | Define perfil, eventos, amostra e métricas de desempenho. |
| **Acessibilidade:** WCAG 2.2 AA nos fluxos de busca, seleção, consulta e troca de unidade; verificar por avaliação automatizada e revisão manual de teclado/leitor de tela. | Define padrão e método mínimo de validação. | Fecha o padrão de acessibilidade. |
| **Privacidade e funcionalidades adicionais:** sem autenticação, telemetria, favoritos, histórico, armazenamento local, geolocalização ou cache na v1. | Mantém o escopo mínimo e evita coleta/persistência não aprovada. | Fecha persistência, telemetria e funcionalidades auxiliares. |
| **Sucesso e restrições:** em teste moderado com cinco participantes representando as personas, ao menos quatro concluem busca + clima atual em até 30 s e previsão em até 60 s, sem ajuda. Não há prazo ou orçamento de produto especificado. | Usa as métricas propostas pelas personas para validar a experiência sem telemetria. | Define critérios de sucesso e registra as restrições informadas. |
| **Conformidade do provedor:** verificar termos, atribuição exigida e limites publicados da Open-Meteo antes da publicação; publicar somente em conformidade. | Requisitos externos devem ser verificados no release e podem mudar. | Transforma a verificação de uso em gate operacional. |

## Personas

> Personas iniciais, baseadas em hipóteses do briefing. As métricas descritas na seção **Decisões** são critérios da baseline v1, não dados de pesquisa já observados.

### 1. Camila — pessoa que se desloca diariamente

- **Objetivo principal:** consultar rapidamente o clima atual e a previsão para decidir como se preparar para o deslocamento.
- **Contexto de uso:** principalmente no celular, pela manhã ou antes de sair; consultas curtas, possivelmente em movimento.
- **Métrica de sucesso:** encontra a cidade correta e consulta o clima atual em até 30 segundos, sem ajuda.

### 2. Rafael — viajante que planeja com antecedência

- **Objetivo principal:** consultar a previsão de cinco dias para uma cidade e escolher quando viajar ou planejar atividades.
- **Contexto de uso:** geralmente no desktop, ao comparar datas com calma; pode voltar ao celular durante a viagem.
- **Métrica de sucesso:** encontra a cidade correta e identifica a previsão do dia desejado em até 1 minuto.

### 3. Joana — organizadora de atividade ao ar livre

- **Objetivo principal:** escolher um dia adequado para uma atividade externa com base na previsão da cidade.
- **Contexto de uso:** consulta inicial no desktop para planejar; nova consulta no celular perto da data da atividade.
- **Métrica de sucesso:** localiza a previsão do período planejado e consegue tomar uma decisão sem precisar consultar outra fonte para entender a informação apresentada.

## Suposições

- A aplicação será uma interface voltada a usuários finais, e não uma ferramenta interna de meteorologistas.
- A baseline v1 é uma aplicação web responsiva para usuários finais, com suporte aos dispositivos e navegadores definidos na seção **Decisões**.
- O período é diário, hoje mais os quatro dias seguintes no fuso local da cidade; não há localização automática nem cidade padrão.
- A unidade inicia em Celsius e a escolha não persiste após recarregar ou reabrir o app.
- Não há persistência, telemetria, favoritos, histórico, cache offline ou autenticação na baseline v1.