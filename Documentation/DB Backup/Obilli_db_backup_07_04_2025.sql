--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.2

-- Started on 2025-04-07 11:53:40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4209 (class 1262 OID 5)
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4210 (class 0 OID 0)
-- Dependencies: 4209
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- TOC entry 4212 (class 0 OID 0)
-- Name: postgres; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE postgres SET "app.settings.jwt_exp" TO '3600';


\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 18 (class 2615 OID 16488)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- TOC entry 16 (class 2615 OID 16388)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 23 (class 2615 OID 16618)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- TOC entry 22 (class 2615 OID 16607)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- TOC entry 12 (class 2615 OID 16386)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- TOC entry 19 (class 2615 OID 16645)
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA pgsodium;


ALTER SCHEMA pgsodium OWNER TO supabase_admin;

--
-- TOC entry 6 (class 3079 OID 16646)
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- TOC entry 4215 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- TOC entry 29 (class 2615 OID 16599)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- TOC entry 17 (class 2615 OID 16536)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- TOC entry 21 (class 2615 OID 16949)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- TOC entry 8 (class 3079 OID 16982)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 4219 (class 0 OID 0)
-- Dependencies: 8
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 5 (class 3079 OID 16389)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 4220 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 3 (class 3079 OID 16434)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 4221 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 2 (class 3079 OID 16471)
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- TOC entry 4222 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- TOC entry 7 (class 3079 OID 16950)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 4223 (class 0 OID 0)
-- Dependencies: 7
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 4 (class 3079 OID 16423)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 4224 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1248 (class 1247 OID 28786)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- TOC entry 1272 (class 1247 OID 28927)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- TOC entry 1245 (class 1247 OID 28780)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1242 (class 1247 OID 28774)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1278 (class 1247 OID 28969)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1314 (class 1247 OID 34798)
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- TOC entry 1305 (class 1247 OID 34758)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- TOC entry 1308 (class 1247 OID 34773)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- TOC entry 1320 (class 1247 OID 34840)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- TOC entry 1317 (class 1247 OID 34811)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- TOC entry 368 (class 1255 OID 16534)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- TOC entry 4225 (class 0 OID 0)
-- Dependencies: 368
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 520 (class 1255 OID 28756)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- TOC entry 367 (class 1255 OID 16533)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- TOC entry 4228 (class 0 OID 0)
-- Dependencies: 367
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 366 (class 1255 OID 16532)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- TOC entry 4230 (class 0 OID 0)
-- Dependencies: 366
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 369 (class 1255 OID 16591)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO postgres;

--
-- TOC entry 4247 (class 0 OID 0)
-- Dependencies: 369
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 373 (class 1255 OID 16612)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- TOC entry 4249 (class 0 OID 0)
-- Dependencies: 373
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 370 (class 1255 OID 16593)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_event_trigger_ddl_commands() AS ev
      JOIN pg_extension AS ext
      ON ev.objid = ext.oid
      WHERE ext.extname = 'pg_net'
    )
    THEN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'supabase_functions_admin'
      )
      THEN
        CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
      END IF;

      GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

      IF EXISTS (
        SELECT FROM pg_extension
        WHERE extname = 'pg_net'
        -- all versions in use on existing projects as of 2025-02-20
        -- version 0.12.0 onwards don't need these applied
        AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8.0', '0.10.0', '0.11.0')
      ) THEN
        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

        ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
        ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

        REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
        REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

        GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
        GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      END IF;
    END IF;
  END;
  $$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO postgres;

--
-- TOC entry 4251 (class 0 OID 0)
-- Dependencies: 370
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 371 (class 1255 OID 16603)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- TOC entry 372 (class 1255 OID 16604)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- TOC entry 374 (class 1255 OID 16614)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- TOC entry 4280 (class 0 OID 0)
-- Dependencies: 374
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 310 (class 1255 OID 16387)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: postgres
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO postgres;

--
-- TOC entry 531 (class 1255 OID 29183)
-- Name: get_listing_rating(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_listing_rating(listing_id uuid) RETURNS TABLE(average_rating numeric, total_reviews bigint)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY
    SELECT
        ROUND(AVG(rating)::numeric, 1) as average_rating,
        COUNT(*) as total_reviews
    FROM reviews
    WHERE reviews.listing_id = $1;
END;
$_$;


ALTER FUNCTION public.get_listing_rating(listing_id uuid) OWNER TO postgres;

--
-- TOC entry 537 (class 1255 OID 34833)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 543 (class 1255 OID 34911)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- TOC entry 539 (class 1255 OID 34845)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- TOC entry 535 (class 1255 OID 34795)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- TOC entry 534 (class 1255 OID 34790)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- TOC entry 538 (class 1255 OID 34841)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- TOC entry 540 (class 1255 OID 34852)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 533 (class 1255 OID 34789)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- TOC entry 542 (class 1255 OID 34910)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- TOC entry 532 (class 1255 OID 34787)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- TOC entry 536 (class 1255 OID 34822)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- TOC entry 541 (class 1255 OID 34904)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- TOC entry 527 (class 1255 OID 29034)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- TOC entry 523 (class 1255 OID 29008)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 522 (class 1255 OID 29007)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 521 (class 1255 OID 29006)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 524 (class 1255 OID 29020)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- TOC entry 529 (class 1255 OID 29073)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 528 (class 1255 OID 29036)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 530 (class 1255 OID 29089)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- TOC entry 525 (class 1255 OID 29023)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 526 (class 1255 OID 29024)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- TOC entry 510 (class 1255 OID 16974)
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: supabase_admin
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


ALTER FUNCTION vault.secrets_encrypt_secret_secret() OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 253 (class 1259 OID 16519)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- TOC entry 4315 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 283 (class 1259 OID 28931)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- TOC entry 4317 (class 0 OID 0)
-- Dependencies: 283
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- TOC entry 274 (class 1259 OID 28728)
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- TOC entry 4319 (class 0 OID 0)
-- Dependencies: 274
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4320 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 252 (class 1259 OID 16512)
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- TOC entry 4322 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 278 (class 1259 OID 28818)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- TOC entry 4324 (class 0 OID 0)
-- Dependencies: 278
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 277 (class 1259 OID 28806)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 4326 (class 0 OID 0)
-- Dependencies: 277
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 276 (class 1259 OID 28793)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- TOC entry 4328 (class 0 OID 0)
-- Dependencies: 276
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 284 (class 1259 OID 28981)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 251 (class 1259 OID 16501)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 4331 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 250 (class 1259 OID 16500)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- TOC entry 4333 (class 0 OID 0)
-- Dependencies: 250
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 281 (class 1259 OID 28860)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4335 (class 0 OID 0)
-- Dependencies: 281
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 282 (class 1259 OID 28878)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- TOC entry 4337 (class 0 OID 0)
-- Dependencies: 282
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 254 (class 1259 OID 16527)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- TOC entry 4339 (class 0 OID 0)
-- Dependencies: 254
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 275 (class 1259 OID 28758)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- TOC entry 4341 (class 0 OID 0)
-- Dependencies: 275
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4342 (class 0 OID 0)
-- Dependencies: 275
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 280 (class 1259 OID 28845)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- TOC entry 4344 (class 0 OID 0)
-- Dependencies: 280
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 279 (class 1259 OID 28836)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4346 (class 0 OID 0)
-- Dependencies: 279
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4347 (class 0 OID 0)
-- Dependencies: 279
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 249 (class 1259 OID 16489)
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- TOC entry 4349 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4350 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 288 (class 1259 OID 29111)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    parent_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    subtitle text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 29127)
-- Name: listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listings (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    category_id uuid NOT NULL,
    seller_id uuid NOT NULL,
    condition text NOT NULL,
    images text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    location_id uuid,
    address character varying
);


ALTER TABLE public.listings OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 36140)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    parent_id uuid,
    type character varying NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT locations_type_check CHECK (((type)::text = ANY ((ARRAY['town'::character varying, 'quarter'::character varying])::text[])))
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 29095)
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text NOT NULL,
    full_name text NOT NULL,
    avatar_url text,
    bio text,
    location text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    phone_number text
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 29147)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    listing_id uuid NOT NULL,
    reviewer_id uuid NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    helpful_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    parent_id uuid,
    is_reply boolean DEFAULT false NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 0) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 34914)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- TOC entry 291 (class 1259 OID 34752)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- TOC entry 294 (class 1259 OID 34775)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- TOC entry 293 (class 1259 OID 34774)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 255 (class 1259 OID 16540)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- TOC entry 4366 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 257 (class 1259 OID 16582)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- TOC entry 256 (class 1259 OID 16555)
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- TOC entry 4369 (class 0 OID 0)
-- Dependencies: 256
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 285 (class 1259 OID 29038)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- TOC entry 286 (class 1259 OID 29052)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- TOC entry 272 (class 1259 OID 16970)
-- Name: decrypted_secrets; Type: VIEW; Schema: vault; Owner: supabase_admin
--

CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;


ALTER VIEW vault.decrypted_secrets OWNER TO supabase_admin;

