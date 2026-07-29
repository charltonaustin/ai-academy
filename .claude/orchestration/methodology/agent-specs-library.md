# Agent Specs Library: Quick Reference & Decision Guide

## Overview: Understanding Agent Types & When to Use Them

**Purpose:** Quick reference for understanding agent types, coordination requirements, and proven patterns from low/high
coordination experiments.

**For Detailed Specifications:** See `.claude/agents/[agent-name].md` for copy-paste ready prompts with all protocols
included.

**This File:** Evidence-based overview to help decide which agents to use for your feature.

**Evidence Base:** All agent types tested through actual parallel execution with documented results and methodology
learnings.

## Infrastructure-Independent Agent Specifications (✅ Proven Low-Risk)

### 1. Database Setup Agent

**Task Scope:** PostgreSQL + Sequelize setup with complete schema implementation
**Coordination Requirements:** Minimal - basic naming conventions only
**Quality Standards:** Production-ready database configuration + comprehensive migrations
**Evidence:** Proven success - seamlessly integrated with other agents

**Detailed Spec:** See `.claude/agents/database-setup.md` (to be created)

**Quick Overview:**

```
## Database Setup Agent Task

### Primary Objectives:
- Set up PostgreSQL database with production-ready configuration
- Implement Sequelize ORM with complete schema definition
- Create all necessary migrations for data model
- Ensure type-safe database access throughout application

### Technical Requirements:
- PostgreSQL database (version 14+)
- Sequelize ORM with TypeScript integration
- Database migrations in version control
- Seed data for development and testing
- Connection pooling and error handling

### Quality Standards:
- All database operations type-safe
- Migration scripts tested and reversible
- Comprehensive error handling for database operations
- Performance considerations for queries and indexes
- Documentation for schema decisions and relationships

### Deliverables:
- Sequelize models with complete data model
- Database migration files
- Seed scripts for development data
- Database configuration and connection setup
- Type definitions generated from models

### SESSION LOGGING REQUIREMENT (MANDATORY):
- Create: `.claude/workspace/[FEATURE]/agent-logs/database-agent-session.md`
- Use: Infrastructure Agent Log template from `.claude/methodology/logging-templates.md`
- Log: Technology decisions, database design choices, integration setup decisions
- Purpose: Teaching material for database setup methodology and coordination patterns
```

**Coordination Integration Points:**

- Schema naming conventions (camelCase recommended)
- Primary key patterns (UUID vs integer)
- Timestamp field standards (createdAt, updatedAt)
- Enum definitions shared with other agents

### 2. API Scaffolding Agent

**Task Scope:** NestJS modular REST API setup with type-safe foundations
**Coordination Requirements:** Minimal - API contract definitions only
**Quality Standards:** Professional API structure + comprehensive error handling
**Evidence:** Proven success - provided stable foundation for other agents

**Specification Template:**

```
## API Scaffolding Agent Task

### Primary Objectives:
- Set up NestJS backend with modular architecture
- Implement a modular REST API (feature modules + controllers)
- Create type-safe API foundations with TypeScript
- Establish error handling and logging patterns

### Technical Requirements:
- NestJS 11.x with module-based architecture
- REST controllers (`@nestjs/platform-express`) with a global `ValidationPipe`
- TypeScript integration throughout API layer
- Comprehensive error handling (exception filters)
- Request logging and performance monitoring

### Quality Standards:
- All API endpoints type-safe and documented
- Consistent error response patterns (real HTTP status codes)
- Security best practices (CORS, rate limiting)
- Performance monitoring and optimization
- Integration testing setup for API endpoints (Supertest)

### Deliverables:
- NestJS module structure
- Root REST setup (global prefix/versioning, `ValidationPipe`)
- Error handling middleware (exception filters)
- API documentation and type definitions
- Security configuration and middleware
```

**Coordination Integration Points:**

- REST route naming conventions
- Error response format standards
- Authentication middleware interfaces
- Shared DTO/type extension points

