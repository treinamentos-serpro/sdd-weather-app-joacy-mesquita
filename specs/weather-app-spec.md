# Especificação de Produto — Weather App

## Overview

O Weather App permitirá que usuários encontrem uma cidade, consultem suas condições meteorológicas atuais e vejam a previsão para cinco dias, podendo alternar entre Celsius e Fahrenheit. A experiência deve funcionar em computadores, tablets e celulares, com interface em pt-BR.

As decisões da baseline v1 são: Open-Meteo sem API key; previsão diária de hoje mais os quatro dias seguintes no fuso local da cidade; Celsius inicial; interface em pt-BR; busca global com sugestões e seleção explícita; distribuição web responsiva; sem autenticação, geolocalização, telemetria, cache ou persistência. A seção **Open Questions** não contém decisões funcionais pendentes; os termos e limites do provedor são um gate antes da publicação.

## Functional Requirements

- **FR-01 — Buscar e selecionar uma cidade:** permitir busca global com sugestões após dois caracteres alfanuméricos e debounce de 300 ms, comparação sem distinção entre caixa e diacríticos, e seleção explícita de até cinco resultados identificados por cidade, região e país. O termo tem de 2 a 80 caracteres Unicode após trim e colapso de espaços; Enter ou botão executam a busca.
- **FR-02 — Consultar clima atual:** ao selecionar uma cidade, consultar clima atual e previsão e exibir temperatura, condição, umidade relativa, velocidade do vento, pressão e precipitação, com unidade visível. Campos ausentes devem ser identificados como indisponíveis, nunca substituídos por zero. Não há atualização em segundo plano.
- **FR-03 — Consultar previsão de cinco dias:** exibir previsão diária para hoje e os quatro dias seguintes no fuso local da cidade, com condição, temperaturas mínima/máxima, probabilidade de precipitação e velocidade do vento.
- **FR-04 — Alternar unidade de temperatura:** o usuário deve poder alternar entre Celsius e Fahrenheit. A unidade inicial é Celsius.
- **FR-05 — Comunicar estados da experiência:** o app deve indicar carregamento, resultados vazios e erros de busca ou consulta de dados, sem apresentar dados indisponíveis como se fossem atuais.

## User Stories

- **US-01 — Encontrar uma cidade:** Como Camila, pessoa que se desloca diariamente, quero buscar e selecionar minha cidade no celular para consultar o clima do lugar correto antes de sair. **Requisito:** FR-01.
- **US-02 — Consultar as condições atuais:** Como Camila, pessoa que se desloca diariamente, quero ver o clima atual da cidade selecionada para me preparar para o deslocamento. **Requisito:** FR-02.
- **US-03 — Planejar uma viagem:** Como Rafael, viajante que planeja com antecedência, quero consultar a previsão de hoje e dos quatro dias seguintes para escolher quando viajar. **Requisito:** FR-03.
- **US-04 — Planejar uma atividade ao ar livre:** Como Joana, organizadora de atividade ao ar livre, quero comparar a previsão dos próximos dias para escolher uma data adequada. **Requisito:** FR-03.
- **US-05 — Escolher a unidade de temperatura:** Como Camila, pessoa que se desloca diariamente, quero alternar entre Celsius e Fahrenheit para entender a temperatura na unidade que prefiro. **Requisito:** FR-04.
- **US-06 — Entender falhas e estados:** Como Rafael, viajante que planeja com antecedência, quero receber uma indicação quando os dados estiverem carregando, indisponíveis ou não encontrados para saber se devo aguardar, tentar novamente ou ajustar a busca. **Requisito:** FR-05.

As personas associadas a essas histórias são hipóteses do discovery e devem ser validadas; não representam segmentos de público já confirmados.

## Acceptance Criteria