--
-- TOC entry 3735 (class 2604 OID 16504)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4178 (class 0 OID 16519)
-- Dependencies: 253
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	dffac5c2-9ef0-4f53-bd36-1229aadee53e	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"john@gmail.com","user_id":"ec75acc2-575b-45df-8de7-162abc33216d","user_phone":""}}	2025-02-21 08:02:49.485551+00	
00000000-0000-0000-0000-000000000000	e381e75b-d2f3-4aaf-ba53-887155398ba6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-18 08:19:29.199995+00	
00000000-0000-0000-0000-000000000000	6eb3db54-8ea5-4216-8b72-ac8a0a451c19	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-18 08:19:29.214927+00	
00000000-0000-0000-0000-000000000000	3217e54c-8dd3-4bef-a96e-e260de12ab16	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"smith@gmail.com","user_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","user_phone":""}}	2025-02-25 06:49:54.812861+00	
00000000-0000-0000-0000-000000000000	78f70f3f-55a8-4691-9edf-a0a5a999195f	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-25 06:50:19.310516+00	
00000000-0000-0000-0000-000000000000	ae67f4f9-3772-44ad-8bac-7c93b0100d44	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-02-26 06:42:49.584802+00	
00000000-0000-0000-0000-000000000000	951485f7-6d83-4223-8da0-b31ae55e9452	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-02-26 06:42:49.60141+00	
00000000-0000-0000-0000-000000000000	c001299c-8d06-43d4-b229-b6a1fe19d8ad	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-26 06:59:07.770246+00	
00000000-0000-0000-0000-000000000000	a4edd203-ddcb-4283-9f12-fc38ea7f735e	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-26 07:00:42.659143+00	
00000000-0000-0000-0000-000000000000	c720d11c-e65f-49a4-8fc4-545c3f39675e	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-26 07:15:00.710704+00	
00000000-0000-0000-0000-000000000000	9186c77c-dce7-4c5a-9b1d-12cdf4145f2b	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-26 07:17:33.842223+00	
00000000-0000-0000-0000-000000000000	51527ecc-1dd6-4344-8cb5-0b696d6584eb	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-26 07:20:02.656851+00	
00000000-0000-0000-0000-000000000000	03802795-a751-450b-921d-2a7bc4434e3f	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-27 09:48:02.237395+00	
00000000-0000-0000-0000-000000000000	2c8c01e3-2bdb-400a-bf7b-fc3d78a1c387	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-27 10:08:32.945977+00	
00000000-0000-0000-0000-000000000000	a62a1e38-e3d1-47c7-8aeb-78de00d0f6b9	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-27 10:12:53.113519+00	
00000000-0000-0000-0000-000000000000	f3efd43f-e919-4592-96fe-0b63bb95c3f6	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-27 10:17:28.818207+00	
00000000-0000-0000-0000-000000000000	f4fd6e2c-e347-4119-a80a-2199f077c268	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-27 10:20:47.416076+00	
00000000-0000-0000-0000-000000000000	4db3515d-ca88-4b6d-9da1-471a5f8e0e8c	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-27 10:36:56.604769+00	
00000000-0000-0000-0000-000000000000	b166c8f2-8ba2-45d8-8d5c-0756f1e791c6	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-02-28 06:14:53.796363+00	
00000000-0000-0000-0000-000000000000	e0295379-c8a9-4521-96e3-85f96311f070	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-02-28 06:14:53.817592+00	
00000000-0000-0000-0000-000000000000	2f1a30e1-7393-436c-8521-1519ec52c190	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-28 06:19:31.854516+00	
00000000-0000-0000-0000-000000000000	5f0534fb-ded0-41e6-9bc2-501c10f7417d	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-28 06:28:00.948476+00	
00000000-0000-0000-0000-000000000000	26a77c49-3e70-49bc-8737-e45b072e765c	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-28 06:41:09.706296+00	
00000000-0000-0000-0000-000000000000	0d079c34-f84b-4694-835a-8bd91a2fd159	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-28 06:44:39.194823+00	
00000000-0000-0000-0000-000000000000	12efaef6-529a-414b-a794-1b1cb7a0de14	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-02-28 06:49:12.958488+00	
00000000-0000-0000-0000-000000000000	3be598f6-f59e-4ad7-90ca-c6339e6e4dce	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-02-28 07:57:38.737029+00	
00000000-0000-0000-0000-000000000000	d0ddff66-eabe-4fbc-ba4f-6d360bc50bcc	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-02-28 07:57:38.74512+00	
00000000-0000-0000-0000-000000000000	56d804eb-134a-4f01-b5f9-5582da77232d	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 13:03:28.1067+00	
00000000-0000-0000-0000-000000000000	97788e81-b237-46f4-a54f-b7968a6c632c	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 13:03:28.135883+00	
00000000-0000-0000-0000-000000000000	83eccc85-e008-4bb8-a7c0-776bfa865255	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 13:09:05.487196+00	
00000000-0000-0000-0000-000000000000	1ab555b3-2d43-4ffd-b911-a3e797472156	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 13:13:25.552802+00	
00000000-0000-0000-0000-000000000000	f7a25acb-d758-4f4c-8d74-dd3a72c21dbc	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 13:18:30.007471+00	
00000000-0000-0000-0000-000000000000	31ad9bad-b65f-4f31-9696-72d52123bd52	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 13:22:09.724451+00	
00000000-0000-0000-0000-000000000000	87d4fdc8-4d44-44ab-b3c6-94c40564af41	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 13:28:11.165589+00	
00000000-0000-0000-0000-000000000000	5777001a-e307-4500-824c-74284532f327	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 13:37:38.613523+00	
00000000-0000-0000-0000-000000000000	a96476fa-ff65-49b0-906e-0798047428f3	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 13:41:55.76394+00	
00000000-0000-0000-0000-000000000000	c89c3f15-1a9c-4a72-8e61-28c33d4d216c	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 13:43:22.249626+00	
00000000-0000-0000-0000-000000000000	07d6126e-ac45-4a99-86b7-82fdd3cee553	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 13:49:17.257359+00	
00000000-0000-0000-0000-000000000000	7c179395-ea26-432c-8700-34194f1b7395	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 14:30:45.139183+00	
00000000-0000-0000-0000-000000000000	30c12b89-edd4-4492-938b-c8eb78288848	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 14:34:36.938725+00	
00000000-0000-0000-0000-000000000000	13bf56a7-0028-4c83-9c89-e5f9ff16cc2c	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 14:36:52.522372+00	
00000000-0000-0000-0000-000000000000	8f3ca5ce-3874-42eb-87a2-dc42325086bb	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 14:40:00.529876+00	
00000000-0000-0000-0000-000000000000	8a4cb785-2007-4e42-885e-cb7ae2498085	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-01 15:01:35.892001+00	
00000000-0000-0000-0000-000000000000	88c262d3-dd18-47e8-8bef-4280a1a9b55e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 16:00:41.663925+00	
00000000-0000-0000-0000-000000000000	34cdba2e-dc56-45fa-a089-41ba3168eed1	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 16:00:41.669013+00	
00000000-0000-0000-0000-000000000000	6679ae78-20d9-4f06-bf40-8c8be666d499	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 17:30:42.777347+00	
00000000-0000-0000-0000-000000000000	cc85694f-7208-482f-9fc4-1311adb2d97c	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 17:30:42.779777+00	
00000000-0000-0000-0000-000000000000	3fe374eb-1cc9-4014-99c4-8a61980bb338	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 17:30:42.801914+00	
00000000-0000-0000-0000-000000000000	d6acfe03-5215-4064-9dfc-efdcd72ffb34	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 17:30:45.112129+00	
00000000-0000-0000-0000-000000000000	84e26d6f-0d21-4c30-8266-10031f91d62f	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 18:29:20.502547+00	
00000000-0000-0000-0000-000000000000	d7d1c50d-6c8e-4ff6-8fd0-fd2c20fcff35	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 18:29:20.512305+00	
00000000-0000-0000-0000-000000000000	2bda34f5-fa00-41b9-bbdf-3a71dd1e1e3a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 19:28:20.868042+00	
00000000-0000-0000-0000-000000000000	30adf1b2-99c1-4edf-8db1-18bb6b64d956	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 19:28:20.871487+00	
00000000-0000-0000-0000-000000000000	5cd1963f-ff61-4758-b541-8c0a8201623a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 20:26:52.865517+00	
00000000-0000-0000-0000-000000000000	23cb3b60-76c9-4179-93c5-d353bc0e5fe7	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-01 20:26:52.879276+00	
00000000-0000-0000-0000-000000000000	02a3c782-8ae6-47c1-8321-6a1449c8953f	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 06:01:16.35789+00	
00000000-0000-0000-0000-000000000000	bb78eeb3-ed19-425a-bc28-6bedfbf4c047	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 06:01:16.36732+00	
00000000-0000-0000-0000-000000000000	61dbab40-e608-462d-bf7a-343278d36d97	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 07:00:15.673214+00	
00000000-0000-0000-0000-000000000000	282e502d-77c3-4d42-bbb6-a9520b266f42	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 07:00:15.68683+00	
00000000-0000-0000-0000-000000000000	2a23918e-5074-466a-be55-1b6248e02ab5	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 07:58:34.42732+00	
00000000-0000-0000-0000-000000000000	edf04824-ae03-4b29-a78f-834c9d9fa85d	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 07:58:34.438751+00	
00000000-0000-0000-0000-000000000000	ac5a7dfb-bfd5-4f85-a143-285398116b23	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:14.086849+00	
00000000-0000-0000-0000-000000000000	b7a329b8-943f-44a5-9dc2-54fea7523d25	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:14.090601+00	
00000000-0000-0000-0000-000000000000	a157bf27-ed18-458f-aa5f-1e14be8e8d9a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:14.126312+00	
00000000-0000-0000-0000-000000000000	243cde30-b572-4759-b53d-b588763b7400	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:15.389761+00	
00000000-0000-0000-0000-000000000000	dfd3c75c-a48d-47b4-9737-175e629b06d3	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.401925+00	
00000000-0000-0000-0000-000000000000	0b230d32-4b41-4e66-889b-4796c11c96ff	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.422404+00	
00000000-0000-0000-0000-000000000000	1b144d94-e690-41fa-b4d1-48e9db90f623	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.815171+00	
00000000-0000-0000-0000-000000000000	30c9d17b-a7d9-4c67-a19f-de75b9e5534e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.850852+00	
00000000-0000-0000-0000-000000000000	7add8bdb-02ac-44c9-9775-5021c8402727	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.868639+00	
00000000-0000-0000-0000-000000000000	8697673f-f70d-4d8a-94df-5069b2a84318	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.88713+00	
00000000-0000-0000-0000-000000000000	bd2d6d76-6610-47f5-934d-c1ad11562124	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.898226+00	
00000000-0000-0000-0000-000000000000	d6678011-bb1e-4114-9eb9-d6a9f8d85a2a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.909846+00	
00000000-0000-0000-0000-000000000000	c75e2c02-b35e-4bf4-9ef1-462b7f6f00f6	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.939979+00	
00000000-0000-0000-0000-000000000000	932c40fe-c71e-4bbd-bf67-e9f3a60245eb	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:16.947691+00	
00000000-0000-0000-0000-000000000000	cc4c016c-1d35-4b5b-81cc-8dfdd7228a9c	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.204096+00	
00000000-0000-0000-0000-000000000000	a06f87ce-e821-46b5-9dd7-2a25c6de66a3	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.256877+00	
00000000-0000-0000-0000-000000000000	9a33fbcf-8d20-49c9-800e-82e8c1004f7e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.450239+00	
00000000-0000-0000-0000-000000000000	31f78b61-7cb7-4839-b7ac-cc2bdb4e214a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.500582+00	
00000000-0000-0000-0000-000000000000	7fe3f03e-3dd9-4f70-a3f4-2138ef56f4ba	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.528274+00	
00000000-0000-0000-0000-000000000000	13079d7a-e48d-405a-8490-99f838cf945e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.564681+00	
00000000-0000-0000-0000-000000000000	e9a5d14c-93e5-4ce1-bb83-59b43ea2a431	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.579443+00	
00000000-0000-0000-0000-000000000000	1df3160e-ca04-4b5f-884e-e14ea7ae624a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.599955+00	
00000000-0000-0000-0000-000000000000	78ae9b06-b9a4-40d6-ac08-21701573161b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.614703+00	
00000000-0000-0000-0000-000000000000	a4152fb4-31fd-4a20-afca-4d4a0faec971	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 08:57:17.979668+00	
00000000-0000-0000-0000-000000000000	208de6fe-f5f9-4b23-b066-48e02c225776	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 09:55:44.905367+00	
00000000-0000-0000-0000-000000000000	e45918dc-6b2d-46a4-8202-b961e22cd0cd	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 09:55:44.911983+00	
00000000-0000-0000-0000-000000000000	0579267d-d474-4f14-94c4-20e98c5ed52e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:25.823048+00	
00000000-0000-0000-0000-000000000000	cc606eb2-a38a-49bb-94a6-3c282ed0dd6c	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:25.826055+00	
00000000-0000-0000-0000-000000000000	bfb63d20-e82c-4e5b-aaba-3472fc8fc9c1	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:48.338878+00	
00000000-0000-0000-0000-000000000000	19159ae6-02e1-473b-995e-c389edfa672a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:49.511229+00	
00000000-0000-0000-0000-000000000000	0b36df76-9684-4873-b3ed-7cb8af2d34ad	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:49.791363+00	
00000000-0000-0000-0000-000000000000	20ab10ff-abce-4122-96ae-5c4f353ad07c	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:49.821549+00	
00000000-0000-0000-0000-000000000000	7d7c63f3-9b65-42a2-9edc-b01cbb36b9d1	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:49.847363+00	
00000000-0000-0000-0000-000000000000	98ec5339-af0f-4651-831d-eb5dc3317588	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:49.931197+00	
00000000-0000-0000-0000-000000000000	d4d51a4f-b586-464b-985e-49cf34cbccfe	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:49.946921+00	
00000000-0000-0000-0000-000000000000	9e23d26e-a0cc-4dbc-8190-d7e1f0903387	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:49.970696+00	
00000000-0000-0000-0000-000000000000	80e48e38-0bf9-42ea-ae35-561e5264b9c0	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:49.979301+00	
00000000-0000-0000-0000-000000000000	08f5e16d-6dd3-4c62-be22-d37fab201f6f	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.020664+00	
00000000-0000-0000-0000-000000000000	86c199c2-fdfc-43a1-803c-397cbc76144d	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.074639+00	
00000000-0000-0000-0000-000000000000	3cb4e457-5023-406a-93e9-475e8e40ca3e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.704144+00	
00000000-0000-0000-0000-000000000000	2c27d08c-688b-4253-9880-f22d3e175a55	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.710563+00	
00000000-0000-0000-0000-000000000000	e73aea41-7444-410f-9f6b-2ae72a285798	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.732384+00	
00000000-0000-0000-0000-000000000000	2ad8ea6e-2673-4510-8493-8371e2cb0aca	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.929155+00	
00000000-0000-0000-0000-000000000000	9af0455a-845c-4610-b3ea-3d9c3e73acbd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:49.515907+00	
00000000-0000-0000-0000-000000000000	fbd2c15c-a442-4b19-97fe-e79614978e44	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:49.539179+00	
00000000-0000-0000-0000-000000000000	4fd32831-6dee-439b-b98b-b0efcc4268ef	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:51.455355+00	
00000000-0000-0000-0000-000000000000	02b6b5cf-d992-448f-b10e-2a4cc0294216	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.083096+00	
00000000-0000-0000-0000-000000000000	fc373c86-b0f2-4af1-a0f8-6bc16de58d71	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.113906+00	
00000000-0000-0000-0000-000000000000	887a7cbf-9079-416f-92a9-2d0a489fe01b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.273318+00	
00000000-0000-0000-0000-000000000000	f87cb207-afdc-4cdf-8f95-67a33c9d6e32	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.316365+00	
00000000-0000-0000-0000-000000000000	49d97dc1-9452-447b-b50b-2995ec1cb396	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.36653+00	
00000000-0000-0000-0000-000000000000	6a801955-c001-450c-a36c-d2f05d2eef73	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.379911+00	
00000000-0000-0000-0000-000000000000	ff12f3f1-1253-4fb1-b3a9-2a3449ace679	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.390866+00	
00000000-0000-0000-0000-000000000000	b2f72ceb-a389-48fc-95a4-b3178fd660ab	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.413177+00	
00000000-0000-0000-0000-000000000000	7f43ac82-2338-4a96-a6e4-4a8b1f503ff8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.432596+00	
00000000-0000-0000-0000-000000000000	4cdb5c66-d19d-4f70-b319-f06e88687c98	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.693466+00	
00000000-0000-0000-0000-000000000000	4c60b768-12b2-43ba-b9dc-9bec5ef037ee	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.882677+00	
00000000-0000-0000-0000-000000000000	3e5bccde-bb8c-424d-b873-d3a2243c5e84	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:14.856682+00	
00000000-0000-0000-0000-000000000000	3766ef5b-262a-4273-a567-da784020d576	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:45.082369+00	
00000000-0000-0000-0000-000000000000	c43d3a8b-4bc7-4ccc-ac79-32ee78f32823	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:45.107927+00	
00000000-0000-0000-0000-000000000000	83bd9f37-4a62-43d4-b137-95a3f600480b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:46.822072+00	
00000000-0000-0000-0000-000000000000	621a82b3-f71b-436d-b6af-1907e277196f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.564323+00	
00000000-0000-0000-0000-000000000000	f33d5134-523d-4d01-afeb-b30048786876	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.586417+00	
00000000-0000-0000-0000-000000000000	cee76aba-f9ca-4574-a127-46f519639f3f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.64179+00	
00000000-0000-0000-0000-000000000000	ad1d3909-4eb6-407c-8a67-3ff5228ed47d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.692543+00	
00000000-0000-0000-0000-000000000000	b5d32697-6b2b-4f78-9aa3-ee516b66ce34	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.701948+00	
00000000-0000-0000-0000-000000000000	ad7656cd-118d-4bab-a008-4c241a0de7f0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.227379+00	
00000000-0000-0000-0000-000000000000	562b1dbd-8378-47b1-948f-29b92aadcd12	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.750664+00	
00000000-0000-0000-0000-000000000000	4d5d681f-114a-4e6e-adc1-1ec39cc8e5ea	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.767654+00	
00000000-0000-0000-0000-000000000000	a9e0921d-4871-4242-8096-c6518ff9ae3f	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.780817+00	
00000000-0000-0000-0000-000000000000	2084ca7a-b3b4-4be1-859d-ecc8bfea67cf	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.922665+00	
00000000-0000-0000-0000-000000000000	3f004ae3-db27-4ede-84e6-f37fa14fe9f4	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.936738+00	
00000000-0000-0000-0000-000000000000	3063c9fd-0f6a-40b7-a244-b5fc55a714f8	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 12:11:50.94723+00	
00000000-0000-0000-0000-000000000000	c8649f34-63a8-482a-81bc-d6cea84b5573	{"action":"logout","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-03 12:53:25.470661+00	
00000000-0000-0000-0000-000000000000	f1646760-18c6-4dad-a188-cedd4a0f465e	{"action":"user_repeated_signup","actor_id":"ec75acc2-575b-45df-8de7-162abc33216d","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-03-03 12:58:47.010355+00	
00000000-0000-0000-0000-000000000000	26f20c61-b8dd-4d69-ba05-1e147929c5bc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.341336+00	
00000000-0000-0000-0000-000000000000	deda2311-682c-43c3-8424-b68a793768f9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.388463+00	
00000000-0000-0000-0000-000000000000	010db206-95e4-4180-a3b3-ae6c3b613956	{"action":"user_confirmation_requested","actor_id":"8292a22c-f051-4924-9576-c81f6cca3eff","actor_name":"john smith","actor_username":"jjosdfhn@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-03-03 13:00:57.010168+00	
00000000-0000-0000-0000-000000000000	4ac5c04c-6cd6-4c86-8e7b-2c5e8f7912f3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.418669+00	
00000000-0000-0000-0000-000000000000	4d415459-349a-40f7-a08d-b7892b7b80be	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.427655+00	
00000000-0000-0000-0000-000000000000	6de7ed2e-b253-455e-a7be-97cfc477f3a2	{"action":"user_confirmation_requested","actor_id":"fb3ab990-e29b-4105-b1d1-ce7ae00a9ac2","actor_name":"john doe","actor_username":"johnrr@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-03-03 13:14:25.420063+00	
00000000-0000-0000-0000-000000000000	8f824829-cdb1-4096-9dd0-c59ebe94c4aa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.452962+00	
00000000-0000-0000-0000-000000000000	c3bb3857-27a4-4db9-a4f7-a0b6df952173	{"action":"user_confirmation_requested","actor_id":"fb3ab990-e29b-4105-b1d1-ce7ae00a9ac2","actor_name":"john doe","actor_username":"johnrr@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-03-03 13:16:25.299677+00	
00000000-0000-0000-0000-000000000000	7a7f2ca1-c747-410c-b000-d2617d97fec8	{"action":"user_confirmation_requested","actor_id":"93e2f4a3-aacf-433a-9de2-250414dcb653","actor_name":"john mary","actor_username":"johnsmithh@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-03-03 13:20:23.424305+00	
00000000-0000-0000-0000-000000000000	8b56957e-9290-4056-8ba5-d00159252f36	{"action":"user_signedup","actor_id":"64a1046b-159a-4b7c-828b-4670addf0caa","actor_name":"john mary","actor_username":"jm@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-03-03 13:21:04.678303+00	
00000000-0000-0000-0000-000000000000	efd627f5-cb47-45d4-b434-036c067072f7	{"action":"login","actor_id":"64a1046b-159a-4b7c-828b-4670addf0caa","actor_name":"john mary","actor_username":"jm@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-03 13:21:04.683545+00	
00000000-0000-0000-0000-000000000000	e3baa84c-3277-4b00-a6d4-9c81328d6cf5	{"action":"login","actor_id":"64a1046b-159a-4b7c-828b-4670addf0caa","actor_name":"john mary","actor_username":"jm@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-03 13:21:05.476087+00	
00000000-0000-0000-0000-000000000000	222f6b1e-9580-413b-bac4-bc7dd470ba3e	{"action":"token_refreshed","actor_id":"64a1046b-159a-4b7c-828b-4670addf0caa","actor_name":"john mary","actor_username":"jm@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 14:19:47.384902+00	
00000000-0000-0000-0000-000000000000	7c2d972a-3d36-4ae6-8e0d-8971bab551bc	{"action":"token_revoked","actor_id":"64a1046b-159a-4b7c-828b-4670addf0caa","actor_name":"john mary","actor_username":"jm@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-03 14:19:47.393454+00	
00000000-0000-0000-0000-000000000000	e5419f80-0245-4af6-a28a-984d9586eb57	{"action":"token_refreshed","actor_id":"64a1046b-159a-4b7c-828b-4670addf0caa","actor_name":"john mary","actor_username":"jm@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 05:54:39.573928+00	
00000000-0000-0000-0000-000000000000	9d5faa31-baf9-4dd6-a79e-452b0632d0cd	{"action":"token_revoked","actor_id":"64a1046b-159a-4b7c-828b-4670addf0caa","actor_name":"john mary","actor_username":"jm@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 05:54:39.588+00	
00000000-0000-0000-0000-000000000000	3de34226-bf66-47fe-add6-a28befefb92e	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-04 06:23:45.145052+00	
00000000-0000-0000-0000-000000000000	a4ba2d38-84d3-491a-9a5a-6c04922a42de	{"action":"logout","actor_id":"64a1046b-159a-4b7c-828b-4670addf0caa","actor_name":"john mary","actor_username":"jm@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-04 06:29:20.389171+00	
00000000-0000-0000-0000-000000000000	1bd8aa6b-5569-4f73-8e25-8b70c2bc601a	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-04 06:29:27.431877+00	
00000000-0000-0000-0000-000000000000	ca050bd1-67fb-4366-948a-4cc31819243e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 07:32:16.132627+00	
00000000-0000-0000-0000-000000000000	b04f3339-d064-405a-8618-3fe1c300f7cc	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 07:32:16.161818+00	
00000000-0000-0000-0000-000000000000	36da4882-5f01-4d82-8092-bb6a446884ba	{"action":"login","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-04 08:52:37.183476+00	
00000000-0000-0000-0000-000000000000	dea380a3-ae74-4b86-aca6-613e94d1dcd9	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 08:54:25.755015+00	
00000000-0000-0000-0000-000000000000	c99623e8-4462-4a25-af37-c0a8d48b7ba0	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 08:54:25.760672+00	
00000000-0000-0000-0000-000000000000	ef2e838d-f023-4d84-810d-b5fc47cce030	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:38.015335+00	
00000000-0000-0000-0000-000000000000	05a3d8cc-8206-42e9-865d-46d125f4a997	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:38.017233+00	
00000000-0000-0000-0000-000000000000	9ac78648-d8ea-41ad-84db-c26b914ff0c0	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:39.704006+00	
00000000-0000-0000-0000-000000000000	3b35a499-0c19-4239-aa61-bd0b80682e1b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.435175+00	
00000000-0000-0000-0000-000000000000	768406c6-1e67-4f2b-a04b-da01341e03c9	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.472026+00	
00000000-0000-0000-0000-000000000000	50d042bf-a90f-4328-b0b0-12828ba5b283	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.508446+00	
00000000-0000-0000-0000-000000000000	637ae434-e6ef-4446-b97d-f69be02e265f	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.539473+00	
00000000-0000-0000-0000-000000000000	14cffde8-bb41-4549-a0c6-3b50ae87bc71	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.559384+00	
00000000-0000-0000-0000-000000000000	8be6a5bc-5bea-48d7-8a22-661eb2acf2ea	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.583217+00	
00000000-0000-0000-0000-000000000000	c24a2744-5ded-453f-b019-7356736073b9	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.593449+00	
00000000-0000-0000-0000-000000000000	cd39812f-8041-45d2-b7fe-bc35e628c604	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.604879+00	
00000000-0000-0000-0000-000000000000	d9ca7911-62a2-456c-9e65-897262b87e86	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.618788+00	
00000000-0000-0000-0000-000000000000	e1b576f8-5a1c-4aff-ae6b-b358cef355eb	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.63845+00	
00000000-0000-0000-0000-000000000000	abd50524-7212-47b1-922b-56a33e4bfd72	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.895161+00	
00000000-0000-0000-0000-000000000000	9d4f5a11-2b6c-46f8-9cbd-9e40d3e3adc2	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:40.922764+00	
00000000-0000-0000-0000-000000000000	6e285e18-89e4-4e83-8228-d5e9a848263a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:41.068791+00	
00000000-0000-0000-0000-000000000000	ffec9f28-d8e4-471f-81ee-403d1b29a535	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:41.079105+00	
00000000-0000-0000-0000-000000000000	f7ee55d9-9023-45dc-97d0-1c3f376d0865	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:41.087185+00	
00000000-0000-0000-0000-000000000000	6ae758d9-3c2c-4b5c-b524-c7872bd5fc90	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:41.10311+00	
00000000-0000-0000-0000-000000000000	673f4f73-1279-406a-8de8-25e4452159e0	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:41.113243+00	
00000000-0000-0000-0000-000000000000	c133f261-c0e7-43b4-9de6-6e14b45fea27	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:41.13146+00	
00000000-0000-0000-0000-000000000000	43129205-c376-4ee9-876c-a184164a1998	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:41.136693+00	
00000000-0000-0000-0000-000000000000	034b5f96-d7a0-41e6-8d3b-0bdea05156b8	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 10:16:41.162023+00	
00000000-0000-0000-0000-000000000000	16098c51-0cdc-4271-a58a-7b631a4301fe	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:00.683694+00	
00000000-0000-0000-0000-000000000000	d77dde14-b17a-4afe-abe3-cb0e40864169	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:00.706853+00	
00000000-0000-0000-0000-000000000000	e77a7c8f-060f-4b04-9a8c-0c53120b98e5	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:01.332079+00	
00000000-0000-0000-0000-000000000000	86f9f107-2907-4243-899e-ec87e792eecc	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:01.972597+00	
00000000-0000-0000-0000-000000000000	ffc0cb12-1f13-4890-baeb-1980f1b80096	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.056542+00	
00000000-0000-0000-0000-000000000000	f72ff0eb-4be5-4efb-b287-c6801fa9a6d0	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.071093+00	
00000000-0000-0000-0000-000000000000	fa765bfa-8392-4714-aa1e-72842b187b36	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.089776+00	
00000000-0000-0000-0000-000000000000	d5c1ce6e-2e46-4ba5-989d-3f0a0dabe5bc	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.117451+00	
00000000-0000-0000-0000-000000000000	37717888-a2e6-4abb-944e-b424eb38a991	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.134485+00	
00000000-0000-0000-0000-000000000000	bd36cf75-baf8-4c36-b197-4fd9ded97968	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.157642+00	
00000000-0000-0000-0000-000000000000	0583a48b-028d-4422-a178-942fdb675147	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.182407+00	
00000000-0000-0000-0000-000000000000	16aa3385-3c23-493a-a00a-4f6a7d06a05c	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.202109+00	
00000000-0000-0000-0000-000000000000	d38866bc-411e-4a3e-bfe3-09e4fb79eb11	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.212486+00	
00000000-0000-0000-0000-000000000000	f274e657-5f48-47cc-ae23-6f89da8b8e48	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.503072+00	
00000000-0000-0000-0000-000000000000	956414a5-5b2c-4357-84f1-c6b536c908e5	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.512354+00	
00000000-0000-0000-0000-000000000000	de5a6b1a-82cd-4ffe-b4a0-115c6106a58a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.522781+00	
00000000-0000-0000-0000-000000000000	60499f4e-6f71-4c8d-a858-7ee3c64b09ae	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.57874+00	
00000000-0000-0000-0000-000000000000	c1ac1255-b165-43b9-b019-1b662b87fb41	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.682858+00	
00000000-0000-0000-0000-000000000000	140d3049-40a8-4c00-bd07-8d4b51f6300a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.694118+00	
00000000-0000-0000-0000-000000000000	d1e41adb-0298-4e83-afa2-f9a81bc8bc71	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.714038+00	
00000000-0000-0000-0000-000000000000	6600ac8a-9d05-4393-a527-9550309b2415	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.723639+00	
00000000-0000-0000-0000-000000000000	d9bac098-376d-4a6d-8d75-3b4d62aa7f63	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.730673+00	
00000000-0000-0000-0000-000000000000	2ff0c21c-8a91-4cd5-b9a2-ea020f3987fd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.363795+00	
00000000-0000-0000-0000-000000000000	cd879981-1451-4fee-9e60-662c1c6e3222	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.771244+00	
00000000-0000-0000-0000-000000000000	af109434-f5a0-4995-a488-036471b9bc57	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.778941+00	
00000000-0000-0000-0000-000000000000	4db9d9d8-68e7-4589-8e7f-0ed9a1375ced	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.78628+00	
00000000-0000-0000-0000-000000000000	a09c7e85-88a5-40d3-b5a3-07b2ec40403c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.812752+00	
00000000-0000-0000-0000-000000000000	98fdb308-f425-439a-811e-f36de11cba10	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.835932+00	
00000000-0000-0000-0000-000000000000	d60c6563-d0e6-465b-9fbd-8e57b222b574	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.377624+00	
00000000-0000-0000-0000-000000000000	d5b1f5c1-4f9f-4608-b797-a7eee3564e83	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.417423+00	
00000000-0000-0000-0000-000000000000	eb419f8e-71f0-460d-9f75-eef962ca3d1a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.456756+00	
00000000-0000-0000-0000-000000000000	ad132f50-18c4-40fb-934c-611031d9f39e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:55.455816+00	
00000000-0000-0000-0000-000000000000	a37e5b6e-9a79-40eb-af9f-2f172307d662	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:57.44597+00	
00000000-0000-0000-0000-000000000000	adc3ccbb-c300-49ab-9c05-721ea9e11e3a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:59.457832+00	
00000000-0000-0000-0000-000000000000	32070f10-3275-4c94-bea0-47aa40791057	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.402212+00	
00000000-0000-0000-0000-000000000000	96904aba-e661-44ee-9272-a7499310d7d3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.700913+00	
00000000-0000-0000-0000-000000000000	8ba60005-9c44-4fd7-81fb-0b9a0ab742f0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.873054+00	
00000000-0000-0000-0000-000000000000	a40397c3-54c9-4e21-b981-447d23702664	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:14.870386+00	
00000000-0000-0000-0000-000000000000	b9a44438-28a4-4cb9-8117-a1832fe312aa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:14.890506+00	
00000000-0000-0000-0000-000000000000	92979796-8a66-455a-a687-bbf141708cac	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:14.907134+00	
00000000-0000-0000-0000-000000000000	43fb4c0c-08d7-4c27-bda3-2741858db6d2	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:12:02.704469+00	
00000000-0000-0000-0000-000000000000	e79c2b65-9903-4f97-848f-aac9dc12452c	{"action":"user_signedup","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-03-05 07:20:22.954982+00	
00000000-0000-0000-0000-000000000000	71272489-622e-41e4-8231-a1777f9a2a91	{"action":"login","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-05 07:20:22.965012+00	
00000000-0000-0000-0000-000000000000	63289774-3568-4508-97c1-b62a295be94b	{"action":"login","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-05 07:20:23.764154+00	
00000000-0000-0000-0000-000000000000	38d1b6a0-c3da-4535-9975-c0f85ef95075	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:34:57.193263+00	
00000000-0000-0000-0000-000000000000	354eeff8-94a8-4559-9852-d5129267c926	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:34:57.195039+00	
00000000-0000-0000-0000-000000000000	ccf42640-9860-4176-b37b-281a1addcba8	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:16.124884+00	
00000000-0000-0000-0000-000000000000	3c85e103-3c30-4b89-b56e-a138199f0393	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:17.721158+00	
00000000-0000-0000-0000-000000000000	5d5ddd40-7033-4597-a726-86bbc0f23b3a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:17.803398+00	
00000000-0000-0000-0000-000000000000	bf675ad5-02e5-44c5-87a8-b8f33af6b87f	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:17.817999+00	
00000000-0000-0000-0000-000000000000	d9c29581-91c8-423d-af06-852e440a851b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:17.83643+00	
00000000-0000-0000-0000-000000000000	f6f4f6f3-5245-4d9a-a05a-2a8edae66d60	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:17.934879+00	
00000000-0000-0000-0000-000000000000	74d063cf-fb86-49ef-823c-b4ad804f5df9	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:17.962549+00	
00000000-0000-0000-0000-000000000000	c1c0f4a0-8421-4b14-8aa8-14009e9413dd	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:17.971165+00	
00000000-0000-0000-0000-000000000000	4ed814d1-fc35-4402-8773-56989d73a61b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:17.994569+00	
00000000-0000-0000-0000-000000000000	2f117b2a-945e-43d7-af7b-4055ce1cc589	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:18.008648+00	
00000000-0000-0000-0000-000000000000	6b961a23-a4fc-492c-8876-5aeab91805ae	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:18.019369+00	
00000000-0000-0000-0000-000000000000	43dbcfdd-3749-43f6-8647-f3ad42d6f945	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:18.90035+00	
00000000-0000-0000-0000-000000000000	63926a24-2f1d-4dac-819c-a156905871b6	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:18.922276+00	
00000000-0000-0000-0000-000000000000	16d20a2d-81ab-4edd-9533-1ac888297615	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:18.931796+00	
00000000-0000-0000-0000-000000000000	d93521e0-b6e4-4030-8022-e697d8c6432f	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:18.953414+00	
00000000-0000-0000-0000-000000000000	1fce5762-896c-4682-812a-64e939deb59b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:18.989264+00	
00000000-0000-0000-0000-000000000000	2f738ced-4c00-4f62-a182-a44d8fba6f1e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:19.222074+00	
00000000-0000-0000-0000-000000000000	b1c776b8-ff36-4d65-93aa-e02864466bfe	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:19.315849+00	
00000000-0000-0000-0000-000000000000	bd159097-0ff7-45ce-a0bf-c3e5501fd04e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:19.332806+00	
00000000-0000-0000-0000-000000000000	7704d0df-66d2-4b6e-831d-d8a7339c4b9b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:19.350728+00	
00000000-0000-0000-0000-000000000000	233b64d1-1b02-47e9-b406-147deb1dcd07	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 07:35:19.361134+00	
00000000-0000-0000-0000-000000000000	be18e94a-add6-47d0-9210-7e885a09a138	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 08:43:47.377275+00	
00000000-0000-0000-0000-000000000000	1da72a6f-af82-4365-92be-e44aa69ef957	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 08:43:47.379666+00	
00000000-0000-0000-0000-000000000000	274542ee-50c3-4816-a943-845aae0be2a8	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 09:46:16.295901+00	
00000000-0000-0000-0000-000000000000	fb0c1a3a-88d9-4506-8956-b7a762d9abe7	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-05 09:46:16.299159+00	
00000000-0000-0000-0000-000000000000	4aeb61cf-0f1e-4dac-8422-9f64e43dfe63	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:29.327336+00	
00000000-0000-0000-0000-000000000000	67338cf9-8d72-4679-b8c6-284fa0ec11b9	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:29.351677+00	
00000000-0000-0000-0000-000000000000	72dfd53c-215c-4ad2-b4cb-1fe6c40ceb98	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:31.0277+00	
00000000-0000-0000-0000-000000000000	eb6e2397-8bf3-4800-baab-df8e640c4268	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:31.609391+00	
00000000-0000-0000-0000-000000000000	58a7aef5-4cc0-48bd-9e08-1a8062f1092e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:31.846981+00	
00000000-0000-0000-0000-000000000000	f726a847-e323-4b7c-abbc-589e2d0857d5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:31.916878+00	
00000000-0000-0000-0000-000000000000	5914e4c3-e0a0-44ef-a80e-bdf712af0d07	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:31.934746+00	
00000000-0000-0000-0000-000000000000	a8096116-31b0-48a6-8cd1-0af626ffcfe1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:31.955915+00	
00000000-0000-0000-0000-000000000000	40a994a5-1f5d-41c5-9c54-bc94f7593482	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:31.972523+00	
00000000-0000-0000-0000-000000000000	51ca427a-becd-4432-8dd0-5c4300e1961f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:31.986668+00	
00000000-0000-0000-0000-000000000000	dde7bf7d-0e31-4294-ae42-5d4f0b2158a2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.014055+00	
00000000-0000-0000-0000-000000000000	7ecdc1ce-ff6c-436e-bcbb-e079770fa0a2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.039592+00	
00000000-0000-0000-0000-000000000000	91ab2a7c-94e1-4cf9-9c4c-bd4d6ee65799	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.048804+00	
00000000-0000-0000-0000-000000000000	d34e3166-97aa-4639-9d88-ff01b936a7fe	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.258269+00	
00000000-0000-0000-0000-000000000000	517a339a-0342-426f-8a46-68f3fe086167	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.270595+00	
00000000-0000-0000-0000-000000000000	81aef05b-4834-4a53-8be9-fa6e138bfabe	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.281379+00	
00000000-0000-0000-0000-000000000000	e1b1b89a-54f5-4590-b72d-65807754efc6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.28908+00	
00000000-0000-0000-0000-000000000000	c6b9c9d5-8066-4c18-b38f-84c4614509de	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.299942+00	
00000000-0000-0000-0000-000000000000	97129b2d-1627-42e3-a2db-023058e6edf3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.317067+00	
00000000-0000-0000-0000-000000000000	4d605af7-3022-4e32-87b6-ec313508ed7c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.325151+00	
00000000-0000-0000-0000-000000000000	6afba5e8-8d55-467b-8f9b-db5c3302f9e5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.439402+00	
00000000-0000-0000-0000-000000000000	94e2f6e0-f434-4848-ba41-6f679bd05105	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.46102+00	
00000000-0000-0000-0000-000000000000	7d670d65-3886-40ed-8da0-02f0270aea22	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:49:32.626774+00	
00000000-0000-0000-0000-000000000000	e68c42b5-bb34-482d-975c-b2a60cf14bf3	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:51:33.973015+00	
00000000-0000-0000-0000-000000000000	381f7419-2257-4d65-ac08-7ed21db10979	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:51:33.973934+00	
00000000-0000-0000-0000-000000000000	86306458-f859-4374-9980-076e491cba4a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:06.412215+00	
00000000-0000-0000-0000-000000000000	5c390753-2ab7-48f6-a299-8d4096d18d47	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.069782+00	
00000000-0000-0000-0000-000000000000	a869f833-1b99-4a06-b4c6-2352b00a7054	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.374012+00	
00000000-0000-0000-0000-000000000000	bc79bafe-c8db-4456-a28f-fa7a6e9fdfb4	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.393331+00	
00000000-0000-0000-0000-000000000000	15633e11-c1b9-4996-b882-a5ac2f4cbfad	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.421994+00	
00000000-0000-0000-0000-000000000000	e53867a0-ce25-4a97-8722-97940eaaf336	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.527953+00	
00000000-0000-0000-0000-000000000000	0939a6b9-eb1c-423f-8263-62379d29cff1	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.54018+00	
00000000-0000-0000-0000-000000000000	768bc871-eb08-43f8-bbec-69652e30946f	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.548899+00	
00000000-0000-0000-0000-000000000000	b04c9fa2-f2f5-4c1d-8bc5-af33a53e9dbd	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.560163+00	
00000000-0000-0000-0000-000000000000	ea4c2bcb-de52-4d45-b058-f6049b223306	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.570161+00	
00000000-0000-0000-0000-000000000000	fc7aab03-d046-4a4b-9278-e8b6ce2dba2e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:08.583349+00	
00000000-0000-0000-0000-000000000000	6c815f25-f958-4219-b233-c98ad30a9585	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.235703+00	
00000000-0000-0000-0000-000000000000	93d51992-cc34-4452-abdb-8c62f6177340	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.259115+00	
00000000-0000-0000-0000-000000000000	9bef9b7b-c3cd-45e8-9f68-a1c73efcf36b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.265274+00	
00000000-0000-0000-0000-000000000000	ce969163-4335-4d49-b988-ec17b5e6fc3b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.439541+00	
00000000-0000-0000-0000-000000000000	9cc5112e-6fdc-406c-8fc2-6f67f4a06809	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.466515+00	
00000000-0000-0000-0000-000000000000	6033af3b-3184-4ac9-b4e0-7b9d050d6c51	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.480504+00	
00000000-0000-0000-0000-000000000000	21c1f20f-ce8c-470f-8297-2282278f081c	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.609955+00	
00000000-0000-0000-0000-000000000000	e93dce6d-c047-4ec1-84cb-c3ead870d835	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.621294+00	
00000000-0000-0000-0000-000000000000	dabd326b-8b7d-4b25-b8d2-27e1ec92cd15	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.638628+00	
00000000-0000-0000-0000-000000000000	51660d2e-27ca-401b-a60a-90954c7265e6	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 06:52:09.661241+00	
00000000-0000-0000-0000-000000000000	184ac945-4950-498c-bc55-5e99117d4029	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 07:50:05.230891+00	
00000000-0000-0000-0000-000000000000	d0b32d12-bdbf-4761-a58b-339a637eadf5	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 07:50:05.235335+00	
00000000-0000-0000-0000-000000000000	ef546c97-8f90-40f0-823e-375709e1cd12	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 07:58:25.296235+00	
00000000-0000-0000-0000-000000000000	708493a0-e639-4cea-af51-0323de16c50a	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 07:58:25.299554+00	
00000000-0000-0000-0000-000000000000	9926dd74-9b90-4338-89e6-4cb5741e513b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 07:58:27.292954+00	
00000000-0000-0000-0000-000000000000	9b514102-2f7a-4be0-bef8-d828f18023c9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 07:58:27.325562+00	
00000000-0000-0000-0000-000000000000	6289cfe9-4877-437e-a99f-23e67f4b0e50	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 07:58:28.419765+00	
00000000-0000-0000-0000-000000000000	2d61a008-61fb-4d6f-a22e-ac6e0f3ae40f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 07:58:28.547524+00	
00000000-0000-0000-0000-000000000000	86517982-8275-4077-9574-893d701eb6aa	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 08:50:16.267839+00	
00000000-0000-0000-0000-000000000000	673f7e8c-b599-4fd3-b050-845a7473a752	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 08:50:16.270832+00	
00000000-0000-0000-0000-000000000000	b55acce3-df9d-4fdf-8944-40f938001246	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 09:49:58.800612+00	
00000000-0000-0000-0000-000000000000	2a72ff00-0854-4261-86b0-eed02a85c9b3	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 09:49:58.804034+00	
00000000-0000-0000-0000-000000000000	18b6db5d-87f3-431e-8edd-e4f8dc83bdd6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:30.537379+00	
00000000-0000-0000-0000-000000000000	4ff690f3-a9bc-42ac-8b4c-cb1061bef1bf	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:30.542459+00	
00000000-0000-0000-0000-000000000000	060a3c78-0cc7-47c4-97d7-f1bd31d78ddb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:32.312396+00	
00000000-0000-0000-0000-000000000000	f0f0e91f-b8a9-47bd-9bbc-a446a3df8c09	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.018558+00	
00000000-0000-0000-0000-000000000000	f4987a60-180f-4814-b01b-ca66b85818c7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.074443+00	
00000000-0000-0000-0000-000000000000	37561f88-6835-4d88-adef-a7450e69a2f1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.096416+00	
00000000-0000-0000-0000-000000000000	7dd5d2fb-12ce-4c0b-b64c-a82818f79213	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.122567+00	
00000000-0000-0000-0000-000000000000	22048f3f-f43b-4338-b03d-64b563289e44	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.136078+00	
00000000-0000-0000-0000-000000000000	799ec1ed-2725-4462-9fde-8881b411be88	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.156776+00	
00000000-0000-0000-0000-000000000000	92582f4b-d840-48a3-bbed-8a6bb4fe34b0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.189837+00	
00000000-0000-0000-0000-000000000000	5e773a9f-cef6-4e20-881b-bb6fd1d069f7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.615096+00	
00000000-0000-0000-0000-000000000000	e1d9eb49-628c-44ca-bd94-3038fcaa2a66	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.609022+00	
00000000-0000-0000-0000-000000000000	f23c6553-0ee3-4f9f-a3b4-fca7f2297f9e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.745229+00	
00000000-0000-0000-0000-000000000000	b730248c-f299-445a-8d2e-ed8a53936f26	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.761834+00	
00000000-0000-0000-0000-000000000000	dc4ccf77-f7de-4281-a5b2-f057c243e172	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.794239+00	
00000000-0000-0000-0000-000000000000	b6e372fb-5c01-4d59-8a53-93297ff63157	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:52.861617+00	
00000000-0000-0000-0000-000000000000	a635a170-f6f1-48b8-8375-cd7842399143	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.024441+00	
00000000-0000-0000-0000-000000000000	10ad6b89-87ce-48df-904d-7343b2dfa9cb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.145181+00	
00000000-0000-0000-0000-000000000000	037cc962-d941-4b88-8efc-77822deae780	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.21476+00	
00000000-0000-0000-0000-000000000000	6098a32d-8466-48df-aebb-bb4326da3322	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.244551+00	
00000000-0000-0000-0000-000000000000	b2b88195-0511-4932-9a92-00a05afeabbd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.26668+00	
00000000-0000-0000-0000-000000000000	41185047-24ec-43a8-8b49-912b712b9254	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.355163+00	
00000000-0000-0000-0000-000000000000	4bba6eb6-0d02-4370-9ff8-0f7edc48696e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 05:36:53.370331+00	
00000000-0000-0000-0000-000000000000	13330bd9-e798-409b-a6b3-5eedef212dc2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.90147+00	
00000000-0000-0000-0000-000000000000	a80010c4-11f4-4b80-9cc6-95dc4c56b2dc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:20.931024+00	
00000000-0000-0000-0000-000000000000	f8864cd7-a394-431d-8823-344924994867	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:14.915159+00	
00000000-0000-0000-0000-000000000000	a74e2f20-e658-49a4-8226-dcddf17ab48b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:15.208044+00	
00000000-0000-0000-0000-000000000000	495816c0-6ae9-4e8d-a02d-a2acf7486d10	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:15.379729+00	
00000000-0000-0000-0000-000000000000	79182956-4431-4e59-b81a-7dfb60ae0ce5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:16.03055+00	
00000000-0000-0000-0000-000000000000	bbb86a4f-a836-42f5-853f-4c854de39da2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:16.050932+00	
00000000-0000-0000-0000-000000000000	e0127a3a-2bdf-4ee3-8210-5d449fe22c1b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:16.086409+00	
00000000-0000-0000-0000-000000000000	8e0cd78d-6f36-4568-a166-37471d4f4dbd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:18.018179+00	
00000000-0000-0000-0000-000000000000	2a4117e4-0221-4f9c-a8f8-b43092afce6c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:20.011961+00	
00000000-0000-0000-0000-000000000000	d35d98d2-2860-4ea4-b5a4-1bc04c2ee47e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:22.029335+00	
00000000-0000-0000-0000-000000000000	34390b00-b776-4a46-abf3-bef5b240e159	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.621184+00	
00000000-0000-0000-0000-000000000000	ac0d4f46-859f-4dbc-9b10-b3fffa1e2f81	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.259625+00	
00000000-0000-0000-0000-000000000000	a8f8d91b-7979-404b-94ff-661da555eead	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.167823+00	
00000000-0000-0000-0000-000000000000	5f237097-9488-4621-893c-5ed9ca0f4234	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.181857+00	
00000000-0000-0000-0000-000000000000	bbf72c74-351b-4d69-8145-f7b45023269c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.210077+00	
00000000-0000-0000-0000-000000000000	98253b4c-d29c-43d8-872a-07d80c688ef1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.499054+00	
00000000-0000-0000-0000-000000000000	b0fcb06b-88a3-443c-860b-2a7e98db26ff	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.50855+00	
00000000-0000-0000-0000-000000000000	4c97af8d-5f37-40bc-87e3-581bf127edc7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.520308+00	
00000000-0000-0000-0000-000000000000	43a79c5e-e7f4-422a-85a9-182491351854	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.534518+00	
00000000-0000-0000-0000-000000000000	b2b01fb9-aa8b-48b3-bf7a-9da335176ff3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.566526+00	
00000000-0000-0000-0000-000000000000	d1267390-ddb2-4813-84d0-742697457320	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.583919+00	
00000000-0000-0000-0000-000000000000	8c6cc26c-65f2-4166-9fce-a36d83adf8e5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.598594+00	
00000000-0000-0000-0000-000000000000	7ee7cb9a-f5a0-46f8-9010-e44aa1bbe71d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 06:41:49.170724+00	
00000000-0000-0000-0000-000000000000	3e293454-f9f8-4f70-aadf-26080501c98e	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 06:41:49.174796+00	
00000000-0000-0000-0000-000000000000	91a4ce1f-ff3d-4ab4-8fe1-460188a610f6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:21.545125+00	
00000000-0000-0000-0000-000000000000	8428f2cc-f23d-4a85-bbc4-f01beb31097f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:21.578668+00	
00000000-0000-0000-0000-000000000000	c733ab77-9d73-49bc-8983-8edcf5d9b50c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:21.645352+00	
00000000-0000-0000-0000-000000000000	537832b0-b58c-4287-86fd-dde3f8202d95	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:23.671714+00	
00000000-0000-0000-0000-000000000000	559ede33-7ee9-401d-afd9-cca482ccb54d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:25.624324+00	
00000000-0000-0000-0000-000000000000	f6f1eea9-8143-48cd-9025-1a739c8dfeab	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 05:38:27.630691+00	
00000000-0000-0000-0000-000000000000	c1b33009-2594-46c5-bad5-c717ab9fc6f7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 07:42:08.47554+00	
00000000-0000-0000-0000-000000000000	727d7532-527c-432f-9092-dc27fdab25f6	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 07:42:08.496506+00	
00000000-0000-0000-0000-000000000000	62fc2f4d-ef28-469d-9d0d-06c598595e6c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 07:42:08.799827+00	
00000000-0000-0000-0000-000000000000	689ce486-9074-443c-9548-2be48f88d234	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 07:42:09.32959+00	
00000000-0000-0000-0000-000000000000	a52d79f8-1284-401a-8938-f34d9c3a081c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.658701+00	
00000000-0000-0000-0000-000000000000	d1d85282-8a4d-4c51-a585-1cf9ac4fbf15	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.274247+00	
00000000-0000-0000-0000-000000000000	6260ec41-20cb-4e21-84bd-b46bfeb99ef1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.788858+00	
00000000-0000-0000-0000-000000000000	a13cdc77-2d73-46ad-abe1-ca3dd5fc8d75	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.79872+00	
00000000-0000-0000-0000-000000000000	e2eca5f3-e2a2-4404-8a36-107892dc9d47	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-30 17:41:09.921763+00	
00000000-0000-0000-0000-000000000000	f8519df6-6b69-487c-aa7f-f40003ae1120	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-30 17:41:09.956637+00	
00000000-0000-0000-0000-000000000000	b47862e8-6ef8-462d-ab88-0150907b0d18	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-30 17:41:11.346091+00	
00000000-0000-0000-0000-000000000000	d5411b3a-23a7-4124-bc92-2b80e2d09292	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.544396+00	
00000000-0000-0000-0000-000000000000	832dc43a-030c-4d63-962d-6912b8c50aeb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 10:46:33.556426+00	
00000000-0000-0000-0000-000000000000	5285af15-f3a8-43da-bed7-e219ecdf2c88	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:05.981243+00	
00000000-0000-0000-0000-000000000000	fc560682-639a-4d7d-9888-59fae8212122	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:05.98749+00	
00000000-0000-0000-0000-000000000000	3f2d75f6-a8f3-4a93-8f7c-9b430c1ae1fe	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:07.572582+00	
00000000-0000-0000-0000-000000000000	34af9639-e5c7-4d36-9efb-fe9b1d5ca660	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.301814+00	
00000000-0000-0000-0000-000000000000	56e49729-8e6e-4961-a46e-6a7cdb16a0c3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.337893+00	
00000000-0000-0000-0000-000000000000	2b694241-6c8c-4052-832e-20ab3fc710a2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.379947+00	
00000000-0000-0000-0000-000000000000	d1164375-d333-4a46-b49d-05766082a052	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.390691+00	
00000000-0000-0000-0000-000000000000	b89748b9-431c-42f8-8489-5399839f38f3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.407795+00	
00000000-0000-0000-0000-000000000000	e4f53c81-2165-4d35-a4a9-a3149aca549d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.417183+00	
00000000-0000-0000-0000-000000000000	97a863af-e9d5-4b29-b0c7-be803d51058b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.438478+00	
00000000-0000-0000-0000-000000000000	8d2bdfb3-709c-415c-a281-4c9b059cff22	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.450768+00	
00000000-0000-0000-0000-000000000000	a98ca4bd-ab87-47c1-9408-4a58cfc8ef4d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.471483+00	
00000000-0000-0000-0000-000000000000	361f00dc-c869-43f9-8c8a-0ffbc67742e1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.478433+00	
00000000-0000-0000-0000-000000000000	9cf86605-2f2b-4d6b-ba47-f1a443fdbbb8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.975684+00	
00000000-0000-0000-0000-000000000000	5a96085f-d23e-4afa-b378-4303b9d6a3b2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:08.993898+00	
00000000-0000-0000-0000-000000000000	43aafddb-9f87-4b06-a5cb-13a02bfcd747	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:09.002075+00	
00000000-0000-0000-0000-000000000000	591d5459-4301-477e-9ec3-6f4b706049ca	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:09.01233+00	
00000000-0000-0000-0000-000000000000	844f5005-1d98-418a-867f-8d36eb6fe909	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:09.019191+00	
00000000-0000-0000-0000-000000000000	1465a65c-9704-4b66-9437-41afae971ba3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:09.029804+00	
00000000-0000-0000-0000-000000000000	d4e21f84-db67-45e1-b7de-3ee7d67e47ae	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:09.050942+00	
00000000-0000-0000-0000-000000000000	0878fc79-1345-4c71-8656-1ccc0164b11d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:09.05981+00	
00000000-0000-0000-0000-000000000000	7a1b3407-b553-4aff-9ed7-99280cde04d4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:09.07587+00	
00000000-0000-0000-0000-000000000000	eb1e2767-adec-4c60-8b7b-74d0a34cbb3d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 12:47:09.095156+00	
00000000-0000-0000-0000-000000000000	a0d797e1-8286-4f16-a508-4d8516937a79	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-07 06:36:20.083263+00	
00000000-0000-0000-0000-000000000000	d68f4184-bc19-425a-a896-a3115607a70a	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-07 06:36:20.106058+00	
00000000-0000-0000-0000-000000000000	2554fbb5-7284-40a8-afac-d1faa377806c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-07 06:36:21.976492+00	
00000000-0000-0000-0000-000000000000	e0bfda64-f343-4a56-8942-6450880cbc3a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-07 06:36:22.695221+00	
00000000-0000-0000-0000-000000000000	ef3f86f7-461d-4fdc-a603-e9fb853e5c22	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-07 06:36:23.311574+00	
00000000-0000-0000-0000-000000000000	f194b7c8-0f25-441d-9fd4-e9bb92410244	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-07 07:42:30.384903+00	
00000000-0000-0000-0000-000000000000	e6fc589c-b287-4a1e-bb38-b5fc1e5e6cf4	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-07 07:42:30.388176+00	
00000000-0000-0000-0000-000000000000	e433b0e2-0587-4c64-b02a-3c086129d1dc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:49.165142+00	
00000000-0000-0000-0000-000000000000	eb2c2778-7a9c-4dcc-8009-7848c2eee397	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:49.186574+00	
00000000-0000-0000-0000-000000000000	02ab88f6-2d94-469f-a82d-2f5ac3e07b9c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:50.635133+00	
00000000-0000-0000-0000-000000000000	1a197989-9c37-4cfb-90a7-d97f30eff1c3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.463075+00	
00000000-0000-0000-0000-000000000000	b7c137ba-4227-4100-8398-1cd8647cd89f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.495021+00	
00000000-0000-0000-0000-000000000000	9c4b3a8d-a8cd-4c7e-9987-a00c0bc80129	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.547582+00	
00000000-0000-0000-0000-000000000000	a8f80f01-9ba2-4e6f-822e-8e9e53779d72	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.563391+00	
00000000-0000-0000-0000-000000000000	861e2840-9ef5-4b0f-978f-b71fc8c488ff	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.578997+00	
00000000-0000-0000-0000-000000000000	500535fe-8b3a-4349-9965-9b10a79da0c6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.592563+00	
00000000-0000-0000-0000-000000000000	924b41ff-d52a-4a1c-b4d7-3a02975a1e90	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.603804+00	
00000000-0000-0000-0000-000000000000	ed4e898b-2688-4af2-89d7-ed3943497688	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.611817+00	
00000000-0000-0000-0000-000000000000	3ccd8dd5-c88f-4415-9909-14584bce94e7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.624734+00	
00000000-0000-0000-0000-000000000000	dec104df-1124-47b8-9166-0d06521a4cc5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:51.633394+00	
00000000-0000-0000-0000-000000000000	c003264c-cb45-432f-86ce-38983cfd59f6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.150791+00	
00000000-0000-0000-0000-000000000000	36ba2617-d3ac-4d68-93a5-d5c8dda99dc5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.170908+00	
00000000-0000-0000-0000-000000000000	2b1a2a7e-01cb-4982-8e12-612b24c637d1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.185409+00	
00000000-0000-0000-0000-000000000000	f05ed65a-c703-4e63-a9fa-26e371eefdd4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.199502+00	
00000000-0000-0000-0000-000000000000	a971f277-93e1-44f3-adb0-d865e91bd12b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.207702+00	
00000000-0000-0000-0000-000000000000	8c71be2d-3ac2-4d2f-9c12-80c5d6dee342	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.214943+00	
00000000-0000-0000-0000-000000000000	dfec7627-46d4-4459-abd0-26b6ed4f0aa0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.22331+00	
00000000-0000-0000-0000-000000000000	fb289ff6-cc27-4f87-be24-4fc01340f8f1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.232237+00	
00000000-0000-0000-0000-000000000000	ca825353-0858-40f6-b07e-9a3adbe58c94	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.239527+00	
00000000-0000-0000-0000-000000000000	5ec8765d-1a45-428f-a485-b22dc3a440ec	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 12:31:52.26677+00	
00000000-0000-0000-0000-000000000000	19dd109f-a305-48e0-bb1f-d21f6a059fdf	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 13:29:51.669496+00	
00000000-0000-0000-0000-000000000000	fe692e41-85fa-4776-809c-062f45ba77d8	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 13:29:51.671658+00	
00000000-0000-0000-0000-000000000000	030ea747-a68a-4757-925a-5014d62bfb69	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:30.165107+00	
00000000-0000-0000-0000-000000000000	cbee2e6e-64ef-4bac-bae4-7a8d96922c5d	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:30.192142+00	
00000000-0000-0000-0000-000000000000	31693845-940e-4c1d-ae53-cc68daa71bd2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:31.630764+00	
00000000-0000-0000-0000-000000000000	8d9a790f-442b-41f1-b563-183007c716c7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.356343+00	
00000000-0000-0000-0000-000000000000	948f0747-4e30-45d7-940e-7e9929995b17	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.393414+00	
00000000-0000-0000-0000-000000000000	d67b799a-bfb4-47ae-8c7d-0ad892077676	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.424536+00	
00000000-0000-0000-0000-000000000000	207efb1f-fd46-4306-926d-c8fb0f5edec2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.438674+00	
00000000-0000-0000-0000-000000000000	ca8536c3-dc00-4a9f-a867-3967d1800f26	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.452146+00	
00000000-0000-0000-0000-000000000000	0c20694c-cd73-4092-89ab-8b68d7440978	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.472104+00	
00000000-0000-0000-0000-000000000000	54d02e5e-a1dd-48e6-ac40-dcd63fe2c908	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.492978+00	
00000000-0000-0000-0000-000000000000	61e2bee6-e0e8-492f-a273-96e285a32f68	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.510965+00	
00000000-0000-0000-0000-000000000000	50499756-5743-479d-90f3-7210337a1a1e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.535736+00	
00000000-0000-0000-0000-000000000000	01742a41-5ccd-48b1-88b2-86caf6536812	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:32.554111+00	
00000000-0000-0000-0000-000000000000	dd503097-f01c-49b9-baff-02243b486515	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.014499+00	
00000000-0000-0000-0000-000000000000	2521a07c-5ba9-4cc5-bebf-32e65eb1d590	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.039763+00	
00000000-0000-0000-0000-000000000000	7d043718-e09c-4dfa-91b4-36865a70492e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.058904+00	
00000000-0000-0000-0000-000000000000	50b7d3b1-4df7-464d-a00b-830f1b8814c4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.073199+00	
00000000-0000-0000-0000-000000000000	65dbcfaf-37be-45bc-8c06-2373ef3e848e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.082281+00	
00000000-0000-0000-0000-000000000000	12d44a8b-49d8-4a5f-abd1-daea65019fea	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.090863+00	
00000000-0000-0000-0000-000000000000	65be7255-e5a0-4c9f-8a15-30af566ede55	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.103383+00	
00000000-0000-0000-0000-000000000000	0083b97a-a9de-4ba3-b32a-96c496e75334	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.113086+00	
00000000-0000-0000-0000-000000000000	21edba8b-3989-45f8-bed9-44f8d6787051	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.122075+00	
00000000-0000-0000-0000-000000000000	dfcc9ba2-ab3a-4ef2-ad7e-ede5e9bb6dba	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:33:33.129902+00	
00000000-0000-0000-0000-000000000000	e2443df9-a2da-49a4-8c27-cb5110d43da7	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:40.389862+00	
00000000-0000-0000-0000-000000000000	6b1339df-2f9e-4f93-a930-ac402e655e1a	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:40.39276+00	
00000000-0000-0000-0000-000000000000	f3e61aa1-fa4d-426d-81a4-6ed6250dccdc	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:52.033623+00	
00000000-0000-0000-0000-000000000000	c7641cfd-ea98-4a6f-932b-447c591c1021	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:52.595283+00	
00000000-0000-0000-0000-000000000000	346ef526-eb42-4a1c-bda7-95d04b4bb421	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.017333+00	
00000000-0000-0000-0000-000000000000	64aa0f14-4970-4aca-8972-15d65d38fc12	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.033444+00	
00000000-0000-0000-0000-000000000000	8bd6ce08-63e8-4f59-affe-d0c362318b10	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.05149+00	
00000000-0000-0000-0000-000000000000	bba482c3-5fdc-4ad3-a037-2afa1b7f418b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.070651+00	
00000000-0000-0000-0000-000000000000	8431338c-852d-4c7a-ac73-07ae3855d416	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.080886+00	
00000000-0000-0000-0000-000000000000	a503d621-6f07-4b5e-9b98-50806c1a8dcb	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.124796+00	
00000000-0000-0000-0000-000000000000	8df6c1d6-f4b5-4a76-a9ae-4aa603a53a27	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:57.360915+00	
00000000-0000-0000-0000-000000000000	ce1a9675-0be8-45d2-a170-726690c0c4ce	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:57.38156+00	
00000000-0000-0000-0000-000000000000	4231e3ac-ae3f-4d80-ad04-2de20d77adda	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.034632+00	
00000000-0000-0000-0000-000000000000	351d5985-dd9b-4bf4-be16-36b185307c6a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.744913+00	
00000000-0000-0000-0000-000000000000	dc0440af-a5e8-4fe1-9056-86b40cc1db03	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.786434+00	
00000000-0000-0000-0000-000000000000	16f4157f-1df3-4880-a64e-8d7c831c0585	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 06:41:33.499288+00	
00000000-0000-0000-0000-000000000000	c7b8f9ed-4211-46b4-ba9e-c2891f07f3c7	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 06:41:33.510391+00	
00000000-0000-0000-0000-000000000000	dc46883d-0fd6-4efa-b8ec-adb1e142de15	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:27.428972+00	
00000000-0000-0000-0000-000000000000	11ceb342-f465-464e-9946-a22e8fb1f543	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:27.442198+00	
00000000-0000-0000-0000-000000000000	f292c5d5-fe05-4351-bc4a-74371cdf4eac	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.029816+00	
00000000-0000-0000-0000-000000000000	dc9b5aad-3557-417c-b8ee-4b06359cfa53	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.648733+00	
00000000-0000-0000-0000-000000000000	4f597e92-befd-432d-9ade-4f839c13d254	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.786355+00	
00000000-0000-0000-0000-000000000000	1a305aa1-e640-469a-ae30-d52e9394e8f3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.816517+00	
00000000-0000-0000-0000-000000000000	99368a2a-fa26-4a17-ac40-5520eff633f3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.683977+00	
00000000-0000-0000-0000-000000000000	64a6b3d3-6eb4-4281-9fe3-330d212db664	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.714022+00	
00000000-0000-0000-0000-000000000000	8810041c-0e27-435e-a1f9-b393ffd746ad	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:47.741118+00	
00000000-0000-0000-0000-000000000000	4b3b8fbb-0053-4f9f-8556-5d9e6dc7932c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.202113+00	
00000000-0000-0000-0000-000000000000	2bfb5430-c739-4651-9569-ba39a4d75cdf	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.215991+00	
00000000-0000-0000-0000-000000000000	a57ac802-ffcd-4da7-89b3-0963f366ca9c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.232013+00	
00000000-0000-0000-0000-000000000000	7640cd9f-381e-4d21-ad25-90940b4af8ff	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.299909+00	
00000000-0000-0000-0000-000000000000	93b5fd97-5d86-4fb0-a19a-4887218bfacd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.317149+00	
00000000-0000-0000-0000-000000000000	c08141bd-6a2f-4175-a73d-92f8b5b4496f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.334852+00	
00000000-0000-0000-0000-000000000000	db03fa9a-2d70-4cf3-bba8-28d20a702586	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.342846+00	
00000000-0000-0000-0000-000000000000	4f8a196d-3e54-4c9b-90be-bb4fac64928c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.354603+00	
00000000-0000-0000-0000-000000000000	8c6294a6-756a-4bbb-bdbb-2d9e4b82f4f4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.607452+00	
00000000-0000-0000-0000-000000000000	1d039013-e3f8-4bdb-a1b6-217d3ca87533	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.633327+00	
00000000-0000-0000-0000-000000000000	287f0aea-3c41-41a8-9d81-54da41880711	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.775573+00	
00000000-0000-0000-0000-000000000000	8d0624dc-03ae-4df9-9f4c-381d3a6427ae	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.105382+00	
00000000-0000-0000-0000-000000000000	7a751d61-cb9a-495e-b56a-e2442219e099	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.136479+00	
00000000-0000-0000-0000-000000000000	ae0ba310-16bf-44e3-a81a-87ef036e9f0b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.166816+00	
00000000-0000-0000-0000-000000000000	4b82dbba-d9a9-4e9d-9b8f-bfeca007ebfd	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.391202+00	
00000000-0000-0000-0000-000000000000	44e2ec14-d9dc-4535-821b-4a2cd18a47c8	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.548434+00	
00000000-0000-0000-0000-000000000000	0ed62f7c-a2bb-4503-81d7-cb1275a156ab	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.581807+00	
00000000-0000-0000-0000-000000000000	d2f44a19-b9c4-49b7-8634-e62f594d99e4	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.591302+00	
00000000-0000-0000-0000-000000000000	2e819c05-e0cb-47ec-9c4a-3b4b36a6e2a1	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.60657+00	
00000000-0000-0000-0000-000000000000	20ea3591-d0ed-4560-ad84-2cdcefac3136	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.617909+00	
00000000-0000-0000-0000-000000000000	fc365348-326e-43a6-b6a1-80839ea67942	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.624391+00	
00000000-0000-0000-0000-000000000000	f50eadd5-06fc-4568-b3a3-6f6dbd6dbd22	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.637048+00	
00000000-0000-0000-0000-000000000000	e7fc22fa-b196-4450-b922-56a5b8fdb011	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.655344+00	
00000000-0000-0000-0000-000000000000	7b559948-fb6e-43c5-baaf-82ea85f9b724	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 16:44:53.66615+00	
00000000-0000-0000-0000-000000000000	0fdb5476-9557-446c-a53d-a5be3a009e72	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 06:02:00.818905+00	
00000000-0000-0000-0000-000000000000	e5d6a3d2-443d-40e8-829d-8b7ec8c1b602	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 06:02:00.826823+00	
00000000-0000-0000-0000-000000000000	c16c403e-e1ea-454c-a246-fad16182f4d3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 06:03:43.467519+00	
00000000-0000-0000-0000-000000000000	a77f5ccb-cd13-4e2a-bfdd-02a085e5acdd	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 06:03:43.469233+00	
00000000-0000-0000-0000-000000000000	9c58f578-44ec-4d19-8bcd-70d84529c443	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 06:03:45.21424+00	
00000000-0000-0000-0000-000000000000	0ef48357-60a7-46cd-91db-dbd1662680e3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 06:03:46.422452+00	
00000000-0000-0000-0000-000000000000	b33171f8-b766-4c4d-9cff-b5372fe854e6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:28:32.579873+00	
00000000-0000-0000-0000-000000000000	b96c0373-0143-40c9-8205-04b801298f23	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:28:32.592409+00	
00000000-0000-0000-0000-000000000000	8e54a230-2d32-41f5-899f-c02a3548786d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:28:33.658289+00	
00000000-0000-0000-0000-000000000000	8d963fbb-fce9-4d14-8f7a-87423aa56a23	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:04.926525+00	
00000000-0000-0000-0000-000000000000	e9bf5769-a49f-476c-b873-e6e651e28b57	{"action":"token_revoked","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:04.928783+00	
00000000-0000-0000-0000-000000000000	c32c85e9-22fd-474c-8be9-1bcf3b095863	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:06.205833+00	
00000000-0000-0000-0000-000000000000	c5b0e2a8-a21b-4ce0-8b84-61c267dd1579	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.244163+00	
00000000-0000-0000-0000-000000000000	6e2ce79f-f2df-4d1a-ad1c-0850291245ed	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.456+00	
00000000-0000-0000-0000-000000000000	eae83835-38ad-4c65-9472-6c748b52df61	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.471505+00	
00000000-0000-0000-0000-000000000000	b956c5fc-fad9-4806-8aaa-84e931631b01	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.486701+00	
00000000-0000-0000-0000-000000000000	071f2d5f-6f02-4b39-a4f8-feebacd08e5e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.502779+00	
00000000-0000-0000-0000-000000000000	88930535-2c7d-42fb-ad34-284384b5a2b2	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.533836+00	
00000000-0000-0000-0000-000000000000	f17f537a-bbad-4b8c-8535-84d0645063a7	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.55765+00	
00000000-0000-0000-0000-000000000000	c3b34665-910a-4488-b123-0966ef1f2fd7	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.573343+00	
00000000-0000-0000-0000-000000000000	3c2a5ac2-b230-4b2c-af9f-ad7e623a7167	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.580575+00	
00000000-0000-0000-0000-000000000000	b1c158ce-27d0-4bc7-834e-f7fb5618cf4b	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:08.605398+00	
00000000-0000-0000-0000-000000000000	340342f1-5693-4413-94f9-c750db88110a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:09.295732+00	
00000000-0000-0000-0000-000000000000	51c1cb0b-dab2-429a-b883-3101e0f7be4c	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:09.317887+00	
00000000-0000-0000-0000-000000000000	6d0d2b07-10a9-4de0-8f9e-438d33831954	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:09.375595+00	
00000000-0000-0000-0000-000000000000	df7c5caf-58e4-4e4b-9034-81fe927febc2	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:09.470347+00	
00000000-0000-0000-0000-000000000000	fffa470b-3f14-451c-b728-0b8dab584bb8	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:09.58634+00	
00000000-0000-0000-0000-000000000000	4c2c285c-5e12-4393-b72a-926c78146e90	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:09.75826+00	
00000000-0000-0000-0000-000000000000	9c518876-971a-4a6c-9c9f-a1d96bfde855	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:09.894573+00	
00000000-0000-0000-0000-000000000000	51959d5f-0302-4c89-aa27-edbf9699694c	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:09.914269+00	
00000000-0000-0000-0000-000000000000	cf871c88-4f36-4350-900c-be5779983576	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.26972+00	
00000000-0000-0000-0000-000000000000	b1fd72ce-adee-4c85-a21a-c17d4749ef2d	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.338192+00	
00000000-0000-0000-0000-000000000000	d6d55fd3-3606-4393-b671-fdaea69da227	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.408375+00	
00000000-0000-0000-0000-000000000000	bab20082-5e94-4172-96d1-1c19d6e53c19	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.487599+00	
00000000-0000-0000-0000-000000000000	bc471a58-15f9-46ab-a92a-59d113db58b0	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.644424+00	
00000000-0000-0000-0000-000000000000	6594b7ab-5f93-435e-8ec1-5f023f35589b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.856053+00	
00000000-0000-0000-0000-000000000000	617ccd73-5b0c-47f3-93ce-97199f4ba4e3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.906224+00	
00000000-0000-0000-0000-000000000000	866f95ad-be5d-4f0b-bc10-05455a85754f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.94091+00	
00000000-0000-0000-0000-000000000000	3a58822d-f82d-47fb-8d55-5cd4c1bc98f8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.952566+00	
00000000-0000-0000-0000-000000000000	19ac1358-1c88-4f93-95cf-a905738e18b4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.989678+00	
00000000-0000-0000-0000-000000000000	e03a0eb8-1eb4-4109-908e-538d7f024a75	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.529087+00	
00000000-0000-0000-0000-000000000000	4fb12339-3482-47db-9557-9d03d15aec97	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:53.361815+00	
00000000-0000-0000-0000-000000000000	1a7960ba-8ebd-414b-950f-6a7a3f7c8c8e	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:53.382182+00	
00000000-0000-0000-0000-000000000000	04c14018-3c4b-49e4-bd35-d8a55f948a8b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:54.952427+00	
00000000-0000-0000-0000-000000000000	1762f60c-4bda-4476-968f-8ff9061bbfb0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.497236+00	
00000000-0000-0000-0000-000000000000	6033078b-4aff-4a58-9d50-22eec1ae4411	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.732251+00	
00000000-0000-0000-0000-000000000000	3e0263de-6319-48e9-bcdf-6d6f9ab9c927	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.860939+00	
00000000-0000-0000-0000-000000000000	1e04b6d3-f3f4-4085-a485-daf252cf4209	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.252853+00	
00000000-0000-0000-0000-000000000000	1ec830a8-4e9a-47b8-8675-2390a37e6ebd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.27339+00	
00000000-0000-0000-0000-000000000000	e5c8cb75-2dfd-4738-ab37-284effe9f81e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.291993+00	
00000000-0000-0000-0000-000000000000	8dd9960c-c1ea-4190-b1b2-9531d177dd04	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.303243+00	
00000000-0000-0000-0000-000000000000	a3ddfb20-b7ed-43c0-840e-8c1ee4f0c00a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.692408+00	
00000000-0000-0000-0000-000000000000	8bab4767-887a-4d00-af79-5504b0c5c245	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.711183+00	
00000000-0000-0000-0000-000000000000	cb762e62-1d26-4410-a3d5-f69e42b07562	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.744605+00	
00000000-0000-0000-0000-000000000000	f6b61301-54b6-4557-b668-bbdc86563055	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.774236+00	
00000000-0000-0000-0000-000000000000	10ccefe6-6e7c-43f1-a3b5-f9a40e6ad353	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:10.961806+00	
00000000-0000-0000-0000-000000000000	4a3f799c-040f-460b-899f-05b5fac8baea	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:11.044261+00	
00000000-0000-0000-0000-000000000000	c373195b-3fea-48b4-a078-2cf568f1408a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:11.168321+00	
00000000-0000-0000-0000-000000000000	6526acfd-d320-4a0e-b5f5-1332a213e3d4	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:11.176943+00	
00000000-0000-0000-0000-000000000000	4c9bf407-1bc5-42f1-b53c-95c4560c45c4	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:12.960111+00	
00000000-0000-0000-0000-000000000000	caad11a2-7867-442d-9aff-6e335d029f03	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:14.941281+00	
00000000-0000-0000-0000-000000000000	9324047b-defb-4b6c-800b-14db42aa9458	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:16.963426+00	
00000000-0000-0000-0000-000000000000	998993b2-b16a-4501-956e-2bf506642824	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:18.935644+00	
00000000-0000-0000-0000-000000000000	c3883e9b-3332-492c-a4b1-3305fd635b79	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:20.941963+00	
00000000-0000-0000-0000-000000000000	69275c51-939f-4651-aa5b-4885ae645231	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:22.988796+00	
00000000-0000-0000-0000-000000000000	2e8931f1-4331-4a93-9170-2f0a74f23859	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:24.922184+00	
00000000-0000-0000-0000-000000000000	f693ddb9-96ae-4e2b-837f-4bb655ffcd6a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:26.927237+00	
00000000-0000-0000-0000-000000000000	81f79f7d-1ce0-46a3-a51f-1fc82fab6564	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:29.01776+00	
00000000-0000-0000-0000-000000000000	abba4328-37b4-45e0-8be2-ed98f06aff5e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:30.95068+00	
00000000-0000-0000-0000-000000000000	9b266cc6-bc94-4f07-9699-3ae063ad1372	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:32.979366+00	
00000000-0000-0000-0000-000000000000	4250e7b8-cf90-47c6-bcaf-b6df8deda171	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:35.012896+00	
00000000-0000-0000-0000-000000000000	0a2eaeda-c7bc-4841-91f8-eceb5c394392	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:36.935527+00	
00000000-0000-0000-0000-000000000000	05348af8-4f7f-4739-ba9b-93ecea08ba04	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:39.021575+00	
00000000-0000-0000-0000-000000000000	b1d54b5b-f25b-4c54-be19-4641540c4396	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:40.943639+00	
00000000-0000-0000-0000-000000000000	0712ea8f-e7d1-4e8e-b5aa-c6e4e3dbe080	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:43.114139+00	
00000000-0000-0000-0000-000000000000	ae808b88-f589-4967-ae0c-5b2603f82f3a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:44.92805+00	
00000000-0000-0000-0000-000000000000	88f03375-1350-490e-858d-9797e245da94	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:46.949912+00	
00000000-0000-0000-0000-000000000000	776a08ea-f647-4f31-97cc-298ee0d258bb	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:49.015109+00	
00000000-0000-0000-0000-000000000000	1ca73907-1361-4b27-9cd1-d2023f2e8e34	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:50.923147+00	
00000000-0000-0000-0000-000000000000	db8fa6b4-0e08-4102-86a6-43e4bc943f89	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:53.023519+00	
00000000-0000-0000-0000-000000000000	da31f535-3eec-45c2-9271-dca4bcce5f41	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:54.927744+00	
00000000-0000-0000-0000-000000000000	bc8deccf-4558-4bec-b38c-4f43f878aa72	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:57.097951+00	
00000000-0000-0000-0000-000000000000	e39af5b1-0d3d-4798-b1f4-2c208b07b095	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:31:58.946011+00	
00000000-0000-0000-0000-000000000000	2d12cf3a-1dfa-4621-a548-630c254631b1	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:00.923464+00	
00000000-0000-0000-0000-000000000000	34ad3a7c-69aa-4b68-8856-a7cd4be9f20e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:02.916159+00	
00000000-0000-0000-0000-000000000000	908dc418-aace-45ab-97d3-207e7bd0619c	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:04.998232+00	
00000000-0000-0000-0000-000000000000	787a15eb-31ba-482c-b73f-32614f3bdbe2	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:06.937159+00	
00000000-0000-0000-0000-000000000000	4b0d59b2-6787-4b42-b3f1-0b8a5160e414	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:08.925385+00	
00000000-0000-0000-0000-000000000000	317e3a70-3346-44c6-a25a-cf9cf0ce663a	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:10.920448+00	
00000000-0000-0000-0000-000000000000	185d6ed6-7aff-4f53-a415-cd3e1a8ee508	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:12.9611+00	
00000000-0000-0000-0000-000000000000	3977e412-eaa2-428f-ab8a-2e776a90adc2	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:14.934472+00	
00000000-0000-0000-0000-000000000000	5c5be516-a26c-4c13-bcfa-dd0ac431bd4f	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:16.924524+00	
00000000-0000-0000-0000-000000000000	7120affe-cf28-486a-961d-878721f05664	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:19.020021+00	
00000000-0000-0000-0000-000000000000	6df24116-5163-4599-881f-c4160ad4db7e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:21.040931+00	
00000000-0000-0000-0000-000000000000	d8aa5aeb-dcac-478c-911a-30508463c1b1	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:22.974305+00	
00000000-0000-0000-0000-000000000000	5ae98420-baa6-4374-8f64-b6a84d065eea	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:24.939042+00	
00000000-0000-0000-0000-000000000000	9f2ab26d-f9aa-4046-9779-192543d18636	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:26.937993+00	
00000000-0000-0000-0000-000000000000	16233736-7caf-4b15-bdcd-11236cae2cba	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:28.992223+00	
00000000-0000-0000-0000-000000000000	5b20a0e5-6773-4ee0-b708-82d55a19e3db	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:30.928493+00	
00000000-0000-0000-0000-000000000000	223f341b-9654-4066-a49a-f5958bb90901	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:32.912342+00	
00000000-0000-0000-0000-000000000000	1acf7bfe-e908-44c8-9cea-40714f27bf4e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:34.919218+00	
00000000-0000-0000-0000-000000000000	9c8484c0-9078-49ce-92ad-e8bebc6664fc	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:36.917955+00	
00000000-0000-0000-0000-000000000000	517b0bca-b4e4-4d1c-aa79-56a06b34906e	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:39.039802+00	
00000000-0000-0000-0000-000000000000	98d5da87-4a62-430f-9d4a-b2de8cdffec8	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:41.015271+00	
00000000-0000-0000-0000-000000000000	33d050e5-db0b-4436-a416-0e28218fb3cf	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:43.030017+00	
00000000-0000-0000-0000-000000000000	d66d205e-97b4-45f1-9fa6-5b164cd25440	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:44.943006+00	
00000000-0000-0000-0000-000000000000	b178c792-7c7a-48f4-bac1-a392cfd098f9	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:46.94934+00	
00000000-0000-0000-0000-000000000000	9cf532d0-db93-4522-ac5d-a5b66a961dd9	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:49.013132+00	
00000000-0000-0000-0000-000000000000	f92c3806-c382-4a8a-9dd4-fce9fa314f95	{"action":"token_refreshed","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-10 07:32:51.184337+00	
00000000-0000-0000-0000-000000000000	46f2b540-0e6f-475e-bbd9-9f2b3ba8151d	{"action":"logout","actor_id":"1adbfc3b-6597-46ae-b020-35cd417418f3","actor_username":"smith@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-10 07:34:59.287294+00	
00000000-0000-0000-0000-000000000000	ff65eb15-f36b-4619-969b-daad31e726bf	{"action":"login","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-10 07:35:14.272414+00	
00000000-0000-0000-0000-000000000000	719a50f3-c6a7-46f1-9917-2ff4f18a252e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:44.942266+00	
00000000-0000-0000-0000-000000000000	16308743-8b86-42bf-a4d1-e3243ea90a32	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:44.960641+00	
00000000-0000-0000-0000-000000000000	c1a120aa-a572-41db-8199-a568248385ec	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:46.469643+00	
00000000-0000-0000-0000-000000000000	1d2397d0-d1cb-4f4e-ace1-8d442dcdabc1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.224591+00	
00000000-0000-0000-0000-000000000000	4d5b14f2-b395-4998-8039-1b989558d5cb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.244262+00	
00000000-0000-0000-0000-000000000000	64e60a4f-881f-4993-9c96-72b757b9454f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.285586+00	
00000000-0000-0000-0000-000000000000	2daeda74-bba8-4333-8a80-267a85b92d1e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.299316+00	
00000000-0000-0000-0000-000000000000	401e476b-a4b9-4ac4-9942-cc2ec267cbbb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.317792+00	
00000000-0000-0000-0000-000000000000	31044c7c-1b6b-43c0-9864-3e37bb402934	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.333749+00	
00000000-0000-0000-0000-000000000000	ef5b15ce-71ce-4679-8bda-79208734dcfc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.350413+00	
00000000-0000-0000-0000-000000000000	34468ccc-b313-4ea4-ba6a-ba93c8b5882f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.371215+00	
00000000-0000-0000-0000-000000000000	b74c3810-c12b-49a4-80df-e5361ddb9fc0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.378505+00	
00000000-0000-0000-0000-000000000000	50faf4c9-99a5-4359-9de2-b191efbce2bc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.402415+00	
00000000-0000-0000-0000-000000000000	88cc366e-ae58-47ab-ac1d-e84798560920	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.880157+00	
00000000-0000-0000-0000-000000000000	96e1419b-497c-4ca8-8231-d5cae356bb5f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.891868+00	
00000000-0000-0000-0000-000000000000	14fb123c-ebe5-4ebb-8376-ac901dcc82ab	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.906872+00	
00000000-0000-0000-0000-000000000000	fb3269d1-7370-4a8e-9ee8-aeb5c34f52a2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.920019+00	
00000000-0000-0000-0000-000000000000	fec7a567-0015-4133-848c-aa073c199b2d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.934847+00	
00000000-0000-0000-0000-000000000000	a41d013a-1b2c-4a77-99fb-e5aa90b650e6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.95357+00	
00000000-0000-0000-0000-000000000000	73ac001a-ccf9-4db3-bbe5-a5888d6615c9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.96185+00	
00000000-0000-0000-0000-000000000000	feb68af2-5505-48f2-96a6-f590cb8cf0dc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.968336+00	
00000000-0000-0000-0000-000000000000	a5ff1f77-e5d4-484d-963b-aeeb2fa6cf32	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.981961+00	
00000000-0000-0000-0000-000000000000	ae52c1c0-8278-4b20-9799-aa3e423ede30	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.146085+00	
00000000-0000-0000-0000-000000000000	1ce32be2-b43d-4bed-84b8-3c5194cac473	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.318999+00	
00000000-0000-0000-0000-000000000000	65609ebc-066a-468e-bf20-e0da3f73aa55	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.3839+00	
00000000-0000-0000-0000-000000000000	e7f7346e-3124-479f-aac4-c1b116ace324	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.449517+00	
00000000-0000-0000-0000-000000000000	2e4a0999-2330-4df2-a540-ad886da10296	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.478322+00	
00000000-0000-0000-0000-000000000000	b50d7f03-ec28-49f5-8f1d-35af2ba361cc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.53093+00	
00000000-0000-0000-0000-000000000000	8913375b-76da-47a7-9e38-002ad3edf765	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.545213+00	
00000000-0000-0000-0000-000000000000	d5e58eb7-b041-4f10-a0e5-fa18ec4ff59a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.552646+00	
00000000-0000-0000-0000-000000000000	c7516858-c9a6-40c5-9548-44eb3a615c16	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.873156+00	
00000000-0000-0000-0000-000000000000	4e459799-ca52-4b8c-9473-94dbd585f357	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.754554+00	
00000000-0000-0000-0000-000000000000	194e8cff-fac8-401d-be7e-30d500cd15aa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.781875+00	
00000000-0000-0000-0000-000000000000	49aefe28-cfc3-42ad-8c3e-0cb8c5710362	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.81553+00	
00000000-0000-0000-0000-000000000000	34e1af8b-b6da-49e2-b9b2-034cc8ebbdca	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.825994+00	
00000000-0000-0000-0000-000000000000	80b0aca7-9eeb-478f-a573-5a21798e8344	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.840644+00	
00000000-0000-0000-0000-000000000000	bf270604-95f7-4d4f-9c8f-a088e343ea8b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:47.944092+00	
00000000-0000-0000-0000-000000000000	9e2defc2-eb94-4f96-9f78-f176ffe915fe	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.560192+00	
00000000-0000-0000-0000-000000000000	e80c5fff-e8fb-42ce-b308-ee8d0f0896a7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:48.617181+00	
00000000-0000-0000-0000-000000000000	c4651c71-3676-446b-b22b-e5dc1344ca8a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:50.474243+00	
00000000-0000-0000-0000-000000000000	af74bd2c-63f0-4933-a2fd-4532d0b8bb40	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:52.458976+00	
00000000-0000-0000-0000-000000000000	525c476c-2a9f-4741-b5ad-e7aa6855ed3d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 06:52:54.467973+00	
00000000-0000-0000-0000-000000000000	7648487d-1aad-46ec-880a-6af03318dd40	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 07:50:55.657667+00	
00000000-0000-0000-0000-000000000000	701e587f-26f3-47ee-a5fc-980eb25bdc75	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-11 07:50:55.660901+00	
00000000-0000-0000-0000-000000000000	d7525c7c-e9ec-4c59-97b4-1524dd2d24d9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:48.723918+00	
00000000-0000-0000-0000-000000000000	a5243449-916e-4c9d-a548-42021a3d29dd	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:48.741543+00	
00000000-0000-0000-0000-000000000000	b1768219-c2e9-4d8b-b5f8-52ed50acefbe	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:50.231791+00	
00000000-0000-0000-0000-000000000000	aee63b81-5da6-4d84-a6e7-319b6d4553bc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:50.975202+00	
00000000-0000-0000-0000-000000000000	7cafadfd-b3e3-435a-b6a2-7ca29aac855b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.034066+00	
00000000-0000-0000-0000-000000000000	1156a8de-3c4b-4ff8-b90c-befd05a7a9ce	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.053664+00	
00000000-0000-0000-0000-000000000000	041eeccd-471b-4e30-be22-2b1a4749d1c7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.075202+00	
00000000-0000-0000-0000-000000000000	e69fe702-bf08-4e6d-b687-9257ef53126d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.089065+00	
00000000-0000-0000-0000-000000000000	dbdcba2b-d9be-432f-9b1b-720d310b4860	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.104631+00	
00000000-0000-0000-0000-000000000000	69815aeb-e1cb-4bbc-ae16-6b2fe9c12427	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.125241+00	
00000000-0000-0000-0000-000000000000	65900013-009d-468d-90e8-05a953a2fab2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.134663+00	
00000000-0000-0000-0000-000000000000	7f9e3b3f-1573-4533-8cfd-b66ecaf22813	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.145854+00	
00000000-0000-0000-0000-000000000000	197e3448-2c9d-46bf-bf78-4e91523d5ce0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.159685+00	
00000000-0000-0000-0000-000000000000	c7bb22d3-774d-452f-9bc3-2cd2efbf88ed	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.485724+00	
00000000-0000-0000-0000-000000000000	90945f4b-a613-4430-b338-686911b46b5b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.494335+00	
00000000-0000-0000-0000-000000000000	1f3c4aa9-54b7-416c-916c-1c8757c8debe	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.593377+00	
00000000-0000-0000-0000-000000000000	e5769705-fb52-406b-8f2a-3c80249a6afa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.674125+00	
00000000-0000-0000-0000-000000000000	75723894-8266-47a9-85f7-35b0ea12c7b2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.683003+00	
00000000-0000-0000-0000-000000000000	18667ff2-9116-4261-a0bb-685ef8cb7c14	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.692227+00	
00000000-0000-0000-0000-000000000000	d56acc16-cea9-4197-b0dd-cfd64d32e27f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.702837+00	
00000000-0000-0000-0000-000000000000	0cce337f-55de-4ff1-a005-37d20d9414e3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.713289+00	
00000000-0000-0000-0000-000000000000	ce29fda9-0c6a-465f-b0d4-34181818836a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.719863+00	
00000000-0000-0000-0000-000000000000	c3d80e4a-3198-459e-8eb4-eef468aadedb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.743516+00	
00000000-0000-0000-0000-000000000000	450d3492-4ddd-4459-b460-1b4bd1413f0e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:51.898485+00	
00000000-0000-0000-0000-000000000000	a2885a74-d9ab-45bb-b89b-f130598ae69c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:52.08859+00	
00000000-0000-0000-0000-000000000000	65d040f9-8810-4ad1-a796-0e3e9104f880	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:52.096419+00	
00000000-0000-0000-0000-000000000000	0343f353-34f1-4521-8162-45748bb40778	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:52.159603+00	
00000000-0000-0000-0000-000000000000	6b6cfdbe-d8b2-4f1f-a94c-1f63a98793a7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:52.180256+00	
00000000-0000-0000-0000-000000000000	61cd33eb-28af-4da2-a01c-319c43cd352f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:52.199924+00	
00000000-0000-0000-0000-000000000000	01d70c5d-84ab-4b1f-92a4-9ad0875e5f47	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:52.275982+00	
00000000-0000-0000-0000-000000000000	38c6c8d2-b73e-4fc4-80b9-023599f7fd55	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:52.301798+00	
00000000-0000-0000-0000-000000000000	f384db6d-bf37-4714-a5ec-1a8bc0c8bbb4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:52.309204+00	
00000000-0000-0000-0000-000000000000	a03c059a-0a0c-4486-96ae-5d27288d0c76	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:52.337551+00	
00000000-0000-0000-0000-000000000000	d306d2ea-8978-48c0-889e-f366989eb3d5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:54.264482+00	
00000000-0000-0000-0000-000000000000	accd5268-de1b-4c89-8bb7-0b0b9a093f64	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:56.225742+00	
00000000-0000-0000-0000-000000000000	d2198b04-7eaf-4d05-8f4f-8620efea3618	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:05:58.22275+00	
00000000-0000-0000-0000-000000000000	f4ad2155-806d-4b21-a198-f204b7ae2eea	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:39.581426+00	
00000000-0000-0000-0000-000000000000	a0cbfb31-4e35-4806-b037-00d033ce3f35	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:39.584061+00	
00000000-0000-0000-0000-000000000000	f494dc37-da95-4e77-9120-e4743f617990	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:41.052956+00	
00000000-0000-0000-0000-000000000000	2af8f605-f4ed-4540-ae8e-5b58c394478d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.393651+00	
00000000-0000-0000-0000-000000000000	0a68f8c7-ad18-4402-b320-c94759b70afa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.560407+00	
00000000-0000-0000-0000-000000000000	7a4b1ffe-bbe9-4f65-9e9e-43b2a416a796	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.762007+00	
00000000-0000-0000-0000-000000000000	c030f312-575c-4622-89ca-87fd9be6508a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.787255+00	
00000000-0000-0000-0000-000000000000	39f87dab-ddab-4fa0-a3cd-5c26357e3223	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.807774+00	
00000000-0000-0000-0000-000000000000	95a61233-06f1-4823-a3f2-22b792555f64	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.825491+00	
00000000-0000-0000-0000-000000000000	6e950434-00cf-4156-b7ce-d0f5b2c4cfc5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.838775+00	
00000000-0000-0000-0000-000000000000	5103283f-e0de-4a7c-959a-b92358382b2f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.854156+00	
00000000-0000-0000-0000-000000000000	0dd9f8d1-0031-4699-875f-5ec06a40989e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.890847+00	
00000000-0000-0000-0000-000000000000	1d738246-69d2-4870-be94-258101a42c77	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:42.914652+00	
00000000-0000-0000-0000-000000000000	9ad89910-136c-4b62-9264-ecfe83da63aa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.453861+00	
00000000-0000-0000-0000-000000000000	3c0283be-e0e6-480f-8500-c87e872a22d2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.461417+00	
00000000-0000-0000-0000-000000000000	5d2eec95-6c39-4723-b8e1-2ad3df0a33ec	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.496918+00	
00000000-0000-0000-0000-000000000000	18321e72-57e0-402f-897a-fca54128e3a7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.666932+00	
00000000-0000-0000-0000-000000000000	5323d20e-5645-4d08-b716-1a82d76274b0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.693204+00	
00000000-0000-0000-0000-000000000000	dcfdbbbc-e546-4692-a26f-b9e3995d434a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.8257+00	
00000000-0000-0000-0000-000000000000	2948e68a-4f7b-4a7c-b0df-55a232b6d7da	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.839298+00	
00000000-0000-0000-0000-000000000000	989bc7cd-1afa-44c2-b9bd-ac675fb9f555	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.848174+00	
00000000-0000-0000-0000-000000000000	6c47b0ae-5954-4643-be1d-2a0ae285df58	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.889575+00	
00000000-0000-0000-0000-000000000000	858d0ac4-e445-4c0d-b8ad-c7f07d80d311	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:44:59.924793+00	
00000000-0000-0000-0000-000000000000	e956aee5-d2fb-4287-a6e4-0971231ed4f6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.801504+00	
00000000-0000-0000-0000-000000000000	505c9bac-2237-47ac-8718-7a3d7a70a29c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.150681+00	
00000000-0000-0000-0000-000000000000	d16b0592-1cac-4fb2-b4c7-4b11cf595582	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.157393+00	
00000000-0000-0000-0000-000000000000	0928f88e-3c13-4949-b071-bb673554ac01	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.165963+00	
00000000-0000-0000-0000-000000000000	cbf8481b-8740-4b13-ad35-aaf7e5c502d6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.176988+00	
00000000-0000-0000-0000-000000000000	3ccaec60-f371-4a80-a79f-bdfa8102ce39	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.18921+00	
00000000-0000-0000-0000-000000000000	aabb23ba-a392-4f24-8e36-91a079f355c2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.208091+00	
00000000-0000-0000-0000-000000000000	bcf7f2da-be0d-46cb-8515-a868dcc58e26	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.222795+00	
00000000-0000-0000-0000-000000000000	cc7cf10d-c89b-4687-9cad-1fd19a8a8e00	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.237787+00	
00000000-0000-0000-0000-000000000000	48fdbed2-8c09-4aa8-8456-bb7b35d4dd53	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.573078+00	
00000000-0000-0000-0000-000000000000	09e66221-5d26-4f6b-b1c1-8a81c8df5f4d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.591194+00	
00000000-0000-0000-0000-000000000000	a558bb61-9f3f-4b5f-8acd-057ca39c5a70	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.611053+00	
00000000-0000-0000-0000-000000000000	9b3b95a3-9868-45e8-9db5-44f497367c80	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.640496+00	
00000000-0000-0000-0000-000000000000	f5d1503b-ce49-4b8a-b399-c39ae36594ca	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.769038+00	
00000000-0000-0000-0000-000000000000	2aa6869b-d1f1-49c8-aea3-beaf33c90533	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.780549+00	
00000000-0000-0000-0000-000000000000	0df3517e-633e-4cd8-b30f-4fc3428b37aa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.788798+00	
00000000-0000-0000-0000-000000000000	aeb8a990-7e50-4380-93f6-d58e57ec12e4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.802931+00	
00000000-0000-0000-0000-000000000000	d5f6be0f-f141-44e2-bdea-402b3c25abc9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.818867+00	
00000000-0000-0000-0000-000000000000	f2984ff1-f538-48d8-975c-953367cf1a5b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:57.021609+00	
00000000-0000-0000-0000-000000000000	8b261d9c-ad63-4c8e-b895-f295484cec69	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:58.952174+00	
00000000-0000-0000-0000-000000000000	684c3a0d-7482-451d-8128-c9d0e117f1f8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.854437+00	
00000000-0000-0000-0000-000000000000	4cf1335a-042b-4615-ac54-1561f7aa5bc2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:43.874562+00	
00000000-0000-0000-0000-000000000000	0335f10a-6417-4e33-b923-6e99cedcbd3b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.48734+00	
00000000-0000-0000-0000-000000000000	8b3886f2-277c-4c5d-aff3-28c1dbc90d97	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.502872+00	
00000000-0000-0000-0000-000000000000	cef90c15-94a3-4453-bfdd-4103737ccc64	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.525795+00	
00000000-0000-0000-0000-000000000000	a6b3e6b2-dffb-4c9c-81dd-802c574e368e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.680868+00	
00000000-0000-0000-0000-000000000000	c9849b13-35ef-494a-9f6d-8b6c7893c5ce	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.810412+00	
00000000-0000-0000-0000-000000000000	b1c44d9b-9abf-4deb-abab-f432f85bd50c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.843025+00	
00000000-0000-0000-0000-000000000000	42bf6704-0c80-4a03-b7c0-7e808ebd12b0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.86479+00	
00000000-0000-0000-0000-000000000000	5fc395a6-2d4c-4056-80ca-ce581cdbeb4a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.877104+00	
00000000-0000-0000-0000-000000000000	ad537787-6da8-4dfc-833f-0661b511f771	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.885293+00	
00000000-0000-0000-0000-000000000000	dcbb3f38-0a8e-4c9d-936d-a7915afafb5f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:44.897262+00	
00000000-0000-0000-0000-000000000000	f96e274b-8cd4-4478-b8b7-385ea15d5388	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:45.587109+00	
00000000-0000-0000-0000-000000000000	86c85abf-5120-4b2c-ab0b-01179d086c4a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:47.607004+00	
00000000-0000-0000-0000-000000000000	123a5e21-c423-45fa-8840-9b12f698fc9c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:49.586834+00	
00000000-0000-0000-0000-000000000000	9a37c557-36d7-4e57-b878-1909e23cab44	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:51.64373+00	
00000000-0000-0000-0000-000000000000	10ccd490-1990-47ed-b233-5e92b4b9a259	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:53.605752+00	
00000000-0000-0000-0000-000000000000	ce8a0e7f-9a14-483f-89e7-b7444722298f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:55.605874+00	
00000000-0000-0000-0000-000000000000	c48148ba-cf7c-4d8d-aaad-0ec854772471	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:57.581765+00	
00000000-0000-0000-0000-000000000000	4ab9f653-ec61-4f54-b1e3-0e83825d38d4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:20:59.577722+00	
00000000-0000-0000-0000-000000000000	3c9c753d-20ef-4243-bd72-f728d565c8b8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:01.579303+00	
00000000-0000-0000-0000-000000000000	524f71eb-42cb-4e11-9b94-b856172d6dc2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:03.58051+00	
00000000-0000-0000-0000-000000000000	a2167ab1-d501-4175-aa96-5f369e499ce5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:05.618623+00	
00000000-0000-0000-0000-000000000000	c2bc0bbb-b33c-47eb-a034-689587516564	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:07.576561+00	
00000000-0000-0000-0000-000000000000	c3f6c608-9256-4e27-a435-e16e602a3b9a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:09.60228+00	
00000000-0000-0000-0000-000000000000	aa6fb406-70dc-45a6-807b-e3b80ee6bdf4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:11.583861+00	
00000000-0000-0000-0000-000000000000	f269f417-09c3-4275-9dad-a758c3fad926	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:13.639901+00	
00000000-0000-0000-0000-000000000000	e1eac875-66e8-4a7d-97c0-9372936369c1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:15.608869+00	
00000000-0000-0000-0000-000000000000	6ff45f18-35f4-4f06-819b-c3c084290dd1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:17.586273+00	
00000000-0000-0000-0000-000000000000	95921f2e-37c8-41b8-b5bd-37cb376eab14	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:19.610069+00	
00000000-0000-0000-0000-000000000000	452b0c54-aafa-4de3-85b8-c8ae766e5713	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:21.619466+00	
00000000-0000-0000-0000-000000000000	f72ee2a2-2c29-4b12-9c1e-be9928b251f1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:23.602758+00	
00000000-0000-0000-0000-000000000000	08a62843-7ea3-4d19-97b3-e995a2dc5dd8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:25.586505+00	
00000000-0000-0000-0000-000000000000	7de12f2b-c391-4711-be03-9953d181c53f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:27.592126+00	
00000000-0000-0000-0000-000000000000	f75ea7c6-ac80-4469-aaa8-fccf546120d9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:29.591278+00	
00000000-0000-0000-0000-000000000000	67fa602e-ce0a-4fc7-a060-d29b2e5d8840	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:31.57612+00	
00000000-0000-0000-0000-000000000000	0800e708-c7b1-4f53-996e-e2c111516333	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:33.577057+00	
00000000-0000-0000-0000-000000000000	262a89a8-854b-4751-9c8f-d6c449814cf0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:35.581803+00	
00000000-0000-0000-0000-000000000000	3af205b0-9413-40ff-94ab-cfa582a988af	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:37.573056+00	
00000000-0000-0000-0000-000000000000	72b9d1e4-a013-4733-ab60-487167d07cf5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:39.609904+00	
00000000-0000-0000-0000-000000000000	2373684c-bfc9-4a94-be3d-aa02c1fd94be	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:41.673516+00	
00000000-0000-0000-0000-000000000000	949bfaea-78fb-4368-8d35-dd4a5a5c83dc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:43.583095+00	
00000000-0000-0000-0000-000000000000	01a3987b-ac52-47bf-924f-b6d5acf56cc5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:45.640607+00	
00000000-0000-0000-0000-000000000000	1a710b81-5dbe-4da7-b72e-ce4796d51b35	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:47.639637+00	
00000000-0000-0000-0000-000000000000	b0411c2e-70a8-47c9-861a-cf9f5bce40d1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:49.582465+00	
00000000-0000-0000-0000-000000000000	6efae49b-362b-49be-881f-ee9c4043b483	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:51.605521+00	
00000000-0000-0000-0000-000000000000	42bee4b3-8655-4c7c-9237-b9d6d68bbadc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:53.58307+00	
00000000-0000-0000-0000-000000000000	721c8a99-8148-484e-948c-b8aae288c438	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:55.656753+00	
00000000-0000-0000-0000-000000000000	7c8e1685-df34-4f42-bccf-5e183cb6cf2a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:57.631163+00	
00000000-0000-0000-0000-000000000000	857239be-d84e-4734-96bd-4c86f82de6c0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:21:59.66073+00	
00000000-0000-0000-0000-000000000000	3eaef402-d207-4cca-86c5-c9cc2b38cfd6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:01.636648+00	
00000000-0000-0000-0000-000000000000	380a5031-0060-434b-b588-2aa6c495c94f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:03.616516+00	
00000000-0000-0000-0000-000000000000	d5b15934-5a01-4710-860e-7228ac822de2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:05.580506+00	
00000000-0000-0000-0000-000000000000	d4df7e1e-abbd-4e43-8b2c-a617f17d19f4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:07.586421+00	
00000000-0000-0000-0000-000000000000	145b3bdf-2f1c-40d7-983b-96fe4c51a3c0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:09.630713+00	
00000000-0000-0000-0000-000000000000	701d09a5-3307-4e7b-b0bd-5cb4051093db	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:11.595564+00	
00000000-0000-0000-0000-000000000000	bfd1f1c0-22ed-491f-9f05-3ba01d90b5e6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:13.588902+00	
00000000-0000-0000-0000-000000000000	9779e7ce-b7dc-47b3-b0b4-ca8c65e1c744	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:15.57657+00	
00000000-0000-0000-0000-000000000000	36c889d3-8bbf-4017-bec3-d8bad6566db3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:17.572648+00	
00000000-0000-0000-0000-000000000000	830354e8-09d3-4eda-a2c6-18953eee4073	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:19.585181+00	
00000000-0000-0000-0000-000000000000	5a05a24d-8d58-4ace-9d2d-39cc61ae8c25	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:21.576524+00	
00000000-0000-0000-0000-000000000000	0e0133cd-136e-46b6-9af2-c381f25f470c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:23.617618+00	
00000000-0000-0000-0000-000000000000	ef1f4113-e6b5-4feb-8dbb-9bccdb6b0e9a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:25.617064+00	
00000000-0000-0000-0000-000000000000	4b787500-4049-4135-91da-3ad804526dee	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:27.659399+00	
00000000-0000-0000-0000-000000000000	2d955be0-4216-4615-9b9f-25fb7b1bb066	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:29.58225+00	
00000000-0000-0000-0000-000000000000	d337230e-19d2-4d79-ba2a-3a4453374ef6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:31.655901+00	
00000000-0000-0000-0000-000000000000	4fed411e-b75f-4095-bac8-11424d01b4df	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:33.630167+00	
00000000-0000-0000-0000-000000000000	faf33eb6-b00c-467b-aeab-e1e1a2749b4f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:35.629539+00	
00000000-0000-0000-0000-000000000000	48451922-d5b4-4e39-9063-b53438349a24	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:37.641546+00	
00000000-0000-0000-0000-000000000000	2f6ec844-9401-4c50-a670-7869c9a2f4ce	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:39.591181+00	
00000000-0000-0000-0000-000000000000	e1b6368b-ec07-47d0-b1af-aa219bee0d83	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:41.75847+00	
00000000-0000-0000-0000-000000000000	2cc8a0a9-a81b-405d-9690-f44c70508851	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:43.671914+00	
00000000-0000-0000-0000-000000000000	eb3ca91d-ee1f-4006-be87-fd305df3a65b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:45.579665+00	
00000000-0000-0000-0000-000000000000	d52e1b3f-f1c2-46be-bad6-429b6ce11111	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:47.79359+00	
00000000-0000-0000-0000-000000000000	1bb7c495-9fba-4c37-bba7-1925c77c369d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:49.692478+00	
00000000-0000-0000-0000-000000000000	ca42a1b7-e12d-4b5c-92c4-87432092d5e3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 06:22:51.592508+00	
00000000-0000-0000-0000-000000000000	8b6cdd32-0a00-4446-b7fb-efa4f2c66fe8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 07:26:12.151898+00	
00000000-0000-0000-0000-000000000000	1e211210-9b8a-402c-baf5-fd3adb28e07e	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 07:26:12.164025+00	
00000000-0000-0000-0000-000000000000	bea97273-1333-4e26-8160-88ced3822575	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 07:26:12.681904+00	
00000000-0000-0000-0000-000000000000	8db19ae4-8dd7-4a2c-85af-4fd9f4bdef50	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 07:26:12.819042+00	
00000000-0000-0000-0000-000000000000	32146de4-b501-4a6f-beb7-1bea15c204a6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 07:26:13.00553+00	
00000000-0000-0000-0000-000000000000	8adf9cb0-c515-4e1e-a474-6ca34a73981e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 07:26:14.316831+00	
00000000-0000-0000-0000-000000000000	1bf8b34e-2221-4a75-95c5-8275b5de12d1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 08:29:32.54064+00	
00000000-0000-0000-0000-000000000000	644954de-315f-47aa-a438-4b4e44a7b504	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 08:29:32.544169+00	
00000000-0000-0000-0000-000000000000	93234165-8e6d-48e8-8e7c-af2457fac190	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 09:35:02.891733+00	
00000000-0000-0000-0000-000000000000	bb979bed-2809-4041-8d7b-70a0c7d8eb97	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-12 09:35:02.894265+00	
00000000-0000-0000-0000-000000000000	ade4b441-1bea-460f-be0d-dbb86b545333	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:09.117847+00	
00000000-0000-0000-0000-000000000000	5f60d9de-d204-4271-bfa0-4f86938ff178	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:09.135371+00	
00000000-0000-0000-0000-000000000000	04c2739b-4e31-4d68-b004-0d7a4b52b53c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:10.995363+00	
00000000-0000-0000-0000-000000000000	bc68ccee-7356-4233-a986-bd17baed0fbf	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.737304+00	
00000000-0000-0000-0000-000000000000	8a429fa3-d07d-445b-84f0-f27869cd9336	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.755041+00	
00000000-0000-0000-0000-000000000000	34057f29-d2eb-4e1d-8117-370d4e00c06b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.806659+00	
00000000-0000-0000-0000-000000000000	eccd7d91-d324-4830-bd35-065f56b68199	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.830849+00	
00000000-0000-0000-0000-000000000000	e1455d42-56e5-4e90-811e-babd8d03c0e8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.84165+00	
00000000-0000-0000-0000-000000000000	793f1d18-20cb-44fe-886a-8c38e99dfd90	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.857172+00	
00000000-0000-0000-0000-000000000000	35b36f1c-5355-4a42-bc93-4b2c0e4deec8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.87217+00	
00000000-0000-0000-0000-000000000000	4a2e143c-4aaa-433a-8992-90f9252e29fa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.881182+00	
00000000-0000-0000-0000-000000000000	de8aac96-5c8e-45c7-bc6d-cafc982ccd7c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.890093+00	
00000000-0000-0000-0000-000000000000	f90aff6c-5521-4560-a7a8-ef400d0dd075	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:11.909047+00	
00000000-0000-0000-0000-000000000000	8a8ee849-f1cf-4f62-8dc8-24f1ade5370b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.387976+00	
00000000-0000-0000-0000-000000000000	e21e684b-b3c8-43bc-bceb-6c70dda67b96	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.397335+00	
00000000-0000-0000-0000-000000000000	4078d89c-1796-49e1-83ea-81a488b02e3c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.420927+00	
00000000-0000-0000-0000-000000000000	5207c810-3cb9-4df4-99ad-24e9ac7ccaf1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.431163+00	
00000000-0000-0000-0000-000000000000	d945a57a-cb70-4a10-b46e-155e8732a42e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.440911+00	
00000000-0000-0000-0000-000000000000	10bf7b40-9c6c-41fb-a505-7861999f4aeb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.452219+00	
00000000-0000-0000-0000-000000000000	af403790-d779-4f83-96d8-ec86cbba7e28	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.459141+00	
00000000-0000-0000-0000-000000000000	5c877fa1-cb9b-4eb1-85e0-6d090bfc8b39	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.474381+00	
00000000-0000-0000-0000-000000000000	1e966369-54c3-4fd4-8537-5ddd8edac3b9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.487532+00	
00000000-0000-0000-0000-000000000000	0094957d-8f88-4018-a14b-affcadb1d3f1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.515034+00	
00000000-0000-0000-0000-000000000000	5ac36857-5e95-4456-aeef-caccaaa4a223	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.675376+00	
00000000-0000-0000-0000-000000000000	46812fe5-82d5-4bec-b78c-507964a53ce7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.818677+00	
00000000-0000-0000-0000-000000000000	230339e2-d664-405f-8a35-b825bb5b13ea	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.875235+00	
00000000-0000-0000-0000-000000000000	3fe3cd13-62ad-4cf9-a9dd-23591819b207	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.888105+00	
00000000-0000-0000-0000-000000000000	6f6c96f6-2cc6-4453-907f-17789c3738e6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.914261+00	
00000000-0000-0000-0000-000000000000	d2b44e8d-77d4-496e-957b-ecd27d599d97	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.926769+00	
00000000-0000-0000-0000-000000000000	543f3fac-6103-4dd1-8961-17d17db7f145	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.935575+00	
00000000-0000-0000-0000-000000000000	568b620f-0f9e-45b4-86b5-c97ff2fb2c54	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.944292+00	
00000000-0000-0000-0000-000000000000	083fb528-7be0-4bc2-b047-3aa631856eb1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:12.986941+00	
00000000-0000-0000-0000-000000000000	e926b902-312f-4376-b96b-b6a42bbb2d05	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:13.012399+00	
00000000-0000-0000-0000-000000000000	2ccbb023-7997-4311-85f9-df6af3acd883	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:14.982908+00	
00000000-0000-0000-0000-000000000000	4b4e4eb6-00a0-4412-bc39-c16ee8ffe5e0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:16.987854+00	
00000000-0000-0000-0000-000000000000	0a4e3835-0fac-45e9-98cc-9c85d4e8a33f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 05:37:19.031427+00	
00000000-0000-0000-0000-000000000000	d69ae3ee-bdb2-47ed-9f0c-99998cc2befd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 06:43:31.301305+00	
00000000-0000-0000-0000-000000000000	5fb73444-f786-424a-85d8-afec20db487b	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-13 06:43:31.315359+00	
00000000-0000-0000-0000-000000000000	a6744656-dd00-4d17-8b14-3c7646cc04cb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:41.922151+00	
00000000-0000-0000-0000-000000000000	a8f329a4-e43f-403c-bcc7-ec132d7a5358	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:41.943494+00	
00000000-0000-0000-0000-000000000000	d640d46a-f4df-4e9a-bf67-086c0c02ce5a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:43.34394+00	
00000000-0000-0000-0000-000000000000	13bc4e6c-c144-4795-96c5-80a95507c61e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.057302+00	
00000000-0000-0000-0000-000000000000	a712953f-409c-4d2f-8860-7c3eea90ed0d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.069287+00	
00000000-0000-0000-0000-000000000000	33e29fb6-85e2-4e05-be74-eb171ff881e1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.116761+00	
00000000-0000-0000-0000-000000000000	e7e3f1b3-3f90-4b65-a52d-8cedccda00b1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.143138+00	
00000000-0000-0000-0000-000000000000	250f09a6-0768-433c-b57d-0a1a61339cb4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.160154+00	
00000000-0000-0000-0000-000000000000	6540acea-0dde-4420-9cb1-69b75b9394b5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.168194+00	
00000000-0000-0000-0000-000000000000	d83206d5-b31a-4378-bda6-7c7b24c94c51	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.207067+00	
00000000-0000-0000-0000-000000000000	bc024bd1-7ca6-4f69-98b8-4b125b533806	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.215764+00	
00000000-0000-0000-0000-000000000000	b521c62a-cf2e-4ac1-95be-16ec00f270bd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.225767+00	
00000000-0000-0000-0000-000000000000	b3355e36-68ac-47b1-9cf1-cad21327ca05	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.243022+00	
00000000-0000-0000-0000-000000000000	2655e863-2d5f-4dd0-bab6-71ed6fa071b3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.520349+00	
00000000-0000-0000-0000-000000000000	38cf9c87-4242-4a33-842c-2b3d8e7c74af	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.697537+00	
00000000-0000-0000-0000-000000000000	d7b17b92-3b8d-4be5-9036-0c359ab3efd0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.705877+00	
00000000-0000-0000-0000-000000000000	d39ee731-1226-48eb-a63f-1bb39c65b2d4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.728171+00	
00000000-0000-0000-0000-000000000000	4651510b-13d7-4bed-b5a4-01947799358a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.740638+00	
00000000-0000-0000-0000-000000000000	6fd78a29-13f3-4559-a168-3e4e52d808a6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.748573+00	
00000000-0000-0000-0000-000000000000	b22981b2-4ab2-41fe-8601-b4837e5529c6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.756729+00	
00000000-0000-0000-0000-000000000000	d153ce05-1cd0-4d91-96d5-339b17a30eae	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.777395+00	
00000000-0000-0000-0000-000000000000	b44671f6-af85-4d29-ad01-62ce722accbd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.793283+00	
00000000-0000-0000-0000-000000000000	225101af-3ba7-4dc3-82a2-ee0a15836cf5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:44.823482+00	
00000000-0000-0000-0000-000000000000	9de7f7c9-d5b5-481f-bc9b-e719b909305c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.123463+00	
00000000-0000-0000-0000-000000000000	db12a19c-a896-44c3-baf8-5fc417d1ef5d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.164452+00	
00000000-0000-0000-0000-000000000000	b2b98e18-135e-420c-9c65-e1b980c75a40	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.332066+00	
00000000-0000-0000-0000-000000000000	0a8aa700-12c3-41e3-b7f7-94cb6dbf0efe	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.339432+00	
00000000-0000-0000-0000-000000000000	98e02348-8924-4255-95d3-9e24e7fdbe4f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.35841+00	
00000000-0000-0000-0000-000000000000	85596f83-350b-44d2-b6d7-41712d80cd01	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.559736+00	
00000000-0000-0000-0000-000000000000	2d446261-2726-4a75-a924-92f1e108d3ca	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.593247+00	
00000000-0000-0000-0000-000000000000	fb994821-4a6d-4f47-abaa-859d03123372	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.645842+00	
00000000-0000-0000-0000-000000000000	03b2dd07-02d4-4c8e-b16f-0cb67e6ebd18	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.677705+00	
00000000-0000-0000-0000-000000000000	971620c9-86f9-4dfd-99b7-8771dd6593d2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.686384+00	
00000000-0000-0000-0000-000000000000	f7df2cdc-ced6-4535-8a09-838c1962f19c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.70908+00	
00000000-0000-0000-0000-000000000000	a9bb365a-de1a-4606-a475-dcaceea0a389	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.735841+00	
00000000-0000-0000-0000-000000000000	8a9b6839-de02-44c9-845a-f450aae1c38b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.106686+00	
00000000-0000-0000-0000-000000000000	cb549474-3aaf-442b-8195-33c987702117	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.165309+00	
00000000-0000-0000-0000-000000000000	b151194d-76b0-4c06-972d-2b6620c7eb6f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.198701+00	
00000000-0000-0000-0000-000000000000	2fe30717-9b53-483b-a4fa-776622dea945	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.240655+00	
00000000-0000-0000-0000-000000000000	54efebfc-8786-4550-b3cd-bc051c98ea80	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.851639+00	
00000000-0000-0000-0000-000000000000	de4131de-2277-4246-90ea-1dd030446d39	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.880503+00	
00000000-0000-0000-0000-000000000000	949e567f-4afe-46c5-8bf8-01014e3893d8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:55.968179+00	
00000000-0000-0000-0000-000000000000	19fa862d-08d0-461e-b3e8-b18c7ebe0fe3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 05:59:56.143453+00	
00000000-0000-0000-0000-000000000000	e0136b96-5d99-4d23-b9a2-b0b548d486d4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.886993+00	
00000000-0000-0000-0000-000000000000	c10d55d7-32dd-4f91-a47e-c2c5eafd7cb7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.91642+00	
00000000-0000-0000-0000-000000000000	214813fb-25b5-48d3-a1a7-91480bc54d48	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.930286+00	
00000000-0000-0000-0000-000000000000	65c43fdd-4e02-4a93-a67b-b4f9d27de409	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.954248+00	
00000000-0000-0000-0000-000000000000	11c7d647-cede-49a1-b198-4a08d2cea2b6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.975932+00	
00000000-0000-0000-0000-000000000000	8e20e9d6-4ceb-4b7d-8d9f-a9c817e77add	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.282653+00	
00000000-0000-0000-0000-000000000000	2c5ed9b1-a17a-44af-a085-3c06ed160136	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.307985+00	
00000000-0000-0000-0000-000000000000	28df7959-a14a-49c1-bef2-488d236b205d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.366609+00	
00000000-0000-0000-0000-000000000000	b4f87723-0421-4876-bd94-bc3c74471ee0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.376046+00	
00000000-0000-0000-0000-000000000000	f90c86d9-6df0-4d32-9cd0-4837990da8de	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.394496+00	
00000000-0000-0000-0000-000000000000	4bbcc49e-9bcf-48c0-b921-c312eb7e1bc1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.409575+00	
00000000-0000-0000-0000-000000000000	51ecc141-5a66-4f01-a75e-e4716596fcd1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:45.427913+00	
00000000-0000-0000-0000-000000000000	541de677-9b85-4bd5-9d10-a4dbcf2074f1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:47.340502+00	
00000000-0000-0000-0000-000000000000	c618d59d-abd1-4671-a208-8ca4e20e09dc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:49.344344+00	
00000000-0000-0000-0000-000000000000	459aa376-39d7-4ffd-8afa-d01399f98f08	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 05:39:51.3633+00	
00000000-0000-0000-0000-000000000000	040cafd5-fc20-4e16-9e09-0488eb038abe	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 06:48:10.925474+00	
00000000-0000-0000-0000-000000000000	d8b91118-5105-4e57-8a8c-65a2346600d9	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 06:48:10.938639+00	
00000000-0000-0000-0000-000000000000	6be732bf-3865-4878-8195-93de701c11a1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 06:48:11.802223+00	
00000000-0000-0000-0000-000000000000	dc89d12b-619e-4f56-abbc-0a1ed6f2b2ce	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 06:48:13.277739+00	
00000000-0000-0000-0000-000000000000	6e380f29-6262-422e-94dc-1f648eac1ccf	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 08:01:35.854832+00	
00000000-0000-0000-0000-000000000000	ebd6e35b-9e5e-4933-a4e2-15075ecaf954	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-14 08:01:35.859383+00	
00000000-0000-0000-0000-000000000000	64e75d83-ad57-4869-84d2-ef547071b21e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:11.493269+00	
00000000-0000-0000-0000-000000000000	4ea4c162-238a-41a9-9ea5-7ba551db2a86	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:11.513196+00	
00000000-0000-0000-0000-000000000000	2d153f65-275c-4e1b-8702-3fb1cc5bcb19	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:13.07409+00	
00000000-0000-0000-0000-000000000000	a6dc70a5-7c19-4c7d-9ba9-15d7cff2e612	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:13.843205+00	
00000000-0000-0000-0000-000000000000	3b9a41ab-af00-4272-bae2-b1c19b1ed113	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:13.865924+00	
00000000-0000-0000-0000-000000000000	c298fd4e-e5a6-4d24-bb38-b07ac86ea788	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:13.921549+00	
00000000-0000-0000-0000-000000000000	093b83f2-c69d-4a99-898d-3368b691d758	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:13.93907+00	
00000000-0000-0000-0000-000000000000	a596cb49-1fbe-4df8-96d6-04015b9e25c6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:13.947718+00	
00000000-0000-0000-0000-000000000000	dde6d986-8844-4769-a1d3-51ee4419b568	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:13.956123+00	
00000000-0000-0000-0000-000000000000	27366fb0-efa4-4c03-a69f-3c4a13ff1679	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:13.974677+00	
00000000-0000-0000-0000-000000000000	5ce5ea46-0359-4d40-8453-0bf12bb2edbe	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.000141+00	
00000000-0000-0000-0000-000000000000	2262b03e-e72f-42bd-b879-2c69af6b88ed	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.010825+00	
00000000-0000-0000-0000-000000000000	27addb05-31bd-4f23-bab1-1c1c5ae01b17	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.028668+00	
00000000-0000-0000-0000-000000000000	5b56c996-0325-4628-84ff-0634ef8d7334	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.491247+00	
00000000-0000-0000-0000-000000000000	96a828f3-6ee0-4450-aa02-61fd716aed92	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.499811+00	
00000000-0000-0000-0000-000000000000	3fcffaab-396c-4e66-bd55-0194a93e4589	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.517975+00	
00000000-0000-0000-0000-000000000000	a188f939-1650-42f2-aa2f-f55e54f4f9a1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.526135+00	
00000000-0000-0000-0000-000000000000	79082f1d-3b37-44b6-b57a-4ea7f7ba1b73	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.537559+00	
00000000-0000-0000-0000-000000000000	f189b09b-1986-452e-812c-917f388441d0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.547745+00	
00000000-0000-0000-0000-000000000000	b462779d-1f65-4956-a059-878738dd7302	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.569654+00	
00000000-0000-0000-0000-000000000000	9404ddb5-2ad2-4084-8234-18bc578542e5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.60903+00	
00000000-0000-0000-0000-000000000000	708f33cc-0dd2-4734-a6ef-09250534abc3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:15.153591+00	
00000000-0000-0000-0000-000000000000	32d661cf-e5c8-4e3d-b744-9b0b3eba6d10	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:15.17023+00	
00000000-0000-0000-0000-000000000000	9cc33562-e25e-46cb-99c3-5dc01a905bb5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:15.193322+00	
00000000-0000-0000-0000-000000000000	6f4cee12-4989-4e3e-bc99-06993637ee46	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:15.205153+00	
00000000-0000-0000-0000-000000000000	365731bc-0039-48f1-9eda-4f81e242383c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:15.216718+00	
00000000-0000-0000-0000-000000000000	726c90c7-d2ef-47af-bba4-767969481dfb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:15.225671+00	
00000000-0000-0000-0000-000000000000	89522cf6-99aa-4c0f-a27c-e05e698dc87e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:15.243354+00	
00000000-0000-0000-0000-000000000000	fa0e4a79-5fd5-4082-9063-96532b4b6aad	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:17.097107+00	
00000000-0000-0000-0000-000000000000	3af33301-9868-4f23-bbc5-c7ddfd010c43	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:19.079234+00	
00000000-0000-0000-0000-000000000000	ef52ace1-8fc9-4351-8c96-05424cbf312c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:21.095044+00	
00000000-0000-0000-0000-000000000000	e271ede1-41f4-4493-adcf-3e6a3efc3fb3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.665565+00	
00000000-0000-0000-0000-000000000000	cebf8e2c-5391-4faf-9fd5-2b2064223b3c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.249539+00	
00000000-0000-0000-0000-000000000000	612c0322-c530-4319-a6d1-c02f1ace929e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.287034+00	
00000000-0000-0000-0000-000000000000	3d88bbc2-d676-4eea-b8eb-6a3a0f3f2940	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.310688+00	
00000000-0000-0000-0000-000000000000	0bbbae4a-49b6-4328-bf81-c09d3984b6ef	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.333746+00	
00000000-0000-0000-0000-000000000000	576bf236-1847-423e-9a39-d60eb906d6bc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.344461+00	
00000000-0000-0000-0000-000000000000	03967ac6-a7cb-4bdc-9582-906018feddb4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:01.362906+00	
00000000-0000-0000-0000-000000000000	e3792550-a3f2-4e4a-8fa9-8f4c0589d550	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:03.034751+00	
00000000-0000-0000-0000-000000000000	33b3e7df-e5ba-4a50-bf68-55725bb7f2f6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:05.035504+00	
00000000-0000-0000-0000-000000000000	1d382174-4191-441a-bb86-c57b4ab402bf	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:07.021216+00	
00000000-0000-0000-0000-000000000000	ce7e6f49-2dac-4127-9094-6ca1e678001b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 06:00:00.953965+00	
00000000-0000-0000-0000-000000000000	575b9c80-0347-4fc3-afec-4ebf3636dbc3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 06:00:02.945868+00	
00000000-0000-0000-0000-000000000000	86557399-8ebd-4749-887e-56cdaa934f58	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:29.942543+00	
00000000-0000-0000-0000-000000000000	13a0999e-a99f-4904-a26f-3dc30ed4aa15	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.616869+00	
00000000-0000-0000-0000-000000000000	26f0c7d9-8eed-4386-85a2-01bd33b19496	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.625096+00	
00000000-0000-0000-0000-000000000000	860e5887-41f1-425e-9482-bb2de19756b5	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:14.918625+00	
00000000-0000-0000-0000-000000000000	2ab69f96-0bc2-4980-9d4d-50cae432eb2c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:15.108948+00	
00000000-0000-0000-0000-000000000000	b2596f8a-a012-493c-ad33-ecd7f88e9e08	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 04:25:15.146529+00	
00000000-0000-0000-0000-000000000000	54dd69f5-ffe1-457b-b30e-3b86fe6ef9bf	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:39.869656+00	
00000000-0000-0000-0000-000000000000	6d2bb77c-b22a-4522-b810-b77111ae3e12	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:39.884113+00	
00000000-0000-0000-0000-000000000000	996c33c5-cfbf-4b78-9942-942f5d6ae848	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:41.553875+00	
00000000-0000-0000-0000-000000000000	6db3327d-18a6-4401-b313-7d67c0e2ff68	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.314362+00	
00000000-0000-0000-0000-000000000000	ab493ab8-e552-4d18-8caf-4ff14d3d21ba	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.36155+00	
00000000-0000-0000-0000-000000000000	44f8711e-2099-4f5c-bf3d-6dca64cc02bc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.391978+00	
00000000-0000-0000-0000-000000000000	e084c2b8-0b82-4975-89bf-60f28d401f5a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.411941+00	
00000000-0000-0000-0000-000000000000	f3f84baa-96b5-4ff3-a944-5833305ea5bb	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.427705+00	
00000000-0000-0000-0000-000000000000	08585e03-449a-443b-b8c0-79289e334cd3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.45152+00	
00000000-0000-0000-0000-000000000000	4c1f1988-53a6-4b19-a10a-4fe14c5aa591	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.467808+00	
00000000-0000-0000-0000-000000000000	3f5a42e3-c336-4b81-8f34-0a92cc21c435	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.487415+00	
00000000-0000-0000-0000-000000000000	29b323c3-08cc-4729-a575-2e64a0a02523	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.494249+00	
00000000-0000-0000-0000-000000000000	87518866-bf94-479c-bc99-6fcb9f926c8c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.526986+00	
00000000-0000-0000-0000-000000000000	3293cae1-175b-4011-9e32-1189e34ac35d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.96605+00	
00000000-0000-0000-0000-000000000000	fd47750d-7a6d-4948-9e4e-f7aece69c492	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.979805+00	
00000000-0000-0000-0000-000000000000	e614160c-ccf2-4b3a-9732-627b6375fd7d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:42.998485+00	
00000000-0000-0000-0000-000000000000	3292f515-c957-45ef-9491-a79a98000b14	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.012068+00	
00000000-0000-0000-0000-000000000000	8e980dcc-a068-46c7-ad79-56b0af8686b1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.019869+00	
00000000-0000-0000-0000-000000000000	a4ac371a-1716-42a1-9b5c-032f73037fd1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.029026+00	
00000000-0000-0000-0000-000000000000	69cf7680-bcad-459d-b1b0-929d74898312	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.038965+00	
00000000-0000-0000-0000-000000000000	4899f0d0-f7be-4486-bdf8-7c3b11374a2e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.049964+00	
00000000-0000-0000-0000-000000000000	789949dd-d8bb-4a44-aef7-2e4eafb521db	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.068884+00	
00000000-0000-0000-0000-000000000000	e85fed98-983b-423f-b10d-1cc5a555279e	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.077638+00	
00000000-0000-0000-0000-000000000000	1374a706-3dce-4370-bf60-61f526802c1f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.403248+00	
00000000-0000-0000-0000-000000000000	eee33c66-76e3-4a20-b4f6-5537f2d0bc3d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.489848+00	
00000000-0000-0000-0000-000000000000	6937d99a-2a84-44de-9a7c-fd87549bfb88	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.505852+00	
00000000-0000-0000-0000-000000000000	d34f3e0c-9fe8-45be-8770-161a14126f79	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.516574+00	
00000000-0000-0000-0000-000000000000	ab16b9f9-35ab-4db6-96ad-9bb30d31daf8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.610003+00	
00000000-0000-0000-0000-000000000000	4576dd6a-41d4-4068-aefc-3a78bb036f42	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.624053+00	
00000000-0000-0000-0000-000000000000	ce567eb2-1104-4b42-8eaa-568dabfc2423	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 05:45:00.697849+00	
00000000-0000-0000-0000-000000000000	3261f863-7e8f-4475-a18a-f8bdae0cdacc	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 08:22:24.659654+00	
00000000-0000-0000-0000-000000000000	01db8ae4-8d93-4eee-852d-370d33d8344b	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-24 08:22:24.673837+00	
00000000-0000-0000-0000-000000000000	bb048fda-7779-4654-a45b-b0521d50a2c8	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.291926+00	
00000000-0000-0000-0000-000000000000	8b60523a-936f-4f28-95a6-614cae92f632	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.33722+00	
00000000-0000-0000-0000-000000000000	c0283696-7a8d-48fb-a657-479ff6240fde	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.342748+00	
00000000-0000-0000-0000-000000000000	c6714ee8-2995-4fe4-8e29-2e164490fdf9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.360584+00	
00000000-0000-0000-0000-000000000000	b2e2f8db-0154-4088-87d3-fb2a5203e2e4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.371662+00	
00000000-0000-0000-0000-000000000000	b9beda14-3117-42a7-aa5f-f80ad5894228	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.39352+00	
00000000-0000-0000-0000-000000000000	828b2694-8a79-44e7-8693-2f41e016ef9c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.520264+00	
00000000-0000-0000-0000-000000000000	8198daf8-ffdd-46b3-9461-6d3eebf2ffce	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.612379+00	
00000000-0000-0000-0000-000000000000	18b779c0-7e2e-44e2-832a-cbd906334858	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.637938+00	
00000000-0000-0000-0000-000000000000	11b68c6e-ef4b-411b-be5e-3918f0349f15	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.758522+00	
00000000-0000-0000-0000-000000000000	38b65844-4b39-4500-8499-bb35566c3cc2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.9034+00	
00000000-0000-0000-0000-000000000000	6942c16a-c07e-4f22-9424-c61583db106f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.281708+00	
00000000-0000-0000-0000-000000000000	cd5aced8-1635-457b-a881-ce596a915b22	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.331753+00	
00000000-0000-0000-0000-000000000000	77a5f1ad-b188-4d80-a9c3-b7f6856b1a6f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.691769+00	
00000000-0000-0000-0000-000000000000	d8504262-9ddb-474e-b8db-ad51d0687997	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.707903+00	
00000000-0000-0000-0000-000000000000	51db06d8-4c64-485c-a8c4-f865fb1b5c0f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.739848+00	
00000000-0000-0000-0000-000000000000	9cb87c80-6684-4e65-865d-c2b454673925	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.810353+00	
00000000-0000-0000-0000-000000000000	631d15c0-ed44-4fd7-b21a-dadded6cdb9b	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.829448+00	
00000000-0000-0000-0000-000000000000	decff4b9-6fb1-4966-a54c-5b8d0a53b342	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-30 17:41:11.796084+00	
00000000-0000-0000-0000-000000000000	8986a53c-29c4-4291-9cff-5c2c1956269f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-30 17:41:11.819409+00	
00000000-0000-0000-0000-000000000000	b0346fb2-9b88-48eb-a75c-5e60babf9e45	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-30 17:41:11.927669+00	
00000000-0000-0000-0000-000000000000	2d1c4349-e786-46d9-90d5-f1aaba9cc073	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.630388+00	
00000000-0000-0000-0000-000000000000	e368131a-62e1-4718-a7aa-2537a61d19ae	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.645281+00	
00000000-0000-0000-0000-000000000000	c7fa8bd9-3479-4ad3-9fe8-abfd5940ab6f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 06:58:50.042228+00	
00000000-0000-0000-0000-000000000000	31d2a1bc-cc15-45c8-a664-e695e15033a4	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 06:58:50.057511+00	
00000000-0000-0000-0000-000000000000	317b76df-91e3-47d7-bd35-54cc2c00de89	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:11.951512+00	
00000000-0000-0000-0000-000000000000	f1eb0865-dc96-4f30-b5e6-612ad8922f5f	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:11.97207+00	
00000000-0000-0000-0000-000000000000	23ab0043-757e-4f73-917f-518e645dace4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:14.014347+00	
00000000-0000-0000-0000-000000000000	36982165-a966-47da-be5f-c722b84f0230	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:14.723438+00	
00000000-0000-0000-0000-000000000000	8a4deee0-0143-4983-96fc-5b8b41512aea	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:14.753109+00	
00000000-0000-0000-0000-000000000000	a94d8cec-51eb-4959-80dc-718952049f55	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-26 05:45:30.322731+00	
00000000-0000-0000-0000-000000000000	d517fd7b-d15c-44df-baf3-4b8b6a4cb4ac	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.324476+00	
00000000-0000-0000-0000-000000000000	154eede6-f937-4332-a61f-b3573ca1375c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.827196+00	
00000000-0000-0000-0000-000000000000	2a0fc111-6d45-4689-b4b3-8a48820664ef	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.83678+00	
00000000-0000-0000-0000-000000000000	2aa4737a-ba89-4a10-8e48-a71199d1adc9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.859993+00	
00000000-0000-0000-0000-000000000000	93c2b02e-cfa6-496b-9af6-6a8deebdcf17	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.886915+00	
00000000-0000-0000-0000-000000000000	c0fc3bbb-2d6c-4e75-9b01-2b420c13bd73	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.904283+00	
00000000-0000-0000-0000-000000000000	8dd58287-476c-47d2-893a-8e1bee50bb69	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.92165+00	
00000000-0000-0000-0000-000000000000	73e37818-c8e3-4499-a21d-c93bd073e7d1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:48.936469+00	
00000000-0000-0000-0000-000000000000	aa61ae6b-2eb0-4393-b040-299f36321609	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:50.835956+00	
00000000-0000-0000-0000-000000000000	e913ad96-6089-4c86-9d04-b9bea1c5962d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:52.810609+00	
00000000-0000-0000-0000-000000000000	73d614ec-88e0-4093-9bbe-d8f062f035af	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 05:50:54.807157+00	
00000000-0000-0000-0000-000000000000	6b3bf581-d43c-4da4-bf15-26601cd679db	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.847476+00	
00000000-0000-0000-0000-000000000000	11e009f2-44ff-46d1-a2e9-7ef6add2dbc4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.867231+00	
00000000-0000-0000-0000-000000000000	710f1401-5b81-4515-81ce-137ba2ba6c76	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:29.886007+00	
00000000-0000-0000-0000-000000000000	0579adee-d272-4160-90de-036bbba86791	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:30.059026+00	
00000000-0000-0000-0000-000000000000	be6591de-e6be-4b75-91c2-884554044c64	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:30.179878+00	
00000000-0000-0000-0000-000000000000	5e4bd749-9b68-42ad-b557-17ae08275a98	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:30.21407+00	
00000000-0000-0000-0000-000000000000	0289f893-211c-401c-b755-99d334e4c664	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:30.240399+00	
00000000-0000-0000-0000-000000000000	fc9657a3-4beb-4989-9d43-7c59aaa28a9d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 05:48:30.254055+00	
00000000-0000-0000-0000-000000000000	8f7c14b0-0786-43d6-8f81-deb9f69263c9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.651785+00	
00000000-0000-0000-0000-000000000000	a3fe2070-3895-4408-868b-ff9999938781	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:43.678589+00	
00000000-0000-0000-0000-000000000000	c1573be8-3647-473a-bed6-2ff2e48ce3fa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:45.551842+00	
00000000-0000-0000-0000-000000000000	1a68fcf4-36dd-4740-8da6-fa0edc48c0a4	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:47.565664+00	
00000000-0000-0000-0000-000000000000	fbb2354c-ef1c-435f-af6c-fadf296382c9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 05:50:49.546328+00	
00000000-0000-0000-0000-000000000000	5eaa8660-feee-46dd-80c1-b12f2b8b6349	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:08.86205+00	
00000000-0000-0000-0000-000000000000	50775c78-a1a9-4325-a5a8-e4a19229666c	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:08.87466+00	
00000000-0000-0000-0000-000000000000	9406d02f-ea75-4fc6-8fde-8a0fe1bbb7ee	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:27.526065+00	
00000000-0000-0000-0000-000000000000	e15b2ec8-1f6c-4de1-a372-76582fd558b0	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:28.775009+00	
00000000-0000-0000-0000-000000000000	f31a6ffa-2242-4273-9dcb-fb9ea320a932	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:28.929417+00	
00000000-0000-0000-0000-000000000000	375a2339-1865-45e8-b8d1-9c8815319bc9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:28.984957+00	
00000000-0000-0000-0000-000000000000	54df851f-70cc-4e26-8716-79795f3ece70	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:29.01361+00	
00000000-0000-0000-0000-000000000000	c1071a56-08a8-465a-b395-e75a43206329	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:29.030437+00	
00000000-0000-0000-0000-000000000000	d6672333-6548-477f-99bb-4fdbdf352989	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:29.051237+00	
00000000-0000-0000-0000-000000000000	23c14896-e4d7-43e5-ae07-651fda31109c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:29.062698+00	
00000000-0000-0000-0000-000000000000	87c1e3b9-3926-4e66-b1cb-c34e80abe9aa	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:29.082218+00	
00000000-0000-0000-0000-000000000000	a410cccb-412e-41ac-b1a2-c00b5c7630a2	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:29.099352+00	
00000000-0000-0000-0000-000000000000	3dde53de-7f1a-466a-ba80-b216c5be39f9	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:29.112188+00	
00000000-0000-0000-0000-000000000000	010e61b5-1e9a-4dda-a264-6fcb6bd22240	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:29.981914+00	
00000000-0000-0000-0000-000000000000	b42a7069-27a6-4959-b59d-246f09ad2e81	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:29.993298+00	
00000000-0000-0000-0000-000000000000	5f85ad65-9b8a-48d3-b8cd-f4c20426b7a3	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:30.038636+00	
00000000-0000-0000-0000-000000000000	37a0f6aa-f4f0-43e4-b960-46a60878f2ee	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:30.076967+00	
00000000-0000-0000-0000-000000000000	002d3ecc-f470-48ed-8333-cc30f94e759f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:30.190396+00	
00000000-0000-0000-0000-000000000000	280275b0-c011-4610-8b66-3806bb76aaf6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:30.379329+00	
00000000-0000-0000-0000-000000000000	7759bc1b-2beb-4a1f-bfc4-86c151a8cd9f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:30.39038+00	
00000000-0000-0000-0000-000000000000	05c67114-d749-4f85-b511-752732e59433	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:30.405161+00	
00000000-0000-0000-0000-000000000000	f8495bce-1224-47de-8fd4-5a376cf8b98d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:30.419844+00	
00000000-0000-0000-0000-000000000000	0b65da02-f293-49d2-aed0-b49aebd770bd	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:30.447607+00	
00000000-0000-0000-0000-000000000000	868899f3-a1b6-4e7a-90fb-146b20eee82a	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:30.765458+00	
00000000-0000-0000-0000-000000000000	643cd291-d065-4058-b95f-0ebc6d2b98b1	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:31.145949+00	
00000000-0000-0000-0000-000000000000	4a4a40e1-5a34-4895-a46e-e78f142b7427	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:31.166134+00	
00000000-0000-0000-0000-000000000000	55a802b0-e8b9-4292-aee5-0696c199b3d6	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:31.181651+00	
00000000-0000-0000-0000-000000000000	4f5b2158-88d3-457a-95c7-53b40a265b7d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:31.555921+00	
00000000-0000-0000-0000-000000000000	857e4e71-4673-4cfe-a4c5-cb3b6653024d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 06:48:31.566597+00	
00000000-0000-0000-0000-000000000000	f7b55ca8-4a50-49e6-b93e-d80499df3d8f	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 08:01:26.685405+00	
00000000-0000-0000-0000-000000000000	3d543831-fd87-4e32-b464-4e8b29f12056	{"action":"token_revoked","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 08:01:26.700327+00	
00000000-0000-0000-0000-000000000000	b7f7ec1b-2907-4212-b428-c509c2a80698	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 08:01:28.038413+00	
00000000-0000-0000-0000-000000000000	cb8526c5-803d-4a81-9291-a76caf12df82	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 08:01:28.257218+00	
00000000-0000-0000-0000-000000000000	1c771acb-176f-4fac-8a0a-cf2551602b50	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 08:01:29.358618+00	
00000000-0000-0000-0000-000000000000	c7d7d23d-0f39-4b7f-945a-7f0ea37903d7	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 08:01:29.448062+00	
00000000-0000-0000-0000-000000000000	631516a0-7716-4713-bdbc-8c21f144054d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:14.796381+00	
00000000-0000-0000-0000-000000000000	344ca520-b7a5-443e-8c06-4ee69039639d	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:15.406991+00	
00000000-0000-0000-0000-000000000000	65aa2ee3-34a8-45a9-b670-cba3c1b5449c	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:15.422557+00	
00000000-0000-0000-0000-000000000000	75523bcf-6668-43c6-8245-2ecb2e245315	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:15.432677+00	
00000000-0000-0000-0000-000000000000	ede35ad1-7f06-4ad1-828d-ac017900d123	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:15.44149+00	
00000000-0000-0000-0000-000000000000	bb68ea1a-eb71-4036-a95f-139032966d72	{"action":"token_refreshed","actor_id":"1255494e-3cea-44b9-ba32-bcf9a38a6262","actor_name":"Astride Evans","actor_username":"astrideevans@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 05:50:15.449987+00	
\.


