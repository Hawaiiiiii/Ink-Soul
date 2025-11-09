# Guía de Contribución - Ink Soul App

¡Gracias por tu interés en contribuir a Ink Soul App! Esta guía te ayudará a contribuir de manera efectiva y seguir nuestros estándares de desarrollo.

## 🚀 Cómo Contribuir

### Tipos de Contribuciones
- 🐛 Reportar bugs
- 💡 Proponer nuevas funcionalidades
- 📝 Mejorar documentación
- 🔧 Corregir código existente
- ✨ Añadir nuevas características
- ♿ Mejorar accesibilidad
- 🔒 Fortalecer seguridad

### Antes de Comenzar
1. **Busca issues existentes** para evitar duplicados
2. **Crea un issue** si no existe el problema que quieres resolver
3. **Comunica tu intención** de trabajar en una característica
4. **Sigue los estándares** de código y diseño

## 📋 Estándares de Código

### Tecnologías Principales
- **Frontend**: React 18+ con TypeScript
- **Build Tool**: Vite
- **Estilos**: TailwindCSS
- **Backend**: Supabase (Edge Functions, Database, Auth)
- **Testing**: Jest + React Testing Library

### Convenciones de Código

#### TypeScript
```typescript
// ✅ Bien - Interfaces y tipos claros
interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// ✅ Bien - Funciones tipadas
const getUserData = async (userId: string): Promise<UserProfile | null> => {
  // implementación
};
```

#### Estructura de Archivos
```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (botones, inputs)
│   └── features/       # Componentes específicos de features
├── pages/              # Páginas de la aplicación
├── hooks/              # Custom hooks
├── lib/                # Utilidades y configuraciones
├── types/              # Definiciones de tipos TypeScript
├── data/               # Datos estáticos y mocks
└── styles/             # Estilos globales
```

