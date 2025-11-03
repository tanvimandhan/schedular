exports.up = function(knex) {
  return knex.schema.createTable('slots', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title').notNullable();
    table.text('description');
    table.integer('day_of_week').notNullable(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.boolean('is_recurring').defaultTo(true);
    table.date('effective_from').notNullable();
    table.date('effective_until');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Ensure only 2 slots per day (enforced by application logic)
    table.index(['day_of_week', 'is_active'], 'idx_day_active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('slots');
};
