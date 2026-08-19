# Backend - Cadastro de Jutsus

## Requisitos
- Java 17+
- Maven 3.9+ (ou Maven Wrapper, se o STS gerar um)
- Spring Tool Suite 4

## Executar
No STS:
1. File > Import > Existing Maven Projects.
2. Selecione esta pasta `backend`.
3. Aguarde o Maven baixar as dependências.
4. Execute `JutsusApplication.java` como Spring Boot App.

API:
- GET `http://localhost:8080/api/jutsus`
- GET `http://localhost:8080/api/jutsus/{id}`
- POST `http://localhost:8080/api/jutsus`
- PUT `http://localhost:8080/api/jutsus/{id}`

Banco:
- H2 em arquivo: `./data/jutsusdb`
- Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/jutsusdb`
- User: `sa`
- Password: vazio

## Regras implementadas
- ID automático.
- Nome obrigatório.
- Nome duplicado bloqueado.
- Natureza: Fogo, Água, Vento, Terra ou Raio.
- Rank: S, A, B, C ou D.
- Custo de chakra >= 0.
- Rank S exige custo >= 100.
- As regras são validadas no backend antes da persistência.
