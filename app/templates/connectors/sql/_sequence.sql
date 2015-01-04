DO
$do$
DECLARE
   _kind "char";
BEGIN
  SELECT INTO _kind  c.relkind
  FROM   pg_class     c
  JOIN   pg_namespace n ON n.oid = c.relnamespace
  WHERE  c.relname = '<%= connectorSQL_createSchema_sequenceName %>' -- sequence name here
  AND    n.nspname = 'public';         -- schema name here

  IF NOT FOUND THEN       -- name is free
    CREATE SEQUENCE "public"."<%= connectorSQL_createSchema_sequenceName %>"
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 2147483647
    START 1
    CACHE 1
    ;
  ELSIF _kind = 'S' THEN  -- sequence exists
      -- do nothing?
  ELSE                    -- conflicting object of different type exists
      -- do somethng!
  END IF;
END
$do$;
