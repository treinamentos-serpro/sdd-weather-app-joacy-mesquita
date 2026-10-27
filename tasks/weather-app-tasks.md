# Backlog — Weather App v1

Derivado de `plans/weather-app-plan.md` e `specs/weather-app-spec.md`. As tarefas estão agrupadas por entrega e em ordem de dependência. Cada tarefa altera no máximo dois arquivos relevantes e não mistura implementação de camadas distintas com seus testes.

## Entrega 1 — Fundação e bootstrap

### T-01 — Definir contratos de domínio

- **ID:** T-01
- **Título:** Criar tipos compartilhados do Weather App.
- **Descrição curta:** declarar os contratos normalizados usados entre service, hook e UI.
- **Critérios de aceite:** exportar `Unit`, `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e `RequestState<T>` com campos e nulabilidade coerentes com a spec; TypeScript strict compila.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Data; **Prioridade:** P0; **Tamanho:** P.

### T-02 — Restaurar ponto de entrada Vite

- **ID:** T-02
- **Título:** Configurar bootstrap React.
- **Descrição curta:** montar a aplicação React no elemento `root` e declarar os tipos de ambiente Vite.
- **Critérios de aceite:** `main.tsx` monta `App` em `#root`; a declaração de ambiente permite importar CSS; nenhuma chamada de API é iniciada no bootstrap.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/main.tsx`, `src/vite-env.d.ts`.
- **Tipo:** Infra; **Prioridade:** P0; **Tamanho:** P.

### T-03 — Criar shell inicial

- **ID:** T-03
- **Título:** Implementar tela inicial vazia em pt-BR.
- **Descrição curta:** criar composição visual inicial e estilos globais responsivos, sem busca ou integração de dados.
- **Critérios de aceite:** exibe título, busca ainda sem comportamento e estado sem cidade; não há overflow horizontal em 320 px; regiões e headings têm semântica acessível.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/App.tsx`, `src/styles/index.css`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** M.

### T-04 — Testar shell inicial

- **ID:** T-04
- **Título:** Cobrir montagem e estado vazio inicial.
- **Descrição curta:** verificar o shell com Testing Library usando queries acessíveis.
- **Critérios de aceite:** teste encontra heading, busca e estado vazio por roles/labels; não depende de rede.
- **Dependências:** T-03.
- **Arquivos prováveis:** `tests/setup.ts`, `tests/unit/App.test.tsx`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

## Entrega 2 — Funções puras

### T-05 — Normalizar termos de busca

- **ID:** T-05
- **Título:** Implementar normalização e validação de busca.
- **Descrição curta:** aplicar trim, colapso de espaços, limites e chave de comparação sem alterar a grafia exibida.
- **Critérios de aceite:** aceita 2–80 code points Unicode com pelo menos dois caracteres alfanuméricos; compara sem distinção entre caixa/diacríticos; informa motivo de rejeição para entrada curta, longa ou sem caracteres alfanuméricos.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/search.ts`.
- **Tipo:** Data; **Prioridade:** P0; **Tamanho:** P.

### T-06 — Testar normalização de busca

- **ID:** T-06
- **Título:** Cobrir limites e caracteres especiais da busca.
- **Descrição curta:** testar normalização, validação e chave de comparação sem rede.
- **Critérios de aceite:** cobrir espaços, limites 2/80, Unicode, acentos, hífens, apóstrofos e entrada sem caracteres alfanuméricos.
- **Dependências:** T-05.
- **Arquivos prováveis:** `tests/unit/search.test.ts`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

### T-07 — Implementar conversão de temperatura

- **ID:** T-07
- **Título:** Derivar temperatura na unidade selecionada.
- **Descrição curta:** converter a partir do valor de origem em Celsius e aplicar arredondamento da spec.
- **Critérios de aceite:** funções puras não alteram a origem; valores nulos permanecem indisponíveis; arredondamento de 0,5 é para longe de zero.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data; **Prioridade:** P0; **Tamanho:** P.

### T-08 — Testar conversão de unidade

- **ID:** T-08
- **Título:** Cobrir conversões Celsius/Fahrenheit.
- **Descrição curta:** validar valores de referência, sinal, arredondamento e indisponibilidade.
- **Critérios de aceite:** inclui 20 °C → 68 °F, -40 °C → -40 °F, arredondamento ±0,5 e null; execução não usa rede.
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