- **FR-01 — Buscar e selecionar uma cidade**
  - **Given** o campo contém menos de dois caracteres alfanuméricos após trim e colapso de espaços, **When** o usuário tenta pesquisar, **Then** o app informa o mínimo exigido e não envia uma consulta de geocoding.
  - **Given** o campo contém de dois a 80 caracteres Unicode válidos, **When** o usuário digita, **Then** após 300 ms sem nova entrada o app busca sugestões e apresenta no máximo cinco opções selecionáveis.
  - **Given** há um termo válido no campo, **When** o usuário pressiona Enter ou ativa o botão de busca, **Then** a busca é executada sem aguardar nova digitação.
  - **Given** o campo contém mais de 80 caracteres após trim e colapso de espaços, **When** o usuário tenta pesquisar, **Then** o app informa o limite e não envia a consulta.
  - **Given** o termo contém acentos, hífens ou apóstrofos, **When** a busca é executada, **Then** a comparação ignora caixa e diacríticos sem alterar a grafia exibida no nome retornado.
  - **Given** os resultados incluem cidades homônimas, **When** as sugestões são apresentadas, **Then** cada opção exibe cidade, região e país disponíveis e nenhuma é selecionada automaticamente.
  - **Given** o geocoding retorna sucesso sem resultados, **When** a busca termina, **Then** o app exibe o estado vazio “Nenhuma cidade encontrada” e não solicita dados meteorológicos.
  - **Given** o campo está vazio ou só contém espaços, **When** o usuário tenta pesquisar, **Then** o app pede um termo válido, não envia consulta e não apresenta resultados anteriores como atuais.
  - **Given** o usuário seleciona uma sugestão, **When** a seleção é confirmada, **Then** essa localidade fica ativa para clima atual e previsão.
  - **Given** uma busca nova é iniciada antes de a anterior terminar, **When** as respostas chegam fora de ordem, **Then** somente os resultados da busca mais recente permanecem visíveis.

- **FR-02 — Consultar clima atual**
  - **Given** o usuário seleciona ou seleciona novamente uma cidade, **When** a seleção é confirmada, **Then** o app solicita uma vez os dados atuais e a previsão para essa cidade, sem atualização em segundo plano.
  - **Given** a resposta atual contém todos os campos, **When** a consulta termina, **Then** o app exibe temperatura, condição, umidade relativa, velocidade do vento, pressão e precipitação com, respectivamente, unidade de temperatura selecionada, descrição da condição, %, km/h, hPa e mm.
  - **Given** um ou mais campos não vêm na resposta, **When** o clima atual é apresentado, **Then** cada campo ausente aparece como “Indisponível” e nenhum valor é substituído por zero ou estimado pelo app.
  - **Given** a observação atual tem até duas horas, **When** é apresentada, **Then** o app mostra o horário de atualização em pt-BR e não marca os dados como desatualizados.
  - **Given** a observação atual tem mais de duas horas, **When** é apresentada, **Then** o app mostra “Desatualizado” junto ao horário e não a descreve como condição atual.
  - **Given** não há uma resposta atual válida, **When** a consulta termina, **Then** o app apresenta o estado de indisponibilidade sem inventar valores meteorológicos.

- **FR-03 — Consultar previsão de cinco dias**
  - **Given** a cidade selecionada tem dados diários para hoje e os quatro dias seguintes no seu fuso local, **When** a previsão termina de carregar, **Then** são exibidas exatamente cinco datas consecutivas, começando pela data local de hoje.
  - **Given** uma data de previsão está visível, **When** o usuário consulta seu resumo, **Then** vê data, condição, mínima e máxima em unidade selecionada, probabilidade de precipitação em % e vento em km/h.
  - **Given** faltam um ou mais campos para uma data, **When** a previsão é apresentada, **Then** os campos ausentes aparecem como “Indisponível” e os campos válidos continuam visíveis.
  - **Given** não há dados para uma das cinco datas, **When** a previsão é apresentada, **Then** a data permanece identificada e seus dados são marcados como indisponíveis, sem valores inventados.

