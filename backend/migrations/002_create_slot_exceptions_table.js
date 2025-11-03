exports.up = function(knex) {
  return knex.schema.createTable('slot_exceptions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('slot_id').references('id').inTable('slots').onDelete('CASCADE');
    table.date('exception_date').notNullable();
    table.time('start_time');
    table.time('end_time');
    table.boolean('is_cancelled').defaultTo(false);
    table.text('reason');
    table.timestamps(true, true);
    
    // Ensure one exception per slot per date
    table.unique(['slot_id', 'exception_date'], 'unique_slot_exception_date');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('slot_exceptions');
};