### T-09 — Implementar formatação pt-BR

- **ID:** T-09
- **Título:** Formatar datas, horários e números.
- **Descrição curta:** formatar data local, horário da observação e medidas meteorológicas.
- **Critérios de aceite:** data usa dia da semana e `dd/MM`; horário usa 24 h no fuso informado; número nulo/inválido resulta em “Indisponível”.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/format.ts`.
- **Tipo:** Data; **Prioridade:** P0; **Tamanho:** P.

### T-10 — Testar formatação

- **ID:** T-10
- **Título:** Validar formatação e timezone.
- **Descrição curta:** cobrir formatos pt-BR, fuso e entradas inválidas.
- **Critérios de aceite:** exemplos determinísticos cobrem data, mudança de horário por timezone, número decimal e valor ausente.
- **Dependências:** T-09.
- **Arquivos prováveis:** `tests/unit/format.test.ts`.
- **Tipo:** Test; **Prioridade:** P1; **Tamanho:** P.

### T-11 — Mapear códigos meteorológicos

- **ID:** T-11
- **Título:** Traduzir códigos WMO para pt-BR.
- **Descrição curta:** fornecer descrição para códigos meteorológicos conhecidos e fallback.
- **Critérios de aceite:** código conhecido tem descrição em pt-BR; null e código desconhecido não lançam erro e têm saída definida.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Tipo:** Data; **Prioridade:** P1; **Tamanho:** P.

### T-12 — Testar códigos WMO

- **ID:** T-12
- **Título:** Cobrir descrições e fallback WMO.
- **Descrição curta:** verificar códigos conhecidos, desconhecidos e ausentes.
- **Critérios de aceite:** teste determinístico valida ao menos um código conhecido, um desconhecido e null.
- **Dependências:** T-11.
- **Arquivos prováveis:** `tests/unit/weatherCodes.test.ts`.
- **Tipo:** Test; **Prioridade:** P1; **Tamanho:** P.

## Entrega 3 — Services

### T-13 — Implementar geocoding

- **ID:** T-13
- **Título:** Consultar e mapear cidades.
- **Descrição curta:** encapsular endpoint/parâmetros Open-Meteo e mapear resultados para `City`.
- **Critérios de aceite:** envia `name`, `count=5`, `language=pt`, `format=json`; sucesso vazio retorna lista vazia; cidades incompletas são descartadas sem fabricar campos.
- **Dependências:** T-01, T-05.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data; **Prioridade:** P0; **Tamanho:** M.

### T-14 — Testar geocoding com fetch mockado

- **ID:** T-14
- **Título:** Cobrir contrato de geocoding.
- **Descrição curta:** verificar parâmetros, mapeamento e falhas do service sem API real.
- **Critérios de aceite:** mocks cobrem sucesso, zero resultados, payload inválido, falha de rede, HTTP 429 e timeout de 10 s.
- **Dependências:** T-13.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

### T-15 — Implementar forecast

- **ID:** T-15
- **Título:** Consultar clima atual e cinco datas diárias.
- **Descrição curta:** montar a consulta forecast e mapear respostas para `CurrentWeather`, `ForecastDay` e `WeatherData`.
- **Critérios de aceite:** pede `current`/`daily`, `timezone=auto`, cinco dias e unidades da spec; produz cinco datas locais; ausências viram null; timeout 10 s e nenhum retry automático.
- **Dependências:** T-01, T-07, T-09, T-11, T-13.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data; **Prioridade:** P0; **Tamanho:** M.

### T-16 — Testar forecast com fetch mockado

- **ID:** T-16
- **Título:** Cobrir mapeamento de clima e previsão.
- **Descrição curta:** validar parâmetros, timezone, offset, cinco datas e respostas parciais.
- **Critérios de aceite:** mocks cobrem payload completo/parcial, data faltante, HTTP 429, falha de rede, resposta inválida e timeout.
- **Dependências:** T-15.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

## Entrega 4 — Hook

### T-17 — Orquestrar busca e clima

- **ID:** T-17
- **Título:** Implementar estado da aplicação.
- **Descrição curta:** controlar query, resultados, cidade selecionada, snapshot, unidade e retry.
- **Critérios de aceite:** busca/clima têm estados independentes; debounce é 300 ms; respostas antigas são ignoradas; selecionar/reselecionar consulta uma vez; unidade não refaz request; não há persistência.
- **Dependências:** T-05, T-13, T-15.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** M.

### T-18 — Testar hook

- **ID:** T-18
- **Título:** Cobrir estados e concorrência do hook.
- **Descrição curta:** mockar services e verificar transições e ações do usuário.
- **Critérios de aceite:** cobre idle/loading/success/empty/error, cancelamento de busca/clima, retry, seleção e unidade sem refetch.
- **Dependências:** T-17.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

## Entrega 5 — Componentes

### T-19 — Implementar campo de busca

- **ID:** T-19
- **Título:** Criar SearchBar acessível.
- **Descrição curta:** apresentar entrada, submit e sugestões com seleção explícita.
- **Critérios de aceite:** label associado, submit por Enter/botão, botão desabilitado em termo inválido, sugestões distinguem homônimos.
- **Dependências:** T-05, T-17.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** P.

### T-20 — Testar SearchBar

- **ID:** T-20
- **Título:** Cobrir busca, vazio e seleção.
- **Descrição curta:** validar comportamento visível e acessível do campo.
- **Critérios de aceite:** verifica input, submit, lista de sugestões, vazio, erro e seleção por roles/labels.
- **Dependências:** T-19.
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

### T-21 — Implementar clima atual

- **ID:** T-21
- **Título:** Criar CurrentWeather.
- **Descrição curta:** apresentar condições atuais, unidades, horário e frescor.
- **Critérios de aceite:** campos ausentes aparecem “Indisponível”; observação >2 h mostra “Desatualizado” e horário.
- **Dependências:** T-04, T-07, T-09, T-11.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** P.

### T-22 — Testar CurrentWeather

- **ID:** T-22
- **Título:** Cobrir dados atuais completos/parciais.
- **Descrição curta:** validar unidade, labels e atualização visíveis.
- **Critérios de aceite:** testes cobrem valor completo, null, conversão e observação recente/desatualizada.
- **Dependências:** T-21.
- **Arquivos prováveis:** `tests/unit/CurrentWeather.test.tsx`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

### T-23 — Implementar cartão de previsão

- **ID:** T-23
- **Título:** Criar ForecastCard.
- **Descrição curta:** mostrar resumo de uma data diária.
- **Critérios de aceite:** data, condição, mínima/máxima, precipitação e vento são apresentados; campos ausentes ficam identificados.
- **Dependências:** T-07, T-09, T-11.
- **Arquivos prováveis:** `src/components/ForecastCard.tsx`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** P.

### T-24 — Testar ForecastCard

- **ID:** T-24
- **Título:** Cobrir resumo diário.
- **Descrição curta:** validar valores completos e parciais do cartão.
- **Critérios de aceite:** teste confere data, unidade, conversão e campos indisponíveis por queries acessíveis.
- **Dependências:** T-23.
- **Arquivos prováveis:** `tests/unit/ForecastCard.test.tsx`.
- **Tipo:** Test; **Prioridade:** P1; **Tamanho:** P.

### T-25 — Implementar lista de cinco dias

- **ID:** T-25
- **Título:** Criar ForecastList.
- **Descrição curta:** ordenar e compor cinco cartões por data local.
- **Critérios de aceite:** renderiza exatamente cinco itens em ordem cronológica com keys estáveis; grade adapta-se aos breakpoints da spec.
- **Dependências:** T-23.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** P.

### T-26 — Testar ForecastList

- **ID:** T-26
- **Título:** Cobrir lista de previsão.
- **Descrição curta:** validar quantidade e ordem dos dias.
- **Critérios de aceite:** lista contém cinco itens e preserva a ordem das datas fornecidas.
- **Dependências:** T-25.
- **Arquivos prováveis:** `tests/unit/ForecastList.test.tsx`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

### T-27 — Implementar toggle de unidade

- **ID:** T-27
- **Título:** Criar UnitToggle.
- **Descrição curta:** permitir alternar Celsius/Fahrenheit com estado acessível.
- **Critérios de aceite:** ambas as opções têm nome acessível e `aria-pressed` reflete a unidade ativa.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** P.

### T-28 — Testar toggle de unidade

- **ID:** T-28
- **Título:** Cobrir estado selecionado e callback.
- **Descrição curta:** testar o controle sem dependência da tela completa.
- **Critérios de aceite:** Celsius/Fahrenheit atualizam `aria-pressed` e disparam o valor esperado.
- **Dependências:** T-27.
- **Arquivos prováveis:** `tests/unit/UnitToggle.test.tsx`.
- **Tipo:** Test; **Prioridade:** P1; **Tamanho:** P.

### T-29 — Implementar loading e vazio

- **ID:** T-29
- **Título:** Criar estados LoadingState e EmptyState.
- **Descrição curta:** representar espera e ausência de seleção/resultados com mensagens distintas.
- **Critérios de aceite:** loading tem `role=status`; vazio tem heading e descrição acessíveis; conteúdo está em pt-BR.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`, `src/components/states/EmptyState.tsx`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** P.