#### Nombramiento
- **Archivos**: PascalCase para componentes (`UserProfile.tsx`)
- **Hooks**: camelCase empezando con 'use' (`useAuth.ts`)
- **Utilidades**: camelCase (`formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

#### CSS y TailwindCSS
```css
/* ✅ Bien - Usar clases de TailwindCSS */
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">

/* ❌ Mal - Estilos inline extensos */
<button style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px' }}>
```

## 🔄 Proceso de Pull Request

### 1. Preparación
```bash
# 1. Fork del repositorio
git clone https://github.com/tu-usuario/ink-soul-app.git

# 2. Crear branch para feature
git checkout -b feature/nueva-funcionalidad

# 3. Instalar dependencias
npm install
```

### 2. Desarrollo
1. **Sigue los estándares** de código establecidos
2. **Escribe commits descriptivos**:
   ```
   feat: añadir sistema de autenticación
   fix: corregir validación de formulario de login
   docs: actualizar documentación de API
   test: añadir tests para componente UserProfile
   ```

### 3. Antes del PR
- [ ] Ejecuta todos los tests: `npm test`
- [ ] Verifica linting: `npm run lint`
- [ ] Build exitoso: `npm run build`
- [ ] Accesibilidad verificada (para cambios UI)
- [ ] Documentación actualizada

### 4. Crear PR
1. **Título descriptivo**: `feat: sistema de comentarios en gallery`
2. **Descripción completa**:
   ```markdown
   ## Descripción
   Breve descripción de los cambios
   
   ## Cambios
   - Añadido componente CommentSection
   - Integrada API de comentarios
   - Tests unitarios incluidos
   
   ## Screenshots
   [Si aplica, añadir capturas]
   
   ## Testing
   - [ ] Tests manuales completados
   - [ ] Cross-browser testing
   - [ ] Mobile responsive
   ```
3. **Asignar reviewers** apropiados
4. **Linkear issues** relacionados

### 5. Review Process
- **Al menos 2 approvals** requeridas
- **Todos los CI/CD checks** deben pasar
- **Resolve conversations** antes de merge
- **Squash commits** al hacer merge

## 🧪 Testing

### Estrategia de Testing
1. **Unit Tests**: Componentes individuales
2. **Integration Tests**: Interacciones entre componentes
3. **E2E Tests**: Flujos completos de usuario

### Ejecutar Tests
```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests en watch mode
npm run test:watch

# Tests E2E
npm run test:e2e
```

### Escribir Tests
```typescript
// ✅ Bien - Test claro y completo
describe('UserProfile Component', () => {
  it('should display user information correctly', () => {
    const mockUser = { id: '1', username: 'john', role: 'user' };
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('john')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Profile picture');
  });
});
```

### Coverage Requirements
- **Mínimo 80%** de coverage para nuevas features
- **100% coverage** para funcionalidades críticas (auth, payments)

## 🔒 Contribuciones que Afecten /admin

### ⚠️ Consideraciones Especiales
Las contribuciones que modifiquen funcionalidades de `/admin` requieren atención especial debido a su naturaleza sensible y privilegios elevados.

### 🔧 Uso de Datos Ficticios en Desarrollo

#### Datos Mock Requeridos
```typescript
// ✅ Datos ficticios para testing admin
const mockAdminData = {
  users: [
    {
      id: 'mock-user-1',
      email: 'admin@test.com',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
      isActive: true
    }
  ],
  analytics: {
    totalUsers: 150,
    activeUsers: 89,
    totalRevenue: 25000
  }
};
```

#### Configuración de Environment
```bash
# .env.development
VITE_USE_MOCK_DATA=true
VITE_ADMIN_MOCK_MODE=true
```

**Reglas**:
- **SIEMPRE** usar datos mock en desarrollo
- **NUNCA** conectar con datos reales en entorno de desarrollo
- **LIMPIAR** datos mock antes de PR
- **DOCUMENTAR** qué datos mock se usaron

### 🔐 Validación de RBAC (Role-Based Access Control)

#### Estructura de Roles
```typescript
type AdminPermission = 
  | 'users.read'
  | 'users.write'
  | 'analytics.read'
  | 'settings.write'
  | 'content.moderate';

interface AdminUser {
  id: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
}
```

#### Implementación de Validación
```typescript
// ✅ Validación RBAC requerida
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, hasPermission } = useAuth();
  
  if (!hasPermission('analytics.read')) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
};
```

#### Checklist RBAC
- [ ] **Verificación de permisos** en cada endpoint admin
- [ ] **Middleware de autorización** implementado
- [ ] **Escalation de privilegios** documentado
- [ ] **Logs de auditoría** para acciones sensibles
- [ ] **Tests de autorización** incluidos

### ♿ Checklist de Accesibilidad para Admin

#### WCAG 2.1 AA Compliance
```typescript
// ✅ Componentes admin accesibles
const AdminPanel = () => {
  return (
    <div role="main" aria-label="Panel de Administración">
      <h1 className="sr-only">Administración del Sistema</h1>
      
      {/* Tabla accesible */}
      <table role="table" aria-label="Lista de usuarios">
        <thead>
          <tr>
            <th scope="col" aria-sort="none">Usuario</th>
            <th scope="col" aria-sort="none">Rol</th>
            <th scope="col" aria-sort="none">Estado</th>
          </tr>
        </thead>
        <tbody>
          {/* Contenido de tabla */}
        </tbody>
      </table>
    </div>
  );
};
```

#### Puntos de Verificación
- [ ] **Navegación por teclado** completa
- [ ] **Screen readers** compatibles (aria-labels, roles)
- [ ] **Contraste de colores** ≥ 4.5:1
- [ ] **Focus indicators** visibles
- [ ] **Text escalable** hasta 200% sin scroll horizontal
- [ ] **Timeout warnings** para sesiones largas
- [ ] **Error messages** descriptivos con aria-live

#### Testing de Accesibilidad
```bash
# Testing automatizado
npm run test:a11y

