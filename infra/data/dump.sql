--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;


--
-- Name: tz_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tz_policies (
    id uuid NOT NULL,
    create_time timestamp with time zone NOT NULL,
    update_time timestamp with time zone NOT NULL,
    delete_time timestamp with time zone,
    created_by character varying,
    updated_by character varying,
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


ALTER TABLE public.tz_policies OWNER TO postgres;

--
-- Data for Name: tz_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tz_policies (id, create_time, update_time, delete_time, created_by, updated_by, display_name, description, tags, annotations, disabled, template, valid_from, valid_to, subject_id, subject_secondary_id, subject_display_name, subject_type, subject_domain, source_address, source_port, destination_address, destination_port, protocol, action, direction, weight, app_id) FROM stdin;
4da8e537-719e-4f26-b967-38ae25a31600	2022-09-19 02:46:09.984987+00	2022-09-19 02:46:26.19184+00	\N	\N	\N	user 1	this is group1 policy 11	{tz,us}	"sumo"=>"demo"	f	t	2022-09-19 16:46:00+00	\N	6e9bf365-8c09-4dd9-b9b2-83f6ab315618	chintagunta@chinthagunta.co	sumanth chinthagunta	subject_type_user	chinthagunta.com		\N	5.9.243.188	2342	Any	action_block	direction_egress	2000	\N
\.


--
-- Name: tz_policies tz_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tz_policies
    ADD CONSTRAINT tz_policies_pkey PRIMARY KEY (id);


--
-- Name: tzpolicy_delete_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tzpolicy_delete_time ON public.tz_policies USING btree (delete_time);


--
-- Name: tzpolicy_subject_id_subject_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tzpolicy_subject_id_subject_type ON public.tz_policies USING btree (subject_id, subject_type);


--
-- Name: tzpolicy_subject_secondary_id_subject_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tzpolicy_subject_secondary_id_subject_type ON public.tz_policies USING btree (subject_secondary_id, subject_type);


--
-- Name: tzpolicy_template; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tzpolicy_template ON public.tz_policies USING btree (template);


--
-- PostgreSQL database dump complete
--