### T-30 — Implementar estado de erro

- **ID:** T-30
- **Título:** Criar ErrorState com retry manual.
- **Descrição curta:** apresentar falha e expor a ação de nova tentativa.
- **Critérios de aceite:** mensagem usa `role=alert`; botão chama callback uma vez por ativação e tem foco visível.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** P.

### T-31 — Testar estados de interface

- **ID:** T-31
- **Título:** Cobrir loading, vazio e erro.
- **Descrição curta:** validar mensagens, roles e retry dos estados reutilizáveis.
- **Critérios de aceite:** estados têm roles distintos; retry chama callback; consultas usam roles/labels.
- **Dependências:** T-29, T-30.
- **Arquivos prováveis:** `tests/unit/states.test.tsx`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

## Entrega 6 — Integração

### T-32 — Compor a tela principal

- **ID:** T-32
- **Título:** Conectar hook e componentes em App.
- **Descrição curta:** substituir placeholders pelo fluxo de busca, clima, previsão, unidade e estados.
- **Critérios de aceite:** seleção apresenta loading/success/error; vazio e sucesso são distintos; alternar unidade não refaz consulta.
- **Dependências:** T-17, T-19, T-21, T-25, T-27, T-29, T-30.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI; **Prioridade:** P0; **Tamanho:** P.

