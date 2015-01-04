DO
$do$
BEGIN

	-- this is the default table schema
	CREATE TABLE IF NOT EXISTS "public"."<%= connectorSQL_database %>" (
		"id" INTEGER DEFAULT nextval('<%= connectorSQL_createSchema_sequenceName %>'::regclass) NOT NULL PRIMARY KEY
	);

	-- default indices
	IF NOT EXISTS (
    SELECT 1
    FROM   pg_class c
    JOIN   pg_namespace n ON n.oid = c.relnamespace
    WHERE  c.relname = '<%= connectorSQL_database %>'
    AND    n.nspname = 'public' -- 'public' by default
    ) THEN

      CREATE INDEX "index_id_<%= connectorSQL_database %>" ON "public"."<%= connectorSQL_database %>" USING btree( "id" );

	END IF;

END
$do$;



