# PokeApp - Ionic & Angular

Este projeto é um aplicativo construído com Ionic e Angular para exibir informações detalhadas sobre Pokémons utilizando a PokeAPI.

## Abordagem

- Utilizei componentes standalone do Angular para modularizar a aplicação.
- Carregamento dinâmico de componentes com `loadComponent`.
- Uso de Observables para consumo assíncrono dos dados da API com o serviço `PokeapiService`.
- Implementação de rotas para navegação entre a lista de Pokémons e detalhes individuais.

## Estilo de codificação

- Código escrito em TypeScript com tipagem explícita onde possível.
- Uso consistente de async/await via Observables para evitar callbacks aninhados.
- Métodos organizados por responsabilidade clara dentro dos componentes.

## Padrões de design

- Arquitetura baseada em componentes para garantir reutilização e manutenção.
- Serviços dedicados para manipulação da lógica de API, isolando a camada de apresentação.
- Navegação via Router do Angular para fluxo previsível.
- Uso do padrão Observer para atualizar a interface reativamente conforme os dados chegam.

![Demonstração](./src/assets/media/Pokeapp%20‐%20Feito%20com%20o%20Clipchamp.gif)

---
Projeto desenvolvido como HackerRank prático em Angular, Ionic e consumo de APIs REST.