- **FR-04 — Alternar unidade de temperatura**
  - **Given** o app foi aberto ou recarregado, **When** temperaturas são apresentadas antes de uma troca de unidade, **Then** estão em Celsius.
  - **Given** temperaturas atuais e de previsão estão visíveis, **When** o usuário seleciona Fahrenheit ou Celsius, **Then** todos os valores visíveis são atualizados e rotulados com a unidade selecionada.
  - **Given** 20 °C está visível, **When** o usuário seleciona Fahrenheit, **Then** é exibido 68 °F; conversões usam o valor de origem antes do arredondamento e arredondam 0,5 para longe de zero.
  - **Given** o usuário recarrega o app após selecionar Fahrenheit, **When** temperaturas voltam a ser apresentadas, **Then** a unidade retorna a Celsius.

- **FR-05 — Comunicar estados da experiência**
  - **Given** uma busca ou consulta está pendente, **When** o app aguarda a resposta, **Then** apresenta um estado de carregamento distinto do estado vazio e de erro.
  - **Given** o geocoding retorna sucesso sem resultados, **When** o app apresenta a resposta, **Then** mostra o estado vazio e permite editar o termo.
  - **Given** uma requisição retorna falha de rede ou HTTP, **When** o app recebe a falha, **Then** informa que não foi possível consultar os dados e oferece retry manual, sem apresentar a falha como dado.
  - **Given** uma requisição permanece sem resposta por 10 s, **When** o timeout ocorre, **Then** o app encerra a espera e oferece retry manual; não inicia retry automático.
  - **Given** o provedor responde com limite de requisições HTTP 429, **When** o app apresenta o erro, **Then** informa que o serviço está temporariamente limitado e não faz retry automático.

## Non-Functional Requirements
## Traceability Matrix

Cada referência FR abaixo aponta para todos os cenários Given/When/Then daquele requisito na seção **Acceptance Criteria**.

| User Story | Requisito(s) funcional(is) | Critérios de aceite relacionados | NFRs relevantes |
|---|---|---|---|
| **US-01 — Encontrar uma cidade** | FR-01, FR-05 | FR-01: limites e normalização do termo, sugestões, homônimos, zero resultados, seleção e respostas fora de ordem; FR-05: carregamento, vazio e falhas da busca. | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07 |
| **US-02 — Consultar as condições atuais** | FR-02, FR-05 | FR-02: carregamento ao selecionar cidade, campos/unidades, campos ausentes, dados atuais/desatualizados; FR-05: carregamento e falha da consulta. | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07, NFR-08 |
| **US-03 — Planejar uma viagem** | FR-03, FR-05 | FR-03: cinco datas locais, conteúdo diário, campos ou datas indisponíveis; FR-05: carregamento e falha da consulta. | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07 |
| **US-04 — Planejar uma atividade ao ar livre** | FR-03, FR-05 | FR-03: cinco datas locais, conteúdo diário, campos ou datas indisponíveis; FR-05: carregamento e falha da consulta. | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07 |
| **US-05 — Escolher a unidade de temperatura** | FR-04 | FR-04: unidade inicial, alternância em todos os valores visíveis, conversão de referência e retorno a Celsius após recarregar. | NFR-01, NFR-03, NFR-04, NFR-05, NFR-08 |
| **US-06 — Entender falhas e estados** | FR-05 | FR-05: carregamento, geocoding sem resultados, falhas HTTP/rede, timeout de 10 s e limite HTTP 429. | NFR-02, NFR-03, NFR-06, NFR-07 |

## Non-Functional Requirements