### 3. UI Foundation Agent

**Task Scope:** Angular app structure + component library + routing setup
**Coordination Requirements:** Minimal - design system + routing conventions only
**Quality Standards:** Professional UI architecture + accessibility standards
**Evidence:** Proven success - enabled parallel component development

**Specification Template:**

```
## UI Foundation Agent Task

### Primary Objectives:
- Set up Angular application structure with modern tooling
- Implement component library (Angular Material) with customization
- Create routing structure with Angular Router
- Establish design system and styling conventions

### Technical Requirements:
- Angular with TypeScript and modern build tools
- Angular Material component library implementation
- Tailwind CSS with custom design tokens
- Responsive design patterns and accessibility standards
- Angular Router for navigation and routing

### Quality Standards:
- All UI components accessible (WCAG 2.1 AA)
- Responsive design across all screen sizes
- Consistent design system throughout application
- Professional typography and spacing patterns
- SEO optimization and meta tag management

### Deliverables:
- Angular application structure and configuration
- Component library setup and customization
- Design system with tokens and variables
- Navigation components and routing setup
- Accessibility standards and testing setup
```

**Coordination Integration Points:**

- Component naming conventions
- Design token definitions (colors, spacing, typography)
- Page routing structure
- State management patterns

### 4. Deployment Configuration Agent

**Task Scope:** Production deployment setup + CI/CD + environment management
**Coordination Requirements:** Minimal - environment variable conventions only
**Quality Standards:** Production-ready deployment + monitoring setup
**Evidence:** Proven success - enabled seamless production deployment

**Specification Template:**

```
## Deployment Configuration Agent Task

### Primary Objectives:
- Set up production deployment configuration for Vercel
- Implement environment management for development/staging/production
- Create CI/CD pipeline with quality checks
- Establish monitoring and error tracking

### Technical Requirements:
- Vercel deployment configuration
- Environment variable management
- Database hosting setup (external PostgreSQL)
- CI/CD pipeline with testing and linting
- Error monitoring and performance tracking

### Quality Standards:
- Zero-downtime deployment patterns
- Comprehensive environment variable management
- Automated testing in CI/CD pipeline
- Production monitoring and alerting
- Security scanning and vulnerability checking

### Deliverables:
- Vercel deployment configuration
- Environment management setup
- CI/CD pipeline configuration
- Monitoring and error tracking setup
- Production database configuration
```

**Coordination Integration Points:**

- Environment variable naming conventions
- Build script requirements
- Testing pipeline integration points
- Production URL and domain configuration

## Contract-Code Integration Specifications (⚠️ Requires Coordination Architecture)

### 5. API Types Agent (with Coordination Mechanisms)

**Task Scope:** Complete shared TypeScript DTO/interface types + REST route map
**Coordination Requirements:** HIGH - Contract-first approach with cross-agent validation required
**Quality Standards:** Type-safe contract + comprehensive API design
**Evidence:** Coordination challenges identified, systematic solutions developed

**Detailed Spec:** See `.claude/agents/api-types.md` (to be created)

**Quick Overview:**

```
## API Types Agent Task (Coordination-Enhanced)

### Primary Objectives:
- Define complete DTO/interface types for all resources and operations
- Implement a contract-first development approach
- Create comprehensive API documentation (route map)
- Establish type safety contracts for other agents

### Technical Requirements:
- Shared TypeScript type definitions with full coverage (request DTOs + response interfaces)
- `class-validator` decorators on request DTOs; `PartialType` for updates
- A route map (method + path + request/response type) for all operations
- Type safety integration with TypeScript
- Documentation for every type/route

### COORDINATION REQUIREMENTS (Critical):
- **Field Naming Convention Lock:** Use camelCase throughout (leadId, budgetMin, budgetMax)
- **Cross-Agent Validation:** Provide the shared types module for controller and UI agents
- **Type Definition Sharing:** Export DTO/interface types for cross-agent use
- **Contract Review Protocol:** Other agents must validate against the actual types, not assumptions

### Quality Standards:
- All operations fully typed (request + response)
- Types follow REST/DTO best practices
- Comprehensive documentation for all types
- Performance considerations for payload shapes
- Security considerations for data exposure

### Deliverables:
- Complete shared types module (`api-types.ts`)
- Request DTOs with validation rules
- Route map documentation
- Type safety integration setup
- Cross-agent coordination files (type exports)
```

