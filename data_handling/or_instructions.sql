--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Ubuntu 14.9-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.9 (Ubuntu 14.9-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: petar
--

CREATE TABLE public.addresses (
    address_id integer NOT NULL,
    country_id integer,
    place character varying(50),
    street character varying(50),
    house_number character varying(10),
    zip_code character varying(10),
    CONSTRAINT valid_zip_code CHECK (((zip_code)::text ~ '^\d{5}(-\d{4})?$'::text))
);


ALTER TABLE public.addresses OWNER TO petar;

--
-- Name: addresses_address_id_seq; Type: SEQUENCE; Schema: public; Owner: petar
--

CREATE SEQUENCE public.addresses_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.addresses_address_id_seq OWNER TO petar;

--
-- Name: addresses_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: petar
--

ALTER SEQUENCE public.addresses_address_id_seq OWNED BY public.addresses.address_id;


--
-- Name: children; Type: TABLE; Schema: public; Owner: petar
--

CREATE TABLE public.children (
    child_id integer NOT NULL,
    personal_information_id integer,
    school character varying(50),
    class integer,
    CONSTRAINT valid_class CHECK (((class > 0) AND (class < 8)))
);


ALTER TABLE public.children OWNER TO petar;

--
-- Name: children_child_id_seq; Type: SEQUENCE; Schema: public; Owner: petar
--

CREATE SEQUENCE public.children_child_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.children_child_id_seq OWNER TO petar;

--
-- Name: children_child_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: petar
--

ALTER SEQUENCE public.children_child_id_seq OWNED BY public.children.child_id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: petar
--

CREATE TABLE public.contacts (
    contact_id integer NOT NULL,
    country_id integer,
    telephone character varying(10),
    email character varying(50),
    CONSTRAINT valid_email CHECK (((email)::text ~ '^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'::text)),
    CONSTRAINT valid_telephone CHECK (((telephone)::text ~ '^[0-9]+$'::text))
);


ALTER TABLE public.contacts OWNER TO petar;

--
-- Name: contacts_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: petar
--

CREATE SEQUENCE public.contacts_contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacts_contact_id_seq OWNER TO petar;

--
-- Name: contacts_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: petar
--

ALTER SEQUENCE public.contacts_contact_id_seq OWNED BY public.contacts.contact_id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: petar
--

CREATE TABLE public.countries (
    country_id integer NOT NULL,
    country_name character varying(50),
    area_code character varying(4),
    CONSTRAINT valid_area_code CHECK (((area_code)::text ~ '^\+[2-9]\d{2}$'::text))
);


ALTER TABLE public.countries OWNER TO petar;

--
-- Name: countries_country_id_seq; Type: SEQUENCE; Schema: public; Owner: petar
--

CREATE SEQUENCE public.countries_country_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.countries_country_id_seq OWNER TO petar;

--
-- Name: countries_country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: petar
--

ALTER SEQUENCE public.countries_country_id_seq OWNED BY public.countries.country_id;


--
-- Name: instructions; Type: TABLE; Schema: public; Owner: petar
--

CREATE TABLE public.instructions (
    instructions_id integer NOT NULL,
    address_id integer,
    parent_id integer,
    child_id integer,
    appointment timestamp without time zone,
    number_of_hours integer,
    hourly_rate real,
    subject character varying(50),
    lesson character varying(50),
    location character varying(11),
    CONSTRAINT valid_location CHECK (((location)::text = ANY ((ARRAY['home'::character varying, 'instructors'::character varying])::text[])))
);


ALTER TABLE public.instructions OWNER TO petar;

--
-- Name: instructions_instructions_id_seq; Type: SEQUENCE; Schema: public; Owner: petar
--

CREATE SEQUENCE public.instructions_instructions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.instructions_instructions_id_seq OWNER TO petar;

--
-- Name: instructions_instructions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: petar
--

ALTER SEQUENCE public.instructions_instructions_id_seq OWNED BY public.instructions.instructions_id;


--
-- Name: parents; Type: TABLE; Schema: public; Owner: petar
--

CREATE TABLE public.parents (
    parent_id integer NOT NULL,
    personal_information_id integer,
    contact_id integer
);


ALTER TABLE public.parents OWNER TO petar;

--
-- Name: parents_parent_id_seq; Type: SEQUENCE; Schema: public; Owner: petar
--

CREATE SEQUENCE public.parents_parent_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parents_parent_id_seq OWNER TO petar;

--
-- Name: parents_parent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: petar
--

ALTER SEQUENCE public.parents_parent_id_seq OWNED BY public.parents.parent_id;


--
-- Name: personal_informations; Type: TABLE; Schema: public; Owner: petar
--

CREATE TABLE public.personal_informations (
    personal_information_id integer NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    CONSTRAINT valid_first_name CHECK (((first_name)::text ~ '^[A-Za-zčćšđžČĆŠĐŽ]+$'::text)),
    CONSTRAINT valid_last_name CHECK (((last_name)::text ~ '^[A-Za-zčćšđžČĆŠĐŽ]+$'::text))
);


ALTER TABLE public.personal_informations OWNER TO petar;

--
-- Name: personal_informations_personal_information_id_seq; Type: SEQUENCE; Schema: public; Owner: petar
--

CREATE SEQUENCE public.personal_informations_personal_information_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.personal_informations_personal_information_id_seq OWNER TO petar;

--
-- Name: personal_informations_personal_information_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: petar
--

ALTER SEQUENCE public.personal_informations_personal_information_id_seq OWNED BY public.personal_informations.personal_information_id;


--
-- Name: addresses address_id; Type: DEFAULT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.addresses ALTER COLUMN address_id SET DEFAULT nextval('public.addresses_address_id_seq'::regclass);


--
-- Name: children child_id; Type: DEFAULT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.children ALTER COLUMN child_id SET DEFAULT nextval('public.children_child_id_seq'::regclass);


--
-- Name: contacts contact_id; Type: DEFAULT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.contacts ALTER COLUMN contact_id SET DEFAULT nextval('public.contacts_contact_id_seq'::regclass);


--
-- Name: countries country_id; Type: DEFAULT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.countries ALTER COLUMN country_id SET DEFAULT nextval('public.countries_country_id_seq'::regclass);


--
-- Name: instructions instructions_id; Type: DEFAULT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.instructions ALTER COLUMN instructions_id SET DEFAULT nextval('public.instructions_instructions_id_seq'::regclass);


--
-- Name: parents parent_id; Type: DEFAULT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.parents ALTER COLUMN parent_id SET DEFAULT nextval('public.parents_parent_id_seq'::regclass);


--
-- Name: personal_informations personal_information_id; Type: DEFAULT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.personal_informations ALTER COLUMN personal_information_id SET DEFAULT nextval('public.personal_informations_personal_information_id_seq'::regclass);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: petar
--

COPY public.addresses (address_id, country_id, place, street, house_number, zip_code) FROM stdin;
1	1	Zagreb	Murterska ulica	35	10000
2	1	Zagreb	Vitoroška ulica	8	10000
3	1	Zagreb	Trnsko ulica	33D	10000
\.


--
-- Data for Name: children; Type: TABLE DATA; Schema: public; Owner: petar
--

COPY public.children (child_id, personal_information_id, school, class) FROM stdin;
1	2	OŠ Rapska	4
2	4	OŠ Malešnica	7
3	6	OŠ Trnsko	2
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: petar
--

COPY public.contacts (contact_id, country_id, telephone, email) FROM stdin;
1	1	0982937683	markohorvat12@gmail.com
2	1	0998366106	ivana.kovacic3@gmail.com
3	1	0751028473	novakmarta11@gmail.com
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: petar
--

COPY public.countries (country_id, country_name, area_code) FROM stdin;
1	Croatia	+385
\.


--
-- Data for Name: instructions; Type: TABLE DATA; Schema: public; Owner: petar
--

COPY public.instructions (instructions_id, address_id, parent_id, child_id, appointment, number_of_hours, hourly_rate, subject, lesson, location) FROM stdin;
1	1	1	1	2023-11-01 15:00:00	2	10	mathematics	geometry	home
2	1	1	1	2023-11-03 11:00:00	3	10	mathematics	geometry	home
3	1	1	1	2023-11-05 17:00:00	2	10	mathematics	geometry	home
4	2	2	2	2023-11-01 12:00:00	2	10	physics	dinamics	instructors
5	2	2	2	2023-11-02 12:00:00	3	10	physics	dinamics	instructors
6	2	2	2	2023-11-04 18:00:00	2	10	physics	dinamics	instructors
7	2	2	2	2023-11-05 20:00:00	1	10	physics	dinamics	instructors
8	3	3	3	2023-11-04 11:30:00	2	12.5	mathematics	multiplication	home
9	3	3	3	2023-11-06 11:30:00	2	12.5	mathematics	multiplication	home
10	3	3	3	2023-11-07 11:30:00	2	12.5	mathematics	multiplication	home
\.


--
-- Data for Name: parents; Type: TABLE DATA; Schema: public; Owner: petar
--

COPY public.parents (parent_id, personal_information_id, contact_id) FROM stdin;
1	1	1
2	3	2
3	5	3
\.


--
-- Data for Name: personal_informations; Type: TABLE DATA; Schema: public; Owner: petar
--

COPY public.personal_informations (personal_information_id, first_name, last_name) FROM stdin;
1	Marko	Horvat
2	Mila	Horvat
3	Ivana	Kovačić
4	Maja	Kovačić
5	Marta	Novak
6	Mario	Novak
\.


--
-- Name: addresses_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: petar
--

SELECT pg_catalog.setval('public.addresses_address_id_seq', 3, true);


--
-- Name: children_child_id_seq; Type: SEQUENCE SET; Schema: public; Owner: petar
--

SELECT pg_catalog.setval('public.children_child_id_seq', 3, true);


--
-- Name: contacts_contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: petar
--

SELECT pg_catalog.setval('public.contacts_contact_id_seq', 3, true);


--
-- Name: countries_country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: petar
--

SELECT pg_catalog.setval('public.countries_country_id_seq', 1, true);


--
-- Name: instructions_instructions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: petar
--

SELECT pg_catalog.setval('public.instructions_instructions_id_seq', 10, true);


--
-- Name: parents_parent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: petar
--

SELECT pg_catalog.setval('public.parents_parent_id_seq', 3, true);


--
-- Name: personal_informations_personal_information_id_seq; Type: SEQUENCE SET; Schema: public; Owner: petar
--

SELECT pg_catalog.setval('public.personal_informations_personal_information_id_seq', 6, true);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (address_id);


--
-- Name: children children_pkey; Type: CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_pkey PRIMARY KEY (child_id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (contact_id);


--
-- Name: countries countries_area_code_key; Type: CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_area_code_key UNIQUE (area_code);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (country_id);


--
-- Name: instructions instructions_pkey; Type: CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.instructions
    ADD CONSTRAINT instructions_pkey PRIMARY KEY (instructions_id);


--
-- Name: parents parents_pkey; Type: CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_pkey PRIMARY KEY (parent_id);


--
-- Name: personal_informations personal_informations_pkey; Type: CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.personal_informations
    ADD CONSTRAINT personal_informations_pkey PRIMARY KEY (personal_information_id);


--
-- Name: addresses addresses_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(country_id);


--
-- Name: children children_personal_information_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_personal_information_id_fkey FOREIGN KEY (personal_information_id) REFERENCES public.personal_informations(personal_information_id);


--
-- Name: contacts contacts_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(country_id);


--
-- Name: instructions instructions_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.instructions
    ADD CONSTRAINT instructions_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(address_id);


--
-- Name: instructions instructions_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.instructions
    ADD CONSTRAINT instructions_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(child_id);


--
-- Name: instructions instructions_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.instructions
    ADD CONSTRAINT instructions_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.parents(parent_id);


--
-- Name: parents parents_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(contact_id);


--
-- Name: parents parents_personal_information_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: petar
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_personal_information_id_fkey FOREIGN KEY (personal_information_id) REFERENCES public.personal_informations(personal_information_id);


--
-- PostgreSQL database dump complete
--