- **NFR-01 — Responsividade:** mobile-first, sem rolagem horizontal da página nos viewports 320x568, 768x1024, 1280x800 e 1920x1080; os fluxos de busca, consulta e unidade devem funcionar em cada um.
- **NFR-02 — Desempenho:** em viewport 390x844, CPU 4x slowdown, rede 10 Mbps down/2 Mbps up/100 ms RTT e Chrome estável atual, medir 20 cargas frias e 20 buscas bem-sucedidas. Campo e ação de busca devem estar interativos em até 2 s p75; feedback após submissão deve aparecer em até 100 ms e resultados em até 2,5 s p95, contado do último caractere digitado.
- **NFR-03 — Acessibilidade:** conformidade WCAG 2.2 AA nos fluxos de busca, seleção, consulta e troca de unidade; verificar por avaliação automatizada e revisão manual de teclado e leitor de tela.
- **NFR-04 — Usabilidade:** em teste moderado com cinco participantes representando as personas, ao menos quatro devem concluir busca + consulta atual em até 30 s e consulta da previsão em até 60 s, sem ajuda.
- **NFR-05 — Compatibilidade:** suportar as versões estável atual e anterior de Chrome, Edge e Firefox nos quatro viewports do NFR-01.
- **NFR-06 — Tolerância a falhas:** cada requisição tem timeout de 10 s; não há retry automático; falhas oferecem retry manual e HTTP 429 informa limite temporário.
- **NFR-07 — Clareza de mensagens:** os estados de carregamento, vazio, indisponibilidade, dados desatualizados e falha devem ser distintos, em pt-BR e acessíveis.
- **NFR-08 — Privacidade:** v1 sem autenticação, geolocalização, telemetria, cache offline, favoritos, histórico ou persistência local/servidor.

## Edge Cases

| Cenário | Comportamento esperado |
|---|---|
| Cidade inexistente | Informar que a cidade não foi encontrada, permitir corrigir a busca e não associar à consulta o clima de outra cidade ou de uma busca anterior. |
| Input vazio ou menor que dois caracteres alfanuméricos | Após trim e colapso de espaços, solicitar um termo com ao menos dois caracteres alfanuméricos; não chamar geocoding nem reutilizar resultados anteriores. |
| Caracteres especiais no nome | Comparar sem distinção entre caixa e diacríticos; preservar a grafia recebida para exibição. Hífens e apóstrofos são parte literal da busca. |
| Respostas de buscas fora de ordem | Se uma busca nova terminar antes de uma anterior, apresentar apenas os resultados da busca mais recente como atuais. |
| Falha da API de geocoding ou previsão | Informar que não foi possível concluir a consulta, oferecer retry manual e não apresentar a falha como resultado válido. Não manter dados anteriores como atuais. |
| Timeout da API | Após 10 s sem resposta, encerrar a requisição, apresentar erro e oferecer retry manual; não iniciar retry automático. |
| Limite de requisições HTTP 429 | Informar que o serviço está temporariamente limitado; não repetir a chamada automaticamente. |
| Geocoding bem-sucedido sem resultados | Exibir um estado vazio informando que nenhum local corresponde à busca; distingui-lo de falha/erro da API e não consultar a previsão para uma cidade não selecionada. |
| Resposta parcial | Exibir campos válidos e rotular cada campo ausente como “Indisponível”; não estimar nem substituir por zero. Aplicar a regra aos seis campos atuais e aos campos diários definidos em FR-03. |
| Várias cidades com o mesmo nome ou resultados incompletos de localização | Diferenciar os resultados com região ou país quando esses dados estiverem disponíveis; não selecionar automaticamente uma opção ambígua. |
| Cidade encontrada, mas sem dados atuais ou previsão disponível | Informar quais dados estão indisponíveis e manter o restante da consulta utilizável quando houver dados válidos. |
| Resposta de dados atrasada ou desatualizada | Se a observação atual tiver mais de 2 h, mostrar “Desatualizado” e o horário da observação; nunca rotular como condição atual. Não há cache na v1. |
| Mudança de dia ou fuso horário durante a apresentação da previsão | Determinar hoje e os quatro dias seguintes pelo fuso local da cidade selecionada; exibir cinco datas consecutivas. |
| Alternância de unidade enquanto os dados estão carregando ou após um erro | Aplicar a unidade selecionada aos dados assim que estiverem disponíveis; não transformar erro ou ausência de dados em valor de temperatura. |
| Valores de temperatura negativos, decimais ou próximos de limites de arredondamento | Converter a partir do valor de origem e arredondar ao inteiro mais próximo; valores com fração de 0,5 arredondam para longe de zero. |
| Uso em viewport estreita, orientação diferente, teclado ou leitor de tela | Manter os fluxos principais utilizáveis e os estados identificáveis, sem perda de conteúdo ou controles inacessíveis. |
| Falha de rede | Exibir estado de erro em pt-BR, manter a busca editável e oferecer retry manual; não há conteúdo offline nem cache. |