# Testing manual con herramientas
# - axe DevTools
# - WAVE Web Accessibility Evaluator
# - Lighthouse Accessibility Audit
```

### 🔒 Consideraciones de Seguridad para Funcionalidades Admin

#### Principios de Seguridad
1. **Principio de Menor Privilegio**
2. **Defense in Depth**
3. **Zero Trust**

#### Validaciones Requeridas
```typescript
// ✅ Validaciones de seguridad
const AdminAction = async () => {
  // 1. Validación de entrada
  const sanitizedInput = sanitizeInput(userInput);
  
  // 2. Autorización
  await assertPermission('users.write');
  
  // 3. Rate limiting
  await checkRateLimit('admin-actions', user.id);
  
  // 4. Audit logging
  await logAdminAction('user_delete', { targetUserId });
  
  // 5. Transacción segura
  return await db.transaction(async (trx) => {
    // operación crítica
  });
};
```

#### Checklist de Seguridad Admin
- [ ] **Input sanitization** en todos los endpoints
- [ ] **SQL injection protection** (usar parameterized queries)
- [ ] **XSS prevention** (escapar output, CSP headers)
- [ ] **CSRF protection** para actions sensibles
- [ ] **Rate limiting** en endpoints administrativos
- [ ] **Audit logging** para todas las acciones críticas
- [ ] **Session management** segura
- [ ] **Multi-factor authentication** para acciones críticas
- [ ] **IP whitelisting** para funcionalidades ultra-sensibles
- [ ] **Encryption** para datos sensibles

#### Datos Sensibles
```typescript
// ❌ Nunca - Datos sensibles en logs o responses
const userData = {
  password: 'userPassword123',
  ssn: '123-45-6789',
  creditCard: '4532-1234-5678-9012'
};

// ✅ Correcto - Datos sanitizados
const safeUserData = {
  id: 'user-123',
  email: 'user@example.com',
  // Campos sensibles omitidos o tokenizados
};
```

#### Dependencias de Seguridad
```bash
# Auditoría de dependencias
npm audit

# Actualizar dependencias críticas
npm update express helmet cors
```

#### Testing de Seguridad
```typescript
// Tests de seguridad específicos
describe('Admin Security', () => {
  it('should prevent unauthorized access to admin routes', async () => {
    const response = await request(app)
      .get('/admin/users')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(403);
  });
  
  it('should validate input sanitization', async () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const response = await request(app)
      .post('/admin/users')
      .send({ username: maliciousInput });
    
    expect(response.body.username).not.toContain('<script>');
  });
});
```

## 📝 Documentación

### Documentación de Features
- [ ] **README actualizado** si añades nueva funcionalidad
- [ ] **JSDoc en código** para funciones complejas
- [ ] **Ejemplos de uso** para APIs
- [ ] **Changelog actualizado**

### Documentar Cambios Admin
Si tu contribución afecta `/admin`:
- [ ] **Security implications** documentadas
- [ ] **RBAC changes** claramente explicados
- [ ] **Migration notes** si hay cambios de DB
- [ ] **Access control matrix** actualizada

## 🚨 Reportar Issues

### Templates de Issues

#### Bug Report
```markdown
**Descripción**
Descripción clara del bug

**Repro Steps**
1. Ir a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Descripción de lo que esperaba que pasara

**Screenshots**
Si aplica

**Environment**
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 96]
- Version: [e.g. 22]
```

#### Feature Request
```markdown
**Problema que Resuelve**
¿Qué problema resuelve esta feature?

**Descripción de Solución**
Descripción clara de lo que quieres que pase

**Alternativas Consideradas**
Otras soluciones que consideraste

**Additional Context**
Screenshots, mocks, etc.
```

## 🎯 Proceso de Release

### Versionado
- **Major** (X.0.0): Breaking changes
- **Minor** (1.X.0): New features, backward compatible
- **Patch** (1.0.X): Bug fixes

### Branches
- **main**: Producción
- **develop**: Desarrollo
- **feature/***: Features
- **hotfix/***: Fixes urgentes

## 📞 Contacto y Soporte

### Canales de Comunicación
- **Issues**: Para bugs y features
- **Discussions**: Para preguntas generales
- **Email**: [contacto@inksoul.com] para temas sensibles

### Mantenedores
- **Lead Developer**: [@lead-developer]
- **Security**: [@security-team]
- **DevOps**: [@devops-team]

---

## 🙏 Reconocimiento

Todas las contribuciones son valoradas y reconocidas en:
- **Contributors.md**: Lista de contribuidores
- **Release notes**: Créditos por cada release
- **GitHub contributors**: Visibilidad automática

**¡Gracias por hacer Ink Soul App mejor!** 🎨✨

---

*Última actualización: Noviembre 2025*