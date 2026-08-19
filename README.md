# Projeto Jutsus - Naruto

Aplicação web para cadastro, consulta e gerenciamento de Jutsus.

## Estrutura

Projeto_Jutsus/
├── backend/
│   ├── pom.xml
│   └── src/
└── frontend/
    ├── index.html
    ├── css/
    └── js/

## Tecnologias

Backend:
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- H2 Database

Frontend:
- HTML
- CSS
- JavaScript puro

## Regras do trabalho

RF01 - Cadastrar Jutsus.
RF02 - ID gerado automaticamente.
RF03 - Informar nome do Jutsu.
RF04 - Natureza: Fogo, Água, Vento, Terra ou Raio.
RF05 - Rank: S, A, B, C ou D.
RF06 - Custo de chakra em pontos.
RF07 - Nomes duplicados bloqueados.
RF08 - Custo negativo bloqueado.
RF09 - Rank S exige custo mínimo de 100 pontos.
RF10 - Persistir somente dados válidos.

Também foram incluídos, por solicitação do enunciado:
- edição;
- listagem;
- pesquisa/filtros;
- visualização detalhada;
- mensagens e estados de interface.

## Decisão de modelagem

Apenas uma entidade `Jutsu` é necessária com os quatro dados informados pelo enunciado, além do ID.
Não foram criadas tabelas de personagens, usuários ou categorias porque essas informações não foram fornecidas.

O H2 foi escolhido para deixar o projeto executável localmente sem exigir instalação de outro servidor de banco. O banco é persistido em arquivo, então os dados não são perdidos quando a aplicação é encerrada.

## Ordem para executar

1. Instale Java 17+.
2. Abra a pasta `backend` no Spring Tool Suite.
3. Importe como Maven Project.
4. Execute `JutsusApplication`.
5. Abra o `frontend/index.html` por um servidor local (Live Server).
6. Acesse a página do frontend.
7. Cadastre um Jutsu e confira os dados no banco.

## API

GET `/api/jutsus`
GET `/api/jutsus/{id}`
POST `/api/jutsus`
PUT `/api/jutsus/{id}`

Consulta com filtros:
`GET /api/jutsus?busca=ras&natureza=FOGO&rank=A`

## Banco H2

Console:
`http://localhost:8080/h2-console`

JDBC URL:
`jdbc:h2:file:./data/jutsusdb`

Usuário:
`sa`

Senha:
vazia
