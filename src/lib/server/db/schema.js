import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/** Usuarios registrados en el sistema */
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  email: text('email', { length: 150 }).notNull().unique(),
  passwordHash: text('password_hash', { length: 255 }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

/** Módulos funcionales del sistema */
export const modules = sqliteTable('modules', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description')
});

/** Casos de prueba asociados a un módulo */
export const testCases = sqliteTable('test_cases', {
  id: integer('id').primaryKey(),
  title: text('title', { length: 150 }).notNull(),
  description: text('description'),
  moduleId: integer('module_id').references(() => modules.id),
  preconditions: text('preconditions'),
  postconditions: text('postconditions'),
  expectedResult: text('expected_result'),
  status: text('status', { length: 20 }).default('untested').notNull()
});

/** Bugs reportados asociados a casos de prueba */
export const bugs = sqliteTable('bugs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title', { length: 150 }).notNull(),
  description: text('description').notNull(),
  severity: text('severity', { length: 20 }).notNull(),
  status: text('status', { length: 20 }).default('open').notNull(),
  testCaseId: integer('test_case_id').references(() => testCases.id),
  testStepId: integer('test_step_id').references(() => testSteps.id),
  reportedById: integer('reported_by_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

/** Pasos individuales de un caso de prueba */
export const testSteps = sqliteTable('test_steps', {
  id: integer('id').primaryKey(),
  testCaseId: integer('test_case_id').references(() => testCases.id),
  stepNumber: integer('step_number').notNull(),
  action: text('action'),
  expected: text('expected'),
  type: text('type', { length: 20 }) // normal | alternativo | excepcion
});

/** Actores involucrados en un caso de prueba */
export const testCaseActors = sqliteTable('test_case_actors', {
  id: integer('id').primaryKey(),
  testCaseId: integer('test_case_id').references(() => testCases.id),
  actorName: text('actor_name', { length: 100 }).notNull()
});

/** Comentarios polimórficos sobre cualquier entidad */
export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id),
  refTable: text('ref_table', { length: 100 }).notNull(),
  refId: integer('ref_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

/** Registro de auditoría para trazabilidad de cambios */
export const audits = sqliteTable('audits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  action: text('action', { length: 100 }).notNull(),
  userId: integer('user_id').references(() => users.id),
  refTable: text('ref_table', { length: 100 }).notNull(),
  refId: integer('ref_id').notNull(),
  details: text('details'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});
