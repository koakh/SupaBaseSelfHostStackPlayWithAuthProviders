# NOTES DEPLOY ON KUARTZO SERVER

started from supabase repo /docker folder

## Deploy

deploy on contabo server notes

structure

```shell
root@vmi381400:$ tree /srv/docker/supabase
/srv/docker/supabase
├── docker-compose.yml
├── teardown.sh
└── volumes
    ├── api
    │   ├── kong.yml
    │   └── init
    │       ├── 00-initial-schema.sql
    │       ├── 01-auth-schema.sql
    │       ├── 02-storage-schema.sql
    │       ├── 03-post-setup.sql
    │       └── 04-pg-graphql.sql
    ├── keycloak
    │   └── themes
    │       └── keywind.jar
    └── storage
```

## .env

create `/srv/docker/supabase/.env` from `supabase_selfhosted/.env`

change

```shell
############
# Secrets 
# YOU MUST CHANGE THESE BEFORE GOING INTO PRODUCTION
############
POSTGRES_PASSWORD=h70uYlPG9OcnZejp
JWT_SECRET=NnssBeJX5Z3CQYTC1OPtQIg3ydJ56CA9
ANON_KEY=GmD1nu2sePIxa49cnIQc7jLxBCH2WpZtDgQdiUIfzAg7ly7KG7DS9M87C2siN5VNMHL5ipLK1hpom2XU
SERVICE_ROLE_KEY=wifFXAJLMdXjoCcBrc4ZZLS84oeYxuWJGJwGaZ2owNX9i9KFvy2oheXNusiDTqGhgrDH1487d0CiJCTF

## General
SITE_URL=https://supademo.kuartzo.com

############
# Studio - Configuration for the Dashboard
############
STUDIO_PORT=3020
# replace if you intend to use Studio outside of localhost
PUBLIC_REST_URL=https://kong.kuartzo.com/rest/v1/

############
# Custom changes
############
=
KEYCLOAK_PORT=8089
PGADMIN_PORT=5482
=
KEYCLOAK_HTTP_PORT=8089
KEYCLOAK_PASSWORD=h70uYlPG9OcnZejp
```

## docker-compose.yml

create `/srv/docker/supabase/docker-compose.yml` from `supabase_selfhosted/docker-compose.yml`

```yml
version: "3.8"

services:

  auth:
    image: koakh/koakh-supabase-gotrue:1.0.0
  environment:
    GOTRUE_EXTERNAL_GITHUB_REDIRECT_URI: "https://kong.kuartzo.com/auth/v1/callback"
    # SupaAuthSelfHostOnKuartzo
    GOTRUE_EXTERNAL_GITHUB_CLIENT_ID: "c2a110c8d758da808ef8"
    GOTRUE_EXTERNAL_GITHUB_SECRET: "7ec6487066e177218cc728defdb94ef8c4be47ce"
    # keycloak
    GOTRUE_EXTERNAL_KEYCLOAK_SECRET: "ZL58Efn1Z0iIrqNWoXpXGveZ1YjLzam7"
    GOTRUE_EXTERNAL_KEYCLOAK_REDIRECT_URI: "https://kong.kuartzo.com/auth/v1/callback"
    GOTRUE_EXTERNAL_KEYCLOAK_URL: "https://keycloak.kuartzo.com/auth/realms/SupaBase"
    # oryhydra
    GOTRUE_EXTERNAL_ORYHYDRA_REDIRECT_URI: "https://kong.kuartzo.com/auth/v1/callback"

  db:
    # don't expose, else gives problems with studio?
    # ports:
    #   - ${POSTGRES_PORT}:5432

  supaauth:
    image: koakh/koakh-nextjs-supabase-supaauth:1.0.0
    environment:
      NEXT_PUBLIC_SUPABASE_URL: https://kong.kuartzo.com
      NEXT_PUBLIC_REDIRECT_URL: https://supademo.kuartzo.com

  supaauth:
    environment:
      NEXT_PUBLIC_SUPABASE_URL: https://kong.kuartzo.com
```

## kong.yml

TODO:

create `volumes/api/kong.yml` from `supabase_selfhosted/volumes/api/kong.yml`

