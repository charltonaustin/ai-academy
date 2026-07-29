# Quick Reference: NestJS + Sequelize + REST Patterns

**Purpose:** Common code patterns for new-crm tech stack

---

## NestJS Service Patterns

### Standard Service Structure

```typescript
// [Content: Standard NestJS service pattern]
```

### Dependency Injection

```typescript
// [Content: Constructor injection patterns]
```

---

## Sequelize Model Patterns

### Model Definition

```typescript
// [Content: Sequelize model with TypeScript]
```

### Associations

```typescript
// [Content: hasMany, belongsTo patterns]
```

---

## REST Controller Patterns

### Read Routes (GET)

```typescript
// [Content: Standard @Get() collection + @Get(':id') controller methods]
```

### Write Routes (POST / PATCH / DELETE)

```typescript
// [Content: @Post() (201), @Patch(':id'), @Delete(':id') (204) with DTOs + ValidationPipe]
```

---

## DTO & Validation Patterns

### Request DTOs (class-validator)

```typescript
// [Content: CreateXDto with @IsString/@IsEmail/@IsInt; UpdateXDto = PartialType(CreateXDto)]
```

### Nested Resource Routes

```typescript
// [Content: @Controller('leads/:leadId/interactions') nested route pattern]
```

---

## Testing Patterns

### Unit Test (Mocked)

```typescript
// [Content: Service test with mocked dependencies]
```

### Integration Test (Real DB)

```typescript
// [Content: End-to-end test with Sequelize]
```

---

**See Also:**

- Chapter 2: Infrastructure-First Pattern
- Chapter 5: Shared Types as the Coordination Contract