**Mandatory Coordination Integration:**

- Shared types module export for other agents to import
- DTO/interface types that other agents inherit
- Field naming convention documentation
- Contract evolution and versioning protocols

### 6. REST Controllers Agent (Contract-Dependent)

**Task Scope:** REST controllers + service implementation + data access patterns
**Coordination Requirements:** HIGH - Must reference actual DTOs from the Types Agent
**Quality Standards:** Type-safe controllers + optimal query patterns
**Evidence:** Field naming mismatch challenges, systematic coordination solution designed

**Enhanced Specification Template:**

```
## REST Controllers Agent Task (Contract-Coordination Required)

### Primary Objectives:
- Implement REST controllers for all routes in the route map
- Create efficient database query patterns with Sequelize
- Establish data access and caching strategies
- Implement authentication and authorization logic

### Technical Requirements:
- NestJS controllers (`@Controller`/`@Get`/`@Post`/`@Patch`/`@Delete`) + services
- Sequelize integration for database operations
- Query optimization and N+1 problem prevention
- Authentication guards and request context setup
- Error handling for database operations (exception filters, real status codes)

### COORDINATION REQUIREMENTS (Critical):
- **Types Import Mandatory:** Must import and reference the actual DTOs from the Types Agent
- **Field Name Validation:** All controller request/response field names must match the DTOs exactly
- **Type Inheritance:** Use the shared types from the Types Agent, never duplicate
- **Cross-Validation Protocol:** Verify field compatibility before implementation

### Quality Standards:
- All controllers fully type-safe with the shared DTOs
- Optimal database query patterns (no N+1 problems)
- Comprehensive error handling and logging
- Authentication and authorization throughout
- Performance monitoring for query optimization

### Deliverables:
- Complete REST controller + service implementation
- Database query optimization
- Authentication and authorization logic
- Error handling and logging setup
- Performance monitoring integration
```

**Mandatory Coordination Requirements:**

- Import DTO/interface types from the Types Agent (not recreate)
- Use exact field names from the DTOs (automated validation recommended)
- Inherit TypeScript types from the shared types module
- Cross-agent field compatibility verification

### 7. UI Component Agent (Data-Layer Dependent)

**Task Scope:** Angular components + services + REST data integration
**Coordination Requirements:** HIGH - Must use the actual REST endpoints and shared types
**Quality Standards:** Professional UI + type-safe data integration
**Evidence:** Data structure assumption challenges, coordination solutions identified

**Enhanced Specification Template:**

```
## UI Component Agent Task (Data-Coordination Required)

### Primary Objectives:
- Implement Angular components for all application features
- Create data services (HttpClient) for data management and state
- Integrate with the REST endpoints for data fetching
- Establish UI patterns and component composition

### Technical Requirements:
- Angular components with TypeScript integration
- HttpClient data services for fetching and state management (signals)
- `HttpClient` calls to the documented REST routes
- Component composition and reusability patterns
- Responsive design and accessibility standards

### COORDINATION REQUIREMENTS (Critical):
- **Endpoint Reuse:** Must call the actual REST routes from the Controllers Agent's route map
- **Type Inheritance:** Use the shared types from the Types Agent for all props
- **Library Version Alignment:** Use `HttpClient` service patterns consistently
- **Data Structure Validation:** Verify component data expectations match the actual DTOs

### Quality Standards:
- All components fully type-safe with the API response types
- Consistent component patterns and composition
- Accessibility standards (WCAG 2.1 AA) throughout
- Responsive design across all screen sizes
- Professional UI patterns and user experience

### Deliverables:
- Complete Angular component implementation
- HttpClient data services for data management
- `provideHttpClient()` wiring and base-URL configuration
- Component documentation and usage examples
- Accessibility and responsive design validation
```

