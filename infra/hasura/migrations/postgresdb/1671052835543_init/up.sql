SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET escape_string_warning = off;
SET TIME ZONE 'UTC';
CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;
COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.tz_policies (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone,
    created_by character varying NOT NULL,
    updated_by character varying NOT NULL,
    display_name character varying NOT NULL,
    description character varying(100),
    tags text[],
    annotations public.hstore,
    disabled boolean DEFAULT false,
    template boolean DEFAULT false,
    valid_from timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    valid_to timestamp with time zone,
    subject_id character varying NOT NULL,
    subject_secondary_id character varying,
    subject_display_name character varying,
    subject_type character varying DEFAULT 'subject_type_user'::character varying,
    subject_domain character varying,
    source_address character varying,
    source_port character varying,
    destination_address character varying,
    destination_port character varying,
    protocol character varying DEFAULT 'Any'::character varying,
    action character varying DEFAULT 'action_permit'::character varying NOT NULL,
    direction character varying DEFAULT 'direction_egress'::character varying NOT NULL,
    weight integer DEFAULT 1000,
    app_id character varying
);
ALTER TABLE ONLY public.tz_policies
    ADD CONSTRAINT tz_policies_pkey PRIMARY KEY (id);
CREATE INDEX tzpolicy_deleted_at ON public.tz_policies USING btree (deleted_at);
CREATE INDEX tzpolicy_subject_id_subject_type ON public.tz_policies USING btree (subject_id, subject_type);
CREATE INDEX tzpolicy_subject_secondary_id_subject_type ON public.tz_policies USING btree (subject_secondary_id, subject_type);
CREATE INDEX tzpolicy_template ON public.tz_policies USING btree (template);
CREATE TRIGGER set_public_tz_policies_updated_at BEFORE UPDATE ON public.tz_policies FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_tz_policies_updated_at ON public.tz_policies IS 'trigger to set value of column "updated_at" to current timestamp on row update';