## Assumptions

- O produto é uma aplicação para usuários finais, não uma ferramenta interna de meteorologistas.
- A baseline v1 é uma aplicação web responsiva; PWA e aplicativos nativos não estão no escopo.
- Open-Meteo é usado sem API key; a publicação depende da verificação dos termos, atribuição e limites vigentes do provedor.
- A previsão é diária, hoje mais os quatro dias seguintes, no fuso local da cidade.
- A unidade inicia em Celsius e retorna a Celsius após recarregar; não há persistência local ou no servidor.
- A busca cobre localidades globais conforme a disponibilidade do provedor; suporte e viewports seguem NFR-05.
- Não há localização automática, telemetria, favoritos, histórico, armazenamento local, modo offline ou cache na v1.
- As personas são hipóteses; a meta de usabilidade é um critério de validação da v1, não resultado de pesquisa já observado.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| As personas hipotéticas não representarem os usuários reais. | Média | Médio: priorização e usabilidade podem não refletir necessidades reais. | Validar fluxos com cinco participantes conforme NFR-04 antes do release. |
| Open-Meteo ficar indisponível ou limitar requisições. | Média | Alto: consultas de clima e previsão podem falhar. | Aplicar timeout de 10 s e retry manual; monitorar falhas durante validação e revisar limites publicados antes do release. |
| Dados atuais estarem incompletos, indisponíveis ou desatualizados. | Média | Alto: usuários podem interpretar condições incorretamente. | Rotular observações com mais de 2 h como desatualizadas e indicar campos indisponíveis. |
| Resultados homônimos levarem à seleção da localidade errada. | Média | Alto: o app pode exibir dados de outra cidade. | Mostrar região e país e exigir seleção explícita. |
| Falhas de rede interromperem uma consulta. | Média | Médio: clima e previsão ficam temporariamente indisponíveis. | Apresentar erro acessível, preservar o termo de busca e oferecer retry manual; não usar cache na v1. |
| Conversão ou arredondamento de temperatura gerar valores enganosos. | Baixa | Médio: usuário pode interpretar incorretamente a temperatura. | Converter a partir do valor de origem e validar valores de referência nos testes. |
| Mudanças nos termos ou limites do provedor tornarem a integração incompatível. | Baixa | Alto: a publicação ou operação pode violar as condições de uso. | Verificar termos, atribuição e limites vigentes como gate de cada release. |

## Out of Scope

- Autenticação, contas, perfis, dados no servidor e persistência local de cidade ou unidade; favoritos e histórico.
- Geolocalização automática ou manual; a cidade é sempre escolhida pela busca.
- PWA, aplicativos nativos, instalação, notificações push, widgets e compartilhamento de previsões.
- Cache, modo offline, atualização em segundo plano e uso sem conexão.
- Previsões horárias ou além de cinco dias; alertas meteorológicos, alertas severos, qualidade do ar, pólen, mapas e radar.
- Telemetria, analytics e exportação de dados.
- Idiomas além de pt-BR, unidades além das definidas nesta spec e fontes meteorológicas além da Open-Meteo.

## Open Questions

Nenhuma para a baseline v1. A única condição externa é verificar termos, atribuição e limites vigentes da Open-Meteo antes de cada publicação.
