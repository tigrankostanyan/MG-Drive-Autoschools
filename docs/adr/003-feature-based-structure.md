# ADR-003: Feature-Based Component Structure

## Status

Accepted

## Context

Frontend applications often use several organizational patterns:
- **Route-based**: Components grouped by route/page
- **Domain-based**: Components grouped by business domain
- **By type**: All components of same type together (ui/, forms/, tables/)
- **Feature-based**: Co-locating components by the feature they belong to

Given our requirements:
- Multiple user-facing features (profile, learning, quiz, admin)
- Shared UI primitives
- Future maintainability and team scaling

## Decision

We chose a **feature-based structure** with co-located modules, organized as:

```
src/
  components/
    feature-name/
      FeatureComponent.tsx
      sub-feature/
        SubComponent.tsx
      feature-name.schema.ts
      use-feature-name.ts
      feature-name.test.tsx
    shared/    # UI primitives (buttons, inputs, etc.)
    ui/        # shadcn-ui styled components
  routes/      # file-based routing
  hooks/       # shared hooks (not feature-specific)
  lib/         # business logic, API clients
```

### Co-location Rules

1. **Components and hooks**: Co-located with feature folder (`components/auth/useAuthForm.ts`)
2. **Tests**: Colocated next to implementation (`FeatureComponent.test.tsx`)
3. **Types/schemas**: Colocated with consuming code
4. **Shared UI**: In `components/shared/` or `components/ui/`

### Naming Conventions

| Type | Convention |
|------|------------|
| Feature components | PascalCase (`PasswordSignInForm.tsx`) |
| Feature hooks | camelCase with `use` prefix (`useGroupList.ts`) |
| API files | kebab-case (`student-groups.ts`) |
| Test files | same name with `.test.` suffix |

## Trade-offs

### Pros
- **Discoverability**: Find all code for a feature in one place
- **Encapsulation**: Features are self-contained, easier to extract as packages
- **Tree-shaking**: Imports are explicit and specific
- **Team scaling**: Teams can own feature folders without conflicts
- **Reduced coupling**: Clear boundaries between features

### Cons
- **File depth**: Some features create nested directory structures
- **Shared discovery**: Finding shared utilities requires searching across features
- **Learning curve**: New team members need to understand the pattern
- **Refactoring cost**: Moving shared code requires updating multiple imports

## Implementation

### Example Feature Structure

```
components/profile/
  AccountSettingsPersonalCard.tsx
  AccountSettingsAddressCard.tsx
  useProfile.ts
  data.ts
  useProfile.test.ts
```

### Import Path Aliases

Configured in `tsconfig.json`:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

Usage:
```typescript
import { Button } from "@/components/ui/button";
import { useAuthForm } from "@/components/auth";
```

### File Size Limit

Files limited to 150 lines (including imports, comments, blank lines). Split by cohesive responsibility, not arbitrarily.