don't forget to update `ANON_KEY` and `SERVICE_ROLE_KEY` to the new defined key above, else supabase studio can't connect gives 401

generated jwt using `JWT_SECRET=NnssBeJX5Z3CQYTC1OPtQIg3ydJ56CA9`

**Use this tool to generate keys:**

- [Self Hosting | Supabase](https://supabase.com/docs/guides/hosting/overview#api-keys)
- 
```
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UiLAogICAgImlhdCI6IDE2NTgwOTg4MDAsCiAgICAiZXhwIjogMTgxNTg2NTIwMAp9.FTkmWsbRwzKvLQii3qJzT3lXHF7WVjQWe0QY_OMonyw
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZSIsCiAgICAiaWF0IjogMTY1ODA5ODgwMCwKICAgICJleHAiOiAxODE1ODY1MjAwCn0.fo43K-x1YCPLMcDnpXix9ee298TiaZNAQKfssckxL00
```

change

```yml
consumers:
  - username: anon
    keyauth_credentials:
      # - key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
      - key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UiLAogICAgImlhdCI6IDE2NTgwOTg4MDAsCiAgICAiZXhwIjogMTgxNTg2NTIwMAp9.FTkmWsbRwzKvLQii3qJzT3lXHF7WVjQWe0QY_OMonyw
  - username: service_role
    keyauth_credentials:
      # - key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q
      - key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZSIsCiAgICAiaWF0IjogMTY1ODA5ODgwMCwKICAgICJleHAiOiAxODE1ODY1MjAwCn0.fo43K-x1YCPLMcDnpXix9ee298TiaZNAQKfssckxL00
...
services:
  ## Open Auth routes
  - name: auth-v1-open
    url: http://auth:9999/verify
    # host machine gotrue auth local development
    # url: http://172.17.0.1:9999/verify
    routes:
      - name: auth-v1-open
        strip_path: true
        paths:
          - /auth/v1/verify
    plugins:
      - name: cors
  - name: auth-v1-open-callback
    url: http://auth:9999/callback
    # host machine gotrue auth local development
    # url: http://172.17.0.1:9999/callback
```

## init db files

```
volumes/db/init/00-initial-schema.sql
volumes/db/init/01-auth-schema.sql
volumes/db/init/02-storage-schema.sql
volumes/db/init/03-post-setup.sql
volumes/db/init/04-pg-graphql.sql
```

## Build SupaAuth for supaauth.kuartzo.com

`supaauth_frontend/.env.production`

use

```shell
# prod / anon
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
NEXT_PUBLIC_SUPABASE_URL=https://kong.kuartzo.com
NEXT_PUBLIC_SUPABASE_STORAGE=
# override default only in production
NEXT_PUBLIC_REDIRECT_URL=https://supademo.kuartzo.com
```

build and push image

## OryHydra Client

TODO:

with redirect to https://supademo.kuartzo.com/

## Keycloak Import

TODO:

import realm and client

update docker-compose secret key after import client `GOTRUE_EXTERNAL_KEYCLOAK_SECRET`

## Keycloak Theme

TODO:

- ./volumes/keycloak/themes/keywind.jar:/opt/jboss/keycloak/standalone/deployments/keywind.jar


## Caddy

exposed subdomains, must be accessed everywhere

- https://supabase.kuartzo.com
- https://kong.kuartzo.com/
- https://keycloak.kuartzo.com
- https://supademo.kuartzo.com/

```conf
# keycloak
keycloak.kuartzo.com {
  # respond "respond from keycloak.kuartzo.com:443"
  reverse_proxy http://127.0.0.1:8089
}

# supabase studio
supabase.kuartzo.com {
  import auth
  # respond "respond from supabase.kuartzo.com:443"
  reverse_proxy http://127.0.0.1:3020
}

# supabase kong
kong.kuartzo.com {
  # respond "respond from kong.kuartzo.com:443"
  reverse_proxy http://127.0.0.1:8000
}

# supabase kong
supademo.kuartzo.com {
  # respond "respond from kong.kuartzo.com:443"
  reverse_proxy http://127.0.0.1:3030
}
```

## Create OAuth Clients

### GitHub: SupaAuthSelfHostOnKuartzo

- [Getting Title at 48:42](https://github.com/settings/applications/1954191)

- Homepage URL: https://kong.kuartzo.com
- Authorization callback URL: https://kong.kuartzo.com/auth/v1/callback

change `docker-compose.yml`

```yml
GOTRUE_EXTERNAL_GITHUB_ENABLED: "true"
GOTRUE_EXTERNAL_GITHUB_REDIRECT_URI: "https://kong.kuartzo.com/auth/v1/callback"
GOTRUE_EXTERNAL_GITHUB_CLIENT_ID: "c2a110c8d758da808ef8"
GOTRUE_EXTERNAL_GITHUB_SECRET: "7ec6487066e177218cc728defdb94ef8c4be47ce"
```

### KeyCloak

1. import client and realm
2. create a user **with email** else `Error getting user email from external provider`
3. verify email

add <https://kong.kuarzto.com/auth/v1/callback> to Valid Redirect URIs

or to `keycloak/supabase.json`

```json
{
  "clientId": "supabase",
  "surrogateAuthRequired": false,
  "enabled": true,
  "alwaysDisplayInConsole": false,
  "clientAuthenticatorType": "client-secret",
  "redirectUris": [
    "https://agtwhwsxgdjudvmebpts.supabase.co/auth/v1/callback",
    "http://localhost:9999/callback",
    "http://localhost:8000/auth/v1/callback",
    "https://kong.kuartzo.com/auth/v1/callback"
  ],
```

change `docker-compose.yml`

```yml
GOTRUE_EXTERNAL_KEYCLOAK_ENABLED: "true"
GOTRUE_EXTERNAL_KEYCLOAK_CLIENT_ID: "supabase"
GOTRUE_EXTERNAL_KEYCLOAK_SECRET: "ZL58Efn1Z0iIrqNWoXpXGveZ1YjLzam7"
GOTRUE_EXTERNAL_KEYCLOAK_REDIRECT_URI: "https://kong.kuartzo.com/auth/v1/callback"
GOTRUE_EXTERNAL_KEYCLOAK_URL: "https://keycloak.kuartzo.com/auth/realms/SupaBase"
```

```
supabase-keycloak  | 22:10:46,952 WARN  [org.keycloak.events] (default task-1) type=LOGIN_ERROR, realmId=SupaBase, clientId=supabase, userId=null, ipAddress=95.95.83.179, error=invalid_redirect_uri, redirect_uri=https://keycloak.kuartzo.com/auth/realms/SupaBase
```
in given error change `https://keycloak.kuartzo.com/auth/realms/SupaBase` to `https://kong.kuartzo.com/auth/v1/callback`

`https://supabase.kuartzo.com/?error=server_error&error_description=Error+getting+user+email+from+external+provider`

in given error **add email** to user

### OryHydra

add new client with `https://kong.kuartzo.com/auth/v1/callback`

```shell
$ CLIENT="supabase-client-oauth-pkce-15"
$ docker-compose -f quickstart.yml exec hydra \
	hydra clients create \
	--endpoint http://127.0.0.1:4445 \
	--id "${CLIENT}" \
  --token-endpoint-auth-method client_secret_post \
	--grant-types client_credentials,authorization_code,implicit,refresh_token \
	--response-types code,id_token \
	--scope openid,profile,email,offline_access,phone \
	--callbacks http://localhost:9999/callback,http://localhost:8000/auth/v1/callback,https://kong.kuartzo.com/auth/v1/callback,https://agtwhwsxgdjudvmebpts.supabase.co/auth/v1/callback
```

change `docker-compose.yml`

```yml
GOTRUE_EXTERNAL_ORYHYDRA_ENABLED: "true"
GOTRUE_EXTERNAL_ORYHYDRA_REDIRECT_URI: "https://kong.kuartzo.com/auth/v1/callback"
GOTRUE_EXTERNAL_ORYHYDRA_URL: "https://kuartzo.com:444"
GOTRUE_EXTERNAL_ORYHYDRA_CLIENT_ID: "supabase-client-oauth-pkce-15"
GOTRUE_EXTERNAL_ORYHYDRA_SECRET: "b7HWgJVS5nrVeoCa.lbLYnGFh1"
```
