import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const modules = sqliteTable('modules', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description')
});

export const testCases = sqliteTable('test_cases', {
  id: integer('id').primaryKey(),
  title: text('title', { length: 150 }).notNull(),
  description: text('description'),
  moduleId: integer('module_id').references(() => modules.id),
  preconditions: text('preconditions'),
  postconditions: text('postconditions'),
  expectedResult: text('expected_result')
});

export const testSteps = sqliteTable('test_steps', {
  id: integer('id').primaryKey(),
  testCaseId: integer('test_case_id').references(() => testCases.id),
  stepNumber: integer('step_number').notNull(),
  action: text('action'),
  expected: text('expected'),
  type: text('type', { length: 20 }) // normal | alternativo | excepcion
});

export const testCaseActors = sqliteTable('test_case_actors', {
  id: integer('id').primaryKey(),
  testCaseId: integer('test_case_id').references(() => testCases.id),
  actorName: text('actor_name', { length: 100 }).notNull()
});