### T-33 — Testar composição de App

- **ID:** T-33
- **Título:** Validar integração dos estados na tela.
- **Descrição curta:** mockar services e verificar os fluxos observáveis do App.
- **Critérios de aceite:** testes cobrem empty inicial, loading, seleção e sucesso, erro/retry e mudança de unidade sem rede real.
- **Dependências:** T-32, T-18.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

## Entrega 7 — E2E

### T-34 — Testar fluxo principal

- **ID:** T-34
- **Título:** Cobrir busca, consulta e conversão ponta a ponta.
- **Descrição curta:** interceptar geocoding/forecast e executar o fluxo feliz.
- **Critérios de aceite:** cidade é selecionada, clima atual e cinco dias aparecem, toggle altera temperaturas; nenhuma API real é chamada.
- **Dependências:** T-32, T-33.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** M.

### T-35 — Testar estados E2E de busca e API

- **ID:** T-35
- **Título:** Cobrir vazio, homônimos, falha e retry.
- **Descrição curta:** verificar fluxos alternativos com respostas de rede controladas.
- **Critérios de aceite:** geocoding vazio não chama forecast; homônimos exigem seleção; falha mostra erro; retry manual conclui sucesso.
- **Dependências:** T-34.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Tipo:** Test; **Prioridade:** P1; **Tamanho:** M.

### T-36 — Testar viewports responsivos

- **ID:** T-36
- **Título:** Cobrir matriz de telas E2E.
- **Descrição curta:** validar busca e previsão nos quatro viewports da spec, incluindo mobile.
- **Critérios de aceite:** sem overflow horizontal e controles principais visíveis em `320x568`, `768x1024`, `1280x800`, `1920x1080`.
- **Dependências:** T-32.
- **Arquivos prováveis:** `tests/e2e/responsive.spec.ts`.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** P.

## Entrega 8 — Hardening

### T-37 — Auditar acessibilidade

- **ID:** T-37
- **Título:** Validar fluxos principais conforme WCAG 2.2 AA.
- **Descrição curta:** combinar avaliação automatizada com revisão manual de teclado/leitor de tela.
- **Critérios de aceite:** registrar achados e corrigir bloqueadores nos fluxos de busca, seleção, consulta e unidade.
- **Dependências:** T-34, T-36.
- **Arquivos prováveis:** relatório de auditoria e, se necessário, componentes afetados.
- **Tipo:** Test; **Prioridade:** P0; **Tamanho:** M.