**Mandatory Coordination Requirements:**

- Call the actual REST endpoints (not invent new paths)
- Use the shared TypeScript types from the Types Agent
- `HttpClient` pattern consistency
- Data structure expectation validation against the actual DTOs

## Agent Specification Usage Guidelines

### For Low-Risk Parallel Tasks (Infrastructure-Independent)

1. **Direct Implementation:** Use specifications as-is with minimal coordination overhead
2. **Basic Conventions:** Establish naming conventions and basic integration points only
3. **Quality Focus:** Emphasis on individual agent quality and professional standards
4. **Simple Integration:** Integration testing straightforward and low-risk

### For High-Risk Parallel Tasks (Schema-Code Dependencies)

1. **Coordination Architecture First:** Implement systematic coordination mechanisms before parallel execution
2. **Technology Stack Lock:** Establish all library versions and patterns before agent execution
3. **Cross-Agent Validation:** Mandatory verification of compatibility during execution
4. **Integration Validation Layer:** Systematic testing between parallel completion and delivery

### Quality Standards for All Specifications

- **Professional Development Practices:** ESLint, TypeScript, testing throughout
- **A/A+ Code Quality:** Professional standards maintained across all parallel agents
- **Documentation Requirements:** Clear documentation for coordination and maintenance
- **Integration Readiness:** All agents deliver integration-ready code, not just functional code

## Evidence Base and Validation

### Low Coordination Success Patterns

- **Infrastructure-Independent Specifications:** All 4 agents completed successfully with seamless integration
- **Professional Quality:** A+ grade code delivered across all parallel agents
- **Integration Success:** Fresh clone → working application achieved

### High Coordination Learning Integration

- **Coordination Architecture Requirements:** Specifications enhanced with systematic coordination mechanisms
- **Technology Stack Management:** Library version and pattern coordination built into specifications
- **Cross-Agent Communication:** Validation and consultation protocols integrated into high-risk specifications
- **Integration Validation:** System-level testing requirements added to all coordination-required specifications

## How to Use This Library

### Quick Reference (This File)

Use this file to:

- **Decide which agents you need** for your feature
- **Understand coordination requirements** (low/medium/high)
- **See proven patterns** from low/high coordination experiments
- **Get quick overview** of agent capabilities

### Detailed Specifications (`.claude/agents/` directory)

Use individual agent files for:

- **Copy-paste ready prompts** with all protocols included
- **Complete task specifications** with validation checklists
- **Full configuration examples** and code samples
- **Execution-ready** for immediate agent launch

### Current Agent Library Status

**✅ Detailed Specs Available:**

- Testing Infrastructure Agent (`.claude/agents/testing-infrastructure-agent.md`)

**📝 To Be Created (Extract from this file):**

- Database Setup Agent (`.claude/agents/database-setup.md`)
- API Scaffolding Agent (`.claude/agents/api-scaffolding.md`)
- UI Foundation Agent (`.claude/agents/ui-foundation.md`)
- Deployment Config Agent (`.claude/agents/deployment-config.md`)
- API Types Agent (`.claude/agents/api-types.md`)
- REST Controllers Agent (`.claude/agents/rest-controllers.md`)
- UI Component Agent (`.claude/agents/ui-component.md`)

---

## Status: Agent Specifications Ready for Replication

**✅ Low-Risk Specifications:** Infrastructure-independent patterns validated and reusable
**✅ High-Risk Specifications:** Schema-code coordination mechanisms systematically designed
**✅ Quality Standards:** Professional development practices maintained throughout
**✅ Evidence-Based:** All specifications tested through actual parallel execution with documented results

**Ready for:** Future implementation using proven specifications with appropriate coordination architecture.
