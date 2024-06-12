# Identity-Reconciliation
Bitespeed Backend Task:


## Key Features:
  - TurboRepo Integration: Utilize TurboRepo for efficient management of a monorepo setup, enabling seamless development across multiple packages.
  - TypeScript: Leverage the power of TypeScript for strict type checking, improved code quality, and enhanced developer productivity.
  - Zod for Schema Validation: Ensure data consistency and reliability with Zod, a TypeScript-first schema validation library.
  - Jest Test Suite: Implement comprehensive test cases using Jest, a feature-rich JavaScript testing framework, for reliable and efficient testing.
  - Superset Integration: Enhance testing capabilities with Superset, offering advanced features for test management and reporting.


## API Reference



#### Identify API

```http
  GET /identify
```

##### curl:
```
curl --location 'https://identity-reconciliation-ans5.onrender.com/identify' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "g@gmail.com",
    "phoneNumber": "2"
}'
```

#### Get all items API(helper)

```http
  GET /getAll
```

##### curl:
```
curl --location 'https://identity-reconciliation-ans5.onrender.com/getAll'
```

#### Clear database API(helper)

```http
  GET /clear
```

##### curl:
```
curl --location --request DELETE 'https://identity-reconciliation-ans5.onrender.com/clear'
```