### T-38 — Medir desempenho

- **ID:** T-38
- **Título:** Executar benchmark da baseline.
- **Descrição curta:** medir cargas frias e buscas no perfil controlado da spec.
- **Critérios de aceite:** 20 cargas frias e 20 buscas registram p75/p95, ambiente e comparação com limites NFR-02.
- **Dependências:** T-34, T-36.
- **Arquivos prováveis:** relatório de benchmark.
- **Tipo:** Test; **Prioridade:** P1; **Tamanho:** M.

### T-39 — Validar usabilidade com participantes

- **ID:** T-39
- **Título:** Executar teste moderado das personas.
- **Descrição curta:** avaliar busca, consulta atual e previsão com cinco participantes.
- **Critérios de aceite:** pelo menos quatro concluem busca + clima atual em até 30 s e previsão em até 60 s sem ajuda; resultados são registrados.
- **Dependências:** T-34, T-36.
- **Arquivos prováveis:** roteiro e relatório de teste.
- **Tipo:** Test; **Prioridade:** P1; **Tamanho:** M.

### T-40 — Verificar gate de publicação Open-Meteo

- **ID:** T-40
- **Título:** Confirmar conformidade do provedor.
- **Descrição curta:** verificar termos, atribuição exigida e limites de uso vigentes.
- **Critérios de aceite:** evidência da verificação registrada; publicação só ocorre se a integração estiver em conformidade.
- **Dependências:** T-15, T-34.
- **Arquivos prováveis:** registro de release.
- **Tipo:** Infra; **Prioridade:** P0; **Tamanho:** P.

## Rastreabilidade FR → tarefas

| Requisito | Tarefas que o implementam e validam |
|---|---|
| FR-01 — Buscar/selecionar cidade | T-02, T-13, T-17, T-19, T-34–T-36 |
| FR-02 — Consultar clima atual | T-15, T-17, T-21, T-32–T-35 |
| FR-03 — Previsão de cinco dias | T-15, T-17, T-23, T-25, T-32–T-36 |
| FR-04 — Alternar unidade | T-07, T-17, T-27, T-32–T-34 |
| FR-05 — Estados da experiência | T-13–T-18, T-29–T-35 |

Todos os requisitos funcionais da spec têm tarefas correspondentes.

## Fatias verticais sugeridas

1. **Busca visível:** T-01–T-04, T-13, T-17, T-19, T-29, T-32–T-34. Resultado: shell com busca real, sugestões e empty state.
2. **Clima atual:** T-15, T-21–T-22, T-32–T-34. Resultado: cidade selecionada com condições e atualização.
3. **Previsão e unidades:** T-05–T-12, T-23–T-28, T-32–T-34. Resultado: cinco dias e alternância Celsius/Fahrenheit.
4. **Hardening/release:** T-35–T-40. Resultado: fluxo validado, acessibilidade, benchmark e gates de publicação.

## Prompt para Coding Agent — T-01

> **Contexto:** implemente somente T-01 deste backlog. A fonte da verdade é `specs/weather-app-spec.md`; o plano é `plans/weather-app-plan.md`. O repositório usa TypeScript strict, React/Vite, pnpm e Biome. Não implemente busca, UI de feature ou chamadas Open-Meteo nesta tarefa.
>
> **Objetivo:** declarar os contratos de domínio normalizados em `src/types/weather.ts`.
>
> **Critérios de aceite:**
> - Exportar `Unit = 'celsius' | 'fahrenheit'`.
> - Exportar interfaces `City`, `CurrentWeather`, `ForecastDay` e `WeatherData` com os campos e nulabilidade definidos no Data Model do plano.
> - Exportar `RequestState<T>` como união discriminada para `idle`, `loading`, `success`, `empty` e `error`; erro inclui categoria e mensagem.
> - Temperaturas têm Celsius como unidade de origem; campos meteorológicos opcionais aceitam `null`.
> - Os contratos compilam em TypeScript strict; não adicionar dependências nem lógica de runtime.
>
> **Arquivo permitido:** `src/types/weather.ts`.
>
> **Validação:** executar `pnpm lint`, `pnpm build` e `pnpm test`. Preservar todas as alterações preexistentes fora do arquivo permitido.
